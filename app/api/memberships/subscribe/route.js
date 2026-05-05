import { NextResponse } from "next/server";

import { getAdminDb, requireAuthenticatedRequest } from "@/lib/firebaseAdmin";
import {
  DEFAULT_MEMBERSHIP_TIER,
  EMPTY_MEMBERSHIP,
  activateMembership,
  formatMembershipPrice,
  getMembershipPlan,
  getMembershipSummary,
  sanitizeMockPaymentMethod,
  syncMembershipState,
} from "@/lib/memberships";

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

function isValidMockPayment(payment = {}) {
  const digits = String(payment.cardNumber ?? "").replace(/\D/g, "");
  return (
    digits.length >= 12 &&
    String(payment.expiration ?? "").trim().length >= 4 &&
    String(payment.cvc ?? "").trim().length >= 3
  );
}

export async function POST(request) {
  try {
    const decoded = await requireAuthenticatedRequest(request);
    const body = await request.json();
    const tierId = String(body?.tierId ?? "");
    const payment = body?.payment ?? {};
    const plan = getMembershipPlan(tierId);

    if (!tierId || plan.id === DEFAULT_MEMBERSHIP_TIER) {
      return jsonError("Choose a valid membership tier.");
    }

    if (!isValidMockPayment(payment)) {
      return jsonError("Enter a valid mock card before subscribing.");
    }

    const db = getAdminDb();
    const userRef = db.collection("users").doc(decoded.uid);
    const now = new Date();
    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(userRef);
      const data = snapshot.exists ? snapshot.data() || {} : {};
      const synced = syncMembershipState(
        data.membership ?? EMPTY_MEMBERSHIP,
        data.membershipBenefits ?? [],
        now,
      );
      const currentSummary = getMembershipSummary(
        synced.membership,
        synced.membershipBenefits,
      );

      if (currentSummary.isActiveMember) {
        throw new Error("You already have an active membership. Manage it from the dashboard.");
      }

      const activation = activateMembership({
        tierId: plan.id,
        now,
        mockPaymentMethod: sanitizeMockPaymentMethod(payment),
      });
      const nextSummary = getMembershipSummary(
        activation.membership,
        activation.membershipBenefits,
      );
      const ledgerRef = userRef.collection("membershipLedger").doc();
      const existingRewards = data.rewards ?? {};

      transaction.set(
        userRef,
        {
          uid: decoded.uid,
          email: decoded.email ?? data.email ?? "",
          displayName: data.displayName ?? "",
          membership: activation.membership,
          membershipBenefits: activation.membershipBenefits,
          rewards: {
            ...existingRewards,
            tier: plan.id,
            updatedAt: now,
          },
          updatedAt: now,
        },
        { merge: true },
      );
      transaction.set(ledgerRef, {
        type: "signup",
        tier: plan.id,
        price: plan.price,
        priceLabel: formatMembershipPrice(plan.price),
        mockPaymentMethod: sanitizeMockPaymentMethod(payment),
        createdAt: now,
      });

      return nextSummary;
    });

    return NextResponse.json({
      ok: true,
      membership: serializeMembership(result),
    });
  } catch (error) {
    const message = error?.message || "Could not start membership.";
    const status = message === "Sign in is required." ? 401 : 400;
    return jsonError(message, status);
  }
}
