import { NextResponse } from "next/server";

import {
  COUPONS_COLLECTION,
  mapCouponDoc,
  sanitizeCouponPayload,
} from "@/lib/serverCoupons";
import { assertValidCouponCode } from "@/lib/coupons.mjs";
import { getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";

function errorStatus(message) {
  if (message === "Sign in is required.") {
    return 401;
  }
  if (message === "Admin access is required.") {
    return 403;
  }
  if (message === "Coupon not found.") {
    return 404;
  }
  return 400;
}

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

async function getCouponRef(params) {
  const { code } = await params;
  const normalizedCode = assertValidCouponCode(code);
  const ref = getAdminDb().collection(COUPONS_COLLECTION).doc(normalizedCode);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error("Coupon not found.");
  }

  return { ref, snapshot, code: normalizedCode };
}

export async function PATCH(request, { params }) {
  try {
    const adminUser = await requireAdminRequest(request);
    const { ref, snapshot, code } = await getCouponRef(params);
    const previous = snapshot.data() || {};
    const body = await request.json().catch(() => ({}));
    const payload = sanitizeCouponPayload(
      {
        ...body,
        code,
      },
      previous,
    );

    await ref.set(
      {
        ...payload,
        code,
        updatedAt: new Date(),
        updatedBy: adminUser.uid,
      },
      { merge: true },
    );

    return NextResponse.json({
      ok: true,
      coupon: mapCouponDoc(await ref.get()),
    });
  } catch (error) {
    return jsonError(error?.message || "Could not update coupon.", errorStatus(error?.message));
  }
}

export async function DELETE(request, { params }) {
  try {
    const adminUser = await requireAdminRequest(request);
    const { ref } = await getCouponRef(params);

    await ref.set(
      {
        active: false,
        updatedAt: new Date(),
        updatedBy: adminUser.uid,
      },
      { merge: true },
    );

    return NextResponse.json({
      ok: true,
      coupon: mapCouponDoc(await ref.get()),
    });
  } catch (error) {
    return jsonError(error?.message || "Could not deactivate coupon.", errorStatus(error?.message));
  }
}
