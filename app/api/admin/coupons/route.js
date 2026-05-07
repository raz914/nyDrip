import { NextResponse } from "next/server";

import {
  COUPONS_COLLECTION,
  mapCouponDoc,
  sanitizeCouponPayload,
} from "@/lib/serverCoupons";
import { getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";

function errorStatus(message) {
  if (message === "Sign in is required.") {
    return 401;
  }
  if (message === "Admin access is required.") {
    return 403;
  }
  return 400;
}

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function GET(request) {
  try {
    await requireAdminRequest(request);
    const snapshot = await getAdminDb()
      .collection(COUPONS_COLLECTION)
      .orderBy("updatedAt", "desc")
      .limit(100)
      .get();

    return NextResponse.json({
      ok: true,
      coupons: snapshot.docs.map(mapCouponDoc),
    });
  } catch (error) {
    return jsonError(error?.message || "Could not load coupons.", errorStatus(error?.message));
  }
}

export async function POST(request) {
  try {
    const adminUser = await requireAdminRequest(request);
    const payload = sanitizeCouponPayload(await request.json().catch(() => ({})));
    const now = new Date();
    const ref = getAdminDb().collection(COUPONS_COLLECTION).doc(payload.code);
    const snapshot = await ref.get();

    if (snapshot.exists) {
      throw new Error("A coupon with this code already exists.");
    }

    await ref.set({
      ...payload,
      createdAt: now,
      createdBy: adminUser.uid,
      updatedAt: now,
      updatedBy: adminUser.uid,
    });

    return NextResponse.json({
      ok: true,
      coupon: mapCouponDoc(await ref.get()),
    });
  } catch (error) {
    return jsonError(error?.message || "Could not create coupon.", errorStatus(error?.message));
  }
}
