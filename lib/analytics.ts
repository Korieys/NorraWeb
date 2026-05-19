"use client";

type EventName = "Lead" | "InitiateCheckout" | "Purchase" | "ViewContent";

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

let viewContentFired = false;
export function fireViewContentOnce() {
  if (viewContentFired) return;
  viewContentFired = true;
  track("ViewContent");
}
