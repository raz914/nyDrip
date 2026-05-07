import { NextResponse } from "next/server";

import { getAdminPaymentHistory } from "@/lib/adminPayments";
import { errorStatus } from "@/lib/adminBookings";
import { getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";

export async function GET(request) {
  try {
    await requireAdminRequest(request);

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 100;
    const payments = await getAdminPaymentHistory(getAdminDb(), { limit });

    return NextResponse.json({ ok: true, payments });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Payment history could not be loaded.",
      },
      { status: errorStatus(error.message) },
    );
  }
}
