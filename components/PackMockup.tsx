import { cn } from "@/lib/utils";
import type { Sku } from "@/lib/skus";

type PackMockupProps = {
  sku: Sku;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: {
    wrap: "aspect-[3/4] w-full max-w-[200px]",
    number: "text-[64px]",
    label: "text-[9px]",
    eyebrow: "text-[8px]",
    spec: "text-[8px]",
    padding: "p-4",
    showSpec: false,
  },
  md: {
    wrap: "aspect-[3/4] w-full max-w-[280px]",
    number: "text-[100px]",
    label: "text-[11px]",
    eyebrow: "text-[9px]",
    spec: "text-[9px]",
    padding: "p-5",
    showSpec: true,
  },
  lg: {
    wrap: "aspect-[3/4] w-full max-w-[420px]",
    number: "text-[160px]",
    label: "text-[13px]",
    eyebrow: "text-[10px]",
    spec: "text-[10px]",
    padding: "p-7",
    showSpec: true,
  },
};

// TODO: real packaging hero shot
export function PackMockup({ sku, size = "md", className }: PackMockupProps) {
  const s = sizes[size];
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[2px] text-paper shadow-[0_30px_60px_-25px_rgba(28,28,26,0.45)] ring-1 ring-paper/10",
        sku.color.bg,
        s.wrap,
        className
      )}
      aria-label={`Norra ${sku.protein} protein pack`}
    >
      {/* Heat-seal top edge */}
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-paper/15 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 50% 0%, #fff 0%, transparent 55%), repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 4px)",
        }}
      />

      {/* Inner safety frame */}
      <div
        className={cn(
          "relative flex flex-1 flex-col justify-between border border-paper/15",
          s.padding
        )}
      >
        {/* Top label row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col">
            <span
              className={cn(
                "font-display font-medium uppercase leading-none tracking-wide-lg text-paper",
                s.label
              )}
            >
              NORRA
            </span>
            <span
              className={cn(
                "mt-1 font-sans font-semibold uppercase leading-none tracking-wide-md text-paper/55",
                s.eyebrow
              )}
            >
              NO. {sku.index}
            </span>
          </div>
          {s.showSpec && (
            <span
              className={cn(
                "shrink-0 font-sans font-semibold uppercase leading-none tracking-wide-md text-paper/55",
                s.eyebrow
              )}
            >
              4 MEALS · 1 DAY
            </span>
          )}
        </div>

        {/* Hero number block */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <span
            className={cn(
              "font-display font-medium tabular-nums leading-none text-paper",
              s.number
            )}
          >
            {sku.protein}
          </span>
          <span
            className={cn(
              "mt-2 font-sans font-semibold uppercase tracking-wide-lg text-paper/80",
              s.label
            )}
          >
            G · PROTEIN
          </span>
        </div>

        {/* Bottom stamp */}
        <div className="flex items-end justify-between gap-2 border-t border-paper/20 pt-3">
          <span
            className={cn(
              "font-sans font-semibold uppercase leading-none tracking-wide-md text-paper",
              s.label
            )}
          >
            PROTEIN PACK
          </span>
          {s.showSpec ? (
            <span
              className={cn(
                "shrink-0 font-sans font-semibold uppercase leading-none tracking-wide-md text-paper/55",
                s.spec
              )}
            >
              LOT-{sku.id}
            </span>
          ) : (
            <span
              className={cn(
                "shrink-0 font-sans font-semibold uppercase leading-none tracking-wide-md text-paper/55",
                s.spec
              )}
            >
              {sku.id}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
