import { FieldValue } from "firebase-admin/firestore";

import {
  EMPTY_REWARDS,
  calculateDripCredit,
  calculateDripsEarned,
  getMaxRedeemableDrips,
} from "@/lib/rewards-engine.mjs";
import {
  DEFAULT_MEMBERSHIP_TIER,
  EMPTY_MEMBERSHIP,
  consumeMembershipBenefits,
  getMembershipPricing,
  getMembershipSummary,
  syncMembershipState,
} from "@/lib/memberships";
import {
  getCartDurationMinutes,
  getSlotAvailability,
  isConciergeLocation,
  parseTimeToMinutes,
} from "@/lib/bookingRules";
import { COUPONS_COLLECTION, getCouponApplication } from "@/lib/serverCoupons";

export const BOOKING_STATUS = {
  PENDING_PAYMENT: "PendingPayment",
  APPROVED: "Approved",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

export const GUEST_PENDING_BOOKINGS_COLLECTION = "guestPendingBookings";

function addMonths(date, months) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

function toJsonDoc(doc) {
  return {
    id: doc.id,
    ...doc.data(),
  };
}

function normalizeItems(items = []) {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    displayName: item.displayName,
    baseName: item.baseName,
    category: item.category,
    duration: item.duration,
    price: item.price,
    image: item.image,
    membershipBucket: item.membershipBucket ?? null,
    membershipKind: item.membershipKind ?? null,
    ivSizeMl: item.ivSizeMl ?? null,
    smallVariantId: item.smallVariantId ?? null,
    smallVariantPrice: item.smallVariantPrice ?? null,
  }));
}

function getBookingRefs(db, uid, bookingId = null) {
  const userRef = db.collection("users").doc(uid);
  const bookingRef = bookingId
    ? userRef.collection("bookings").doc(bookingId)
    : userRef.collection("bookings").doc();
  const bookingIndexRef = db.collection("bookings").doc(bookingRef.id);

  return {
    userRef,
    bookingRef,
    bookingIndexRef,
  };
}

function getBookingIndexPayload(booking) {
  return {
    id: booking.id,
    uid: booking.uid,
    appointmentDate: booking.appointmentDate,
    appointmentTime: booking.appointmentTime,
    durationMinutes: booking.durationMinutes,
    startMinutes: booking.startMinutes,
    endMinutes: booking.endMinutes,
    location: {
      type: booking.location?.type ?? "clinic",
    },
    status: booking.status,
    calendar: booking.calendar ?? {
      status: "pending",
    },
    payment: booking.payment ?? {},
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt ?? booking.createdAt,
  };
}

function buildFinalRewards(rewards, dripsRedeemed, dripsEarned, totalPaid, effectiveTier) {
  return {
    tier: effectiveTier,
    availableDrips:
      Math.max(Number(rewards.availableDrips) || 0, 0) - dripsRedeemed + dripsEarned,
    lifetimeDrips: Math.max(Number(rewards.lifetimeDrips) || 0, 0) + dripsEarned,
    lifetimeSpend: Math.max(Number(rewards.lifetimeSpend) || 0, 0) + totalPaid,
  };
}

function buildBookingPaymentState(overrides = {}) {
  return {
    provider: "stripe",
    status: "pending",
    checkoutStatus: "open",
    checkoutSessionId: "",
    paymentIntentId: "",
    customerId: "",
    amountPaid: 0,
    amountPaidCents: 0,
    currency: "usd",
    expiresAt: null,
    paidAt: null,
    ...overrides,
  };
}

function normalizeBookingEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function assertGuestBookingCustomer(customer = {}) {
  const email = normalizeBookingEmail(customer.email);
  const dateOfBirth = String(customer.dateOfBirth || "").trim();

  if (!customer.fullName?.trim()) {
    throw new Error("Enter your full name before checkout.");
  }

  if (!customer.phone?.trim()) {
    throw new Error("Enter your phone number before checkout.");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address before checkout.");
  }

  if (!dateOfBirth) {
    throw new Error("Enter your date of birth before checkout.");
  }

  return {
    ...customer,
    fullName: customer.fullName.trim(),
    phone: customer.phone.trim(),
    email,
    dateOfBirth,
  };
}

