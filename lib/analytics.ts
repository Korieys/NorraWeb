"use client";

// Purchase is intentionally excluded: it is a server-side-only event fired from
// the Stripe webhook via the Conversions API (see lib/meta.ts). Never fire it
// client-side or it will double-count deposits.
type EventName =
  | "Lead"
  | "InitiateCheckout"
  | "ViewContent"
  | "FindYourPack";

type EventPayload = {
  value?: number;
  currency?: string;
  sku?: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: EventName, payload: EventPayload = {}) {
  if (typeof window === "undefined") return;

  try {
    if (window.fbq) {
      window.fbq("track", event, payload);
    }
  } catch (err) {
    console.warn("Meta Pixel event failed", err);
  }

  try {
    if (window.gtag) {
      window.gtag("event", event, {
        ...payload,
        send_to: process.env.NEXT_PUBLIC_GA_ID,
      });
    }
  } catch (err) {
    console.warn("GA4 event failed", err);
  }
}

/**
 * Reads the Meta browser cookies (_fbp / _fbc) so they can be forwarded to the
 * server and included in the Conversions API Purchase event for better match
 * quality. Returns only the keys that are present.
 */
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const read = (name: string) => {
    const match = document.cookie.match(
      new RegExp("(?:^|; )" + name + "=([^;]*)")
    );
    return match ? decodeURIComponent(match[1]) : undefined;
  };
  const fbp = read("_fbp");
  const fbc = read("_fbc");
  return { ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}) };
}

let viewContentFired = false;
export function fireViewContentOnce() {
  if (viewContentFired) return;
  viewContentFired = true;
  track("ViewContent");
}
