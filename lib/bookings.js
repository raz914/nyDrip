import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import {
  addEarnLedgerEntry,
  addRedeemLedgerEntry,
  calculateDripCredit,
  calculateDripsEarned,
  getMaxRedeemableDrips,
  getUserRewards,
} from "@/lib/rewards";
import { db } from "@/lib/firebase";
import {
  calculateMembershipDiscount,
  getUserMembership,
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
    category: item.category,
    duration: item.duration,
    price: item.price,
    image: item.image,
  }));
}

export async function createUserBooking(user, bookingInput) {
  if (!user) {
    throw new Error("You must be signed in to complete a booking.");
  }

  const [rewards, membership] = await Promise.all([
    getUserRewards(user.uid),
    getUserMembership(user.uid),
  ]);
  const membershipDiscount = calculateMembershipDiscount(
    bookingInput.items,
    membership,
  );
  const verifiedOrderTotal = Math.max(
    (bookingInput.subtotal ?? 0) +
      (bookingInput.travelFee ?? 0) -
      (bookingInput.couponDiscount ?? 0) -
      membershipDiscount,
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
  const dripsEarned = calculateDripsEarned(totalPaid, membership.tier);
  const nextAvailableDrips =
    rewards.availableDrips - dripsRedeemed + dripsEarned;
  const nextLifetimeDrips = rewards.lifetimeDrips + dripsEarned;
  const nextLifetimeSpend = rewards.lifetimeSpend + totalPaid;
  const bookingRef = doc(collection(db, "users", user.uid, "bookings"));
  const bookingIndexRef = doc(db, "bookings", bookingRef.id);
  const batch = writeBatch(db);
  const items = normalizeItems(bookingInput.items);
  const durationMinutes = getCartDurationMinutes(items);
  const startMinutes = parseTimeToMinutes(bookingInput.appointmentTime);
  const endMinutes =
    startMinutes === null ? null : startMinutes + durationMinutes;

  if (isConciergeLocation(bookingInput.location?.type) && !bookingInput.travelFee) {
    throw new Error("Please calculate the travel fee before checkout.");
  }

  batch.set(bookingRef, {
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
    travelMiles: bookingInput.travelMiles ?? null,
    travelBase: bookingInput.travelBase ?? null,
    travelFeeSource: bookingInput.travelFeeSource ?? "none",
    couponCode: bookingInput.couponCode ?? "",
    couponDiscount: bookingInput.couponDiscount ?? 0,
    membershipTier: membership.tier,
    membershipDiscount,
    earnRate: membership.earnRate,
    dripCredit,
    dripsRedeemed,
    totalPaid,
    dripsEarned,
    status: "Approved",
    createdAt: serverTimestamp(),
  });

  batch.set(bookingIndexRef, {
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
    addRedeemLedgerEntry(batch, user.uid, {
      drips: dripsRedeemed,
      value: dripCredit,
      bookingId: bookingRef.id,
      note: `Redeemed on ${items.length} service booking`,
    });
  }

  addEarnLedgerEntry(batch, user.uid, {
    drips: dripsEarned,
    bookingId: bookingRef.id,
    note: `Earned from ${items.length} service booking`,
  });

  batch.set(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? "",
      rewards: {
        tier: membership.tier,
        availableDrips: nextAvailableDrips,
        lifetimeDrips: nextLifetimeDrips,
        lifetimeSpend: nextLifetimeSpend,
        updatedAt: serverTimestamp(),
      },
    },
    { merge: true },
  );

  await batch.commit();

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
    travelMiles: bookingInput.travelMiles ?? null,
    travelBase: bookingInput.travelBase ?? null,
    travelFeeSource: bookingInput.travelFeeSource ?? "none",
    couponCode: bookingInput.couponCode ?? "",
    couponDiscount: bookingInput.couponDiscount ?? 0,
    membershipTier: membership.tier,
    membershipDiscount,
    earnRate: membership.earnRate,
    dripCredit,
    dripsRedeemed,
    totalPaid,
    dripsEarned,
    status: "Approved",
    rewards: {
      ...rewards,
      tier: membership.tier,
      availableDrips: nextAvailableDrips,
      lifetimeDrips: nextLifetimeDrips,
      lifetimeSpend: nextLifetimeSpend,
    },
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
    service,
    duration: firstItem?.duration ?? "1h",
    points: `${booking.dripsEarned ?? 0} Drips`,
    status: booking.status ?? "Approved",
    createdAt: toDate(booking.createdAt),
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
