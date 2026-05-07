import { NextResponse } from "next/server";

import { calculateSubtotal } from "@/components/booking/data";
import { getAdminDb, requireAuthenticatedRequest } from "@/lib/firebaseAdmin";
import { getCouponApplication } from "@/lib/serverCoupons";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request) {
  try {
    const user = await requireAuthenticatedRequest(request);
    const body = await request.json().catch(() => ({}));
    const items = Array.isArray(body.items) ? body.items : [];
    const subtotal = Number.isFinite(Number(body.subtotal))
      ? Number(body.subtotal)
      : calculateSubtotal(items);
    const application = await getCouponApplication({
      db: getAdminDb(),
      user,
      couponCode: body.couponCode,
      items,
      locationType: body.locationType,
      travelFee: Number(body.travelFee) || 0,
      subtotal,
    });

    return NextResponse.json({
      ok: true,
      couponCode: application.code,
      couponDiscount: application.couponDiscount,
      discountBase: application.discountBase,
      message: application.message,
    });
  } catch (error) {
    const message = error?.message || "Could not validate coupon.";
    const status = message === "Sign in is required." ? 401 : 400;

    return jsonError(message, status);
  }
}
