import Stripe from "stripe";

let stripeClient = null;

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getStripe() {
  if (stripeClient) {
    return stripeClient;
  }

  stripeClient = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"));
  return stripeClient;
}

export function getStripeWebhookSecret() {
  return getRequiredEnv("STRIPE_WEBHOOK_SECRET");
}

export function getAppUrl() {
  const value =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (!value) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_APP_URL",
    );
  }

  return value.replace(/\/+$/, "");
}

export function buildAppUrl(path) {
  const normalizedPath = String(path || "/").startsWith("/")
    ? String(path || "/")
    : `/${String(path || "/")}`;

  return `${getAppUrl()}${normalizedPath}`;
}

export function toStripeAmount(value) {
  return Math.max(Math.round((Number(value) || 0) * 100), 0);
}

export function fromStripeAmount(amount) {
  return Math.max(Number(amount) || 0, 0) / 100;
}

export function constructStripeEvent(payload, signature) {
  return getStripe().webhooks.constructEvent(
    payload,
    signature,
    getStripeWebhookSecret(),
  );
}
