"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PackMockup } from "@/components/PackMockup";
import { SKUS, type SkuId } from "@/lib/skus";
import { track } from "@/lib/analytics";

type Props = {
  skuId: SkuId;
};

export function SKUSection({ skuId }: Props) {
  const sku = SKUS[skuId];
  const [loading, setLoading] = useState(false);

  async function reserve() {
    setLoading(true);
    track("InitiateCheckout", { sku: sku.id, value: 1, currency: "USD" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: sku.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Checkout failed");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Checkout temporarily unavailable. Try again shortly.");
    }
  }

  return (
    <section
      id={`sku-${sku.id}`}
      className={`relative overflow-hidden ${sku.color.bg} text-paper`}
      aria-labelledby={`sku-${sku.id}-heading`}
    >
      {/* Faint diagonal texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 16px)",
        }}
      />

      {/* Section index marker */}
      <div className="relative border-b border-paper/15">
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5 lg:px-10">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-paper/60">
            PROTEIN PACK NO. {sku.index} / 03
          </span>
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-paper/60">
            {sku.color.name.toUpperCase()} · {sku.color.hex}
          </span>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-content grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-28">
        <div className="lg:col-span-7">
          <h2
            id={`sku-${sku.id}-heading`}
            className="font-display font-medium leading-[0.86] tracking-wide-sm text-paper"
            style={{ fontSize: "clamp(120px, 18vw, 240px)" }}
          >
            {sku.protein}
          </h2>
          <p className="mt-2 font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-paper/80">
            GRAMS OF PROTEIN · 4 MEALS · 1 DAY
          </p>
          <p className="mt-8 max-w-[520px] font-sans text-[18px] leading-[1.5] text-paper/85">
            <span className="font-display uppercase tracking-wide-sm">
              {sku.title}
            </span>{" "}
            {sku.description}
          </p>

          <ul className="mt-12 divide-y divide-paper/15 border-y border-paper/15">
            {sku.meals.map((meal) => (
              <li
                key={meal.slot}
                className="flex items-center justify-between gap-6 py-5"
              >
                <div className="min-w-0">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-paper/60">
                    {meal.slot}
                  </p>
                  <p className="mt-1 truncate font-sans text-[15px] text-paper/90">
                    {meal.name}
                  </p>
                </div>
                <span className="font-display text-[28px] tabular-nums text-paper sm:text-[36px]">
                  {meal.protein}
                  <span className="text-[16px] text-paper/60 sm:text-[18px]">
                    g
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-paper/55">
                FOUNDER PRICING
              </p>
              <p className="mt-1 font-display text-[32px] font-medium leading-none tracking-wide-sm text-paper">
                ${sku.pricePerDay}
                <span className="ml-2 font-sans text-[12px] font-semibold uppercase tracking-wide-md text-paper/55">
                  / DAY
                </span>
              </p>
              <p className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-wide-md text-paper/55">
                ${sku.pricePerWeek} / WEEK
              </p>
            </div>
            <Button
              variant="outlinePaper"
              size="lg"
              onClick={reserve}
              disabled={loading}
            >
              {loading ? "REDIRECTING..." : `RESERVE THE ${sku.id} →`}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center lg:col-span-5 lg:justify-end">
          <PackMockup sku={sku} size="lg" />
        </div>
      </div>
    </section>
  );
}
