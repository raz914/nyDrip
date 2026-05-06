import { NextResponse } from "next/server";

import {
  errorStatus,
  getBlocksForRange,
  getBookingsForRange,
} from "@/lib/adminBookings";
import { getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";
import { listGoogleCalendarEvents } from "@/lib/googleCalendar";

export async function GET(request) {
  try {
    await requireAdminRequest(request);

    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start") || "";
    const end = searchParams.get("end") || "";
    const db = getAdminDb();
    const [bookings, blocks, googleResult] = await Promise.all([
      getBookingsForRange(db, start, end),
      getBlocksForRange(db, start, end),
      listGoogleCalendarEvents({ startDate: start, endDate: end })
        .then((events) => ({
          status: "connected",
          events,
          message: "",
        }))
        .catch((error) => ({
          status: "error",
          events: [],
          message: error.message || "Google Calendar could not be loaded.",
        })),
    ]);

    return NextResponse.json({
      ok: true,
      bookings,
      blocks,
      googleEvents: googleResult.events,
      googleStatus: {
        status: googleResult.status,
        message: googleResult.message,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Calendar could not be loaded.",
      },
      { status: errorStatus(error.message) },
    );
  }
}
