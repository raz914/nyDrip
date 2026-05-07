import { NextResponse } from "next/server";

import { errorStatus, mapBookingDoc } from "@/lib/adminBookings";
import { getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";

export async function GET(request, { params }) {
  try {
    await requireAdminRequest(request);

    const { uid } = await params;
    const normalizedUid = String(uid || "").trim();

    if (!normalizedUid) {
      throw new Error("Choose a user.");
    }

    const snapshot = await getAdminDb()
      .collection("users")
      .doc(normalizedUid)
      .collection("bookings")
      .orderBy("createdAt", "desc")
      .get();

    return NextResponse.json({
      ok: true,
      bookings: snapshot.docs.map(mapBookingDoc),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error.message || "Could not load user bookings." },
      { status: errorStatus(error.message) },
    );
  }
}
