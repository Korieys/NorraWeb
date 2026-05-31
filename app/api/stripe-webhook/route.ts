import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { sendPurchaseToMeta } from "@/lib/meta";

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
  const stripeObjectId = paymentIntentIdFrom(session.payment_intent) ?? session.id;
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

  console.log("Klaviyo Placed Deposit request", {
    url: KLAVIYO_EVENTS_URL,
    metricName: "Placed Deposit",
    keySource: privateKey.source,
    hasKlaviyoPrivateApiKey: privateKey.hasPrivateApiKey,
    hasKlaviyoPrivateKey: privateKey.hasPrivateKey,
    payload,
  });

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

  const responseBody = await res.text();
  console.log("Klaviyo Placed Deposit response", {
    email: deposit.email,
    status: res.status,
    body: responseBody,
  });

  if (!res.ok) {
    console.error("Klaviyo Placed Deposit error", {
      status: res.status,
      body: responseBody,
    });
    return { ok: false, status: res.status, error: responseBody };
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
    console.error("Stripe signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let deposit: DepositPayload | null = null;
  try {
    console.log("Stripe webhook event type received", {
      type: event.type,
    });

    if (event.type === "checkout.session.completed") {
      deposit = await depositFromCheckoutSession(
        stripe,
        event.data.object as Stripe.Checkout.Session
      );
    } else if (event.type === "payment_intent.succeeded") {
      deposit = await depositFromPaymentIntent(
        stripe,
        event.data.object as Stripe.PaymentIntent
      );
    } else {
      console.log("Stripe webhook received", {
        type: event.type,
        email: "n/a",
      });
      return NextResponse.json({ received: true });
    }

    console.log("Stripe webhook received", {
      type: event.type,
      email: deposit.email ?? "missing",
      stripeSessionId: deposit.stripeSessionId ?? "n/a",
      reservedPack: deposit.reservedPack ?? "missing",
      reservationId: deposit.reservationId,
    });

    if (!deposit.email || !deposit.reservedPack) {
      console.warn("Stripe deposit missing required Klaviyo fields", {
        type: event.type,
        email: deposit.email ?? "missing",
        reservedPack: deposit.reservedPack ?? "missing",
        stripeObjectId: deposit.stripeObjectId,
      });
      return NextResponse.json({ received: true });
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
        value: 1.0,
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
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