function buildGuestBookingContext(bookingInput) {
  const customer = assertGuestBookingCustomer(bookingInput.customer);
  const items = normalizeItems(bookingInput.items || []);
  const durationMinutes = getCartDurationMinutes(items);
  const startMinutes = parseTimeToMinutes(bookingInput.appointmentTime);
  const endMinutes = startMinutes === null ? null : startMinutes + durationMinutes;

  if (!items.length) {
    throw new Error("Choose at least one service before checkout.");
  }

  if (!bookingInput.appointmentDate || startMinutes === null) {
    throw new Error("Choose a valid appointment date and time.");
  }

  if (isConciergeLocation(bookingInput.location?.type) && !bookingInput.travelFee) {
    throw new Error("Please calculate the travel fee before checkout.");
  }

  if (bookingInput.couponCode) {
    throw new Error("Sign in is required to apply coupons.");
  }

  if (Number(bookingInput.dripsToRedeem) > 0) {
    throw new Error("Sign in is required to redeem Drips.");
  }

  const membershipSummary = getMembershipSummary(EMPTY_MEMBERSHIP, []);
  const rewards = { ...EMPTY_REWARDS };
  const pricing = getMembershipPricing({
    items,
    membership: membershipSummary,
    benefits: membershipSummary.benefits,
    locationType: bookingInput.location?.type ?? "clinic",
    travelFee: bookingInput.travelFee ?? 0,
  });
  const verifiedOrderTotal = Math.max(
    (bookingInput.subtotal ?? 0) +
      (bookingInput.travelFee ?? 0) -
      pricing.travelFeeWaived -
      pricing.membershipCreditApplied -
      pricing.membershipDiscount,
    0,
  );
  const totalPaid = verifiedOrderTotal;
  const effectiveTier = membershipSummary.effectiveTier ?? DEFAULT_MEMBERSHIP_TIER;
  const dripsEarned = calculateDripsEarned(totalPaid, effectiveTier);

  return {
    items,
    durationMinutes,
    startMinutes,
    endMinutes,
    customer,
    membershipSummary,
    rewards,
    pricing,
    couponApplication: null,
    couponDiscount: 0,
    verifiedOrderTotal,
    dripsRedeemed: 0,
    dripCredit: 0,
    totalPaid,
    effectiveTier,
    dripsEarned,
  };
}

async function buildBookingContext({
  db,
  user,
  bookingInput,
  now = new Date(),
  transaction,
}) {
  if (!user?.uid) {
    throw new Error("Sign in is required.");
  }

  const items = normalizeItems(bookingInput.items || []);
  const durationMinutes = getCartDurationMinutes(items);
  const startMinutes = parseTimeToMinutes(bookingInput.appointmentTime);
  const endMinutes = startMinutes === null ? null : startMinutes + durationMinutes;

  if (!items.length) {
    throw new Error("Choose at least one service before checkout.");
  }

  if (!bookingInput.appointmentDate || startMinutes === null) {
    throw new Error("Choose a valid appointment date and time.");
  }

  if (isConciergeLocation(bookingInput.location?.type) && !bookingInput.travelFee) {
    throw new Error("Please calculate the travel fee before checkout.");
  }

  const userRef = db.collection("users").doc(user.uid);
  const userSnapshot = await transaction.get(userRef);
  const userData = userSnapshot.exists ? userSnapshot.data() || {} : {};
  const syncedMembershipState = syncMembershipState(
    userData.membership ?? EMPTY_MEMBERSHIP,
    Array.isArray(userData.membershipBenefits) ? userData.membershipBenefits : [],
    now,
  );
  const membershipSummary = getMembershipSummary(
    syncedMembershipState.membership,
    syncedMembershipState.membershipBenefits,
  );
  const rewards = {
    ...EMPTY_REWARDS,
    ...(userData.rewards ?? {}),
  };
  const pricing = getMembershipPricing({
    items,
    membership: membershipSummary,
    benefits: membershipSummary.benefits,
    locationType: bookingInput.location?.type ?? "clinic",
    travelFee: bookingInput.travelFee ?? 0,
  });
  const couponCode = String(bookingInput.couponCode || "").trim();
  const couponApplication = couponCode
    ? await getCouponApplication({
        db,
        user,
        couponCode,
        items,
        locationType: bookingInput.location?.type ?? "clinic",
        travelFee: bookingInput.travelFee ?? 0,
        subtotal: bookingInput.subtotal ?? 0,
        now,
        transaction,
      })
    : null;
  const couponDiscount = couponApplication?.couponDiscount ?? 0;
  const verifiedOrderTotal = Math.max(
    (bookingInput.subtotal ?? 0) +
      (bookingInput.travelFee ?? 0) -
      pricing.travelFeeWaived -
      pricing.membershipCreditApplied -
      pricing.membershipDiscount -
      couponDiscount,
    0,
  );
  const maxRedeemableDrips = getMaxRedeemableDrips(
    rewards.availableDrips,
    verifiedOrderTotal,
  );
  const dripsRedeemed = Math.min(bookingInput.dripsToRedeem ?? 0, maxRedeemableDrips);
  const dripCredit = calculateDripCredit(dripsRedeemed);
  const totalPaid = Math.max(verifiedOrderTotal - dripCredit, 0);
  const effectiveTier = membershipSummary.effectiveTier ?? DEFAULT_MEMBERSHIP_TIER;
  const dripsEarned = calculateDripsEarned(totalPaid, effectiveTier);

  return {
    items,
    durationMinutes,
    startMinutes,
    endMinutes,
    userRef,
    userData,
    syncedMembershipState,
    membershipSummary,
    rewards,
    pricing,
    couponApplication,
    couponDiscount,
    verifiedOrderTotal,
    dripsRedeemed,
    dripCredit,
    totalPaid,
    effectiveTier,
    dripsEarned,
  };
}

