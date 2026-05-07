import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  DEFAULT_MEMBERSHIP_TIER,
  EMPTY_MEMBERSHIP,
  MEMBERSHIP_STATUS,
  activateMembership,
  formatMembershipPrice,
  getMembershipPlan,
  syncMembershipState,
} from "@/lib/memberships";
import {
  finalizePendingServerBooking,
  expirePendingServerBooking,
  finalizeGuestPendingServerBooking,
  expireGuestPendingServerBooking,
  GUEST_PENDING_BOOKINGS_COLLECTION,
} from "@/lib/serverBookings";
import { fulfillFinalizedBooking } from "@/lib/serverBookingFulfillment";
import { ensureGuestBookingUserAndPasswordEmail } from "@/lib/serverGuestUsers";
import { constructStripeEvent, fromStripeAmount, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function getStripeId(value) {
  return typeof value === "string" ? value : value?.id || "";
}

function fromStripeUnix(value) {
  return Number.isFinite(value) ? new Date(value * 1000) : null;
}

function getMembershipStatusFromSubscription(subscription) {
  if (subscription.cancel_at_period_end) {
    return MEMBERSHIP_STATUS.CANCEL_AT_PERIOD_END;
  }

  if (["active", "trialing", "past_due"].includes(subscription.status)) {
    return MEMBERSHIP_STATUS.ACTIVE;
  }

  return MEMBERSHIP_STATUS.EXPIRED;
}

function buildMembershipStripeFields(subscription, session = null) {
  const subscriptionId = getStripeId(subscription);
  const customerId = getStripeId(subscription?.customer || session?.customer);
  const checkoutSessionId = getStripeId(session);
  const item = subscription?.items?.data?.[0];

  return {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    stripeCheckoutSessionId: checkoutSessionId,
    stripePriceId: item?.price?.id || "",
    stripeSubscriptionStatus: subscription?.status || "",
  };
}

function getInvoiceAmount(invoice, status) {
  if (status === "paid") {
    return {
      amount: fromStripeAmount(invoice.amount_paid ?? invoice.amount_due ?? 0),
      amountCents: invoice.amount_paid ?? invoice.amount_due ?? 0,
    };
  }

  return {
    amount: fromStripeAmount(invoice.amount_due ?? invoice.amount_remaining ?? 0),
    amountCents: invoice.amount_due ?? invoice.amount_remaining ?? 0,
  };
}

async function beginStripeEventProcessing(db, event) {
  const eventRef = db.collection("stripeWebhookEvents").doc(event.id);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(eventRef);
    const data = snapshot.exists ? snapshot.data() || {} : {};

    if (data.status === "processed") {
      return false;
    }

    transaction.set(
      eventRef,
      {
        id: event.id,
        type: event.type,
        status: "processing",
        attempts: FieldValue.increment(1),
        receivedAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true },
    );

    return true;
  });
}

async function finishStripeEventProcessing(db, event, status, error = "") {
  await db.collection("stripeWebhookEvents").doc(event.id).set(
    {
      status,
      error,
      processedAt: new Date(),
      updatedAt: new Date(),
    },
    { merge: true },
  );
}

async function activateMembershipFromCheckout(db, session) {
  const uid = session.metadata?.uid || "";
  const tierId = session.metadata?.tierId || DEFAULT_MEMBERSHIP_TIER;
  const subscriptionId = getStripeId(session.subscription);

  if (!uid || !subscriptionId || tierId === DEFAULT_MEMBERSHIP_TIER) {
    return;
  }

  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userRef = db.collection("users").doc(uid);
  const now = new Date();

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);
    const data = snapshot.exists ? snapshot.data() || {} : {};
    const synced = syncMembershipState(
      data.membership ?? EMPTY_MEMBERSHIP,
      Array.isArray(data.membershipBenefits) ? data.membershipBenefits : [],
      now,
    );
    const existingSubscriptionId = synced.membership?.stripeSubscriptionId || "";

    if (existingSubscriptionId && existingSubscriptionId === subscription.id) {
      return;
    }

    if (synced.membership?.status === MEMBERSHIP_STATUS.ACTIVE && existingSubscriptionId) {
      return;
    }

    const plan = getMembershipPlan(tierId);
    const activation = activateMembership({
      tierId: plan.id,
      now: fromStripeUnix(subscription.current_period_start) ?? now,
      mockPaymentMethod: synced.membership?.mockPaymentMethod ?? null,
    });
    const membership = {
      ...activation.membership,
      ...buildMembershipStripeFields(subscription, session),
      status: getMembershipStatusFromSubscription(subscription),
      autoRenew: !subscription.cancel_at_period_end,
      currentPeriodStartedAt:
        fromStripeUnix(subscription.current_period_start) ??
        activation.membership.currentPeriodStartedAt,
      currentPeriodEndsAt:
        fromStripeUnix(subscription.current_period_end) ??
        activation.membership.currentPeriodEndsAt,
      nextRenewalAt:
        fromStripeUnix(subscription.current_period_end) ??
        activation.membership.nextRenewalAt,
      updatedAt: now,
    };
    const ledgerRef = userRef.collection("membershipLedger").doc();
    const existingRewards = data.rewards ?? {};

    transaction.set(
      userRef,
      {
        uid,
        email: data.email ?? session.customer_details?.email ?? "",
        displayName: data.displayName ?? "",
        membership,
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
      stripeCustomerId: membership.stripeCustomerId,
      stripeSubscriptionId: membership.stripeSubscriptionId,
      stripeCheckoutSessionId: membership.stripeCheckoutSessionId,
      createdAt: now,
    });
  });

  await syncMembershipFromSubscription(db, subscription, { session });
}

