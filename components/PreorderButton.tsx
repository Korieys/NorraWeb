"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getMetaCookies, track } from "@/lib/analytics";

export type OfferId = "single" | "core3" | "core3-subscription";

type Props = { offer?: OfferId; className?: string; label?: string; variant?: "primary" | "invertedPaper" | "outlinePaper" | "outlineInk" };

const OFFER_VALUES: Record<OfferId, number> = { single: 54.99, core3: 149.99, "core3-subscription": 139.99 };

export function PreorderButton({ offer = "single", className, label = "PREORDER 1 DAYPACK — $54.99", variant = "primary" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function preorder() {
    setLoading(true);
    setError("");
    track("InitiateCheckout", { sku: "170", offer, value: OFFER_VALUES[offer], currency: "USD" });
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: "170", offer, ...getMetaCookies() }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout is unavailable.");
      window.location.assign(data.url);
    } catch (checkoutError) {
      setLoading(false);
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout is unavailable. Please try again.");
    }
  }

  return (
    <div className={className}>
      <Button type="button" size="lg" variant={variant} onClick={preorder} disabled={loading} className="w-full sm:w-auto">
        {loading ? "OPENING SECURE CHECKOUT..." : label}
      </Button>
      {error ? <p className="mt-3 max-w-md font-sans text-xs leading-5 text-sienna" role="alert">{error}</p> : null}
    </div>
  );
}
