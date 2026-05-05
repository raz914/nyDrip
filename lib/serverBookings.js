import {
  EMPTY_REWARDS,
  calculateDripCredit,
  calculateDripsEarned,
  getMaxRedeemableDrips,
} from "@/lib/rewards-engine.mjs";
import {
  DEFAULT_MEMBERSHIP_TIER,
  EMPTY_MEMBERSHIP,
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

function addMonths(date, months) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
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

function toJsonDoc(doc) {
  return {
    id: doc.id,
    ...doc.data(),
  };
}

function assertValidMockPayment(payment = {}) {
  const digits = String(payment.cardNumber ?? "").replace(/\D/g, "");

  if (
    digits.length < 12 ||
    String(payment.expiration ?? "").trim().length < 5 ||
    String(payment.cvc ?? "").trim().length < 3
  ) {
    throw new Error("Enter a valid mock card before checkout.");
  }
}

export async function assertServerSlotAvailable(db, bookingInput) {
  const [bookingsSnapshot, blocksSnapshot] = await Promise.all([
    db.collection("bookings").where("appointmentDate", "==", bookingInput.appointmentDate).get(),
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

export async function createServerBooking(db, user, bookingInput) {
  if (!user?.uid) {
    throw new Error("Sign in is required.");
  }

  assertValidMockPayment(bookingInput.payment);

  const bookingRef = db.collection("users").doc(user.uid).collection("bookings").doc();
  const bookingIndexRef = db.collection("bookings").doc(bookingRef.id);
  const items = normalizeItems(bookingInput.items || []);
  const durationMinutes = getCartDurationMinutes(items);
  const startMinutes = parseTimeToMinutes(bookingInput.appointmentTime);
  const endMinutes =
    startMinutes === null ? null : startMinutes + durationMinutes;
  const now = new Date();

  if (!items.length) {
    throw new Error("Choose at least one service before checkout.");
  }

  if (!bookingInput.appointmentDate || startMinutes === null) {
    throw new Error("Choose a valid appointment date and time.");
  }

  if (isConciergeLocation(bookingInput.location?.type) && !bookingInput.travelFee) {
    throw new Error("Please calculate the travel fee before checkout.");
  }

  await assertServerSlotAvailable(db, {
    ...bookingInput,
    durationMinutes,
  });

  const result = await db.runTransaction(async (transaction) => {
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
    const verifiedOrderTotal = Math.max(
      (bookingInput.subtotal ?? 0) +
        (bookingInput.travelFee ?? 0) -
        pricing.travelFeeWaived -
        (bookingInput.couponDiscount ?? 0) -
        pricing.membershipCreditApplied -
        pricing.membershipDiscount,
      0,
    );
    const maxRedeemableDrips = getMaxRedeemableDrips(
      rewards.availableDrips,
      verifiedOrderTotal,
    );
    const dripsRedeemed = Math.min(
      bookingInput.dripsToRedeem ?? 0,
      maxRedeemableDrips,
    );
    const dripCredit = calculateDripCredit(dripsRedeemed);
    const totalPaid = Math.max(verifiedOrderTotal - dripCredit, 0);
    const effectiveTier = membershipSummary.effectiveTier ?? DEFAULT_MEMBERSHIP_TIER;
    const dripsEarned = calculateDripsEarned(totalPaid, effectiveTier);
    const nextAvailableDrips =
      Math.max(Number(rewards.availableDrips) || 0, 0) - dripsRedeemed + dripsEarned;
    const nextLifetimeDrips =
      Math.max(Number(rewards.lifetimeDrips) || 0, 0) + dripsEarned;
    const nextLifetimeSpend =
      Math.max(Number(rewards.lifetimeSpend) || 0, 0) + totalPaid;
    const remainingBenefits = pricing.remainingBenefits;
    const booking = {
      id: bookingRef.id,
      uid: user.uid,
      items,
      appointmentDate: bookingInput.appointmentDate,
      appointmentTime: bookingInput.appointmentTime,
      durationMinutes,
      startMinutes,
      endMinutes,
      location: bookingInput.location,
      customer: bookingInput.customer,
      notes: bookingInput.notes ?? "",
      subtotal: bookingInput.subtotal,
      travelFee: bookingInput.travelFee,
      travelFeeWaived: pricing.travelFeeWaived,
      travelMiles: bookingInput.travelMiles ?? null,
      travelBase: bookingInput.travelBase ?? null,
      travelFeeSource: bookingInput.travelFeeSource ?? "none",
      couponCode: bookingInput.couponCode ?? "",
      couponDiscount: bookingInput.couponDiscount ?? 0,
      membershipTier: membershipSummary.tier,
      membershipStatus: membershipSummary.status,
      membershipCreditApplied: pricing.membershipCreditApplied,
      membershipDiscount: pricing.membershipDiscount,
      membershipBenefitUsage: pricing.adjustedItems,
      membershipAppliedBenefits: pricing.appliedBenefits,
      earnRate: membershipSummary.earnRate,
      dripCredit,
      dripsRedeemed,
      totalPaid,
      dripsEarned,
      status: "Approved",
      calendar: {
        status: "pending",
      },
      createdAt: now,
    };

    transaction.set(bookingRef, booking);
    transaction.set(bookingIndexRef, {
      id: bookingRef.id,
      uid: user.uid,
      appointmentDate: bookingInput.appointmentDate,
      appointmentTime: bookingInput.appointmentTime,
      durationMinutes,
      startMinutes,
      endMinutes,
      location: {
        type: bookingInput.location?.type ?? "clinic",
      },
      status: "Approved",
      calendar: {
        status: "pending",
      },
      createdAt: now,
    });

    if (dripsRedeemed) {
      transaction.set(userRef.collection("rewardLedger").doc(), {
        type: "redeem",
        drips: -dripsRedeemed,
        value: dripCredit,
        bookingId: bookingRef.id,
        note: `Redeemed on ${items.length} service booking`,
        createdAt: now,
      });
    }

    if (dripsEarned) {
      transaction.set(userRef.collection("rewardLedger").doc(), {
        type: "earn",
        drips: dripsEarned,
        bookingId: bookingRef.id,
        note: `Earned from ${items.length} service booking`,
        expiresAt: addMonths(now, 12),
        createdAt: now,
      });
    }

    transaction.set(
      userRef,
      {
        uid: user.uid,
        email: user.email ?? userData.email ?? "",
        displayName: user.name ?? userData.displayName ?? "",
        membership: syncedMembershipState.membership,
        membershipBenefits: remainingBenefits,
        rewards: {
          tier: effectiveTier,
          availableDrips: nextAvailableDrips,
          lifetimeDrips: nextLifetimeDrips,
          lifetimeSpend: nextLifetimeSpend,
          updatedAt: now,
        },
      },
      { merge: true },
    );

    return {
      booking,
      membershipSummary,
      rewards: {
        ...rewards,
        tier: effectiveTier,
        availableDrips: nextAvailableDrips,
        lifetimeDrips: nextLifetimeDrips,
        lifetimeSpend: nextLifetimeSpend,
      },
    };
  });

  return {
    ...result.booking,
    rewards: result.rewards,
  };
}

export async function updateBookingCalendarState(db, uid, bookingId, calendar) {
  const payload = {
    calendar,
  };

  await Promise.all([
    db.collection("users").doc(uid).collection("bookings").doc(bookingId).set(payload, {
      merge: true,
    }),
    db.collection("bookings").doc(bookingId).set(payload, { merge: true }),
  ]);
}
