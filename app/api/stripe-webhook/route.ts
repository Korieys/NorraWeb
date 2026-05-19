import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { subscribeToKlaviyo, trackKlaviyoEvent } from "@/lib/klaviyo";

export const runtime = "nodejs";

// Stripe needs the raw body bytes to verify the signature.
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");

  if (!stripe || !secret) {
    console.warn("Stripe webhook env not configured. Skipping.");
    return NextResponse.json({ received: true });
  }
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error("Stripe signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email =
        session.customer_details?.email ||
        session.customer_email ||
        undefined;
      const sku = (session.metadata?.sku as string | undefined) || "unknown";
      const amount = (session.amount_total ?? 100) / 100;

      if (email) {
        // Add (or refresh) profile + tag as reserved with the chosen SKU.
        await subscribeToKlaviyo(
          email,
          {
            source: "stripe_checkout",
            reservation_status: "reserved",
            reserved_sku: sku,
            reserved_at: new Date().toISOString(),
          },
          process.env.KLAVIYO_RESERVED_LIST_ID || undefined
        );

        // Fire a metric so flows can trigger off it.
        await trackKlaviyoEvent(email, "Reserved Deposit", {
          sku,
          amount,
          currency: (session.currency || "usd").toUpperCase(),
          session_id: session.id,
        });
      } else {
        console.warn(
          "checkout.session.completed without email",
          session.id
        );
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    // Still 200 so Stripe doesn't retry indefinitely on app bugs.
  }

  return NextResponse.json({ received: true });
}
