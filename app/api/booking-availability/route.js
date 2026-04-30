import { NextResponse } from "next/server";

import { getServiceById } from "@/components/booking/data";
import {
  BOOKING_LIMITS,
  getAvailabilityByTime,
  getBookableTimeSlots,
  parseDurationToMinutes,
} from "@/lib/bookingRules";
import { getAdminDb, requireAuthenticatedRequest } from "@/lib/firebaseAdmin";

function getDurationMinutes(searchParams) {
  const service = getServiceById(searchParams.get("serviceId"));
  const durationParam = Number(searchParams.get("durationMinutes"));

  if (Number.isFinite(durationParam) && durationParam > 0) {
    return durationParam;
  }

  return parseDurationToMinutes(service?.duration);
}

function toJsonDoc(doc) {
  return {
    id: doc.id,
    ...doc.data(),
  };
}

async function getAvailabilityPayload(searchParams) {
  const date = searchParams.get("date");
  const locationType = searchParams.get("locationType") || "clinic";
  const durationMinutes = getDurationMinutes(searchParams);

  if (!date) {
    return {
      ok: false,
      status: 400,
      message: "Choose a booking date.",
    };
  }

  const db = getAdminDb();
  const [bookingsSnapshot, blocksSnapshot] = await Promise.all([
    db.collection("bookings").where("appointmentDate", "==", date).get(),
    db.collection("availabilityBlocks").where("date", "==", date).get(),
  ]);
  const bookings = bookingsSnapshot.docs.map(toJsonDoc);
  const blocks = blocksSnapshot.docs.map(toJsonDoc);
  const timeSlots = getBookableTimeSlots(durationMinutes);
  const availabilityByTime = getAvailabilityByTime({
    bookings,
    blocks,
    date,
    timeSlots,
    durationMinutes,
    locationType,
  });

  return {
    ok: true,
    status: 200,
    date,
    durationMinutes,
    timeSlots,
    availabilityByTime,
  };
}

export async function GET(request) {
  try {
    await requireAuthenticatedRequest(request);

    const { searchParams } = new URL(request.url);
    const payload = await getAvailabilityPayload(searchParams);
    const { status, ...body } = payload;

    return NextResponse.json(body, { status });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Availability is unavailable.",
      },
      { status: error.message === "Sign in is required." ? 401 : 503 },
    );
  }
}

export async function POST(request) {
  try {
    await requireAuthenticatedRequest(request);

    const body = await request.json().catch(() => ({}));
    const searchParams = new URLSearchParams({
      date: body.date || "",
      locationType: body.locationType || "clinic",
      durationMinutes: String(
        body.durationMinutes || BOOKING_LIMITS.defaultDurationMinutes,
      ),
    });
    const payload = await getAvailabilityPayload(searchParams);
    const selectedTime = body.time;
    const selectedAvailability = payload.availabilityByTime?.[selectedTime];

    if (!payload.ok) {
      const { status, ...responseBody } = payload;

      return NextResponse.json(responseBody, { status });
    }

    if (!selectedAvailability?.available) {
      return NextResponse.json(
        {
          ok: false,
          message:
            selectedAvailability?.reason ||
            "This time slot is no longer available.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Availability could not be validated.",
      },
      { status: error.message === "Sign in is required." ? 401 : 503 },
    );
  }
}
