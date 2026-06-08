"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/Reveal";
import { track, getMetaCookies } from "@/lib/analytics";
import type { SkuId } from "@/lib/skus";

/*
  ============================================================================
  TODO — VERIFY EVERY NUMBER BEFORE LAUNCH (all placeholders)
  ============================================================================
  Everything in CONFIG below is a placeholder except the 170 g Daypack price
  ($24.99), which is real today. Confirm each value against real retail SKUs
  and real Daypack pricing before launch.

  Verify:
    - UNIT_REFERENCE: every grams + price (6 products).
    - SKU_CONFIG: each Daypack price (110/140/200/230 are NOT final), and each
      build-it-yourself basket composition (the per-item quantities).
    - The six Daypack modules and the implied per-module gram split are not
      finalized. We deliberately do not print a per-module gram breakdown.

  PRICING NOTE — why "Daypack saves $X" is conditional:
    The dollar gap is thin at 110 and 140 (Daypack may be within a dollar or
    two of the basket, or even level). At those tiers the FRICTION tags (item
    count, product count, overshoot grams) and the "hits {grams} exactly"
    benefit carry the argument. The price win only reliably shows up at 170
    and up. So the punchline appends "Daypack saves $X" ONLY when Daypack is
    actually cheaper than the basket. Never show Daypack as the pricier option.

  ASSET / FONT NOTES:
    - Serif (Fraunces) and mono (IBM Plex Mono) are STAND-INS loaded in
      app/layout.tsx. Swap Fraunces for the real brand serif once available.
    - The topographic contour pattern and mountain mark are inline SVG
      stand-ins. Replace with a brand topo asset if one is added to the repo.
  ============================================================================
*/

type UnitKey = "bar" | "stick" | "shake" | "oats" | "tuna" | "nuts";

type Unit = { name: string; grams: number; price: number };

// Unit reference. Display order = data-sheet order. (placeholders)
const UNIT_REFERENCE: Record<UnitKey, Unit> = {
  bar: { name: "protein bar", grams: 12, price: 1.9 },
  stick: { name: "meat stick", grams: 11, price: 2.5 },
  shake: { name: "protein shake", grams: 30, price: 3.25 },
  oats: { name: "protein oats cup", grams: 11, price: 2.99 },
  tuna: { name: "tuna pouch", grams: 17, price: 2.79 },
  nuts: { name: "mixed nuts", grams: 8, price: 2.49 },
};

const UNIT_ORDER: UnitKey[] = ["bar", "stick", "shake", "oats", "tuna", "nuts"];

type SkuConfig = {
  grams: number;
  daypackPrice: number; // placeholder except 170
  basket: Partial<Record<UnitKey, number>>;
};

// Per-SKU Daypack price + build-it-yourself basket quantities. (placeholders)
// Basket grams + cost are COMPUTED from UNIT_REFERENCE so they stay
// self-consistent when these quantities are edited.
const SKU_CONFIG: Record<SkuId, SkuConfig> = {
  "110": {
    grams: 110,
    daypackPrice: 18.99,
    basket: { shake: 1, bar: 2, stick: 2, tuna: 1, oats: 1, nuts: 1 },
  },
  "140": {
    grams: 140,
    daypackPrice: 21.99,
    basket: { shake: 2, bar: 2, stick: 2, tuna: 1, oats: 1, nuts: 1 },
  },
  "170": {
    grams: 170,
    daypackPrice: 24.99, // real today
    basket: { shake: 2, bar: 2, stick: 3, tuna: 2, oats: 1, nuts: 1 },
  },
  "200": {
    grams: 200,
    daypackPrice: 28.99,
    basket: { shake: 2, bar: 4, stick: 4, tuna: 2, oats: 1, nuts: 1 },
  },
  "230": {
    grams: 230,
    daypackPrice: 32.99,
    basket: { shake: 3, bar: 4, stick: 4, tuna: 2, oats: 1, nuts: 1 },
  },
};

const SKU_ORDER: SkuId[] = ["110", "140", "170", "200", "230"];

// Daypack's six modules, same every SKU. (placeholder copy)
const DAYPACK_MODULES = [
  "High-protein oats sachet",
  "Hot entree",
  "Hot entree",
  "Protein bar",
  "Meat stick",
  "Recovery stick-pack",
];

