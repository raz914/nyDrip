import { NextResponse } from "next/server";

import {
  cancelBooking,
  errorStatus,
  updateBooking,
} from "@/lib/adminBookings";
import { getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";

export async function PATCH(request, { params }) {
  try {
    await requireAdminRequest(request);

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const booking = await updateBooking(getAdminDb(), id, body);

    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    const message = error.message || "Booking could not be updated.";

    return NextResponse.json(
      { ok: false, message },
      { status: message === "Booking not found." ? 404 : errorStatus(message) },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdminRequest(request);

    const { id } = await params;
    const booking = await cancelBooking(getAdminDb(), id);

    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    const message = error.message || "Booking could not be cancelled.";

    return NextResponse.json(
      { ok: false, message },
      { status: message === "Booking not found." ? 404 : errorStatus(message) },
    );
  }
}
