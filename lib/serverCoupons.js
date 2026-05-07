import {
  assertValidCouponCode,
  calculateCouponDiscount,
  getCouponDiscountBase,
  normalizeCouponRecord,
  validateCouponForUser,
} from "@/lib/coupons.mjs";
import {
  EMPTY_MEMBERSHIP,
  getMembershipPricing,
  getMembershipSummary,
  syncMembershipState,
} from "@/lib/memberships";

export const COUPONS_COLLECTION = "coupons";

function toDate(value, endOfDay = false) {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value.toDate === "function") {
    return value.toDate();
  }
  const input = String(value).trim();
  if (!input) {
    return null;
  }
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(input);
  const parsed = new Date(dateOnly ? `${input}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}` : input);

  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function toMillis(value) {
  const date = toDate(value);
  return date ? date.getTime() : null;
}

function toInputDate(value) {
  const date = toDate(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

export function mapCouponDoc(doc) {
  const data = doc.data() || {};

  return {
    code: data.code || doc.id,
    type: data.type || "fixed",
    amount: data.amount ?? 0,
    active: data.active !== false,
    startsAt: toMillis(data.startsAt),
    endsAt: toMillis(data.endsAt),
    startsAtDate: toInputDate(data.startsAt),
    endsAtDate: toInputDate(data.endsAt),
    maxRedemptions: data.maxRedemptions ?? null,
    redeemedCount: data.redeemedCount ?? 0,
    maxRedemptionsPerUser: data.maxRedemptionsPerUser ?? null,
    createdAt: toMillis(data.createdAt),
    createdBy: data.createdBy || "",
    updatedAt: toMillis(data.updatedAt),
    updatedBy: data.updatedBy || "",
  };
}

export function sanitizeCouponPayload(input = {}, previous = {}) {
  const normalized = normalizeCouponRecord({
    ...previous,
    ...input,
    startsAt: toDate(input.startsAt ?? previous.startsAt),
    endsAt: toDate(input.endsAt ?? previous.endsAt, true),
  });

  return {
    ...normalized,
    startsAt: toDate(input.startsAt ?? previous.startsAt),
    endsAt: toDate(input.endsAt ?? previous.endsAt, true),
    redeemedCount: previous.redeemedCount ?? normalized.redeemedCount,
  };
}

export async function getCouponApplication({
  db,
  user,
  couponCode,
  items,
  locationType,
  travelFee,
  subtotal,
  now = new Date(),
  transaction = null,
}) {
  const code = assertValidCouponCode(couponCode);
  const couponRef = db.collection(COUPONS_COLLECTION).doc(code);
  const redemptionRef = couponRef.collection("redemptions").doc(user.uid);
  const read = transaction
    ? (ref) => transaction.get(ref)
    : (ref) => ref.get();
  const [couponSnapshot, redemptionSnapshot, userSnapshot] = await Promise.all([
    read(couponRef),
    read(redemptionRef),
    read(db.collection("users").doc(user.uid)),
  ]);

  if (!couponSnapshot.exists) {
    throw new Error("Coupon code was not found.");
  }

  const userData = userSnapshot.exists ? userSnapshot.data() || {} : {};
  const syncedMembershipState = syncMembershipState(
    userData.membership ?? EMPTY_MEMBERSHIP,
    Array.isArray(userData.membershipBenefits) ? userData.membershipBenefits : [],
    now,
  );
  const membershipSummary = getMembershipSummary(
    syncedMembershipState.membership,
    syncedMembershipState.membershipBenefits,
  );
  const pricing = getMembershipPricing({
    items,
    membership: membershipSummary,
    benefits: membershipSummary.benefits,
    locationType: locationType ?? "clinic",
    travelFee: travelFee ?? 0,
  });
  const coupon = {
    ...couponSnapshot.data(),
    code,
  };
  const userRedemptionCount = redemptionSnapshot.exists
    ? Number(redemptionSnapshot.data()?.count) || 0
    : 0;
  const validation = validateCouponForUser({
    coupon,
    userRedemptionCount,
    now,
  });

  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const discountBase = getCouponDiscountBase({
    subtotal,
    travelFee,
    travelFeeWaived: pricing.travelFeeWaived,
    membershipCreditApplied: pricing.membershipCreditApplied,
    membershipDiscount: pricing.membershipDiscount,
  });
  const couponDiscount = calculateCouponDiscount(validation.coupon, discountBase);

  if (!couponDiscount) {
    throw new Error("This coupon cannot be applied to the current booking.");
  }

  return {
    code,
    coupon: validation.coupon,
    couponRef,
    redemptionRef,
    discountBase,
    couponDiscount,
    message: validation.message,
  };
}
