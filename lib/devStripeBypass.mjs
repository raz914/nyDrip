function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;

  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

export function isDevStripeBypassEnabled(env = process.env) {
  return parseBoolean(env.DEV_BYPASS_STRIPE) && env.NODE_ENV !== "production";
}

export function assertDevStripeBypassAllowed(env = process.env) {
  if (parseBoolean(env.DEV_BYPASS_STRIPE) && env.NODE_ENV === "production") {
    throw new Error("DEV_BYPASS_STRIPE cannot be enabled in production.");
  }
}

export function createDevPaymentPayload(overrides = {}) {
  const now = new Date();

  return {
    provider: "dev_bypass",
    status: "paid",
    checkoutStatus: "dev_bypassed",
    checkoutSessionId: `dev_bypass_${now.getTime()}`,
    paymentIntentId: "dev_bypass",
    customerId: "dev_bypass",
    amountPaidCents: 0,
    currency: "usd",
    paidAt: now,
    ...overrides,
  };
}
