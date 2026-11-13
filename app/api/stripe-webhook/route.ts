import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { sendPurchaseToMeta } from "@/lib/meta";
import { isPaidReservationIntent, reservationSessionState } from "@/lib/reservations";

export const runtime = "nodejs";

const KLAVIYO_EVENTS_URL = "https://a.klaviyo.com/api/events";
const KLAVIYO_JSON_API_MIME = "application/vnd.api+json";
const KLAVIYO_REVISION = "2026-04-15";

type DepositPayload = {
  email?: string;
  reservedPack?: string;
  amount: number;
  reservationId: string;
  stripeSessionId?: string;
  stripeObjectId: string;
  fbp?: string;
  fbc?: string;
};

const DEPOSIT_PAGE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://eatdaypack.com"
).replace(/\/$/, "");

function cleanString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function reservationIdFrom(stripeObjectId: string): string {
  return stripeObjectId.slice(-6).toUpperCase();
}

function dollarsFromCents(amount: number | null | undefined): number {
  return typeof amount === "number" ? amount / 100 : 0;
}

function reservedPackFrom(
  metadata: Stripe.Metadata | null | undefined
): string | undefined {
  return cleanString(metadata?.reserved_pack) ?? cleanString(metadata?.sku);
}

function paymentIntentIdFrom(
  paymentIntent: string | Stripe.PaymentIntent | null
): string | undefined {
  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id;
}

function customerEmailFrom(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): string | undefined {
  if (!customer || typeof customer === "string") return undefined;
  if ("deleted" in customer && customer.deleted) return undefined;
  return cleanString(customer.email);
}

async function retrieveCustomerEmail(
  stripe: Stripe,
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): Promise<string | undefined> {
  const fromObject = customerEmailFrom(customer);
  if (fromObject || typeof customer !== "string") return fromObject;

  const retrieved = await stripe.customers.retrieve(customer);
  return customerEmailFrom(retrieved);
}

function chargeEmailFrom(
  charge: string | Stripe.Charge | null | undefined
): string | undefined {
  if (!charge || typeof charge === "string") return undefined;
  return cleanString(charge.billing_details.email);
}

async function retrieveChargeEmail(
  stripe: Stripe,
  charge: string | Stripe.Charge | null | undefined
): Promise<string | undefined> {
  const fromObject = chargeEmailFrom(charge);
  if (fromObject || typeof charge !== "string") return fromObject;

  const retrieved = await stripe.charges.retrieve(charge);
  return chargeEmailFrom(retrieved);
}

async function depositFromCheckoutSession(
  stripe: Stripe,
  session: Stripe.Checkout.Session
): Promise<DepositPayload> {
  const stripeObjectId = paymentIntentIdFrom(session.payment_intent);
  if (!stripeObjectId) throw new Error("Paid reservation is missing its payment reference.");
  const email =
    cleanString(session.customer_details?.email) ??
    cleanString(session.customer_email) ??
    (await retrieveCustomerEmail(stripe, session.customer));

  return {
    email,
    reservedPack: reservedPackFrom(session.metadata),
    amount: dollarsFromCents(session.amount_total),
    reservationId: reservationIdFrom(stripeObjectId),
    stripeSessionId: session.id,
    stripeObjectId,
    fbp: cleanString(session.metadata?.fbp),
    fbc: cleanString(session.metadata?.fbc),
  };
}

async function depositFromPaymentIntent(
  stripe: Stripe,
  paymentIntent: Stripe.PaymentIntent
): Promise<DepositPayload> {
  const email =
    cleanString(paymentIntent.receipt_email) ??
    (await retrieveCustomerEmail(stripe, paymentIntent.customer)) ??
    (await retrieveChargeEmail(stripe, paymentIntent.latest_charge));

  return {
    email,
    reservedPack: reservedPackFrom(paymentIntent.metadata),
    amount: dollarsFromCents(paymentIntent.amount_received || paymentIntent.amount),
    reservationId: reservationIdFrom(paymentIntent.id),
    stripeObjectId: paymentIntent.id,
    fbp: cleanString(paymentIntent.metadata?.fbp),
    fbc: cleanString(paymentIntent.metadata?.fbc),
  };
}

