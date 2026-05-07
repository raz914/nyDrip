import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import {
  EMPTY_REWARDS,
  addEarnLedgerEntry,
  addRedeemLedgerEntry,
  calculateDripCredit,
  calculateDripsEarned,
  getMaxRedeemableDrips,
} from "@/lib/rewards";
import { db } from "@/lib/firebase";
import {
  DEFAULT_MEMBERSHIP_TIER,
  getMembershipPricing,
  getMembershipSummary,
  syncMembershipState,
} from "@/lib/memberships";
import {
  getCartDurationMinutes,
  isConciergeLocation,
  parseTimeToMinutes,
} from "@/lib/bookingRules";

function toDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  return new Date(value);
}

function formatAppointmentDate(dateValue, timeValue) {
  if (!dateValue) {
    return "Date pending";
  }

  const date = new Date(`${dateValue}T12:00:00`);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return timeValue ? `${formattedDate} ${timeValue}` : formattedDate;
}

function normalizeItems(items) {
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

export async function createUserBooking(user, bookingInput) {
  if (!user) {
    throw new Error("You must be signed in to complete a booking.");
  }

  const bookingRef = doc(collection(db, "users", user.uid, "bookings"));
  const bookingIndexRef = doc(db, "bookings", bookingRef.id);
  const items = normalizeItems(bookingInput.items);
  const durationMinutes = getCartDurationMinutes(items);
  const startMinutes = parseTimeToMinutes(bookingInput.appointmentTime);
  const endMinutes =
    startMinutes === null ? null : startMinutes + durationMinutes;

  if (isConciergeLocation(bookingInput.location?.type) && !bookingInput.travelFee) {
    throw new Error("Please calculate the travel fee before checkout.");
  }

  const result = await runTransaction(db, async (transaction) => {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await transaction.get(userRef);
    const userData = userSnapshot.exists() ? userSnapshot.data() : {};
    const syncedMembershipState = syncMembershipState(
      userData.membership,
      userData.membershipBenefits,
      new Date(),
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

    transaction.set(bookingRef, {
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
      createdAt: serverTimestamp(),
    });

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
      createdAt: serverTimestamp(),
    });

    if (dripsRedeemed) {
      addRedeemLedgerEntry(transaction, user.uid, {
        drips: dripsRedeemed,
        value: dripCredit,
        bookingId: bookingRef.id,
        note: `Redeemed on ${items.length} service booking`,
      });
    }

    addEarnLedgerEntry(transaction, user.uid, {
      drips: dripsEarned,
      bookingId: bookingRef.id,
      note: `Earned from ${items.length} service booking`,
    });

    transaction.set(
      userRef,
      {
        uid: user.uid,
        email: user.email ?? "",
        displayName: user.displayName ?? "",
        membership: syncedMembershipState.membership,
        membershipBenefits: remainingBenefits,
        rewards: {
          tier: effectiveTier,
          availableDrips: nextAvailableDrips,
          lifetimeDrips: nextLifetimeDrips,
          lifetimeSpend: nextLifetimeSpend,
          updatedAt: serverTimestamp(),
        },
      },
      { merge: true },
    );

    return {
      membershipSummary,
      rewards: {
        ...rewards,
        tier: effectiveTier,
        availableDrips: nextAvailableDrips,
        lifetimeDrips: nextLifetimeDrips,
        lifetimeSpend: nextLifetimeSpend,
      },
      pricing,
      dripsRedeemed,
      dripCredit,
      totalPaid,
      dripsEarned,
    };
  });

  return {
    id: bookingRef.id,
    items,
    appointmentDate: bookingInput.appointmentDate,
    appointmentTime: bookingInput.appointmentTime,
    durationMinutes,
    startMinutes,
    endMinutes,
    location: bookingInput.location,
    subtotal: bookingInput.subtotal,
    travelFee: bookingInput.travelFee,
    travelFeeWaived: result.pricing.travelFeeWaived,
    travelMiles: bookingInput.travelMiles ?? null,
    travelBase: bookingInput.travelBase ?? null,
    travelFeeSource: bookingInput.travelFeeSource ?? "none",
    couponCode: bookingInput.couponCode ?? "",
    couponDiscount: bookingInput.couponDiscount ?? 0,
    membershipTier: result.membershipSummary.tier,
    membershipStatus: result.membershipSummary.status,
    membershipCreditApplied: result.pricing.membershipCreditApplied,
    membershipDiscount: result.pricing.membershipDiscount,
    membershipBenefitUsage: result.pricing.adjustedItems,
    membershipAppliedBenefits: result.pricing.appliedBenefits,
    earnRate: result.membershipSummary.earnRate,
    dripCredit: result.dripCredit,
    dripsRedeemed: result.dripsRedeemed,
    totalPaid: result.totalPaid,
    dripsEarned: result.dripsEarned,
    status: "Approved",
    rewards: result.rewards,
  };
}