function buildBookingRecord({ bookingId, uid, bookingInput, context, now, status, payment }) {
  return {
    id: bookingId,
    uid,
    items: context.items,
    appointmentDate: bookingInput.appointmentDate,
    appointmentTime: bookingInput.appointmentTime,
    durationMinutes: context.durationMinutes,
    startMinutes: context.startMinutes,
    endMinutes: context.endMinutes,
    location: bookingInput.location,
    customer: bookingInput.customer,
    notes: bookingInput.notes ?? "",
    subtotal: bookingInput.subtotal,
    travelFee: bookingInput.travelFee,
    travelFeeWaived: context.pricing.travelFeeWaived,
    travelMiles: bookingInput.travelMiles ?? null,
    travelBase: bookingInput.travelBase ?? null,
    travelFeeSource: bookingInput.travelFeeSource ?? "none",
    couponCode: context.couponApplication?.code ?? "",
    couponDiscount: context.couponDiscount,
    membershipTier: context.membershipSummary.tier,
    membershipStatus: context.membershipSummary.status,
    membershipCreditApplied: context.pricing.membershipCreditApplied,
    membershipDiscount: context.pricing.membershipDiscount,
    membershipBenefitUsage: context.pricing.adjustedItems,
    membershipAppliedBenefits: context.pricing.appliedBenefits,
    membershipUpdatedBenefits: context.pricing.updatedBenefits,
    earnRate: context.membershipSummary.earnRate,
    dripCredit: context.dripCredit,
    dripsRedeemed: context.dripsRedeemed,
    totalPaid: context.totalPaid,
    dripsEarned: context.dripsEarned,
    status,
    calendar: {
      status: status === BOOKING_STATUS.APPROVED ? "pending" : "not_started",
    },
    payment,
    createdAt: now,
    updatedAt: now,
  };
}

function applyRewardLedgerEntries(transaction, userRef, booking, now) {
  if (booking.dripsRedeemed) {
    transaction.set(userRef.collection("rewardLedger").doc(), {
      type: "redeem",
      drips: -booking.dripsRedeemed,
      value: booking.dripCredit,
      bookingId: booking.id,
      note: `Redeemed on ${booking.items.length} service booking`,
      createdAt: now,
    });
  }

  if (booking.dripsEarned) {
    transaction.set(userRef.collection("rewardLedger").doc(), {
      type: "earn",
      drips: booking.dripsEarned,
      bookingId: booking.id,
      note: `Earned from ${booking.items.length} service booking`,
      expiresAt: addMonths(now, 12),
      createdAt: now,
    });
  }
}

