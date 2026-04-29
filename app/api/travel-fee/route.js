import { NextResponse } from "next/server";

import {
  getInvalidAddressTravelFeeResult,
  getTravelFeeForAddress,
} from "@/lib/travelFees";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const address = String(body.address || "").trim();

  if (!address) {
    return NextResponse.json(getInvalidAddressTravelFeeResult(), { status: 400 });
  }

  const result = await getTravelFeeForAddress(address);
  const status = result.ok ? 200 : result.source === "missing-config" ? 503 : 502;

  return NextResponse.json(result, { status });
}