function getKlaviyoPrivateKey() {
  const privateApiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const privateKey = process.env.KLAVIYO_PRIVATE_KEY;
  return {
    key: privateApiKey ?? privateKey,
    source: privateApiKey
      ? "KLAVIYO_PRIVATE_API_KEY"
      : privateKey
        ? "KLAVIYO_PRIVATE_KEY"
        : "missing",
    hasPrivateApiKey: Boolean(privateApiKey),
    hasPrivateKey: Boolean(privateKey),
  };
}

async function sendPlacedDepositToKlaviyo(
  deposit: DepositPayload & { email: string; reservedPack: string }
) {
  const privateKey = getKlaviyoPrivateKey();
  if (!privateKey.key) {
    console.error("Klaviyo private API key is not configured.", {
      hasKlaviyoPrivateApiKey: privateKey.hasPrivateApiKey,
      hasKlaviyoPrivateKey: privateKey.hasPrivateKey,
    });
    return {
      ok: false,
      status: 0,
      error: "Klaviyo private API key is not configured.",
    };
  }

  const payload = {
    data: {
      type: "event",
      attributes: {
        properties: {
          ReservedPack: deposit.reservedPack,
          ReservationId: deposit.reservationId,
          reserved_sku: deposit.reservedPack,
          stripe_object_id: deposit.stripeObjectId,
          stripe_session_id: deposit.stripeSessionId,
          currency: "USD",
          source: "stripe_checkout",
          order_type: "reservation",
        },
        value: deposit.amount,
        value_currency: "USD",
        unique_id: deposit.stripeObjectId,
        metric: {
          data: {
            type: "metric",
            attributes: { name: "Placed Deposit" },
          },
        },
        profile: {
          data: {
            type: "profile",
            attributes: {
              email: deposit.email,
              properties: {
                reserved_pack: deposit.reservedPack,
                reservation_status: "reserved",
              },
            },
          },
        },
      },
    },
  };

  const res = await fetch(KLAVIYO_EVENTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${privateKey.key}`,
      "Content-Type": KLAVIYO_JSON_API_MIME,
      Accept: KLAVIYO_JSON_API_MIME,
      revision: KLAVIYO_REVISION,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("Klaviyo reservation event failed", { status: res.status });
    return { ok: false, status: res.status, error: "Reservation event rejected" };
  }

  return { ok: true, status: res.status };
}

// App Router route handlers expose the raw Web Request body; do not call req.json().
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");

  if (!stripe || !secret) {
    console.error("Stripe webhook env is not configured.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error("Stripe signature verification failed.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let deposit: DepositPayload | null = null;
  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (reservationSessionState(session) !== "paid") return NextResponse.json({ received: true });
      deposit = await depositFromCheckoutSession(stripe, session);
    } else if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as Stripe.PaymentIntent;
      if (!isPaidReservationIntent(intent)) return NextResponse.json({ received: true });
      deposit = await depositFromPaymentIntent(stripe, intent);
    } else {
      // Failed, unpaid, unrelated, and full-product events never become deposits.
      return NextResponse.json({ received: true });
    }

    if (!deposit.email || !deposit.reservedPack) {
      console.error("Paid reservation is missing required event fields.");
      return NextResponse.json({ error: "Reservation details unavailable" }, { status: 502 });
    }

    // Server-side Purchase to Meta CAPI (source of truth for the $1 deposit).
    // Runs alongside Klaviyo; a CAPI failure is logged but never blocks the
    // webhook response — Meta dedupes on event_id if Stripe retries.
    const [klaviyo] = await Promise.all([
      sendPlacedDepositToKlaviyo({
        ...deposit,
        email: deposit.email,
        reservedPack: deposit.reservedPack,
      }),
      sendPurchaseToMeta({
        eventId: deposit.reservationId,
        email: deposit.email,
        eventSourceUrl: DEPOSIT_PAGE_URL,
        reservedPack: deposit.reservedPack,
        value: deposit.amount,
        fbp: deposit.fbp,
        fbc: deposit.fbc,
      }),
    ]);

    if (!klaviyo.ok) {
      return NextResponse.json(
        { error: "Klaviyo event failed", status: klaviyo.status },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Reservation webhook could not be processed.");
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
