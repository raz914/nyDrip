import { NextResponse } from "next/server";

import { getAdminDb, requireAdminRequest } from "@/lib/firebaseAdmin";
import {
  DEFAULT_MEMBERSHIP_TIER,
  EMPTY_MEMBERSHIP,
  MEMBERSHIP_STATUS,
  getMembershipPlan,
  syncMembershipState,
} from "@/lib/memberships";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request) {
  try {
    await requireAdminRequest(request);
    const body = await request.json();
    const action = String(body?.action ?? "");
    const uid = String(body?.uid ?? "");

    if (!uid) {
      return jsonError("User id is required.");
    }

    const db = getAdminDb();
    const userRef = db.collection("users").doc(uid);
    const now = new Date();

    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(userRef);
      const data = snapshot.exists ? snapshot.data() || {} : {};
      const synced = syncMembershipState(
        data.membership ?? EMPTY_MEMBERSHIP,
        data.membershipBenefits ?? [],
        now,
      );

      if (action === "grant_bonus_drips") {
        const drips = Math.max(Number(body?.drips) || 0, 0);
        const note = String(body?.note ?? "Manual membership bonus");
        const rewardLedgerRef = userRef.collection("rewardLedger").doc();
        const rewards = data.rewards ?? {};

        if (!drips) {
          throw new Error("Bonus Drips must be greater than zero.");
        }

        transaction.set(
          userRef,
          {
            rewards: {
              ...rewards,
              tier: synced.membership?.tier ?? DEFAULT_MEMBERSHIP_TIER,
              availableDrips: Math.max(Number(rewards.availableDrips) || 0, 0) + drips,
              lifetimeDrips: Math.max(Number(rewards.lifetimeDrips) || 0, 0) + drips,
              updatedAt: now,
            },
          },
          { merge: true },
        );
        transaction.set(rewardLedgerRef, {
          type: "bonus",
          drips,
          note,
          createdAt: now,
        });

        return { action, uid, drips };
      }

      if (action === "adjust_benefit") {
        const benefitCode = String(body?.benefitCode ?? "");
        const deltaRemaining = Number(body?.deltaRemaining);
        const nextBenefits = (synced.membershipBenefits ?? []).map((benefit) =>
          benefit.code === benefitCode
            ? {
                ...benefit,
                remaining: Math.max((Number(benefit.remaining) || 0) + deltaRemaining, 0),
              }
            : benefit,
        );

        transaction.set(
          userRef,
          {
            membershipBenefits: nextBenefits,
            updatedAt: now,
          },
          { merge: true },
        );
        transaction.set(userRef.collection("membershipLedger").doc(), {
          type: "manual_adjustment",
          benefitCode,
          deltaRemaining,
          createdAt: now,
        });

        return { action, uid, benefitCode, deltaRemaining };
      }

      if (action === "set_membership_status") {
        const status = String(body?.status ?? "");
        const tierId = String(body?.tierId ?? synced.membership?.tier ?? "");
        const plan = getMembershipPlan(tierId);

        if (!Object.values(MEMBERSHIP_STATUS).includes(status)) {
          throw new Error("Invalid membership status.");
        }

        if (!tierId || plan.id === DEFAULT_MEMBERSHIP_TIER) {
          throw new Error("Choose a valid member tier for manual status changes.");
        }

        transaction.set(
          userRef,
          {
            membership: {
              ...synced.membership,
              tier: plan.id,
              status,
              updatedAt: now,
            },
            updatedAt: now,
          },
          { merge: true },
        );
        transaction.set(userRef.collection("membershipLedger").doc(), {
          type: "manual_adjustment",
          tier: plan.id,
          status,
          createdAt: now,
        });

        return { action, uid, status, tier: plan.id };
      }

      throw new Error("Unsupported admin membership action.");
    });

    return NextResponse.json({
      ok: true,
      result,
    });
  } catch (error) {
    return jsonError(error?.message || "Could not update membership admin state.");
  }
}
