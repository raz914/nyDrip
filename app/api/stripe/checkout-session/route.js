import { NextResponse } from "next/server";

import { getAdminDb, requireAuthenticatedRequest } from "@/lib/firebaseAdmin";
import { getMembershipSummary, syncMembershipState } from "@/lib/memberships";
import { getServerBookingById } from "@/lib/serverBookings";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function serializeMembership(summary) {
  return {
    ...summary,
    currentPeriodEndsAt: summary.currentPeriodEndsAt?.toISOString?.() ?? null,
    nextRenewalAt: summary.nextRenewalAt?.toISOString?.() ?? null,
    minimumTermEndsAt: summary.minimumTermEndsAt?.toISOString?.() ?? null,
    startedAt: summary.startedAt?.toISOString?.() ?? null,
    currentPeriodStartedAt: summary.currentPeriodStartedAt?.toISOString?.() ?? null,
    benefits: summary.displayBenefits?.map((benefit) => ({
      code: benefit.code,
      label: benefit.label,
      summary: benefit.summary,
      remaining: benefit.remaining,
      expiresAt: benefit.expiresAt?.toISOString?.() ?? null,
      expiresAtLabel: benefit.expiresAtLabel ?? null,
      period: benefit.period,
    })),
  };
}

export async function GET(request) {
  try {
    const user = await requireAuthenticatedRequest(request);
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
      return jsonError("Checkout session is required.");
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadataUid = session.metadata?.uid || "";

    if (metadataUid && metadataUid !== user.uid) {
      return jsonError("This checkout session does not belong to you.", 403);
    }

    const kind = session.metadata?.kind || "";
    const db = getAdminDb();

    if (kind === "booking") {
      const bookingId = session.metadata?.bookingId || session.client_reference_id || "";
      const booking = bookingId ? await getServerBookingById(db, user.uid, bookingId) : null;

      return NextResponse.json({
        ok: true,
        kind,
        session: {
          id: session.id,
          status: session.status,
          paymentStatus: session.payment_status,
          amountTotal: session.amount_total,
          customerId:
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id || "",
        },
        booking,
      });
    }

    if (kind === "membership_signup") {
      const userSnapshot = await db.collection("users").doc(user.uid).get();
      const userData = userSnapshot.exists ? userSnapshot.data() || {} : {};
      const syncedMembershipState = syncMembershipState(
        userData.membership,
        Array.isArray(userData.membershipBenefits) ? userData.membershipBenefits : [],
        new Date(),
      );
      const membership = getMembershipSummary(
        syncedMembershipState.membership,
        syncedMembershipState.membershipBenefits,
      );

      return NextResponse.json({
        ok: true,
        kind,
        session: {
          id: session.id,
          status: session.status,
          paymentStatus: session.payment_status,
          subscriptionId:
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription?.id || "",
          customerId:
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id || "",
        },
        membership: serializeMembership(membership),
      });
    }

    return NextResponse.json({
      ok: true,
      kind,
      session: {
        id: session.id,
        status: session.status,
        paymentStatus: session.payment_status,
      },
    });
  } catch (error) {
    const message = error?.message || "Could not load checkout session.";
    const status = message === "Sign in is required." ? 401 : 400;
    return jsonError(message, status);
  }
}
