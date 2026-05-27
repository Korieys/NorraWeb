import Image from "next/image";
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
    label: "text-[8px]",
    eyebrow: "text-[7px]",
    showSpec: false,
    bracket: "h-3 w-3 border-[1.5px]",
    pad: "p-3",
    sizes: "200px",
  },
  md: {
    wrap: "aspect-[3/4] w-full max-w-[300px]",
    label: "text-[10px]",
    eyebrow: "text-[9px]",
    showSpec: true,
    bracket: "h-4 w-4 border-[1.5px]",
    pad: "p-4",
    sizes: "300px",
  },
  lg: {
    wrap: "aspect-[3/4] w-full max-w-[460px]",
    label: "text-[12px]",
    eyebrow: "text-[10px]",
    showSpec: true,
    bracket: "h-6 w-6 border-2",
    pad: "p-6",
    sizes: "(min-width: 1024px) 460px, 80vw",
  },
};

export function PackMockup({ sku, size = "md", className }: PackMockupProps) {
  const s = sizes[size];
  return (
    <figure
      className={cn(
        "group relative flex flex-col text-paper",
        s.wrap,
        className
      )}
      aria-label={`Daypack ${sku.protein} gram protein pack, ${sku.color.name}`}
    >
      {/* Photo plate */}
      <div
        className={cn(
          "relative flex-1 overflow-hidden rounded-[2px] shadow-[0_30px_60px_-25px_rgba(28,28,26,0.5)] ring-1 ring-ink/10",
          sku.color.bg
        )}
      >
        <Image
          src={sku.image.src}
          alt={sku.image.alt}
          fill
          sizes={s.sizes}
          className="object-cover object-center transition-transform ease-out group-hover:scale-[1.03]"
          style={{ transitionDuration: "1200ms" }}
        />

        {/* Editorial overlay: corner brackets, spec rails */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 flex flex-col justify-between",
            s.pad
          )}
        >
          {/* Corner brackets */}
          <Corner pos="tl" size={s.bracket} />
          <Corner pos="tr" size={s.bracket} />
          <Corner pos="bl" size={s.bracket} />
          <Corner pos="br" size={s.bracket} />

          {/* Top rail */}
          <div className="flex items-start justify-between gap-2">
            <span
              className={cn(
                "rounded-[1px] bg-ink/55 px-1.5 py-0.5 font-sans font-semibold uppercase leading-none tracking-wide-md text-paper backdrop-blur-[2px]",
                s.eyebrow
              )}
            >
              NO. {sku.index}
            </span>
            {s.showSpec && (
              <span
                className={cn(
                  "rounded-[1px] bg-ink/55 px-1.5 py-0.5 font-sans font-semibold uppercase leading-none tracking-wide-md text-paper backdrop-blur-[2px]",
                  s.eyebrow
                )}
              >
                4 MEALS · 1 DAY
              </span>
            )}
          </div>

          {/* Bottom rail */}
          <div className="flex items-end justify-between gap-2">
            <span
              className={cn(
                "rounded-[1px] bg-ink/55 px-1.5 py-0.5 font-sans font-semibold uppercase leading-none tracking-wide-md text-paper backdrop-blur-[2px]",
                s.eyebrow
              )}
            >
              LOT-{sku.id}
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}

function Corner({
  pos,
  size,
}: {
  pos: "tl" | "tr" | "bl" | "br";
  size: string;
}) {
  const map = {
    tl: "left-2 top-2 border-l border-t",
    tr: "right-2 top-2 border-r border-t",
    bl: "left-2 bottom-2 border-l border-b",
    br: "right-2 bottom-2 border-r border-b",
  } as const;
  return (
    <span
      aria-hidden
      className={cn(
        "absolute border-paper/80 mix-blend-screen",
        size,
        map[pos]
      )}
    />
  );
}
