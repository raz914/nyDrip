import { NextResponse } from "next/server";

import { getAdminDb, requireAuthenticatedRequest } from "@/lib/firebaseAdmin";
import {
  DEFAULT_MEMBERSHIP_TIER,
  EMPTY_MEMBERSHIP,
  MEMBERSHIP_STATUS,
  getMembershipPlan,
  getMembershipSummary,
  getRenewalEligibilityDate,
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

export async function POST(request) {
  try {
    const decoded = await requireAuthenticatedRequest(request);
    const body = await request.json();
    const action = String(body?.action ?? "");
    const tierId = String(body?.tierId ?? "");
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

      if (!currentSummary.isActiveMember) {
        throw new Error("You do not have an active membership to manage.");
      }

      const nextMembership = {
        ...synced.membership,
      };
      let ledgerType = action;
      let ledgerPayload = {};

      if (action === "cancel_at_period_end") {
        if (!currentSummary.canCancelAtPeriodEnd) {
          throw new Error("Cancellation is available after the 3-month minimum term.");
        }

        nextMembership.status = MEMBERSHIP_STATUS.CANCEL_AT_PERIOD_END;
        nextMembership.autoRenew = false;
        nextMembership.cancelScheduledAt = now;
        ledgerPayload = {
          effectiveAt: currentSummary.currentPeriodEndsAt ?? null,
        };
      } else if (action === "resume_auto_renew") {
        nextMembership.status = MEMBERSHIP_STATUS.ACTIVE;
        nextMembership.autoRenew = true;
        nextMembership.cancelScheduledAt = null;
        ledgerPayload = {
          effectiveAt: currentSummary.nextRenewalAt ?? null,
        };
      } else if (action === "schedule_tier_change") {
        const nextPlan = getMembershipPlan(tierId);

        if (!tierId || nextPlan.id === DEFAULT_MEMBERSHIP_TIER) {
          throw new Error("Choose a valid future tier.");
        }

        if (nextPlan.id === currentSummary.tier) {
          throw new Error("You are already on that membership tier.");
        }

        const effectiveAt = getRenewalEligibilityDate(currentSummary);
        nextMembership.pendingTier = nextPlan.id;
        nextMembership.pendingTierEffectiveAt = effectiveAt;
        nextMembership.status = MEMBERSHIP_STATUS.ACTIVE;
        nextMembership.autoRenew = true;
        nextMembership.cancelScheduledAt = null;
        ledgerType = "tier_change";
        ledgerPayload = {
          fromTier: currentSummary.tier,
          toTier: nextPlan.id,
          effectiveAt,
        };
      } else {
        throw new Error("Unsupported membership action.");
      }

      nextMembership.updatedAt = now;
      const nextSummary = getMembershipSummary(nextMembership, synced.membershipBenefits);
      const ledgerRef = userRef.collection("membershipLedger").doc();

      transaction.set(
        userRef,
        {
          membership: nextMembership,
          membershipBenefits: synced.membershipBenefits,
          updatedAt: now,
        },
        { merge: true },
      );
      transaction.set(ledgerRef, {
        type: ledgerType,
        tier: nextSummary.tier,
        createdAt: now,
        ...ledgerPayload,
      });

      return nextSummary;
    });

    return NextResponse.json({
      ok: true,
      membership: serializeMembership(result),
    });
  } catch (error) {
    const message = error?.message || "Could not update membership.";
    const status = message === "Sign in is required." ? 401 : 400;
    return jsonError(message, status);
  }
}
