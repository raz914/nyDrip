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
    const user = await requireAuthenticatedRequest(request);
    const body = await request.json().catch(() => ({}));
    const db = getAdminDb();
    const booking = await createServerBooking(db, user, body);

    try {
      const event = await createBookingCalendarEvent(booking);
      const calendar = {
        status: "created",
        eventId: event.eventId,
        htmlLink: event.htmlLink,
        syncedAt: new Date(),
      };

      await updateBookingCalendarState(db, user.uid, booking.id, calendar);

      return NextResponse.json({
        ok: true,
        booking: {
          ...booking,
          calendar,
        },
      });
    } catch (error) {
      const calendar = {
        status: "failed",
        error: error?.message || "Could not create Google Calendar event.",
        syncedAt: new Date(),
      };

      await updateBookingCalendarState(db, user.uid, booking.id, calendar);

      return NextResponse.json({
        ok: true,
        booking: {
          ...booking,
          calendar,
        },
      });
    }
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
