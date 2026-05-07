import assert from "node:assert/strict";
import test from "node:test";

import { buildAppUrl, fromStripeAmount, toStripeAmount } from "../lib/stripe.js";

test("buildAppUrl trims trailing slash and normalizes paths", () => {
  const originalValue = process.env.NEXT_PUBLIC_APP_URL;
  process.env.NEXT_PUBLIC_APP_URL = "https://example.com/";

  try {
    assert.equal(buildAppUrl("/booking/success"), "https://example.com/booking/success");
    assert.equal(buildAppUrl("memberships/success"), "https://example.com/memberships/success");
  } finally {
    if (originalValue === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL;
    } else {
      process.env.NEXT_PUBLIC_APP_URL = originalValue;
    }
  }
});

test("stripe amount helpers convert dollars and cents safely", () => {
  assert.equal(toStripeAmount(149), 14900);
  assert.equal(toStripeAmount(249.99), 24999);
  assert.equal(fromStripeAmount(24999), 249.99);
});