function applyCouponRedemption(transaction, couponApplication, uid, bookingId, now) {
  if (!couponApplication) {
    return;
  }

  transaction.set(
    couponApplication.couponRef,
    {
      redeemedCount: FieldValue.increment(1),
      updatedAt: now,
    },
    { merge: true },
  );
  transaction.set(
    couponApplication.redemptionRef,
    {
      uid,
      count: FieldValue.increment(1),
      bookingIds: FieldValue.arrayUnion(bookingId),
      updatedAt: now,
    },
    { merge: true },
  );
}

function applyStoredCouponRedemption(transaction, db, couponCode, uid, bookingId, now) {
  if (!couponCode) {
    return;
  }

  const couponRef = db.collection(COUPONS_COLLECTION).doc(couponCode);
  const redemptionRef = couponRef.collection("redemptions").doc(uid);

  transaction.set(
    couponRef,
    {
      redeemedCount: FieldValue.increment(1),
      updatedAt: now,
    },
    { merge: true },
  );
  transaction.set(
    redemptionRef,
    {
      uid,
      count: FieldValue.increment(1),
      bookingIds: FieldValue.arrayUnion(bookingId),
      updatedAt: now,
    },
    { merge: true },
  );
}

export async function assertServerSlotAvailable(db, bookingInput) {
  const [bookingsSnapshot, blocksSnapshot] = await Promise.all([
    db
      .collection("bookings")
      .where("appointmentDate", "==", bookingInput.appointmentDate)
      .get(),
    db.collection("availabilityBlocks").where("date", "==", bookingInput.appointmentDate).get(),
  ]);
  const availability = getSlotAvailability({
    bookings: bookingsSnapshot.docs.map(toJsonDoc),
    blocks: blocksSnapshot.docs.map(toJsonDoc),
    date: bookingInput.appointmentDate,
    time: bookingInput.appointmentTime,
    durationMinutes: bookingInput.durationMinutes,
    locationType: bookingInput.location?.type ?? "clinic",
  });

  if (!availability.available) {
    throw new Error(availability.reason || "This time slot is no longer available.");
  }
}

export async function createPendingServerBooking(
  db,
  user,
  bookingInput,
  { payment = {}, now = new Date() } = {},
) {
  const refs = getBookingRefs(db, user.uid);
  const items = normalizeItems(bookingInput.items || []);
  const durationMinutes = getCartDurationMinutes(items);

  await assertServerSlotAvailable(db, {
    ...bookingInput,
    durationMinutes,
  });

  return db.runTransaction(async (transaction) => {
    const context = await buildBookingContext({
      db,
      user,
      bookingInput,
      now,
      transaction,
    });
    const booking = buildBookingRecord({
      bookingId: refs.bookingRef.id,
      uid: user.uid,
      bookingInput,
      context,
      now,
      status: BOOKING_STATUS.PENDING_PAYMENT,
      payment: buildBookingPaymentState(payment),
    });

    transaction.set(refs.bookingRef, booking);
    transaction.set(refs.bookingIndexRef, getBookingIndexPayload(booking));

    return booking;
  });
}

export async function createGuestPendingServerBooking(
  db,
  bookingInput,
  { payment = {}, now = new Date() } = {},
) {
  const guestBookingRef = db.collection(GUEST_PENDING_BOOKINGS_COLLECTION).doc();
  const bookingIndexRef = db.collection("bookings").doc(guestBookingRef.id);
  const items = normalizeItems(bookingInput.items || []);
  const durationMinutes = getCartDurationMinutes(items);

  await assertServerSlotAvailable(db, {
    ...bookingInput,
    durationMinutes,
  });

  return db.runTransaction(async (transaction) => {
    const context = buildGuestBookingContext(bookingInput);
    const normalizedInput = {
      ...bookingInput,
      customer: context.customer,
    };
    const booking = buildBookingRecord({
      bookingId: guestBookingRef.id,
      uid: "",
      bookingInput: normalizedInput,
      context,
      now,
      status: BOOKING_STATUS.PENDING_PAYMENT,
      payment: buildBookingPaymentState(payment),
    });
    const guestBooking = {
      ...booking,
      guest: true,
      accountStatus: "pending_signup",
    };

    transaction.set(guestBookingRef, guestBooking);
    transaction.set(bookingIndexRef, {
      ...getBookingIndexPayload(guestBooking),
      guest: true,
    });

    return guestBooking;
  });
}

