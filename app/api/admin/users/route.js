import { NextResponse } from "next/server";

import { getAdminAuth, getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";

function errorStatus(message) {
  if (message === "Sign in is required.") {
    return 401;
  }
  if (message === "Admin access is required.") {
    return 403;
  }
  return 503;
}

export async function GET(request) {
  try {
    await requireAdminRequest(request);

    const { searchParams } = new URL(request.url);
    const pageToken = searchParams.get("pageToken") || undefined;
    const maxResultsRaw = Number(searchParams.get("maxResults")) || 50;
    const maxResults = Math.min(Math.max(maxResultsRaw, 1), 100);

    const listResult = await getAdminAuth().listUsers(maxResults, pageToken);

    const db = getAdminDb();
    const refs = listResult.users.map((u) => db.collection("users").doc(u.uid));
    const profileSnaps = refs.length ? await db.getAll(...refs) : [];

    const profileByUid = new Map(
      profileSnaps.filter((s) => s.exists).map((s) => [s.id, s.data()]),
    );

    const users = listResult.users.map((record) => {
      const profile = profileByUid.get(record.uid) || {};

      return {
        uid: record.uid,
        email: record.email ?? "",
        displayName: record.displayName ?? profile.displayName ?? "",
        disabled: record.disabled,
        creationTime: record.metadata.creationTime,
        lastSignInTime: record.metadata.lastSignInTime,
        phone: profile.phone ?? "",
        membershipTier: profile.membership?.tier ?? profile.membership?.currentTier ?? null,
      };
    });

    return NextResponse.json({
      ok: true,
      users,
      nextPageToken: listResult.pageToken ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error.message || "Could not list users." },
      { status: errorStatus(error.message) },
    );
  }
}
