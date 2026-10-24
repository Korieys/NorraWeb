import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripePaymentMode } from "@/lib/stripe";
import { sendPurchaseToMeta } from "@/lib/meta";
import { OFFERS, orderOffer, type OfferId } from "@/lib/daypack-offers";

export const runtime = "nodejs";
export const maxDuration = 60;

type Notice = {
  metric: string;
  key: string;
  email: string;
  time: number;
  properties: Record<string, string | number | boolean | null>;
  amount?: number;
  purchase?: { pack: string; quantity: number; fbp?: string; fbc?: string };
};

function idOf(value: string | { id: string } | null | undefined) {
  return typeof value === "string" ? value : value?.id;
}

async function emailFor(stripe: Stripe, email: string | null | undefined, customer: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  if (email?.trim()) return email.trim();
  const resolved = typeof customer === "string" ? await stripe.customers.retrieve(customer) : customer;
  if (resolved && !("deleted" in resolved && resolved.deleted) && "email" in resolved && resolved.email?.trim()) return resolved.email.trim();
  // Retry rather than acknowledge an order whose confirmation would be lost.
  throw new Error("missing_customer_email");
}

function properties(offerId: OfferId) {
  const offer = OFFERS[offerId];
  return { ReservedPack: "170", reserved_sku: "170", offer: offerId, offer_name: offer.name,
    pack_quantity: offer.quantity, recurring: offer.recurring, currency: "USD",
    fulfillment_window: "Q4 2026", fulfillment_status: "unfulfilled" };
}

async function invoiceNotice(stripe: Stripe, invoiceId: string, failed = false, failureTime?: number): Promise<Notice | null> {
  // Re-read through the pinned API: old payload versions and delayed failures
  // cannot turn a now-paid invoice into a failed order.
  const invoice = await stripe.invoices.retrieve(invoiceId);
  const details = invoice.parent?.subscription_details;
  const offer = orderOffer(details?.metadata);
  if (offer !== "core3-subscription") return null;
  if (!["subscription_create", "subscription_cycle"].includes(invoice.billing_reason ?? "")) return null;
  if (invoice.currency !== "usd") throw new Error("unexpected_currency");
  if (failed ? invoice.status !== "open" || invoice.amount_remaining <= 0 : invoice.status !== "paid" || invoice.amount_paid <= 0) return null;
  const email = await emailFor(stripe, invoice.customer_email, invoice.customer);
  const renewal = invoice.billing_reason === "subscription_cycle";
  return {
    metric: failed ? "Daypack Payment Failed" : "Placed Preorder",
    // Initial Checkout and invoice.paid resolve to the same invoice key.
    key: failed ? invoice.id + ":payment_failed" : invoice.id,
    email, time: failed ? failureTime! : invoice.status_transitions.paid_at ?? invoice.created,
    amount: failed ? undefined : invoice.amount_paid / 100,
    properties: { ...properties(offer), ReservationId: invoice.id, stripe_object_id: invoice.id,
      stripe_invoice_id: invoice.id, stripe_subscription_id: idOf(details?.subscription) ?? null,
      order_type: renewal ? "renewal" : "preorder", payment_status: failed ? "failed" : "paid",
      amount_due: invoice.amount_remaining / 100 },
    // Renewals are operational events, not additional ad-conversion tracking.
    ...(!failed && !renewal ? { purchase: { pack: "170", quantity: 3,
      fbp: details?.metadata?.fbp, fbc: details?.metadata?.fbc } } : {}),
  };
}

async function checkoutNotice(stripe: Stripe, session: Stripe.Checkout.Session, time: number): Promise<Notice | null> {
  if (session.payment_status !== "paid") return null;
  const offer = orderOffer(session.metadata);
  if (offer === "core3-subscription" && session.mode === "subscription") {
    const invoice = idOf(session.invoice);
    if (!invoice) throw new Error("missing_subscription_invoice");
    return invoiceNotice(stripe, invoice);
  }
  if (session.mode !== "payment") return null;
  const key = idOf(session.payment_intent);
  if (!key) throw new Error("missing_payment_intent");
  const cents = session.amount_total;
  if (session.currency !== "usd" || !cents || cents <= 0) return null;
  const legacyPack = !session.metadata?.kind && cents === 100
    ? session.metadata?.reserved_pack ?? session.metadata?.sku : null;
  if (!offer && !["170", "200", "230"].includes(legacyPack ?? "")) return null;
  if (offer && OFFERS[offer].recurring) return null;
  const email = await emailFor(stripe, session.customer_details?.email ?? session.customer_email, session.customer);
  return { metric: offer ? "Placed Preorder" : "Placed Deposit", key, email, time,
    amount: cents / 100,
    properties: { ...(offer ? properties(offer) : { ReservedPack: legacyPack!, reserved_sku: legacyPack!, currency: "USD" }),
      ReservationId: key, stripe_object_id: key, stripe_session_id: session.id,
      order_type: offer ? "preorder" : "deposit", payment_status: "paid" },
    purchase: { pack: offer ? "170" : legacyPack!, quantity: offer ? OFFERS[offer].quantity : 1,
      fbp: session.metadata?.fbp, fbc: session.metadata?.fbc },
  };
}

