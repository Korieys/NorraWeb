import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/Reveal";

export const metadata = {
  title: "Our Story | Daypack",
  description:
    "Daypack started because KJ Grotesk got tired of solving the same annoying problem every day. Hitting a protein target without turning it into a side quest.",
};

export default function StoryPage() {
  return (
    <>
      <Nav />
      <main>
        <StoryHero />
        <Letter />
        <PullQuote />
        <Principles />
        <Signoff />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

function StoryHero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(28,28,26,1) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
      <div className="relative mx-auto grid max-w-content grid-cols-1 gap-12 px-6 pb-24 pt-14 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:pb-32 lg:pt-24">
        <div className="lg:col-span-6 lg:pt-4">
          <p className="animate-fade-in-down font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-ink/55 [animation-delay:80ms]">
            OUR STORY · A LETTER FROM THE FOUNDER
          </p>
          <h1 className="mt-6 font-display text-[48px] font-medium uppercase leading-[0.95] tracking-wide-sm text-ink sm:text-[64px] lg:text-[80px]">
            <span className="block animate-fade-in-up-lg [animation-delay:180ms]">ONE PACK.</span>
            <span className="block animate-fade-in-up-lg [animation-delay:300ms]">ONE DAY.</span>
            <span className="block animate-fade-in-up-lg [animation-delay:420ms]">FOUR REAL</span>
            <span className="block animate-fade-in-up-lg [animation-delay:540ms]">MEALS.</span>
          </h1>
          <p className="mt-8 max-w-[520px] animate-fade-in-up font-sans text-[18px] leading-[1.55] text-ink/80 lg:text-[20px] [animation-delay:700ms]">
            Daypack started because I got tired of solving the same annoying
            problem every day. Hitting a protein target that actually mattered,
            without turning my whole day into a grocery store side quest.
          </p>
          <p className="mt-5 animate-fade-in font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/45 [animation-delay:880ms]">
            KJ GROTESK · FOUNDER, DAYPACK
          </p>
        </div>

        <div className="lg:col-span-6">
          <figure className="relative animate-fade-in-scale [animation-delay:300ms] [animation-duration:1.2s]">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
              <Image
                src="/founder-kj.jpg"
                alt="KJ Grotesk, founder of Daypack"
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between border-t border-ink/15 pt-3 font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-ink/55">
              <span>KJ GROTESK · FOUNDER</span>
              <span className="font-display tabular-nums">01 / 01</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function Letter() {
  return (
    <section className="border-t border-ink/10 bg-paper py-24 lg:py-32">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:px-10">
        <Reveal className="lg:col-span-3">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan">
            THE PROBLEM
          </p>
          <h2 className="mt-6 font-display text-[32px] font-medium uppercase leading-[1.0] tracking-wide-sm text-ink sm:text-[40px] lg:text-[44px]">
            THE GROCERY STORE SIDE QUEST.
          </h2>
        </Reveal>

        <Reveal delayMs={150} className="space-y-6 font-sans text-[17px] leading-[1.65] text-ink/80 lg:col-span-9 lg:text-[18px]">
          <p>
            I&rsquo;d train, try to hit a protein target that actually mattered,
            then spend the rest of the day hunting down food like it was a
            scavenger hunt I never signed up for.
          </p>
          <p>
            One stop for chicken. Another stop for snacks. Maybe a smoothie
            somewhere. Maybe a &ldquo;high protein&rdquo; thing that only works
            if you eat three of them and pretend the sugar doesn&rsquo;t count.
          </p>
          <p className="font-display text-[20px] font-medium uppercase tracking-wide-sm text-ink lg:text-[22px]">
            The other option was meal prep. <span className="text-tan">
              (cue the daunting music.)
            </span>
          </p>
          <p>
            Spend half of Sunday cooking eight containers of the same food,
            stack them in the fridge, then slowly start hating them by
            Wednesday.
          </p>
          <p className="font-display text-[22px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[26px]">
            There had to be a better middle option.
          </p>

          <ul className="mt-8 space-y-3 border-l-2 border-ink/15 pl-6">
            <li className="font-sans text-[16px] leading-[1.5] text-ink/80">
              Fast food was too expensive.
            </li>
            <li className="font-sans text-[16px] leading-[1.5] text-ink/80">
              I didn&rsquo;t want a cleanse <span className="text-ink/45">
                (because ew).
              </span>
            </li>
            <li className="font-sans text-[16px] leading-[1.5] text-ink/80">
              Not a box of bars <span className="text-ink/45">
                (are you kidding me?).
              </span>
            </li>
            <li className="font-sans text-[16px] leading-[1.5] text-ink/80">
              And definitely not another meal kit that still needs time, dishes,
              and motivation.
            </li>
          </ul>

          <p className="pt-6 font-display text-[22px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[26px]">
            I wanted one thing I could grab that already handled the day.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PullQuote() {
  return (
    <section className="border-y border-ink/10 bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6 lg:px-10">
        <Reveal as="p" className="text-center font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-tan">
          THE WHOLE IDEA, ON ONE LINE
        </Reveal>
        <Reveal delayMs={120} className="mx-auto mt-6 max-w-[1100px]">
          <blockquote className="text-center font-display text-[32px] font-medium uppercase leading-[1.05] tracking-wide-sm text-ink sm:text-[44px] lg:text-[56px]">
            ONE PACK. ONE DAY.
            <br />
            FOUR REAL MEALS.
            <br />
            <span className="text-tan">
              A CLEAR PROTEIN TARGET ON THE FRONT.
            </span>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

const PRINCIPLES = [
  {
    index: "01",
    accent: "text-slate",
    headline: "THE BOX IS THE MATH.",
    body: "Every Daypack is engineered around a single protein number. No counting macros. No logging meals. Open the box, eat the box, hit the number.",
  },
  {
    index: "02",
    accent: "text-olive",
    headline: "REAL FOOD, NOT POWDER.",
    body: "Sous-vide proteins. Real grains. Real sauces. Nothing extruded, nothing pretending. The kind of meal you&rsquo;d make on your best day, on every day.",
  },
  {
    index: "03",
    accent: "text-sienna",
    headline: "SHELF STABLE BY DESIGN.",
    body: "Needing a fridge turns food into another planning problem. Built to sit in a backpack, gym bag, truck, or desk drawer. Wherever life actually happens.",
  },
];

function Principles() {
  return (
    <section className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6 lg:px-10">
        <Reveal as="p" className="text-center font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan">
          WHAT WE BELIEVE
        </Reveal>
        <Reveal as="h2" delayMs={100} className="mx-auto mt-6 max-w-[900px] text-center font-display text-[36px] font-medium uppercase leading-[1.05] tracking-wide-sm text-ink sm:text-[44px] lg:text-[56px]">
          THREE RULES. NO EXCEPTIONS.
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-3 lg:mt-20">
          {PRINCIPLES.map((p, i) => (
            <Reveal
              key={p.index}
              variant="fade-scale"
              delayMs={200 + i * 120}
              className="relative flex flex-col gap-6 bg-paper p-8 lg:p-10"
            >
              <span
                className={`font-display text-[72px] font-medium leading-none tabular-nums ${p.accent}`}
              >
                {p.index}
              </span>
              <div className="space-y-4">
                <h3 className="font-display text-[20px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[22px]">
                  {p.headline}
                </h3>
                <p
                  className="font-sans text-[16px] leading-[1.55] text-ink/75"
                  dangerouslySetInnerHTML={{ __html: p.body }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Signoff() {
  return (
    <section className="border-t border-ink/10 bg-paper py-24 lg:py-32">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:px-10">
        <Reveal className="lg:col-span-3">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan">
            THE GOAL
          </p>
          <h2 className="mt-6 font-display text-[32px] font-medium uppercase leading-[1.0] tracking-wide-sm text-ink sm:text-[40px] lg:text-[44px]">
            ALREADY HANDLED.
          </h2>
        </Reveal>

        <Reveal delayMs={150} className="space-y-6 font-sans text-[17px] leading-[1.65] text-ink/80 lg:col-span-9 lg:text-[18px]">
          <p className="font-display text-[22px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[26px]">
            Make hitting your protein feel less like a chore, and more like
            something already handled.
          </p>
          <p>
            Daypack isn&rsquo;t trying to be some magic transformation product.
            It&rsquo;s definitely not promising to change your life in thirty
            days. And I can&rsquo;t pretend it&rsquo;s a celebrity meal plan in
            a cleaner box.
          </p>
          <p>
            It&rsquo;s just a full day of food, sorted by protein, shipped to
            your door, so you can stop thinking about it and go do the work.
          </p>

          <div className="mt-8 border-l-2 border-tan bg-tan/5 p-6 lg:p-8">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-tan">
              WHERE WE ARE RIGHT NOW
            </p>
            <p className="mt-4 font-sans text-[16px] leading-[1.6] text-ink/85">
              Daypack is still in validation. The site is real. The $1 deposit
              is real and refundable. The packs are being finalized with a
              co-packer. I&rsquo;m building this in public, sending honest
              updates, and only shipping once the food is good enough to put my
              name on.
            </p>
            <p className="mt-4 font-sans text-[16px] leading-[1.6] text-ink/85">
              You can follow our socials to stay updated, or you can follow me
              personally to see behind the scenes: how we design the
              packaging, brainstorming meals, stressing out, thinking out loud,
              second-guessing fonts, taste-testing protein numbers, and
              whatever else.
            </p>
            <p className="mt-4 font-sans text-[13px] font-semibold uppercase tracking-wide-lg text-ink/70">
              <a
                href="https://instagram.com/eatdaypack"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-ink/30 underline-offset-4 transition hover:decoration-tan hover:text-tan"
              >
                @eatdaypack
              </a>
              <span className="px-2 text-ink/35">·</span>
              IG &amp; FB
              <span className="px-2 text-ink/35">{"//"}</span>
              <a
                href="https://instagram.com/kjgrotesk"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-ink/30 underline-offset-4 transition hover:decoration-tan hover:text-tan"
              >
                @kjgrotesk
              </a>
              <span className="px-2 text-ink/35">·</span>
              IG &amp; YOUTUBE
            </p>
          </div>

          <p className="pt-6">
            If this sounds like something you would actually use, lock a pack.
            <br />
            If not, no hard feelings.
          </p>
          <p className="font-display text-[22px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[26px]">
            Either way. Eat the protein, enjoy the gym.
          </p>

          <div className="mt-10 border-t border-ink/15 pt-8">
            <p className="font-sans text-[14px] italic text-ink/70">
              Never stop,
            </p>
            <p className="mt-2 font-display text-[40px] font-medium uppercase leading-none tracking-wide-sm text-ink lg:text-[52px]">
              KJ
            </p>
            <p className="mt-2 font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/55">
              KJ GROTESK · FOUNDER, DAYPACK
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-ink/10 bg-ink py-24 text-paper lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(244,240,232,0.2) 0 1px, transparent 1px 18px)",
        }}
      />
      <div className="relative mx-auto max-w-content px-6 text-center lg:px-10">
        <Reveal as="p" className="font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-paper/55">
          LOCK A PACK
        </Reveal>
        <Reveal as="h2" delayMs={120} className="mx-auto mt-6 max-w-[900px] font-display text-[36px] font-medium uppercase leading-[1.05] tracking-wide-sm sm:text-[44px] lg:text-[56px]">
          $1 DEPOSIT. REAL AND REFUNDABLE.
        </Reveal>
        <Reveal as="p" delayMs={220} className="mx-auto mt-6 max-w-[560px] font-sans text-[16px] leading-[1.55] text-paper/75 lg:text-[18px]">
          Built in public. Honest updates. Shipping once the food is good enough
          to put my name on. $20 off at launch. First run Q3 2026.
        </Reveal>
        <Reveal delayMs={320} className="mt-10 flex justify-center">
          <Button asChild size="lg" variant="invertedPaper">
            <a href="/#sku-110">LOCK YOUR PACK · $1</a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
