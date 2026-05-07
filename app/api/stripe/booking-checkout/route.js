import { NextResponse } from "next/server";

import { createBookingCalendarEvent } from "@/lib/googleCalendar";
import { getAdminDb, requireAuthenticatedRequest } from "@/lib/firebaseAdmin";
import {
  createPendingServerBooking,
  expirePendingServerBooking,
  finalizePendingServerBooking,
  updateBookingCalendarState,
  updatePendingBookingPayment,
} from "@/lib/serverBookings";
import { buildAppUrl, getStripe, toStripeAmount } from "@/lib/stripe";

export const runtime = "nodejs";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function getBookingSessionName(booking) {
  const firstItem = booking.items?.[0];
  const extraCount = Math.max((booking.items?.length ?? 0) - 1, 0);
  const serviceName = firstItem?.displayName || firstItem?.name || "Appointment";

  return extraCount ? `${serviceName} + ${extraCount} more` : serviceName;
}

async function syncBookingCalendar(db, uid, booking) {
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

export async function POST(request) {
  let pendingBooking = null;

  try {
    const user = await requireAuthenticatedRequest(request);
    const body = await request.json().catch(() => ({}));
    const db = getAdminDb();

    pendingBooking = await createPendingServerBooking(db, user, body);

    if ((pendingBooking.totalPaid ?? 0) <= 0) {
      const booking = await finalizePendingServerBooking(db, user.uid, pendingBooking.id, {
        payment: {
          provider: "internal",
          status: "no_payment_required",
          checkoutStatus: "not_required",
          amountPaid: 0,
          amountPaidCents: 0,
          currency: "usd",
          paidAt: new Date(),
        },
      });
      const syncedBooking = await syncBookingCalendar(db, user.uid, booking);

      return NextResponse.json({
        ok: true,
        mode: "confirmed",
        booking: syncedBooking,
      });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: buildAppUrl("/booking/success?session_id={CHECKOUT_SESSION_ID}"),
      cancel_url: buildAppUrl("/booking?checkout=cancelled"),
      client_reference_id: pendingBooking.id,
      customer_email: user.email ?? pendingBooking.customer?.email ?? undefined,
      metadata: {
        kind: "booking",
        uid: user.uid,
        bookingId: pendingBooking.id,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: toStripeAmount(pendingBooking.totalPaid),
            product_data: {
              name: `NY Drip Lounge - ${getBookingSessionName(pendingBooking)}`,
              description: `${pendingBooking.appointmentDate} at ${pendingBooking.appointmentTime}`,
            },
          },
        },
      ],
    });

    await updatePendingBookingPayment(db, user.uid, pendingBooking.id, {
      provider: "stripe",
      status: "pending",
      checkoutStatus: session.status ?? "open",
      checkoutSessionId: session.id,
      customerId:
        typeof session.customer === "string" ? session.customer : session.customer?.id || "",
      amountPaid: 0,
      amountPaidCents: 0,
      currency: session.currency || "usd",
      expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : null,
    });

    return NextResponse.json({
      ok: true,
      mode: "checkout",
      url: session.url,
      sessionId: session.id,
      bookingId: pendingBooking.id,
    });
  } catch (error) {
    if (pendingBooking?.id && pendingBooking?.uid) {
      await expirePendingServerBooking(getAdminDb(), pendingBooking.uid, pendingBooking.id, {
        status: BOOKING_STATUS.CANCELLED,
        paymentStatus: "failed",
      }).catch(() => {});
    }

    const message = error?.message || "Could not start checkout.";
    const status = message === "Sign in is required." ? 401 : 400;
    return jsonError(message, status);
  }
}
