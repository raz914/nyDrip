import { NextResponse } from "next/server";

import { getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";
import {
  createAdminBooking,
  errorStatus,
  getBookingsForRange,
  syncAdminBookingCalendar,
} from "@/lib/adminBookings";

export async function GET(request) {
  try {
    await requireAdminRequest(request);

    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start") || "";
    const end = searchParams.get("end") || "";
    const bookings = await getBookingsForRange(getAdminDb(), start, end);

    return NextResponse.json({ ok: true, bookings });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Bookings could not be loaded.",
      },
      { status: errorStatus(error.message) },
    );
  }
}

export async function POST(request) {
  try {
    const adminUser = await requireAdminRequest(request);
    const body = await request.json().catch(() => ({}));
    const db = getAdminDb();
    const booking = await createAdminBooking(db, adminUser, body);
    const syncedBooking = await syncAdminBookingCalendar(db, booking);

    return NextResponse.json({ ok: true, booking: syncedBooking });
  } catch (error) {
    const message = error.message || "Booking could not be created.";
    const status = message.includes("time slot") ? 409 : errorStatus(message);

    return NextResponse.json({ ok: false, message }, { status });
  }
}
