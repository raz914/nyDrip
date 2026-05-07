import { FieldValue } from "firebase-admin/firestore";

import {
  assertServerSlotAvailable,
  updateBookingCalendarState,
} from "@/lib/serverBookings";
import {
  formatMinutesToTime,
  getCartDurationMinutes,
  getSlotAvailability,
  parseTimeToMinutes,
} from "@/lib/bookingRules";

export function errorStatus(message) {
  if (message === "Sign in is required.") {
    return 401;
  }
  if (message === "Admin access is required.") {
    return 403;
  }
  return 400;
}

function toMillis(value) {
  if (!value) {
    return null;
  }
  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  return null;
}

export function mapBookingDoc(doc) {
  const data = doc.data() || {};

  return {
    id: doc.id,
    uid: data.uid || "",
    appointmentDate: data.appointmentDate || "",
    appointmentTime: data.appointmentTime || "",
    durationMinutes: data.durationMinutes ?? null,
    startMinutes: data.startMinutes ?? null,
    endMinutes: data.endMinutes ?? null,
    items: Array.isArray(data.items) ? data.items : [],
    customer: data.customer || {},
    location: data.location || {},
    notes: data.notes || "",
    status: data.status || "Approved",
    subtotal: data.subtotal ?? null,
    totalPaid: data.totalPaid ?? null,
    calendar: data.calendar || { status: "pending" },
    createdAt: toMillis(data.createdAt),
    updatedAt: toMillis(data.updatedAt),
    canceledAt: toMillis(data.canceledAt),
  };
}

export function mapBlockDoc(doc) {
  const data = doc.data() || {};

  return {
    id: doc.id,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    startMinutes: data.startMinutes,
    endMinutes: data.endMinutes,
    reason: data.reason || "",
    createdBy: data.createdBy || "",
  };
}

export async function getBookingsForRange(db, start, end) {
  let query = db.collection("bookings");

  if (start) {
    query = query.where("appointmentDate", ">=", start);
  }
  if (end) {
    query = query.where("appointmentDate", "<=", end);
  }

  const snapshot = await query.orderBy("appointmentDate", "asc").get();

  const bookings = snapshot.docs.map(mapBookingDoc);
  const userBookingRefs = bookings
    .filter((booking) => booking.uid)
    .map((booking) =>
      db
        .collection("users")
        .doc(booking.uid)
        .collection("bookings")
        .doc(booking.id),
    );
  const userBookingSnapshots = userBookingRefs.length
    ? await db.getAll(...userBookingRefs)
    : [];
  const userBookingById = new Map(
    userBookingSnapshots
      .filter((bookingSnapshot) => bookingSnapshot.exists)
      .map((bookingSnapshot) => [bookingSnapshot.id, mapBookingDoc(bookingSnapshot)]),
  );

  return bookings.map((booking) => ({
    ...booking,
    ...(userBookingById.get(booking.id) || {}),
    id: booking.id,
    uid: booking.uid,
    calendar:
      booking.calendar ||
      userBookingById.get(booking.id)?.calendar ||
      { status: "pending" },
  }));
}

export async function getBlocksForRange(db, start, end) {
  let query = db.collection("availabilityBlocks");

  if (start) {
    query = query.where("date", ">=", start);
  }
  if (end) {
    query = query.where("date", "<=", end);
  }

  const snapshot = await query.orderBy("date", "asc").get();

  return snapshot.docs.map(mapBlockDoc);
}

export async function getBookingDoc(db, id) {
  const snapshot = await db.collection("bookings").doc(id).get();

  if (!snapshot.exists) {
    throw new Error("Booking not found.");
  }

  return snapshot;
}