export async function createServerBooking(
  db,
  user,
  bookingInput,
  { payment = {}, now = new Date() } = {},
) {
  const refs = getBookingRefs(db, user.uid);
  const items = normalizeItems(bookingInput.items || []);
  const durationMinutes = getCartDurationMinutes(items);

  await assertServerSlotAvailable(db, {
    ...bookingInput,
    durationMinutes,
  });

  const result = await db.runTransaction(async (transaction) => {
    const context = await buildBookingContext({
      db,
      user,
      bookingInput,
      now,
      transaction,
    });
    const booking = buildBookingRecord({
      bookingId: refs.bookingRef.id,
      uid: user.uid,
      bookingInput,
      context,
      now,
      status: BOOKING_STATUS.APPROVED,
      payment: buildBookingPaymentState({
        status: context.totalPaid > 0 ? "paid" : "no_payment_required",
        checkoutStatus: context.totalPaid > 0 ? "complete" : "not_required",
        amountPaid: context.totalPaid,
        currency: "usd",
        paidAt: now,
        ...payment,
      }),
    });
    const nextRewards = buildFinalRewards(
      context.rewards,
      context.dripsRedeemed,
      context.dripsEarned,
      context.totalPaid,
      context.effectiveTier,
    );

    transaction.set(refs.bookingRef, booking);
    transaction.set(refs.bookingIndexRef, getBookingIndexPayload(booking));
    applyCouponRedemption(
      transaction,
      context.couponApplication,
      user.uid,
      refs.bookingRef.id,
      now,
    );
    applyRewardLedgerEntries(transaction, context.userRef, booking, now);
    transaction.set(
      context.userRef,
      {
        uid: user.uid,
        email: user.email ?? context.userData.email ?? "",
        displayName: user.name ?? context.userData.displayName ?? "",
        membership: context.syncedMembershipState.membership,
        membershipBenefits: context.pricing.remainingBenefits,
        rewards: {
          ...nextRewards,
          updatedAt: now,
        },
      },
      { merge: true },
    );

    return {
      booking,
      rewards: nextRewards,
    };
  });

  return {
    ...result.booking,
    rewards: result.rewards,
  };
}

export async function updatePendingBookingPayment(
  db,
  uid,
  bookingId,
  paymentUpdates = {},
) {
  const payload = {
    payment: paymentUpdates,
    updatedAt: new Date(),
  };

  await Promise.all([
    db.collection("users").doc(uid).collection("bookings").doc(bookingId).set(payload, {
      merge: true,
    }),
    db.collection("bookings").doc(bookingId).set(payload, { merge: true }),
  ]);
}

export async function updateGuestPendingBookingPayment(
  db,
  guestBookingId,
  paymentUpdates = {},
) {
  const payload = {
    payment: paymentUpdates,
    updatedAt: new Date(),
  };

  await Promise.all([
    db.collection(GUEST_PENDING_BOOKINGS_COLLECTION).doc(guestBookingId).set(payload, {
      merge: true,
    }),
    db.collection("bookings").doc(guestBookingId).set(payload, { merge: true }),
  ]);
}

export async function expirePendingServerBooking(
  db,
  uid,
  bookingId,
  { status = BOOKING_STATUS.EXPIRED, paymentStatus = "expired", now = new Date() } = {},
) {
  const payload = {
    status,
    payment: {
      status: paymentStatus,
      checkoutStatus: status === BOOKING_STATUS.CANCELLED ? "canceled" : "expired",
    },
    updatedAt: now,
  };

  await Promise.all([
    db.collection("users").doc(uid).collection("bookings").doc(bookingId).set(payload, {
      merge: true,
    }),
    db.collection("bookings").doc(bookingId).set(payload, { merge: true }),
  ]);
}