async function syncMembershipFromSubscription(db, subscription, { session = null } = {}) {
  const uid = subscription.metadata?.uid || session?.metadata?.uid || "";
  const tierId = subscription.metadata?.tierId || session?.metadata?.tierId || "";

  if (!uid) {
    return;
  }

  const userRef = db.collection("users").doc(uid);
  const now = new Date();

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);
    const data = snapshot.exists ? snapshot.data() || {} : {};
    const synced = syncMembershipState(
      data.membership ?? EMPTY_MEMBERSHIP,
      Array.isArray(data.membershipBenefits) ? data.membershipBenefits : [],
      now,
    );
    const shouldActivate =
      !synced.membership?.tier || synced.membership?.tier === DEFAULT_MEMBERSHIP_TIER;
    const activation =
      shouldActivate && tierId && tierId !== DEFAULT_MEMBERSHIP_TIER
        ? activateMembership({
            tierId,
            now: fromStripeUnix(subscription.current_period_start) ?? now,
            mockPaymentMethod: synced.membership?.mockPaymentMethod ?? null,
          })
        : null;
    const baseMembership = activation?.membership ?? synced.membership;
    const nextBenefits = activation?.membershipBenefits ?? synced.membershipBenefits;
    const membership = {
      ...baseMembership,
      ...buildMembershipStripeFields(subscription, session),
      tier: tierId || baseMembership.tier || DEFAULT_MEMBERSHIP_TIER,
      status: getMembershipStatusFromSubscription(subscription),
      autoRenew: !subscription.cancel_at_period_end,
      currentPeriodStartedAt:
        fromStripeUnix(subscription.current_period_start) ??
        baseMembership.currentPeriodStartedAt,
      currentPeriodEndsAt:
        fromStripeUnix(subscription.current_period_end) ??
        baseMembership.currentPeriodEndsAt,
      nextRenewalAt:
        fromStripeUnix(subscription.current_period_end) ?? baseMembership.nextRenewalAt,
      updatedAt: now,
    };

    transaction.set(
      userRef,
      {
        membership,
        membershipBenefits: nextBenefits,
        updatedAt: now,
      },
      { merge: true },
    );
  });
}

async function recordMembershipInvoicePayment(db, subscription, invoice, status) {
  const uid = subscription.metadata?.uid || "";

  if (!uid || !invoice?.id || invoice.billing_reason === "subscription_create") {
    return;
  }

  const userRef = db.collection("users").doc(uid);
  const { amount, amountCents } = getInvoiceAmount(invoice, status);

  await userRef.collection("membershipLedger").doc(`invoice_${invoice.id}`).set(
    {
      type: status === "paid" ? "invoice_paid" : "invoice_payment_failed",
      tier: subscription.metadata?.tierId || "",
      amountPaid: status === "paid" ? amount : 0,
      amountPaidCents: status === "paid" ? amountCents : 0,
      amountDue: amount,
      amountDueCents: amountCents,
      currency: invoice.currency || "usd",
      status,
      paymentProvider: "stripe",
      stripeInvoiceId: invoice.id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: getStripeId(invoice.customer || subscription.customer),
      stripeHostedInvoiceUrl: invoice.hosted_invoice_url || "",
      stripeInvoicePdf: invoice.invoice_pdf || "",
      createdAt: fromStripeUnix(invoice.created) ?? new Date(),
      updatedAt: new Date(),
    },
    { merge: true },
  );
}

