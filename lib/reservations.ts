import type Stripe from "stripe";

// Only this newly verified, fixed-price offer may be sold by reservation checkout.
export const RESERVATION_PRICE_ID = "price_1UbQCOCjycSxVu5e2GmItx78";
export const RESERVATION_PRODUCT_ID = "prod_VcfXjAdKnRrvc6";
export const RESERVATION_OFFER = "daypack_refundable_1usd_2026_11";
export const RESERVATION_AMOUNT = 100;
export const RESERVATION_METADATA = {
  kind: "founder_reservation",
  reservation_offer: RESERVATION_OFFER,
  reservation_price_id: RESERVATION_PRICE_ID,
  reserved_pack: "daypack",
  sku: "reservation",
} as const;

export function isReservationMetadata(metadata: Stripe.Metadata | null | undefined): boolean {
  if (metadata?.kind !== "founder_reservation") return false;
  if (metadata.reservation_offer === RESERVATION_OFFER) {
    return metadata.reservation_price_id === RESERVATION_PRICE_ID && metadata.reserved_pack === "daypack" && metadata.sku === "reservation";
  }
  // Recognize existing paid reservations without changing their historical offer.
  return !metadata.reservation_offer && ["140", "170", "200", "230"].includes(metadata.reserved_pack || "") && metadata.sku === metadata.reserved_pack;
}

export function reservationSessionState(session: Stripe.Checkout.Session): "paid" | "pending" | null {
  if (session.mode !== "payment" || session.status !== "complete" || session.amount_total !== RESERVATION_AMOUNT || session.currency !== "usd" || !isReservationMetadata(session.metadata)) return null;
  if (session.payment_status === "paid") return "paid";
  return session.payment_status === "unpaid" ? "pending" : null;
}

export function isPaidReservationIntent(intent: Stripe.PaymentIntent): boolean {
  return intent.status === "succeeded" && intent.amount_received === RESERVATION_AMOUNT && intent.currency === "usd" && isReservationMetadata(intent.metadata);
}
