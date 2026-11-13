import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { canCreatePreorder } from "@/lib/preorder-availability";
import { RESERVATION_AMOUNT, RESERVATION_METADATA, RESERVATION_PRICE_ID, RESERVATION_PRODUCT_ID } from "@/lib/reservations";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };
const cleanCookie = (value: unknown) => typeof value === "string" && value.length <= 256 && /^[\w.\-]+$/.test(value) ? value : undefined;

export async function POST(req: Request) {
  if (process.env.DAYPACK_RESERVATIONS_ENABLED === "false" || canCreatePreorder()) {
    return NextResponse.json({ error: "New reservations are currently closed.", code: "RESERVATIONS_CLOSED" }, { status: 503, headers: noStore });
  }
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid reservation request." }, { status: 400, headers: noStore }); }
  if (!body || body.offer !== "reservation" || Object.keys(body).some(key => !["offer", "fbp", "fbc"].includes(key))) {
    return NextResponse.json({ error: "Choose the $1 refundable reservation offer." }, { status: 400, headers: noStore });
  }
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Reservation checkout is temporarily unavailable." }, { status: 503, headers: noStore });
  try {
    const price = await stripe.prices.retrieve(RESERVATION_PRICE_ID, { expand: ["product"] });
    const product = price.product;
    if (!price.active || price.type !== "one_time" || price.currency !== "usd" || price.unit_amount !== RESERVATION_AMOUNT || price.recurring || price.custom_unit_amount || price.transform_quantity || typeof product === "string" || product.deleted || product.id !== RESERVATION_PRODUCT_ID || !product.active) {
      return NextResponse.json({ error: "Reservation checkout is temporarily unavailable." }, { status: 503, headers: noStore });
    }
    const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://eatdaypack.com").origin;
    const metadata = { ...RESERVATION_METADATA, ...(cleanCookie(body.fbp) ? { fbp: cleanCookie(body.fbp)! } : {}), ...(cleanCookie(body.fbc) ? { fbc: cleanCookie(body.fbc)! } : {}) };
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "usd",
      line_items: [{ price: RESERVATION_PRICE_ID, quantity: 1 }],
      allow_promotion_codes: false,
      automatic_tax: { enabled: false },
      adaptive_pricing: { enabled: false },
      customer_creation: "always",
      metadata,
      payment_intent_data: { metadata },
      custom_text: { submit: { message: "$1 fully refundable reservation for a future preorder opportunity. Not a product order. No automatic purchase credit or discount. Full preorders planned January 25, 2027, subject to readiness. Shipping date unconfirmed. Refunds: team@eatdaypack.com." } },
      success_url: `${origin}/reserved?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancelled`,
    });
    if (session.amount_total !== RESERVATION_AMOUNT || session.currency !== "usd" || session.mode !== "payment" || !session.url) {
      await stripe.checkout.sessions.expire(session.id);
      return NextResponse.json({ error: "Reservation checkout is temporarily unavailable." }, { status: 503, headers: noStore });
    }
    // Session creation never records a deposit or sends a confirmation. The signed,
    // paid-payment webhook is the only source of reservation success.
    return NextResponse.json({ url: session.url }, { headers: noStore });
  } catch {
    console.error("Reservation checkout could not be created.");
    return NextResponse.json({ error: "We could not open reservation checkout. Please try again." }, { status: 502, headers: noStore });
  }
}
