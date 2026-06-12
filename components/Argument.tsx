import { Reveal } from "@/components/Reveal";

const COLUMNS = [
  {
    index: "01",
    accent: "text-slate",
    headline: "PICK YOUR DAILY TARGET",
    body: "Five packs sized by grams of protein. Match the number to your body weight and goal. The pack does the rest.",
  },
  {
    index: "02",
    accent: "text-olive",
    headline: "SHELF STABLE. MICROWAVE READY.",
    body: "No freezer space. No prep. Ready in ninety seconds.",
  },
  {
    index: "03",
    accent: "text-sienna",
    headline: "REAL FOOD. NOT POWDER.",
    body: "Sous-vide proteins, real grains, real sauces. Engineered, not extruded.",
  },
];

export function Argument() {
  return (
    <section id="why" className="border-t border-ink/10 bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6 lg:px-10">
        <Reveal as="p" className="text-center font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan">
          HOW IT WORKS
        </Reveal>
        <Reveal as="h2" delayMs={100} className="mx-auto mt-6 max-w-[900px] text-center font-display text-[36px] font-medium uppercase leading-[1.05] tracking-wide-sm text-ink sm:text-[44px] lg:text-[56px]">
          PICK YOUR DAILY PROTEIN TARGET.
        </Reveal>
        <Reveal as="p" delayMs={200} className="mx-auto mt-6 max-w-[640px] text-center font-sans text-[16px] leading-[1.55] text-ink/70 lg:text-[18px]">
          Daypack is built for any adult who wants structured daily protein.
          Five pack sizes, from 110 to 230 grams. Match your body weight and
          goal to a number, then eat the pouch.
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-3 lg:mt-20">
          {COLUMNS.map((col, i) => (
            <Reveal
              key={col.index}
              variant="fade-scale"
              delayMs={300 + i * 120}
              className="relative flex flex-col gap-6 bg-paper p-8 transition-colors hover:bg-tan/[0.06] lg:p-10"
            >
              <span
                className={`font-display text-[72px] font-medium leading-none tabular-nums ${col.accent}`}
              >
                {col.index}
              </span>
              <div className="space-y-4">
                <h3 className="font-display text-[20px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[22px]">
                  {col.headline}
                </h3>
                <p className="font-sans text-[16px] leading-[1.55] text-ink/75">
                  {col.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
