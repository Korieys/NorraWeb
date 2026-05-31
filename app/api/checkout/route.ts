import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { SKUS, type SkuId } from "@/lib/skus";

export const runtime = "nodejs";

function originFrom(req: Request): string {
  const h = req.headers;
  const forwardedHost = h.get("x-forwarded-host") ?? h.get("host");
  const forwardedProto = h.get("x-forwarded-proto") ?? "https";
  if (forwardedHost && !/^localhost(:|$)/i.test(forwardedHost)) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv && !/localhost/i.test(fromEnv)) return fromEnv.replace(/\/$/, "");
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sku = body?.sku as SkuId | undefined;
    const email =
      typeof body?.email === "string" && body.email.trim()
        ? body.email.trim()
        : undefined;
    // Meta browser cookies forwarded from the client to improve CAPI match
    // quality; persisted in Stripe metadata so the webhook can read them.
    const fbp =
      typeof body?.fbp === "string" && body.fbp.trim() ? body.fbp.trim() : undefined;
    const fbc =
      typeof body?.fbc === "string" && body.fbc.trim() ? body.fbc.trim() : undefined;

    if (!sku || !SKUS[sku]) {
      return NextResponse.json({ error: "Invalid SKU" }, { status: 400 });
    }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const stripe = getStripe();
    const origin = originFrom(req);
    const reservationMetadata = {
      sku,
      reserved_pack: sku,
      kind: "founder_reservation",
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {}),
    };

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
              name: `Daypack ${sku} Protein Pack — Founder Reservation`,
              description: `Refundable $1 deposit. Locks in $20 off launch and early access to the ${sku} pack.`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: reservationMetadata,
      payment_intent_data: {
        metadata: reservationMetadata,
      },
      ...(email ? { customer_email: email } : {}),
      customer_creation: "always",
      consent_collection: {
        terms_of_service: "none",
      },
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
