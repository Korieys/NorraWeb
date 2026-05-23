"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { EmailDialog } from "@/components/EmailDialog";
import { SKU_ORDER, SKUS } from "@/lib/skus";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      {/* Faint paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(28,28,26,1) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* DESKTOP: full-bleed image with overlaid text in the natural left negative space */}
      <div className="relative hidden lg:block">
        {/* Image canvas */}
        <div className="relative h-[760px] w-full xl:h-[820px]">
          <Image
            src="/DaypackHero.png"
            alt="Daypack 200g daily meal kit pouch with a bowl of chicken, grains, and vegetables. 170g and 230g pouches and a water bottle in the background."
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Soft gradient on the left so text always reads, regardless of crop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(244,240,232,0.92) 0%, rgba(244,240,232,0.78) 28%, rgba(244,240,232,0.0) 55%)",
            }}
          />

          {/* Disclaimer floats bottom-right of the image */}
          <p className="absolute bottom-5 right-6 max-w-[260px] text-right font-sans text-[10px] leading-[1.5] text-ink/55 lg:right-10">
            Prototype photography. Final flavors, ingredients &amp; packaging
            may change before launch.
          </p>

          {/* Overlay copy */}
          <div className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-content items-center px-6 lg:px-10">
              <div className="max-w-[620px]">
                <p className="font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-ink/55">
                  PRE-LAUNCH · DAILY PROTEIN, SORTED
                </p>
                <h1 className="mt-6 font-display font-medium uppercase leading-[0.92] tracking-wide-sm text-ink"
                    style={{ fontSize: "clamp(64px, 8.4vw, 112px)" }}>
                  PICK YOUR
                  <br />
                  PROTEIN
                  <br />
                  TARGET.
                </h1>
                <p className="mt-7 max-w-[480px] font-sans text-[18px] leading-[1.5] text-ink/80 lg:text-[20px]">
                  Five daily packs sized by grams of protein. From 110 to 230.
                  Shelf stable. Microwave ready. No tracking.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Button asChild size="lg">
                    <a href="/find-your-pack">FIND YOUR PACK</a>
                  </Button>
                  <EmailDialog
                    trigger={
                      <button
                        type="button"
                        className="inline-flex items-center rounded-[4px] border border-ink/15 bg-paper px-4 py-2.5 font-sans text-[14px] font-medium text-ink underline underline-offset-4 shadow-sm transition-colors hover:bg-paper/85"
                      >
                        Or just get notified →
                      </button>
                    }
                  />
                </div>
                <p className="mt-7 font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/45">
                  REFUNDABLE ANY TIME · $20 OFF AT LAUNCH · FIRST RUN Q3 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET: text first, image full-width below */}
      <div className="relative lg:hidden">
        <div className="mx-auto max-w-content px-6 pb-10 pt-14 sm:px-8">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-ink/55">
            PRE-LAUNCH · DAILY PROTEIN, SORTED
          </p>
          <h1 className="mt-6 font-display text-[52px] font-medium uppercase leading-[0.95] tracking-wide-sm text-ink sm:text-[68px]">
            PICK YOUR
            <br />
            PROTEIN
            <br />
            TARGET.
          </h1>
          <p className="mt-7 max-w-[560px] font-sans text-[17px] leading-[1.5] text-ink/80">
            Five daily packs sized by grams of protein. From 110 to 230. Shelf
            stable. Microwave ready. No tracking.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button asChild size="lg">
              <a href="/find-your-pack">FIND YOUR PACK</a>
            </Button>
            <EmailDialog
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center rounded-[4px] border border-ink/15 bg-paper px-4 py-2.5 font-sans text-[14px] font-medium text-ink underline underline-offset-4 shadow-sm transition-colors hover:bg-paper/85"
                >
                  Or just get notified →
                </button>
              }
            />
          </div>
          <p className="mt-7 font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/45">
            REFUNDABLE ANY TIME · $20 OFF AT LAUNCH · FIRST RUN Q3 2026
          </p>
        </div>

        <figure className="relative mt-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
            <Image
              src="/DaypackHero.png"
              alt="Daypack 200g daily meal kit pouch with a bowl of chicken, grains, and vegetables."
              fill
              sizes="100vw"
              className="object-cover object-[65%_center]"
            />
          </div>
          <p className="px-6 pb-6 pt-3 font-sans text-[10px] leading-[1.5] text-ink/50 sm:px-8">
            Prototype photography. Final flavors, ingredients &amp; packaging
            may change before launch.
          </p>
        </figure>
      </div>

      <SkuIndexStrip />
    </section>
  );
}

function SkuIndexStrip() {
  return (
    <div className="relative border-y border-ink/15 bg-paper">
      <div className="mx-auto grid max-w-content grid-cols-5 px-3 sm:px-6 lg:px-10">
        {SKU_ORDER.map((id) => {
          const sku = SKUS[id];
          return (
            <a
              key={id}
              href={`#sku-${id}`}
              className="group flex items-center justify-center gap-1.5 border-r border-ink/15 py-4 text-center font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-ink/65 transition-colors last:border-r-0 hover:text-ink sm:gap-3 sm:text-[11px]"
            >
              <span className="font-display tabular-nums">{sku.index}</span>
              <span className="hidden sm:inline">·</span>
              <span className="font-display tabular-nums">{sku.protein}</span>
              <span className="hidden lg:inline">·</span>
              <span className="hidden lg:inline">{sku.color.name.toUpperCase()}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