/*
  Per-SKU accent. The selected pack's identity color (from lib/skus.ts +
  tailwind.config.ts) drives the whole accented Daypack side, the active
  segment, and the CTA, so the right column reads as "this pack." Foreground
  is chosen for contrast on each color: linen is light, so it carries ink
  text; the darker tones (olive, pine, oak, granite) carry paper text.
  Class strings are written as literals so Tailwind's JIT keeps them.
*/
type Accent = {
  seg: string; // active segment: background + foreground
  border: string; // Daypack card border color
  badge: string; // badge: background + foreground (also tints the mountain mark)
  hero: string; // hero grams number color
  chip: string; // benefit chip: background + foreground
  check: string; // module checkmark color
  cta: string; // reserve button: background + foreground + hover
};

const ACCENT: Record<SkuId, Accent> = {
  "110": {
    seg: "bg-linen text-ink",
    border: "border-linen",
    badge: "bg-linen text-ink",
    hero: "text-oak", // linen is too light for a legible numeral on cream; use its darker oak sibling
    chip: "bg-linen text-ink",
    check: "text-oak",
    cta: "bg-linen text-ink hover:bg-linen/90",
  },
  "140": {
    seg: "bg-olive text-paper",
    border: "border-olive",
    badge: "bg-olive text-paper",
    hero: "text-olive",
    chip: "bg-olive text-paper",
    check: "text-olive",
    cta: "bg-olive text-paper hover:bg-olive/90",
  },
  "170": {
    seg: "bg-pine text-paper",
    border: "border-pine",
    badge: "bg-pine text-paper",
    hero: "text-pine",
    chip: "bg-pine text-paper",
    check: "text-pine",
    cta: "bg-pine text-paper hover:bg-pine/90",
  },
  "200": {
    seg: "bg-oak text-paper",
    border: "border-oak",
    badge: "bg-oak text-paper",
    hero: "text-oak",
    chip: "bg-oak text-paper",
    check: "text-oak",
    cta: "bg-oak text-paper hover:bg-oak/90",
  },
  "230": {
    seg: "bg-granite text-paper",
    border: "border-granite",
    badge: "bg-granite text-paper",
    hero: "text-granite",
    chip: "bg-granite text-paper",
    check: "text-granite",
    cta: "bg-granite text-paper hover:bg-granite/90",
  },
};

const money = (n: number) => `$${n.toFixed(2)}`;

function computeBasket(sku: SkuId) {
  const cfg = SKU_CONFIG[sku];
  const rows = UNIT_ORDER.filter((k) => (cfg.basket[k] ?? 0) > 0).map((k) => {
    const qty = cfg.basket[k] as number;
    const unit = UNIT_REFERENCE[k];
    return {
      key: k,
      name: unit.name,
      qty,
      grams: unit.grams * qty,
      price: unit.price * qty,
    };
  });
  const itemCount = rows.reduce((sum, r) => sum + r.qty, 0);
  const productCount = rows.length;
  const basketGrams = rows.reduce((sum, r) => sum + r.grams, 0);
  const basketCost = rows.reduce((sum, r) => sum + r.price, 0);
  const overshoot = basketGrams - cfg.grams;
  const savings = basketCost - cfg.daypackPrice; // > 0 means Daypack is cheaper
  return {
    rows,
    itemCount,
    productCount,
    basketGrams,
    basketCost,
    overshoot,
    savings,
    targetGrams: cfg.grams,
    daypackPrice: cfg.daypackPrice,
  };
}

