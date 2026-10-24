import Stripe from "stripe";

let cached: Stripe | null = null;
let cachedKey: string | undefined;

// Vercel supplies this server-side value. Local development and every preview
// accept test keys only, even if a live key is accidentally inherited.
export function stripePaymentMode(): "live" | "test" {
  return process.env.VERCEL_ENV === "production" ? "live" : "test";
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  const prefix = stripePaymentMode() === "live" ? /^(sk|rk)_live_/ : /^(sk|rk)_test_/;
  if (!key || !prefix.test(key)) return null;
  if (cached && cachedKey === key) return cached;
  cached = new Stripe(key, {
    apiVersion: "2026-09-30.endive",
    timeout: 8_000,
    maxNetworkRetries: 1,
  });
  cachedKey = key;
  return cached;
}
