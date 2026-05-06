import { NextResponse } from "next/server";

import { getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";

function errorStatus(message) {
  if (message === "Sign in is required.") {
    return 401;
  }
  if (message === "Admin access is required.") {
    return 403;
  }
  return 503;
}

function serializeDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return null;
}

export async function GET(request) {
  try {
    await requireAdminRequest(request);

    const { searchParams } = new URL(request.url);
    const limitRaw = Number(searchParams.get("limit")) || 50;
    const limit = Math.min(Math.max(limitRaw, 1), 100);
    const db = getAdminDb();
    const snapshot = await db
      .collection("contactSubmissions")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const submissions = snapshot.docs.map((doc) => {
      const data = doc.data() || {};

      return {
        id: doc.id,
        name: data.name ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        questions: data.questions ?? "",
        source: data.source ?? "",
        consent: Boolean(data.consent),
        createdAt: serializeDate(data.createdAt),
      };
    });

    return NextResponse.json({
      ok: true,
      submissions,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error.message || "Could not load contact submissions." },
      { status: errorStatus(error.message) },
    );
  }
}
