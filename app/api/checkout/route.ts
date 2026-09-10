import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
const SHIPPING_CENTS = 999;
const OFFERS = {
  single: { amount: 5499, quantity: 1, name: "1 Daypack 170", recurring: false },
  core3: { amount: 14999, quantity: 3, name: "Daypack 170 — Core 3", recurring: false },
  "core3-subscription": { amount: 13999, quantity: 3, name: "Daypack 170 — Core 3 Subscription", recurring: true },
} as const;

function originFrom(req: Request): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${protocol}://${host}`;
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://eatdaypack.com").replace(/\/$/, "");
}

function optionalCookie(value: unknown) { return typeof value === "string" && value.trim() ? value.trim() : undefined; }

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body?.sku !== "170") return NextResponse.json({ error: "Only the Daypack 170 is open for preorder." }, { status: 400 });
    const offerId = body?.offer as keyof typeof OFFERS;
    const offer = OFFERS[offerId];
    if (!offer) return NextResponse.json({ error: "Choose a valid Daypack offer." }, { status: 400 });
    const stripe = getStripe();
    if (!stripe) return NextResponse.json({ error: "Secure checkout is not configured yet." }, { status: 503 });

    const origin = originFrom(req);
    const metadata = {
      sku: "170", reserved_pack: "170", offer: offerId, pack_quantity: String(offer.quantity),
      kind: offer.recurring ? "daypack_170_subscription" : "daypack_170_preorder", fulfillment_window: "Q4 2026",
      ...(optionalCookie(body?.fbp) ? { fbp: optionalCookie(body.fbp)! } : {}),
      ...(optionalCookie(body?.fbc) ? { fbc: optionalCookie(body.fbc)! } : {}),
    };
    const session = await stripe.checkout.sessions.create({
      mode: offer.recurring ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "usd", unit_amount: offer.amount, product_data: {
        name: offer.name,
        description: `${offer.quantity} single-day 170g protein pack${offer.quantity > 1 ? "s" : ""}. Estimated Q4 2026 first fulfillment.`,
        metadata: { sku: "170", offer: offerId },
      }, ...(offer.recurring ? { recurring: { interval: "month" as const } } : {}) }, quantity: 1 }],
      metadata,
      ...(offer.recurring ? { subscription_data: { metadata } } : { payment_intent_data: { metadata } }),
      ...(!offer.recurring ? { customer_creation: "always" as const } : {}),
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: [{ shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: SHIPPING_CENTS, currency: "usd" },
        display_name: "Standard U.S. shipping",
        delivery_estimate: { minimum: { unit: "business_day", value: 3 }, maximum: { unit: "business_day", value: 7 } },
      } }],
      phone_number_collection: { enabled: true },
      custom_text: {
        submit: { message: offer.recurring ? "Renews monthly until canceled. First fulfillment estimated Q4 2026." : "Preorder charged today. Estimated Q4 2026 fulfillment. Cancel before shipment for a full refund." },
        shipping_address: { message: "$9.99 standard U.S. shipping is added at checkout." },
      },
      success_url: `${origin}/reserved?sku=170&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancelled`,
      allow_promotion_codes: false,
      billing_address_collection: "auto",
    });
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Checkout error", error);
    return NextResponse.json({ error: "Unable to open secure checkout. Please try again." }, { status: 500 });
  }
}
