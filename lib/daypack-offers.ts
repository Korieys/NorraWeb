export const SHIPPING_CENTS = 999;
export const OFFERS = {
  single: { amount: 5499, quantity: 1, name: "1 Daypack 170", recurring: false },
  core3: { amount: 14999, quantity: 3, name: "Daypack 170 — Core 3", recurring: false },
  "core3-subscription": { amount: 13999, quantity: 3, name: "Daypack 170 — Core 3 Subscription", recurring: true },
} as const;
export type OfferId = keyof typeof OFFERS;

export function offerIdFrom(value: unknown): OfferId | null {
  return typeof value === "string" && Object.hasOwn(OFFERS, value) ? value as OfferId : null;
}

export function orderOffer(metadata: Record<string, string> | null | undefined): OfferId | null {
  if (!metadata || metadata.sku !== "170") return null;
  const id = offerIdFrom(metadata.offer);
  if (!id) return null;
  const offer = OFFERS[id];
  return metadata.kind === (offer.recurring ? "daypack_170_subscription" : "daypack_170_preorder")
    && metadata.pack_quantity === String(offer.quantity) ? id : null;
}