export async function expireGuestPendingServerBooking(
  db,
  guestBookingId,
  { status = BOOKING_STATUS.EXPIRED, paymentStatus = "expired", now = new Date() } = {},
) {
  const payload = {
    status,
    payment: {
      status: paymentStatus,
      checkoutStatus: status === BOOKING_STATUS.CANCELLED ? "canceled" : "expired",
    },
    updatedAt: now,
  };

  await Promise.all([
    db.collection(GUEST_PENDING_BOOKINGS_COLLECTION).doc(guestBookingId).set(payload, {
      merge: true,
    }),
    db.collection("bookings").doc(guestBookingId).set(payload, { merge: true }),
  ]);
}

export async function finalizePendingServerBooking(
  db,
  uid,
  bookingId,
  {
    payment = {},
    now = new Date(),
  } = {},
) {
  const refs = getBookingRefs(db, uid, bookingId);

  const result = await db.runTransaction(async (transaction) => {
    const [bookingSnapshot, userSnapshot] = await Promise.all([
      transaction.get(refs.bookingRef),
      transaction.get(refs.userRef),
    ]);

    if (!bookingSnapshot.exists) {
      throw new Error("Booking was not found.");
    }

    const existingBooking = bookingSnapshot.data() || {};

    if (existingBooking.status === BOOKING_STATUS.APPROVED) {
      return {
        booking: existingBooking,
        rewards: {
          ...EMPTY_REWARDS,
          ...((userSnapshot.exists ? userSnapshot.data()?.rewards : {}) ?? {}),
        },
      };
    }

    if (existingBooking.status === BOOKING_STATUS.CANCELLED) {
      throw new Error("This checkout session has already been cancelled.");
    }

    if (existingBooking.status === BOOKING_STATUS.EXPIRED) {
      throw new Error("This checkout session has expired.");
    }

    const userData = userSnapshot.exists ? userSnapshot.data() || {} : {};
    const syncedMembershipState = syncMembershipState(
      userData.membership ?? EMPTY_MEMBERSHIP,
      Array.isArray(userData.membershipBenefits) ? userData.membershipBenefits : [],
      now,
    );
    const rewards = {
      ...EMPTY_REWARDS,
      ...(userData.rewards ?? {}),
    };
    const effectiveTier =
      syncedMembershipState.membership?.tier ?? existingBooking.membershipTier ?? DEFAULT_MEMBERSHIP_TIER;
    const nextRewards = buildFinalRewards(
      rewards,
      existingBooking.dripsRedeemed ?? 0,
      existingBooking.dripsEarned ?? 0,
      existingBooking.totalPaid ?? 0,
      effectiveTier,
    );
    const remainingBenefits = Array.isArray(existingBooking.membershipUpdatedBenefits)
      ? consumeMembershipBenefits({
          benefits: syncedMembershipState.membershipBenefits,
          updatedBenefits: existingBooking.membershipUpdatedBenefits,
        })
      : syncedMembershipState.membershipBenefits;
    const booking = {
      ...existingBooking,
      status: BOOKING_STATUS.APPROVED,
      calendar: {
        status: "pending",
      },
      payment: buildBookingPaymentState({
        ...existingBooking.payment,
        status: existingBooking.totalPaid > 0 ? "paid" : "no_payment_required",
        checkoutStatus: existingBooking.totalPaid > 0 ? "complete" : "not_required",
        amountPaid: existingBooking.totalPaid ?? 0,
        paidAt: now,
        ...payment,
      }),
      updatedAt: now,
    };

    transaction.set(refs.bookingRef, booking, { merge: true });
    transaction.set(refs.bookingIndexRef, getBookingIndexPayload(booking), { merge: true });
    applyStoredCouponRedemption(transaction, db, existingBooking.couponCode, uid, bookingId, now);
    applyRewardLedgerEntries(transaction, refs.userRef, booking, now);
    transaction.set(
      refs.userRef,
      {
        membership: syncedMembershipState.membership,
        membershipBenefits: remainingBenefits,
        rewards: {
          ...nextRewards,
          updatedAt: now,
        },
        updatedAt: now,
      },
      { merge: true },
    );

    return {
      booking,
      rewards: nextRewards,
    };
  });

  return {
    ...result.booking,
    rewards: result.rewards,
  };
}

