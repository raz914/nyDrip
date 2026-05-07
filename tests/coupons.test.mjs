import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateCouponDiscount,
  getCouponDiscountBase,
  normalizeCouponCode,
  validateCouponForUser,
} from "../lib/coupons.mjs";
import { calculateDripCredit } from "../lib/rewards-engine.mjs";

const now = new Date("2026-05-07T12:00:00.000Z");

function coupon(overrides = {}) {
  return {
    code: "SAVE20",
    type: "fixed",
    amount: 20,
    active: true,
    startsAt: null,
    endsAt: null,
    redeemedCount: 0,
    maxRedemptions: null,
    maxRedemptionsPerUser: null,
    ...overrides,
  };
}

test("normalizes coupon codes as uppercase without spaces", () => {
  assert.equal(normalizeCouponCode(" save-10 "), "SAVE-10");
});

test("fixed discount is capped by discount base", () => {
  assert.equal(calculateCouponDiscount(coupon({ amount: 50 }), 30), 30);
});

test("percent discount uses the discount base", () => {
  assert.equal(
    calculateCouponDiscount(coupon({ type: "percent", amount: 15 }), 200),
    30,
  );
});

test("inactive coupon is rejected", () => {
  const result = validateCouponForUser({ coupon: coupon({ active: false }), now });

  assert.equal(result.ok, false);
  assert.equal(result.message, "This coupon is not active.");
});

test("not-yet-started and expired coupons are rejected", () => {
  assert.equal(
    validateCouponForUser({
      coupon: coupon({ startsAt: new Date("2026-05-08T00:00:00.000Z") }),
      now,
    }).message,
    "This coupon is not active yet.",
  );
  assert.equal(
    validateCouponForUser({
      coupon: coupon({ endsAt: new Date("2026-05-06T23:59:59.000Z") }),
      now,
    }).message,
    "This coupon has expired.",
  );
});

test("total usage limit is enforced", () => {
  const result = validateCouponForUser({
    coupon: coupon({ maxRedemptions: 3, redeemedCount: 3 }),
    now,
  });

  assert.equal(result.ok, false);
  assert.equal(result.message, "This coupon has reached its usage limit.");
});

test("per-user usage limit is enforced", () => {
  const result = validateCouponForUser({
    coupon: coupon({ maxRedemptionsPerUser: 1 }),
    userRedemptionCount: 1,
    now,
  });

  assert.equal(result.ok, false);
  assert.equal(result.message, "You have already used this coupon.");
});

test("coupon applies after membership adjustments and before Drips", () => {
  const discountBase = getCouponDiscountBase({
    subtotal: 300,
    travelFee: 40,
    travelFeeWaived: 10,
    membershipCreditApplied: 50,
    membershipDiscount: 20,
  });
  const couponDiscount = calculateCouponDiscount(coupon({ amount: 25 }), discountBase);
  const orderTotal = discountBase - couponDiscount;
  const dripCredit = calculateDripCredit(100);

  assert.equal(discountBase, 260);
  assert.equal(couponDiscount, 25);
  assert.equal(Math.max(orderTotal - dripCredit, 0), 225);
});
