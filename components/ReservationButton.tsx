"use client";
import { useState } from "react";
import { getMetaCookies, track } from "@/lib/analytics";

export function ReservationButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function reserve() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/reservation-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ offer: "reservation", ...getMetaCookies() }) });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error("Checkout unavailable");
      const url = new URL(data.url);
      if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com") throw new Error("Invalid checkout destination");
      track("InitiateCheckout", { value: 1, currency: "USD", sku: "reservation" });
      window.location.assign(url.href);
    } catch {
      setError("We could not open checkout. Please try again, or email team@eatdaypack.com.");
      setLoading(false);
    }
  }
  return <div className="dp-reservation-action"><button type="button" className="dp-button dp-reserve-button" onClick={reserve} disabled={loading}>{loading ? "Opening secure checkout…" : "Make a $1 reservation"}<span aria-hidden>↗</span></button>{error && <p role="alert" className="dp-reservation-error">{error}</p>}</div>;
}
