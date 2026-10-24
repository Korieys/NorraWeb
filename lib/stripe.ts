import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  cached = new Stripe(key, {
    apiVersion: "2026-09-30.endive",
    timeout: 8_000,
    maxNetworkRetries: 1,
  });
  return cached;
}
