import { Reveal } from "@/components/Reveal";

const HEADING = "What's in the pouch";

const INTRO =
  "One pouch. One full day. Open it and everything you need to hit your protein is already inside.";

const ITEMS = [
  {
    heading: "Morning oats.",
    body: "A high-protein oats sachet to start the day. Hot water, two minutes, done.",
  },
  {
    heading: "Two hot entrées.",
    body: "Real meals, sealed and shelf-stable, ready straight from the pouch. Lunch and dinner with no fridge and no cooking.",
  },
  {
    heading: "A protein bar.",
    body: "For the gap between meals or the drive home.",
  },
  {
    heading: "A jerky stick.",
    body: "Salt, protein, something to chew.",
  },
  {
    heading: "A recovery stick-pack.",
    body: "Mix into water after you train.",
  },
];

const CLOSING =
  "Every pouch is built around a protein number, not a calorie count. Five pouches, five targets: 110, 140, 170, 200, and 230. Pick your number and the pouch is portioned to hit it. Nothing needs refrigeration. Nothing needs prep beyond hot water. The whole day fits in a drawer or a bag.";

export function PackContents() {
  return (
    <section
      id="whats-in-the-pouch"
      className="border-t border-ink/10 bg-paper py-24 lg:py-32"
    >
      <div className="mx-auto max-w-content px-6 lg:px-10">
        <Reveal
          as="h2"
          className="mx-auto max-w-[900px] text-center font-display text-[32px] font-medium uppercase leading-[1.05] tracking-wide-sm text-ink sm:text-[40px] lg:text-[48px]"
        >
          {HEADING}
        </Reveal>
        <Reveal
          as="p"
          delayMs={100}
          className="mx-auto mt-6 max-w-[640px] text-center font-sans text-[16px] leading-[1.55] text-ink/70 lg:text-[18px]"
        >
          {INTRO}
        </Reveal>

        <ul className="mx-auto mt-16 max-w-[760px] divide-y divide-ink/10 border-y border-ink/10 lg:mt-20">
          {ITEMS.map((item, i) => (
            <Reveal
              as="li"
              key={item.heading}
              delayMs={200 + i * 90}
              className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[220px_1fr] sm:gap-8 lg:py-7"
            >
              <h3 className="font-display text-[20px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[22px]">
                {item.heading}
              </h3>
              <p className="font-sans text-[16px] leading-[1.55] text-ink/75">
                {item.body}
              </p>
            </Reveal>
          ))}
        </ul>

        <Reveal
          delayMs={200 + ITEMS.length * 90}
          className="mx-auto mt-12 max-w-[760px] border-l-2 border-ink/20 pl-5"
        >
          <p className="font-sans text-[16px] leading-[1.6] text-ink/75 lg:text-[17px]">
            {CLOSING}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
