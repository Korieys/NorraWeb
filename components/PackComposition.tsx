import Image from "next/image";

type Ingredient = {
  name: string;
  protein: number;
  accent: "text-slate" | "text-olive" | "text-sienna";
  // TODO: real photography
  image: string;
  alt: string;
};

const INGREDIENTS: Ingredient[] = [
  {
    name: "CHICKEN POUCH",
    protein: 35,
    accent: "text-slate",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    alt: "Overhead chicken bowl on neutral ceramic",
  },
  {
    name: "BEEF POUCH",
    protein: 38,
    accent: "text-olive",
    image:
      "https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=800&q=80",
    alt: "Overhead beef bowl on neutral ceramic",
  },
  {
    name: "PLANT POUCH",
    protein: 30,
    accent: "text-sienna",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    alt: "Overhead plant bowl on neutral ceramic",
  },
  {
    name: "JASMINE RICE",
    protein: 5,
    accent: "text-slate",
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80",
    alt: "Overhead jasmine rice on neutral ceramic",
  },
  {
    name: "ANCIENT GRAINS",
    protein: 8,
    accent: "text-olive",
    image:
      "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80",
    alt: "Overhead grain bowl on neutral ceramic",
  },
  {
    name: "TOMATO SAUCE",
    protein: 2,
    accent: "text-sienna",
    image:
      "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80",
    alt: "Overhead tomato sauce on neutral ceramic",
  },
  {
    name: "PROTEIN OATS",
    protein: 25,
    accent: "text-slate",
    image:
      "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=800&q=80",
    alt: "Overhead protein oats bowl on neutral ceramic",
  },
  {
    name: "BEEF JERKY",
    protein: 12,
    accent: "text-olive",
    image:
      "https://images.unsplash.com/photo-1599639957043-f3aa5c986398?auto=format&fit=crop&w=800&q=80",
    alt: "Overhead jerky on neutral ceramic",
  },
];

export function PackComposition() {
  return (
    <section className="border-t border-ink/10 bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6 lg:px-10">
        <p className="text-center font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan">
          WHAT&apos;S IN THE BOX
        </p>
        <h2 className="mx-auto mt-6 max-w-[900px] text-center font-display text-[32px] font-medium uppercase leading-[1.05] tracking-wide-sm text-ink sm:text-[40px] lg:text-[48px]">
          REAL INGREDIENTS. VERIFIED NUMBERS.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[2px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {INGREDIENTS.map((ing, i) => (
            <article
              key={ing.name}
              className="group flex flex-col bg-paper transition-colors hover:bg-tan/15"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-tan/20">
                {/* TODO: real photography */}
                <Image
                  src={ing.image}
                  alt={ing.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-3 top-3 font-sans text-[9px] font-semibold uppercase tracking-wide-lg text-paper drop-shadow">
                  {String(i + 1).padStart(2, "0")} / 08
                </span>
              </div>
              <div className="flex flex-col gap-2 p-5 lg:p-6">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink">
                  {ing.name}
                </p>
                <p
                  className={`font-display text-[42px] font-medium tabular-nums leading-none ${ing.accent}`}
                >
                  {ing.protein}
                  <span className="text-[18px] text-ink/40">g</span>
                </p>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-ink/55">
                  PROTEIN PER SERVING
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/45">
          ALLERGENS LABELED PER FDA · NUTRITION DATA THIRD-PARTY VERIFIED
        </p>
      </div>
    </section>
  );
}