export async function getBookingsForDate(date) {
  if (!date) {
    return [];
  }

  const bookingsQuery = query(
    collection(db, "bookings"),
    where("appointmentDate", "==", date),
  );
  const snapshot = await getDocs(bookingsQuery);

  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));
}

export async function getUserBookings(uid, rowLimit = 20) {
  if (!uid) {
    return [];
  }

  const bookingsQuery = query(
    collection(db, "users", uid, "bookings"),
    orderBy("createdAt", "desc"),
    limit(rowLimit),
  );
  const snapshot = await getDocs(bookingsQuery);

  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));
}

export function getNextAppointment(bookings) {
  const now = new Date();

  return bookings
    .filter((booking) => {
      if (!booking.appointmentDate) {
        return false;
      }

      return new Date(`${booking.appointmentDate}T23:59:59`) >= now;
    })
    .sort((a, b) =>
      `${a.appointmentDate} ${a.appointmentTime}`.localeCompare(
        `${b.appointmentDate} ${b.appointmentTime}`,
      ),
    )[0] ?? null;
}

export function mapBookingToHistoryRow(booking) {
  const firstItem = booking.items?.[0];
  const extraCount = Math.max((booking.items?.length ?? 0) - 1, 0);
  const service = extraCount
    ? `${firstItem?.displayName ?? "Booking"} + ${extraCount} more`
    : firstItem?.displayName ?? "Booking";

  return {
    id: booking.id,
    date: formatAppointmentDate(booking.appointmentDate, booking.appointmentTime),
    appointmentDate: booking.appointmentDate,
    appointmentTime: booking.appointmentTime,
    service,
    duration: firstItem?.duration ?? "1h",
    points: `${booking.dripsEarned ?? 0} Drips`,
    status: booking.status ?? "Approved",
    createdAt: toDate(booking.createdAt),
    items: booking.items ?? [],
    customer: booking.customer ?? {},
    location: booking.location ?? {},
    notes: booking.notes ?? "",
    subtotal: booking.subtotal ?? 0,
    travelFee: booking.travelFee ?? 0,
    travelFeeWaived: booking.travelFeeWaived ?? 0,
    couponCode: booking.couponCode ?? "",
    couponDiscount: booking.couponDiscount ?? 0,
    membershipCreditApplied: booking.membershipCreditApplied ?? 0,
    membershipDiscount: booking.membershipDiscount ?? 0,
    membershipAppliedBenefits: booking.membershipAppliedBenefits ?? [],
    dripCredit: booking.dripCredit ?? 0,
    totalPaid: booking.totalPaid ?? 0,
    payment: booking.payment ?? {},
  };
}

export function mapBookingToAppointment(booking) {
  if (!booking) {
    return null;
  }

  const firstItem = booking.items?.[0];

  return {
    id: booking.id,
    date: formatAppointmentDate(booking.appointmentDate, booking.appointmentTime),
    service: firstItem?.displayName ?? "Appointment",
    location: booking.location?.address ?? "Location pending",
  };
}