export function BuildItYourself() {
  const [sku, setSku] = useState<SkuId>("170");
  const [loading, setLoading] = useState(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const data = useMemo(() => computeBasket(sku), [sku]);
  const accent = ACCENT[sku];

  // Reuses the exact $1 deposit flow from ConversionBlock, passing the
  // selected SKU. No new checkout path.
  async function reserve() {
    setLoading(true);
    track("InitiateCheckout", { sku, value: 1, currency: "USD" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, ...getMetaCookies() }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        throw new Error(json.error || "Checkout failed");
      }
    } catch (err) {
      setLoading(false);
      alert("Checkout temporarily unavailable. Try again shortly.");
    }
  }

  // Roving-tabindex keyboard support for the radiogroup.
  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % SKU_ORDER.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (index - 1 + SKU_ORDER.length) % SKU_ORDER.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = SKU_ORDER.length - 1;
    else return;
    e.preventDefault();
    const nextSku = SKU_ORDER[next];
    setSku(nextSku);
    tabRefs.current[nextSku]?.focus();
  }

  return (
    <section
      id="the-math"
      aria-label="The math: build it yourself versus the matching Daypack pack"
      className="relative overflow-hidden border-t border-ink/10 bg-paper py-24 lg:py-32"
    >
      {/* Decorative topographic contour pattern behind the whole section. */}
      <TopoPattern />

      <div className="relative mx-auto max-w-content px-6 lg:px-10">
        <Reveal
          as="p"
          className="text-center font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-rust"
        >
          THE MATH
        </Reveal>
        <Reveal
          as="h2"
          delayMs={100}
          className="mx-auto mt-6 max-w-[900px] text-center font-serif text-[34px] font-medium leading-[1.08] text-ink sm:text-[44px] lg:text-[56px]"
        >
          Hitting your number the hard way
        </Reveal>
        <Reveal
          as="p"
          delayMs={200}
          className="mx-auto mt-6 max-w-[620px] text-center font-sans text-[16px] leading-[1.55] text-ink/70 lg:text-[18px]"
        >
          Same protein. More money. More decisions. We did the math so you do
          not have to.
        </Reveal>

        {/* Segmented control — real radiogroup with keyboard support. */}
        <Reveal delayMs={260} className="mt-10 flex justify-center">
          <div
            role="radiogroup"
            aria-label="Choose your daily protein target in grams"
            className="inline-flex flex-wrap justify-center gap-1 rounded-[4px] border border-ink/[0.12] p-1"
          >
            {SKU_ORDER.map((s, i) => {
              const active = s === sku;
              return (
                <button
                  key={s}
                  ref={(el) => {
                    tabRefs.current[s] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSku(s)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`h-11 px-4 font-sans text-[13px] font-semibold uppercase tracking-wide-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 sm:px-6 ${
                    active ? ACCENT[s].seg : "text-ink hover:bg-ink/5"
                  }`}
                >
                  {s}
                  <span className="sr-only"> grams</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Two cards. Mobile order = build-it-yourself first (tedium), then
            Daypack (relief). Desktop = side by side. */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {/* LEFT — Build it yourself: flat, low-contrast, dense data wall. */}
          <div className="order-1 flex flex-col border border-ink/[0.12] bg-paper p-7 lg:p-9">
            <div>
              <h3 className="font-sans text-[15px] font-semibold uppercase tracking-wide-md text-olive">
                Build it yourself
              </h3>
              <p className="mt-1 font-sans text-[13px] leading-[1.5] text-olive/80">
                a no-prep, shelf-stable day
              </p>
            </div>

            {/* Friction tags, data driven */}
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Friction">
              <li className="border border-olive/30 px-2.5 py-1 font-mono text-[12px] text-olive">
                {data.itemCount} items
              </li>
              <li className="border border-olive/30 px-2.5 py-1 font-mono text-[12px] text-olive">
                {data.productCount} products
              </li>
              {data.overshoot > 0 && (
                <li className="border border-olive/30 px-2.5 py-1 font-mono text-[12px] text-olive">
                  {data.overshoot} g you did not ask for
                </li>
              )}
            </ul>

            {/* Data sheet */}
            <table className="mt-7 w-full border-collapse font-mono text-[13px] text-ink/75">
              <thead>
                <tr className="border-b border-ink/[0.12] text-left text-[11px] uppercase tracking-wide-sm text-olive/70">
                  <th scope="col" className="py-2 pr-2 font-medium">
                    Item
                  </th>
                  <th scope="col" className="py-2 px-2 text-right font-medium">
                    Protein
                  </th>
                  <th scope="col" className="py-2 pl-2 text-right font-medium">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.key} className="border-b border-ink/[0.08]">
                    <th
                      scope="row"
                      className="py-2.5 pr-2 text-left font-normal text-ink/80"
                    >
                      {row.name} x{row.qty}
                    </th>
                    <td className="py-2.5 px-2 text-right tabular-nums">
                      {row.grams} g
                    </td>
                    <td className="py-2.5 pl-2 text-right tabular-nums">
                      {money(row.price)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-ink/20 font-semibold text-ink">
                  <th scope="row" className="py-3 pr-2 text-left uppercase tracking-wide-sm">
                    Total
                  </th>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {data.basketGrams} g
                  </td>
                  <td className="py-3 pl-2 text-right tabular-nums">
                    {money(data.basketCost)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* RIGHT — Daypack: the only accented element. */}
          <div
            className={`relative order-2 flex flex-col border-2 bg-paper p-7 transition-colors lg:p-9 ${accent.border}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-sans text-[15px] font-semibold uppercase tracking-wide-md text-ink">
                  Daypack {data.targetGrams} pack
                </h3>
                <p className="mt-1 font-sans text-[13px] leading-[1.5] text-ink/60">
                  one box, one day
                </p>
              </div>
              {/* Badge — the only place the mountain mark appears. */}
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-wide-md transition-colors ${accent.badge}`}
              >
                <MountainMark />
                hits your number
              </span>
            </div>

            {/* Hero number — subtle transition between SKUs via key remount. */}
            <div className="mt-7 flex items-baseline gap-3">
              <span
                key={data.targetGrams}
                className={`animate-fade-in font-serif text-[72px] font-medium leading-none lg:text-[88px] ${accent.hero}`}
              >
                {data.targetGrams}
              </span>
              <span className="font-mono text-[13px] text-ink/60">
                g protein
                <br />
                {money(data.daypackPrice)} / day
              </span>
            </div>

            {/* Six modules as a checked list */}
            <ul className="mt-7 space-y-2.5" aria-label="Six modules in the Daypack pack">
              {DAYPACK_MODULES.map((module, i) => (
                <li
                  key={`${module}-${i}`}
                  className="flex items-center gap-3 font-sans text-[15px] text-ink/80"
                >
                  <CheckMark className={accent.check} />
                  {module}
                </li>
              ))}
            </ul>

            {/* Benefit tags */}
            <ul className="mt-7 flex flex-wrap gap-2" aria-label="Benefits">
              {["one decision", "no prep", `hits ${data.targetGrams} exactly`].map(
                (tag) => (
                  <li
                    key={tag}
                    className={`px-2.5 py-1 font-mono text-[12px] transition-colors ${accent.chip}`}
                  >
                    {tag}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Screen-reader announcement of the changing totals. */}
        <p aria-live="polite" className="sr-only">
          {data.targetGrams} grams selected. Build it yourself: {data.itemCount}{" "}
          items from {data.productCount} products, {data.basketGrams} grams,{" "}
          {money(data.basketCost)}. Daypack {data.targetGrams} pack:{" "}
          {money(data.daypackPrice)}.
          {data.savings > 0 ? ` Daypack saves ${money(data.savings)}.` : ""}
        </p>

        {/* Punchline + CTA row */}
        <div className="mt-14 flex flex-col items-start gap-7 border-t border-ink/[0.12] pt-10 lg:mt-16 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <p className="max-w-[640px] font-serif text-[22px] leading-[1.3] text-ink lg:text-[26px]">
            {data.targetGrams} grams. One box instead of {data.itemCount} items.
            {data.savings > 0 ? ` Daypack saves ${money(data.savings)}.` : ""}
          </p>
          <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
            <Button
              onClick={reserve}
              disabled={loading}
              size="lg"
              className={accent.cta}
            >
              {loading ? "REDIRECTING..." : "RESERVE YOUR SPOT FOR $1"}
            </Button>
            <span className="font-sans text-[11px] font-semibold uppercase tracking-wide-md text-ink/50">
              SECURE CHECKOUT VIA STRIPE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Decorative topographic contour pattern. aria-hidden, no layout shift.
   TODO: replace with a brand topo asset if one is added to the repo. */
function TopoPattern() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 600"
      fill="none"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          d={`M0 ${60 + i * 60} C 160 ${20 + i * 60}, 320 ${110 + i * 60}, 480 ${
            50 + i * 60
          } S 720 ${110 + i * 60}, 800 ${60 + i * 60}`}
          stroke="#1C1C1A"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

/* Small mountain mark — appears only inside the Daypack badge. */
function MountainMark() {
  return (
    <svg
      aria-hidden
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0"
    >
      <path d="M1 10.5 L4.5 3.5 L6.5 7 L8 4.5 L11 10.5 Z" fill="currentColor" />
    </svg>
  );
}

/* Check mark for the Daypack module list. Inherits accent color via className. */
function CheckMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M2 7.5 L5.5 11 L12 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
