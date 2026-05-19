"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function PurchaseTracker({ sku }: { sku?: string }) {
  useEffect(() => {
    track("Purchase", { value: 1, currency: "USD", sku: sku || "unknown" });
  }, [sku]);
  return null;
}