async function subscriptionNotice(stripe: Stripe, event: Stripe.Event): Promise<Notice | null> {
  const snapshot = event.data.object as Stripe.Subscription;
  const previous = event.data.previous_attributes as Partial<Stripe.Subscription> | undefined;
  const deleted = event.type === "customer.subscription.deleted";
  if (!deleted && !Object.hasOwn(previous ?? {}, "cancel_at_period_end") && !Object.hasOwn(previous ?? {}, "cancel_at")) return null;
  const current = await stripe.subscriptions.retrieve(snapshot.id);
  if (orderOffer(current.metadata) !== "core3-subscription") return null;
  if (deleted ? current.status !== "canceled" : current.status === "canceled"
      || current.cancel_at_period_end !== snapshot.cancel_at_period_end || current.cancel_at !== snapshot.cancel_at) return null;
  const scheduled = current.cancel_at_period_end || current.cancel_at !== null;
  return { metric: deleted ? "Daypack Subscription Canceled" : scheduled ? "Daypack Cancellation Scheduled" : "Daypack Cancellation Reversed",
    key: event.id, email: await emailFor(stripe, null, current.customer), time: event.created,
    properties: { stripe_subscription_id: current.id, offer: "core3-subscription",
      subscription_status: current.status, cancel_at_period_end: current.cancel_at_period_end,
      cancel_at: current.cancel_at, canceled_at: current.canceled_at,
      // Cancellation and refunds are separate operations. Never claim a refund here.
      refund_status: "not_checked" },
  };
}

async function noticeFor(stripe: Stripe, event: Stripe.Event): Promise<Notice | null> {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      return checkoutNotice(stripe, event.data.object, event.created);
    case "invoice.paid":
      return invoiceNotice(stripe, event.data.object.id);
    case "invoice.payment_failed":
      return invoiceNotice(stripe, event.data.object.id, true, event.created);
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      return subscriptionNotice(stripe, event);
    default:
      // Checkout owns one-time confirmations. PaymentIntent events lack its
      // shipping and offer context and must not create a second order.
      return null;
  }
}

async function sendNotice(notice: Notice) {
  const key = process.env.KLAVIYO_PRIVATE_API_KEY ?? process.env.KLAVIYO_PRIVATE_KEY;
  if (!key) throw new Error("missing_email_service_configuration");
  const response = await fetch("https://a.klaviyo.com/api/events", {
    method: "POST", signal: AbortSignal.timeout(8_000),
    headers: { Authorization: "Klaviyo-API-Key " + key, "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json", revision: "2026-04-15" },
    body: JSON.stringify({ data: { type: "event", attributes: {
      properties: notice.properties, unique_id: notice.key,
      time: new Date(notice.time * 1000).toISOString(),
      ...(notice.amount !== undefined ? { value: notice.amount, value_currency: "USD" } : {}),
      metric: { data: { type: "metric", attributes: { name: notice.metric } } },
      // Event history avoids late deliveries overwriting newer profile state.
      profile: { data: { type: "profile", attributes: { email: notice.email } } },
    } } }),
  });
  await response.body?.cancel();
  if (!response.ok) throw new Error("email_service_rejected_event");
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await req.text(), signature, secret); }
  catch { return NextResponse.json({ error: "Invalid signature" }, { status: 400 }); }
  if (event.livemode !== (stripePaymentMode() === "live")) {
    return NextResponse.json({ error: "Event payment mode does not match this environment" }, { status: 400 });
  }
  try {
    const notice = await noticeFor(stripe, event);
    if (!event.livemode) {
      // Exercise the same Stripe reads and order classification in a sandbox,
      // without writing profiles, sending emails or reporting ad conversions.
      // These diagnostics do not prove email delivery or fulfillment.
      const result = notice ? {
        metric: notice.metric, reference: notice.key, amount: notice.amount,
        orderType: notice.properties.order_type, quantity: notice.properties.pack_quantity,
        currency: notice.properties.currency,
      } : null;
      console.log("Daypack sandbox event checked", { eventId: event.id, type: event.type, result });
      return NextResponse.json({ received: true, test: true, notification: result });
    }
    if (notice) {
      await sendNotice(notice);
      if (notice.purchase) await sendPurchaseToMeta({
        eventId: notice.key, eventTime: notice.time, email: notice.email,
        eventSourceUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://eatdaypack.com").replace(/\/$/, ""),
        reservedPack: notice.purchase.pack, quantity: notice.purchase.quantity,
        contentName: notice.metric === "Placed Deposit" ? "Daypack Deposit" : "Daypack Preorder",
        value: notice.amount, fbp: notice.purchase.fbp, fbc: notice.purchase.fbc,
      });
    }
    return NextResponse.json({ received: true });
  } catch {
    // Log only delivery identifiers, never customer data or provider responses.
    console.error("Daypack webhook delivery failed", { eventId: event.id, type: event.type });
    return NextResponse.json({ error: "Event delivery failed; retry required" }, { status: 502 });
  }
}
