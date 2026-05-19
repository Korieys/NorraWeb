import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { SKUS, type SkuId } from "@/lib/skus";

export const runtime = "nodejs";

function originFrom(req: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sku = body?.sku as SkuId | undefined;
    if (!sku || !SKUS[sku]) {
      return NextResponse.json({ error: "Invalid SKU" }, { status: 400 });
    }

    const stripe = getStripe();
    const origin = originFrom(req);

    if (!stripe) {
      // Dev fallback: skip Stripe and go straight to confirmation.
      console.warn("STRIPE_SECRET_KEY not set. Returning dev redirect.");
      return NextResponse.json({
        url: `${origin}/reserved?sku=${sku}&dev=1`,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 100,
            product_data: {
              name: `Norra ${sku} Protein Pack — Founder Reservation`,
              description: `Refundable $1 deposit. Locks in $20 off launch and early access to the ${sku} pack.`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { sku },
      success_url: `${origin}/reserved?sku=${sku}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancelled`,
      allow_promotion_codes: false,
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
