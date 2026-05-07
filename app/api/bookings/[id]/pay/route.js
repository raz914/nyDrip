import { NextResponse } from "next/server";

import { getAdminDb, requireAuthenticatedRequest } from "@/lib/firebaseAdmin";
import {
  BOOKING_STATUS,
  expirePendingServerBooking,
  getServerBookingById,
} from "@/lib/serverBookings";
import { buildAppUrl, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request, { params }) {
  try {
    const user = await requireAuthenticatedRequest(request);
    const { id } = await params;
    const bookingId = String(id || "").trim();

    if (!bookingId) {
      return jsonError("Booking id is required.");
    }

    const db = getAdminDb();
    const booking = await getServerBookingById(db, user.uid, bookingId);

    if (!booking) {
      return jsonError("Booking was not found.", 404);
    }

    if (booking.status !== BOOKING_STATUS.PENDING_PAYMENT) {
      return jsonError("This booking is not pending payment.");
    }

    const checkoutSessionId = booking.payment?.checkoutSessionId || "";

    if (!checkoutSessionId) {
      return jsonError("This booking does not have a payable checkout session.");
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);

    if (session.status === "complete") {
      return NextResponse.json({
        ok: true,
        url: buildAppUrl(`/booking/success?session_id=${encodeURIComponent(session.id)}`),
      });
    }

    if (session.status !== "open" || !session.url) {
      await expirePendingServerBooking(db, user.uid, bookingId);
      return jsonError("This payment session expired. Please book again.");
    }

    return NextResponse.json({
      ok: true,
      url: session.url,
    });
  } catch (error) {
    const message = error?.message || "Could not open payment session.";
    const status = message === "Sign in is required." ? 401 : 400;

    return jsonError(message, status);
  }
}
