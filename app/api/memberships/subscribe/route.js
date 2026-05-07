import { NextResponse } from "next/server";

import { getAdminDb, requireAuthenticatedRequest } from "@/lib/firebaseAdmin";
import {
  DEFAULT_MEMBERSHIP_TIER,
  EMPTY_MEMBERSHIP,
  formatMembershipPrice,
  getMembershipPlan,
  syncMembershipState,
} from "@/lib/memberships";
import { buildAppUrl, getStripe, toStripeAmount } from "@/lib/stripe";

export const runtime = "nodejs";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request) {
  try {
    const decoded = await requireAuthenticatedRequest(request);
    const body = await request.json();
    const tierId = String(body?.tierId ?? "");
    const plan = getMembershipPlan(tierId);

    if (!tierId || plan.id === DEFAULT_MEMBERSHIP_TIER) {
      return jsonError("Choose a valid membership tier.");
    }

    const db = getAdminDb();
    const userRef = db.collection("users").doc(decoded.uid);
    await db.runTransaction(async (transaction) => {
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
    });
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: buildAppUrl("/memberships/success?session_id={CHECKOUT_SESSION_ID}"),
      cancel_url: buildAppUrl("/memberships?checkout=cancelled#checkout"),
      client_reference_id: decoded.uid,
      customer_email: decoded.email ?? undefined,
      metadata: {
        kind: "membership_signup",
        uid: decoded.uid,
        tierId: plan.id,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: toStripeAmount(plan.price),
            recurring: {
              interval: "month",
            },
            product_data: {
              name: `${plan.name} Membership`,
              description: `${formatMembershipPrice(plan.price)} / month with a ${plan.minimumTermMonths}-month minimum term.`,
            },
          },
        },
      ],
      subscription_data: {
        metadata: {
          kind: "membership_signup",
          uid: decoded.uid,
          tierId: plan.id,
        },
      },
    });

    return NextResponse.json({
      ok: true,
      url: session.url,
      sessionId: session.id,
      tierId: plan.id,
    });
  } catch (error) {
    const message = error?.message || "Could not start membership.";
    const status = message === "Sign in is required." ? 401 : 400;
    return jsonError(message, status);
  }
}
