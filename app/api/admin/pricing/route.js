import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { treatmentCatalog } from "@/components/pricing/catalog";
import { buildBookableServices } from "@/lib/bookingCatalog";
import { getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";
import { PRICING_DOC_PATH, getPricingDocumentData } from "@/lib/serverPricing";

function errorStatus(message) {
  if (message === "Sign in is required.") {
    return 401;
  }
  if (message === "Admin access is required.") {
    return 403;
  }
  return 503;
}

function sanitizeCatalogOverrides(input) {
  if (!input || typeof input !== "object") {
    return {};
  }

  const out = {};

  for (const [key, val] of Object.entries(input)) {
    if (typeof key !== "string" || !key.trim()) {
      continue;
    }

    let num = null;

    if (typeof val === "number" && Number.isFinite(val)) {
      num = val;
    } else if (val && typeof val === "object" && val.amount !== undefined) {
      num = Number(val.amount);
    } else if (val !== undefined && val !== null) {
      num = Number(val);
    }

    if (!Number.isFinite(num) || num < 0 || num > 1_000_000) {
      continue;
    }

    out[key.trim()] = Math.round(num * 100) / 100;
  }

  return out;
}

export async function GET(request) {
  try {
    await requireAdminRequest(request);

    const stored = await getPricingDocumentData();
    const baseRows = buildBookableServices(treatmentCatalog, {});
    const baseById = Object.fromEntries(baseRows.map((s) => [s.id, s.price]));

    const services = buildBookableServices(treatmentCatalog, stored.catalogOverrides).map(
      (s) => ({
        ...s,
        catalogBasePrice: baseById[s.id],
      }),
    );

    return NextResponse.json({
      ok: true,
      catalogOverrides: stored.catalogOverrides,
      services,
      updatedAt: stored.updatedAt,
      updatedBy: stored.updatedBy,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error.message || "Could not load pricing." },
      { status: errorStatus(error.message) },
    );
  }
}

export async function PATCH(request) {
  try {
    const adminUser = await requireAdminRequest(request);
    const body = await request.json().catch(() => ({}));

    const catalogOverrides =
      body.catalogOverrides !== undefined
        ? sanitizeCatalogOverrides(body.catalogOverrides)
        : null;

    if (catalogOverrides === null) {
      return NextResponse.json(
        { ok: false, message: "Provide catalogOverrides." },
        { status: 400 },
      );
    }

    const nextCatalog = catalogOverrides;

    await getAdminDb()
      .doc(PRICING_DOC_PATH)
      .set(
        {
          catalogOverrides: nextCatalog,
          updatedAt: FieldValue.serverTimestamp(),
          updatedBy: adminUser.uid,
        },
        { merge: true },
      );

    const baseRows = buildBookableServices(treatmentCatalog, {});
    const baseById = Object.fromEntries(baseRows.map((s) => [s.id, s.price]));
    const services = buildBookableServices(treatmentCatalog, nextCatalog).map((s) => ({
      ...s,
      catalogBasePrice: baseById[s.id],
    }));

    return NextResponse.json({
      ok: true,
      catalogOverrides: nextCatalog,
      services,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error.message || "Could not save pricing." },
      { status: errorStatus(error.message) },
    );
  }
}