async function handleBookingCheckoutCompleted(db, session) {
  const uid = session.metadata?.uid || "";
  const bookingId = session.metadata?.bookingId || session.client_reference_id || "";

  if (!uid || !bookingId) {
    return;
  }

  const booking = await finalizePendingServerBooking(db, uid, bookingId, {
    payment: {
      provider: "stripe",
      status: "paid",
      checkoutStatus: session.status ?? "complete",
      checkoutSessionId: session.id,
      paymentIntentId: getStripeId(session.payment_intent),
      customerId: getStripeId(session.customer),
      amountPaid: fromStripeAmount(session.amount_total),
      amountPaidCents: session.amount_total ?? 0,
      currency: session.currency || "usd",
      paidAt: new Date(),
    },
  });

  await fulfillFinalizedBooking(db, uid, booking);
}

async function handleGuestBookingCheckoutCompleted(db, session) {
  const guestBookingId =
    session.metadata?.guestBookingId || session.metadata?.bookingId || session.client_reference_id || "";

  if (!guestBookingId) {
    return;
  }

  const guestBookingSnapshot = await db
    .collection(GUEST_PENDING_BOOKINGS_COLLECTION)
    .doc(guestBookingId)
    .get();

  if (!guestBookingSnapshot.exists) {
    return;
  }

  const guestBooking = {
    id: guestBookingSnapshot.id,
    ...guestBookingSnapshot.data(),
  };
  const account = await ensureGuestBookingUserAndPasswordEmail(db, guestBooking);
  const booking = await finalizeGuestPendingServerBooking(db, account.uid, guestBookingId, {
    payment: {
      provider: "stripe",
      status: "paid",
      checkoutStatus: session.status ?? "complete",
      checkoutSessionId: session.id,
      paymentIntentId: getStripeId(session.payment_intent),
      customerId: getStripeId(session.customer),
      amountPaid: fromStripeAmount(session.amount_total),
      amountPaidCents: session.amount_total ?? 0,
      currency: session.currency || "usd",
      paidAt: new Date(),
    },
  });

  await fulfillFinalizedBooking(db, account.uid, booking);
}

async function handleBookingCheckoutExpired(db, session) {
  const uid = session.metadata?.uid || "";
  const bookingId = session.metadata?.bookingId || session.client_reference_id || "";

  if (!uid || !bookingId) {
    return;
  }

  await expirePendingServerBooking(db, uid, bookingId);
}

async function handleGuestBookingCheckoutExpired(db, session) {
  const guestBookingId =
    session.metadata?.guestBookingId || session.metadata?.bookingId || session.client_reference_id || "";

  if (!guestBookingId) {
    return;
  }

  await expireGuestPendingServerBooking(db, guestBookingId);
}

export async function POST(request) {
  const db = getAdminDb();

  try {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ ok: false, message: "Missing stripe signature." }, { status: 400 });
    }

    const payload = await request.text();
    const event = constructStripeEvent(payload, signature);
    const shouldProcess = await beginStripeEventProcessing(db, event);

    if (!shouldProcess) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;

          if (session.metadata?.kind === "booking") {
            await handleBookingCheckoutCompleted(db, session);
          } else if (session.metadata?.kind === "guest_booking") {
            await handleGuestBookingCheckoutCompleted(db, session);
          } else if (session.metadata?.kind === "membership_signup") {
            await activateMembershipFromCheckout(db, session);
          }
          break;
        }

        case "checkout.session.expired": {
          const session = event.data.object;

          if (session.metadata?.kind === "booking") {
            await handleBookingCheckoutExpired(db, session);
          } else if (session.metadata?.kind === "guest_booking") {
            await handleGuestBookingCheckoutExpired(db, session);
          }
          break;
        }

        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          await syncMembershipFromSubscription(db, subscription);
          break;
        }

        case "invoice.paid":
        case "invoice.payment_failed": {
          const invoice = event.data.object;
          const subscriptionId = getStripeId(invoice.subscription);

          if (subscriptionId) {
            const stripe = getStripe();
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            await recordMembershipInvoicePayment(
              db,
              subscription,
              invoice,
              event.type === "invoice.paid" ? "paid" : "failed",
            );
            await syncMembershipFromSubscription(db, subscription);
          }
          break;
        }

        default:
          break;
      }

      await finishStripeEventProcessing(db, event, "processed");
      return NextResponse.json({ ok: true });
    } catch (error) {
      await finishStripeEventProcessing(
        db,
        event,
        "failed",
        error?.message || "Webhook processing failed.",
      );
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Webhook failed.",
      },
      { status: 400 },
    );
  }
}
