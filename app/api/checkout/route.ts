import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { OFFERS, SHIPPING_CENTS, offerIdFrom } from "@/lib/daypack-offers";

export const runtime = "nodejs";

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
    const offerId = offerIdFrom(body?.offer);
    if (!offerId) return NextResponse.json({ error: "Choose a valid Daypack offer." }, { status: 400 });
    const offer = OFFERS[offerId];
    if (process.env.DAYPACK_CHECKOUT_ENABLED !== "true") {
      return NextResponse.json({ error: "Preorders are temporarily unavailable. Please contact team@eatdaypack.com for updates." }, { status: 503 });
    }
    const stripe = getStripe();
    if (!stripe) return NextResponse.json({ error: "Secure checkout is not configured yet." }, { status: 503 });

    const origin = originFrom(req);
    const metadata = {
      sku: "170", reserved_pack: "170", offer: offerId, pack_quantity: String(offer.quantity),
      kind: offer.recurring ? "daypack_170_subscription" : "daypack_170_preorder", fulfillment_window: "Q4 2026",
      ...(optionalCookie(body?.fbp) ? { fbp: optionalCookie(body.fbp)! } : {}),
      ...(optionalCookie(body?.fbc) ? { fbc: optionalCookie(body.fbc)! } : {}),
    };
    const productLineItem = { price_data: { currency: "usd", unit_amount: offer.amount, product_data: {
      name: offer.name,
        description: `${offer.quantity} single-day pack${offer.quantity > 1 ? "s" : ""}, each with 9 shelf-stable items and a working target of 170g+ protein. Estimated Q4 2026 first fulfillment.`,
      metadata: { sku: "170", offer: offerId },
    }, ...(offer.recurring ? { recurring: { interval: "month" as const } } : {}) }, quantity: 1 };
    const lineItems = offer.recurring
      ? [productLineItem, { price_data: { currency: "usd", unit_amount: SHIPPING_CENTS, product_data: {
          name: "Standard U.S. shipping",
          description: "Shipping for each monthly Core 3 delivery.",
          metadata: { kind: "shipping", offer: offerId },
        }, recurring: { interval: "month" as const } }, quantity: 1 }]
      : [productLineItem];
    const session = await stripe.checkout.sessions.create({
      mode: offer.recurring ? "subscription" : "payment",
      integration_identifier: "daypack-preorder-nqvszwrt",
      line_items: lineItems,
      metadata,
      ...(offer.recurring ? { subscription_data: { metadata, billing_mode: { type: "classic" as const } } } : { payment_intent_data: { metadata } }),
      ...(!offer.recurring ? { customer_creation: "always" as const } : {}),
      shipping_address_collection: { allowed_countries: ["US"] },
      ...(!offer.recurring ? { shipping_options: [{ shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: SHIPPING_CENTS, currency: "usd" },
        display_name: "Preorder shipping — estimated Q4 2026 fulfillment",
      } }] } : {}),
      phone_number_collection: { enabled: true },
      custom_text: {
        submit: { message: offer.recurring ? "Renews monthly until canceled. First fulfillment estimated Q4 2026." : "Preorder charged today. Estimated Q4 2026 fulfillment. Cancel before shipment for a full refund." },
        shipping_address: { message: "$9.99 standard U.S. shipping. This is a preorder with first fulfillment estimated for Q4 2026, not immediate dispatch." },
      },
      success_url: `${origin}/reserved?sku=170&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancelled`,
      allow_promotion_codes: false,
      billing_address_collection: "auto",
    });
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Daypack checkout could not be created.");
    return NextResponse.json({ error: "Unable to open secure checkout. Please try again." }, { status: 500 });
  }
}
