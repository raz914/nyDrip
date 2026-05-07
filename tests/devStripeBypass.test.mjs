import assert from "node:assert/strict";
import test from "node:test";

import {
  assertDevStripeBypassAllowed,
  createDevPaymentPayload,
  isDevStripeBypassEnabled,
} from "../lib/devStripeBypass.mjs";

test("dev Stripe bypass is enabled only outside production", () => {
  assert.equal(
    isDevStripeBypassEnabled({ DEV_BYPASS_STRIPE: "true", NODE_ENV: "development" }),
    true,
  );
  assert.equal(
    isDevStripeBypassEnabled({ DEV_BYPASS_STRIPE: "true", NODE_ENV: "production" }),
    false,
  );
  assert.equal(
    isDevStripeBypassEnabled({ DEV_BYPASS_STRIPE: "false", NODE_ENV: "development" }),
    false,
  );
});

test("dev Stripe bypass throws when enabled in production", () => {
  assert.throws(
    () => assertDevStripeBypassAllowed({ DEV_BYPASS_STRIPE: "true", NODE_ENV: "production" }),
    /cannot be enabled in production/,
  );
});

test("dev payment payload is marked as a bypassed payment", () => {
  const payment = createDevPaymentPayload({ amountPaid: 125, amountPaidCents: 12500 });

  assert.equal(payment.provider, "dev_bypass");
  assert.equal(payment.checkoutStatus, "dev_bypassed");
  assert.equal(payment.paymentIntentId, "dev_bypass");
  assert.equal(payment.amountPaid, 125);
  assert.equal(payment.amountPaidCents, 12500);
});