export async function updateBooking(db, id, input = {}) {
  const snapshot = await getBookingDoc(db, id);
  const booking = mapBookingDoc(snapshot);
  const patch = {
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (input.appointmentDate !== undefined) {
    const date = String(input.appointmentDate || "").trim();
    if (!date) {
      throw new Error("Choose a valid appointment date.");
    }
    patch.appointmentDate = date;
  }

  if (input.appointmentTime !== undefined || input.startMinutes !== undefined) {
    const startMinutes =
      input.startMinutes !== undefined && Number.isFinite(Number(input.startMinutes))
        ? Number(input.startMinutes)
        : parseTimeToMinutes(input.appointmentTime);

    if (!Number.isFinite(startMinutes)) {
      throw new Error("Choose a valid appointment time.");
    }

    const durationMinutes = Number.isFinite(Number(input.durationMinutes))
      ? Number(input.durationMinutes)
      : Number(booking.durationMinutes) || 60;
    patch.startMinutes = startMinutes;
    patch.endMinutes = startMinutes + durationMinutes;
    patch.durationMinutes = durationMinutes;
    patch.appointmentTime = formatMinutesToTime(startMinutes);
  }

  if (input.status !== undefined) {
    const status = String(input.status || "").trim();
    if (!status) {
      throw new Error("Choose a valid booking status.");
    }
    patch.status = status;
    if (status === "Cancelled") {
      patch.canceledAt = FieldValue.serverTimestamp();
    }
  }

  if (input.notes !== undefined) {
    patch.notes = String(input.notes || "");
  }

  if (Object.keys(patch).length === 1) {
    throw new Error("No booking updates were provided.");
  }

  if (patch.appointmentDate || patch.appointmentTime || patch.durationMinutes) {
    await assertAdminSlotAvailableForUpdate(db, booking, patch);
  }

  const nextCalendar =
    booking.calendar?.eventId &&
    (patch.appointmentDate || patch.appointmentTime || patch.status === "Cancelled")
      ? {
          ...booking.calendar,
          status: patch.status === "Cancelled" ? "needs_cancel" : "needs_resync",
          error:
            patch.status === "Cancelled"
              ? "Booking was cancelled in admin after Google Calendar sync."
              : "Booking was changed in admin after Google Calendar sync.",
        }
      : null;

  if (nextCalendar) {
    patch.calendar = nextCalendar;
  }

  await writeBookingPatch(db, booking, id, patch);
  const updated = await db.collection("bookings").doc(id).get();

  return mapBookingDoc(updated);
}

export async function cancelBooking(db, id) {
  const snapshot = await getBookingDoc(db, id);
  const booking = mapBookingDoc(snapshot);
  const patch = {
    status: "Cancelled",
    canceledAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    calendar: booking.calendar?.eventId
      ? {
          ...booking.calendar,
          status: "needs_cancel",
          error: "Booking was cancelled in admin after Google Calendar sync.",
        }
      : booking.calendar,
  };

  await writeBookingPatch(db, booking, id, patch);
  const updated = await db.collection("bookings").doc(id).get();

  return mapBookingDoc(updated);
}

export async function createAdminBooking(db, adminUser, input = {}) {
  const service = input.service;
  const appointmentDate = String(input.appointmentDate || "").trim();
  const appointmentTime = String(input.appointmentTime || "").trim();
  const locationType = input.locationType === "mobile" ? "mobile" : "clinic";
  const customer = {
    fullName: String(input.customer?.fullName || "").trim(),
    email: String(input.customer?.email || "").trim(),
    phone: String(input.customer?.phone || "").trim(),
    dateOfBirth: String(input.customer?.dateOfBirth || "").trim(),
  };

  if (!service?.id) {
    throw new Error("Choose a service.");
  }

  if (!customer.fullName || !customer.email || !customer.phone || !customer.dateOfBirth) {
    throw new Error("Enter the customer name, email, phone, and date of birth.");
  }

  const items = [
    {
      id: service.id,
      name: service.name,
      displayName: service.displayName || service.name,
      baseName: service.baseName || service.displayName || service.name,
      category: service.category || "",
      duration: service.duration,
      price: Number(service.price) || 0,
      image: service.image || "",
      membershipBucket: service.membershipBucket ?? null,
      membershipKind: service.membershipKind ?? null,
      ivSizeMl: service.ivSizeMl ?? null,
      smallVariantId: service.smallVariantId ?? null,
      smallVariantPrice: service.smallVariantPrice ?? null,
    },
  ];
  const durationMinutes = getCartDurationMinutes(items);
  const startMinutes = parseTimeToMinutes(appointmentTime);

  if (!appointmentDate || startMinutes === null) {
    throw new Error("Choose a valid appointment date and time.");
  }

  if (locationType === "mobile" && !String(input.location?.address || "").trim()) {
    throw new Error("Enter the mobile appointment address.");
  }

  await assertServerSlotAvailable(db, {
    appointmentDate,
    appointmentTime,
    durationMinutes,
    location: {
      type: locationType,
    },
  });

  const bookingRef = db.collection("bookings").doc();
  const uid = String(input.uid || "").trim();
  const now = new Date();
  const booking = {
    id: bookingRef.id,
    uid,
    items,
    appointmentDate,
    appointmentTime,
    durationMinutes,
    startMinutes,
    endMinutes: startMinutes + durationMinutes,
    location: {
      type: locationType,
      label: locationType === "mobile" ? "Mobile appointment" : "In clinic",
      address: locationType === "mobile" ? String(input.location?.address || "").trim() : "",
    },
    customer,
    notes: String(input.notes || ""),
    subtotal: Number(service.price) || 0,
    travelFee: 0,
    couponDiscount: 0,
    totalPaid: Number(service.price) || 0,
    status: "Approved",
    calendar: {
      status: "pending",
    },
    createdBy: adminUser.email || adminUser.uid,
    createdAt: now,
  };

  await bookingRef.set(booking);

  if (uid) {
    await db
      .collection("users")
      .doc(uid)
      .collection("bookings")
      .doc(bookingRef.id)
      .set(booking);
  }

  return booking;
}

export async function syncAdminBookingCalendar(db, booking) {
  const { createBookingCalendarEvent } = await import("@/lib/googleCalendar");

  try {
    const event = await createBookingCalendarEvent(booking);
    const calendar = {
      status: "created",
      eventId: event.eventId,
      htmlLink: event.htmlLink,
      syncedAt: new Date(),
    };

    if (booking.uid) {
      await updateBookingCalendarState(db, booking.uid, booking.id, calendar);
    } else {
      await db.collection("bookings").doc(booking.id).set({ calendar }, { merge: true });
    }

    return {
      ...booking,
      calendar,
    };
  } catch (error) {
    const calendar = {
      status: "failed",
      error: error?.message || "Could not create Google Calendar event.",
      syncedAt: new Date(),
    };

    if (booking.uid) {
      await updateBookingCalendarState(db, booking.uid, booking.id, calendar);
    } else {
      await db.collection("bookings").doc(booking.id).set({ calendar }, { merge: true });
    }

    return {
      ...booking,
      calendar,
    };
  }
}

async function writeBookingPatch(db, booking, id, patch) {
  const writes = [db.collection("bookings").doc(id).set(patch, { merge: true })];

  if (booking.uid) {
    writes.push(
      db
        .collection("users")
        .doc(booking.uid)
        .collection("bookings")
        .doc(id)
        .set(patch, { merge: true }),
    );
  }

  await Promise.all(writes);
}

async function assertAdminSlotAvailableForUpdate(db, booking, patch) {
  const appointmentDate = patch.appointmentDate || booking.appointmentDate;
  const appointmentTime = patch.appointmentTime || booking.appointmentTime;
  const durationMinutes = patch.durationMinutes || booking.durationMinutes || 60;
  const [bookingsSnapshot, blocksSnapshot] = await Promise.all([
    db.collection("bookings").where("appointmentDate", "==", appointmentDate).get(),
    db.collection("availabilityBlocks").where("date", "==", appointmentDate).get(),
  ]);
  const availability = getSlotAvailability({
    bookings: bookingsSnapshot.docs
      .filter((doc) => doc.id !== booking.id)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    blocks: blocksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })),
    date: appointmentDate,
    time: appointmentTime,
    durationMinutes,
    locationType: booking.location?.type || "clinic",
  });

  if (!availability.available) {
    throw new Error(availability.reason || "This time slot is no longer available.");
  }
}
