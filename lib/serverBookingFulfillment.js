import { createBookingCalendarEvent } from "@/lib/googleCalendar";
import { buildBookingConfirmationEmail } from "@/lib/bookingConfirmationEmail.mjs";
import {
  GUEST_PENDING_BOOKINGS_COLLECTION,
  updateBookingCalendarState,
} from "@/lib/serverBookings";
import { sendPlainTextEmail } from "@/lib/smtpMailer";

async function updateBookingConfirmationEmailState(db, uid, booking, confirmationEmail) {
  const payload = {
    confirmationEmail,
    updatedAt: new Date(),
  };
  const writes = [
    db.collection("bookings").doc(booking.id).set(payload, { merge: true }),
  ];

  if (uid) {
    writes.push(
      db.collection("users").doc(uid).collection("bookings").doc(booking.id).set(payload, {
        merge: true,
      }),
    );
  }

  if (booking.accountStatus || booking.accountCreatedUid) {
    writes.push(
      db.collection(GUEST_PENDING_BOOKINGS_COLLECTION).doc(booking.id).set(payload, {
        merge: true,
      }),
    );
  }

  await Promise.all(writes);
}

async function beginConfirmationEmailSend(db, booking) {
  const bookingIndexRef = db.collection("bookings").doc(booking.id);
  const staleSendingBefore = Date.now() - 5 * 60 * 1000;

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(bookingIndexRef);
    const data = snapshot.exists ? snapshot.data() || {} : {};
    const current = data.confirmationEmail ?? booking.confirmationEmail ?? {};
    const sent = current.status === "sent";
    const sendingAt = current.sendingAt?.toDate?.() ?? current.sendingAt ?? null;
    const sendingTime = sendingAt instanceof Date ? sendingAt.getTime() : 0;
    const activelySending = current.status === "sending" && sendingTime > staleSendingBefore;

    if (sent || activelySending) {
      return false;
    }

    transaction.set(
      bookingIndexRef,
      {
        confirmationEmail: {
          status: "sending",
          toEmail: booking.customer?.email || "",
          sendingAt: new Date(),
        },
        updatedAt: new Date(),
      },
      { merge: true },
    );

    return true;
  });
}

export async function sendBookingConfirmationEmail(db, uid, booking) {
  const toEmail = booking.customer?.email || "";

  if (!toEmail) {
    return booking;
  }

  const shouldSend = await beginConfirmationEmailSend(db, booking);

  if (!shouldSend) {
    return booking;
  }

  try {
    const message = buildBookingConfirmationEmail(booking);
    const confirmationEmail = {
      status: "sent",
      toEmail,
      sentAt: new Date(),
    };

    await sendPlainTextEmail({
      toEmail,
      subject: message.subject,
      body: message.body,
    });
    await updateBookingConfirmationEmailState(db, uid, booking, confirmationEmail);

    return {
      ...booking,
      confirmationEmail,
    };
  } catch (error) {
    const confirmationEmail = {
      status: "failed",
      toEmail,
      error: error?.message || "Could not send booking confirmation email.",
      failedAt: new Date(),
    };

    await updateBookingConfirmationEmailState(db, uid, booking, confirmationEmail);

    return {
      ...booking,
      confirmationEmail,
    };
  }
}

export async function syncBookingCalendar(db, uid, booking) {
  if (booking.calendar?.status === "created" && booking.calendar?.eventId) {
    return booking;
  }

  try {
    const event = await createBookingCalendarEvent(booking);
    const calendar = {
      status: "created",
      eventId: event.eventId,
      htmlLink: event.htmlLink,
      syncedAt: new Date(),
    };

    await updateBookingCalendarState(db, uid, booking.id, calendar);

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

    await updateBookingCalendarState(db, uid, booking.id, calendar);

    return {
      ...booking,
      calendar,
    };
  }
}

export async function fulfillFinalizedBooking(db, uid, booking) {
  const bookingWithCalendar = await syncBookingCalendar(db, uid, booking);

  return sendBookingConfirmationEmail(db, uid, bookingWithCalendar);
}
