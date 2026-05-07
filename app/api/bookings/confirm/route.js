import { NextResponse } from "next/server";

import { createBookingCalendarEvent } from "@/lib/googleCalendar";
import { getAdminDb, requireAuthenticatedRequest } from "@/lib/firebaseAdmin";
import {
  createServerBooking,
  updateBookingCalendarState,
} from "@/lib/serverBookings";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request) {
  try {
    await requireAuthenticatedRequest(request);
    return jsonError("Direct booking confirmation is no longer supported. Use Stripe checkout.");
  } catch (error) {
    const message = error?.message || "Could not confirm booking.";
    const status =
      message === "Sign in is required."
        ? 401
        : message.includes("time slot")
          ? 409
          : 400;

    return jsonError(message, status);
  }
}