export async function finalizeGuestPendingServerBooking(
  db,
  uid,
  guestBookingId,
  {
    payment = {},
    now = new Date(),
  } = {},
) {
  const userRef = db.collection("users").doc(uid);
  const bookingRef = userRef.collection("bookings").doc(guestBookingId);
  const bookingIndexRef = db.collection("bookings").doc(guestBookingId);
  const guestBookingRef = db.collection(GUEST_PENDING_BOOKINGS_COLLECTION).doc(guestBookingId);

  const result = await db.runTransaction(async (transaction) => {
    const [guestBookingSnapshot, userSnapshot] = await Promise.all([
      transaction.get(guestBookingRef),
      transaction.get(userRef),
    ]);

    if (!guestBookingSnapshot.exists) {
      throw new Error("Booking was not found.");
    }

    const existingBooking = guestBookingSnapshot.data() || {};

    if (existingBooking.status === BOOKING_STATUS.APPROVED) {
      return {
        booking: existingBooking,
        rewards: {
          ...EMPTY_REWARDS,
          ...((userSnapshot.exists ? userSnapshot.data()?.rewards : {}) ?? {}),
        },
      };
    }

    if (existingBooking.status === BOOKING_STATUS.CANCELLED) {
      throw new Error("This checkout session has already been cancelled.");
    }

    if (existingBooking.status === BOOKING_STATUS.EXPIRED) {
      throw new Error("This checkout session has expired.");
    }

    const userData = userSnapshot.exists ? userSnapshot.data() || {} : {};
    const syncedMembershipState = syncMembershipState(
      userData.membership ?? EMPTY_MEMBERSHIP,
      Array.isArray(userData.membershipBenefits) ? userData.membershipBenefits : [],
      now,
    );
    const rewards = {
      ...EMPTY_REWARDS,
      ...(userData.rewards ?? {}),
    };
    const effectiveTier =
      syncedMembershipState.membership?.tier ??
      existingBooking.membershipTier ??
      DEFAULT_MEMBERSHIP_TIER;
    const nextRewards = buildFinalRewards(
      rewards,
      existingBooking.dripsRedeemed ?? 0,
      existingBooking.dripsEarned ?? 0,
      existingBooking.totalPaid ?? 0,
      effectiveTier,
    );
    const booking = {
      ...existingBooking,
      uid,
      guest: false,
      accountStatus: "attached",
      status: BOOKING_STATUS.APPROVED,
      calendar: {
        status: "pending",
      },
      payment: buildBookingPaymentState({
        ...existingBooking.payment,
        status: existingBooking.totalPaid > 0 ? "paid" : "no_payment_required",
        checkoutStatus: existingBooking.totalPaid > 0 ? "complete" : "not_required",
        amountPaid: existingBooking.totalPaid ?? 0,
        paidAt: now,
        ...payment,
      }),
      updatedAt: now,
    };

    transaction.set(bookingRef, booking, { merge: true });
    transaction.set(bookingIndexRef, getBookingIndexPayload(booking), { merge: true });
    transaction.set(
      guestBookingRef,
      {
        ...booking,
        finalizedAt: now,
      },
      { merge: true },
    );
    applyRewardLedgerEntries(transaction, userRef, booking, now);
    transaction.set(
      userRef,
      {
        uid,
        email: userData.email ?? existingBooking.customer?.email ?? "",
        displayName: userData.displayName ?? existingBooking.customer?.fullName ?? "",
        membership: syncedMembershipState.membership,
        membershipBenefits: syncedMembershipState.membershipBenefits,
        rewards: {
          ...nextRewards,
          updatedAt: now,
        },
        updatedAt: now,
      },
      { merge: true },
    );

    return {
      booking,
      rewards: nextRewards,
    };
  });

  return {
    ...result.booking,
    rewards: result.rewards,
  };
}

export async function getServerBookingById(db, uid, bookingId) {
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("bookings")
    .doc(bookingId)
    .get();

  if (!snapshot.exists) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function updateBookingCalendarState(db, uid, bookingId, calendar) {
  const payload = {
    calendar,
    updatedAt: new Date(),
  };

  await Promise.all([
    db.collection("users").doc(uid).collection("bookings").doc(bookingId).set(payload, {
      merge: true,
    }),
    db.collection("bookings").doc(bookingId).set(payload, { merge: true }),
  ]);
}
