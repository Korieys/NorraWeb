"use client";

import { Button } from "@/components/ui/Button";
import { EmailDialog } from "@/components/EmailDialog";
import { PackMockup } from "@/components/PackMockup";
import { SKUS } from "@/lib/skus";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      {/* Faint paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(28,28,26,1) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative mx-auto grid max-w-content grid-cols-1 gap-12 px-6 pb-24 pt-14 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:pb-36 lg:pt-24">
        <div className="lg:col-span-7 lg:pt-4">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-ink/55">
            PRE-LAUNCH · COMPLETE DAILY NUTRITION
          </p>
          <h1 className="mt-6 font-display text-[48px] font-medium uppercase leading-[0.95] tracking-wide-sm text-ink sm:text-[64px] lg:text-[84px]">
            HIT YOUR
            <br />
            NUMBER.
            <br />
            FUEL YOUR DAY.
          </h1>
          <p className="mt-4 font-display text-[18px] uppercase leading-[1.3] tracking-wide-sm text-tan sm:text-[24px]">
            FACTOR MAKES YOU PICK MEALS. HUEL ASKS YOU TO DRINK THEM.{" "}
            DAYPACK JUST SELLS YOU A NUMBER.
          </p>
          <p className="mt-4 max-w-[560px] font-sans text-[18px] leading-[1.5] text-ink/80 lg:text-[20px]">
            Daily meal packs engineered around your protein target. Shelf
            stable. Microwave ready. No tracking.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button asChild size="lg">
              <a href="#sku-170">RESERVE YOUR PACK — $1</a>
            </Button>
            <EmailDialog
              trigger={
                <button
                  type="button"
                  className="font-sans text-[14px] font-medium text-ink underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Or just get notified →
                </button>
              }
            />
          </div>
          <p className="mt-8 font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/45">
            REFUNDABLE ANY TIME · $20 OFF AT LAUNCH · FIRST RUN Q3 2026
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto h-[520px] w-full max-w-[520px] lg:h-[600px] lg:max-w-[560px]">
            {/* Back-left peeking */}
            <div className="absolute bottom-0 left-0 z-10 -rotate-[8deg] origin-bottom-left">
              <PackMockup sku={SKUS["170"]} size="sm" />
            </div>
            {/* Back-right peeking */}
            <div className="absolute bottom-0 right-0 z-10 rotate-[8deg] origin-bottom-right">
              <PackMockup sku={SKUS["230"]} size="sm" />
            </div>
            {/* Hero — middle (slightly smaller than lg to let peeks breathe) */}
            <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
              <PackMockup sku={SKUS["200"]} size="md" className="max-w-[260px] sm:max-w-[300px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Section index strip */}
      <SkuIndexStrip />
    </section>
  );
}

function SkuIndexStrip() {
  const items = [
    { id: "170", num: "01", protein: "170", color: "SLATE", href: "#sku-170" },
    { id: "200", num: "02", protein: "200", color: "OLIVE", href: "#sku-200" },
    { id: "230", num: "03", protein: "230", color: "SIENNA", href: "#sku-230" },
  ];
  return (
    <div className="relative border-y border-ink/15 bg-paper">
      <div className="mx-auto grid max-w-content grid-cols-3 px-3 sm:px-6 lg:px-10">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="group flex items-center justify-center gap-1.5 border-r border-ink/15 py-4 text-center font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-ink/65 transition-colors last:border-r-0 hover:text-ink sm:gap-3 sm:text-[11px]"
          >
            <span className="font-display tabular-nums">{item.num}</span>
            <span className="hidden sm:inline">·</span>
            <span className="font-display tabular-nums">{item.protein}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{item.color}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
