export const COUPON_TYPES = {
  FIXED: "fixed",
  PERCENT: "percent",
};

export function normalizeCouponCode(input) {
  return String(input ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

export function assertValidCouponCode(code) {
  const normalized = normalizeCouponCode(code);

  if (!normalized) {
    throw new Error("Enter a coupon code.");
  }

  if (!/^[A-Z0-9_-]{3,32}$/.test(normalized)) {
    throw new Error("Coupon codes may use 3-32 letters, numbers, dashes, or underscores.");
  }

  return normalized;
}

function toMillis(value) {
  if (!value) {
    return null;
  }
  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeLimit(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}

export function normalizeCouponRecord(input = {}) {
  const code = assertValidCouponCode(input.code);
  const type = input.type === COUPON_TYPES.PERCENT ? COUPON_TYPES.PERCENT : COUPON_TYPES.FIXED;
  const amount = Math.round((Number(input.amount) || 0) * 100) / 100;

  if (amount <= 0) {
    throw new Error("Coupon amount must be greater than 0.");
  }

  if (type === COUPON_TYPES.PERCENT && amount > 100) {
    throw new Error("Percent coupons cannot exceed 100%.");
  }

  return {
    code,
    type,
    amount,
    active: input.active !== false,
    startsAt: input.startsAt ?? null,
    endsAt: input.endsAt ?? null,
    maxRedemptions: normalizeLimit(input.maxRedemptions),
    redeemedCount: Math.max(0, Math.floor(Number(input.redeemedCount) || 0)),
    maxRedemptionsPerUser: normalizeLimit(input.maxRedemptionsPerUser),
  };
}

export function calculateCouponDiscount(coupon, discountBase) {
  const base = Math.max(Number(discountBase) || 0, 0);
  const amount = Number(coupon?.amount) || 0;
  let discount = 0;

  if (!base || amount <= 0) {
    return 0;
  }

  if (coupon?.type === COUPON_TYPES.PERCENT) {
    discount = base * (amount / 100);
  } else {
    discount = amount;
  }

  return Math.min(Math.round(discount * 100) / 100, base);
}

export function validateCouponForUser({
  coupon,
  userRedemptionCount = 0,
  now = new Date(),
}) {
  if (!coupon) {
    return { ok: false, message: "Coupon code was not found." };
  }

  const normalized = normalizeCouponRecord(coupon);
  const nowMillis = toMillis(now) ?? Date.now();
  const startsAt = toMillis(normalized.startsAt);
  const endsAt = toMillis(normalized.endsAt);

  if (!normalized.active) {
    return { ok: false, message: "This coupon is not active." };
  }

  if (startsAt && startsAt > nowMillis) {
    return { ok: false, message: "This coupon is not active yet." };
  }

  if (endsAt && endsAt < nowMillis) {
    return { ok: false, message: "This coupon has expired." };
  }

  if (
    normalized.maxRedemptions &&
    normalized.redeemedCount >= normalized.maxRedemptions
  ) {
    return { ok: false, message: "This coupon has reached its usage limit." };
  }

  if (
    normalized.maxRedemptionsPerUser &&
    Math.max(Number(userRedemptionCount) || 0, 0) >= normalized.maxRedemptionsPerUser
  ) {
    return { ok: false, message: "You have already used this coupon." };
  }

  return { ok: true, coupon: normalized, message: `${normalized.code} applied successfully.` };
}

export function getCouponDiscountBase({
  subtotal = 0,
  travelFee = 0,
  travelFeeWaived = 0,
  membershipCreditApplied = 0,
  membershipDiscount = 0,
}) {
  return Math.max(
    (Number(subtotal) || 0) +
      (Number(travelFee) || 0) -
      (Number(travelFeeWaived) || 0) -
      (Number(membershipCreditApplied) || 0) -
      (Number(membershipDiscount) || 0),
    0,
  );
}
