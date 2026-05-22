import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Our Story — Daypack",
  description:
    "Daypack was built by KJ Dixon to solve a simple problem: hitting your protein target without spending your life tracking food.",
};

export default function StoryPage() {
  return (
    <>
      <Nav />
      <main>
        <StoryHero />
        <PullQuote />
        <Principles />
        <Founder />
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
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-ink/55">
            OUR STORY · EST. 2026
          </p>
          <h1 className="mt-6 font-display text-[48px] font-medium uppercase leading-[0.95] tracking-wide-sm text-ink sm:text-[64px] lg:text-[80px]">
            BUILT
            <br />
            BY SOMEONE
            <br />
            HITTING
            <br />
            THE NUMBER.
          </h1>
          <p className="mt-8 max-w-[520px] font-sans text-[18px] leading-[1.55] text-ink/80 lg:text-[20px]">
            Daypack started in a kitchen, on a kitchen scale, with a frustration
            most lifters and busy professionals know too well — eating enough
            real food to hit your protein target without spending your whole day
            cooking, tracking, and second-guessing it.
          </p>
          <p className="mt-5 font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/45">
            FOUNDED BY KJ DIXON · DESIGNED FOR THE NUMBER
          </p>
        </div>

        <div className="lg:col-span-6">
          <figure className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
              <Image
                src="/founder-kj.jpg"
                alt="KJ Dixon, founder of Daypack"
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between border-t border-ink/15 pt-3 font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-ink/55">
              <span>KJ DIXON · FOUNDER</span>
              <span className="font-display tabular-nums">01 / 01</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function PullQuote() {
  return (
    <section className="border-y border-ink/10 bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-content px-6 lg:px-10">
        <blockquote className="mx-auto max-w-[1100px] text-center font-display text-[28px] font-medium uppercase leading-[1.15] tracking-wide-sm text-ink sm:text-[36px] lg:text-[48px]">
          <span className="text-tan">&ldquo;</span>I didn&rsquo;t want another
          shake. I didn&rsquo;t want another app. I wanted a box that already
          did the math &mdash; and tasted like food.<span className="text-tan">
            &rdquo;
          </span>
        </blockquote>
        <p className="mt-8 text-center font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/55">
          &mdash; KJ DIXON, FOUNDER
        </p>
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
    body: "Sous-vide proteins. Real grains. Real sauces. Nothing extruded, nothing pretending. The kind of meal you&rsquo;d make on your best day &mdash; on every day.",
  },
  {
    index: "03",
    accent: "text-sienna",
    headline: "DESIGNED FOR THE NUMBER.",
    body: "Three packs. Three targets. 170, 200, 230 grams of protein. Pick the one that matches your training, your work, your week. It&rsquo;s that simple.",
  },
];

function Principles() {
  return (
    <section className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6 lg:px-10">
        <p className="text-center font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan">
          WHAT WE BELIEVE
        </p>
        <h2 className="mx-auto mt-6 max-w-[900px] text-center font-display text-[36px] font-medium uppercase leading-[1.05] tracking-wide-sm text-ink sm:text-[44px] lg:text-[56px]">
          THREE RULES. NO EXCEPTIONS.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-3 lg:mt-20">
          {PRINCIPLES.map((p) => (
            <div
              key={p.index}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Founder() {
  return (
    <section className="border-t border-ink/10 bg-paper py-24 lg:py-32">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan">
            THE FOUNDER
          </p>
          <h2 className="mt-6 font-display text-[36px] font-medium uppercase leading-[1.0] tracking-wide-sm text-ink sm:text-[44px] lg:text-[52px]">
            KJ DIXON
          </h2>
          <p className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/55">
            FOUNDER &amp; HEAD OF PRODUCT
          </p>
        </div>

        <div className="space-y-6 font-sans text-[17px] leading-[1.6] text-ink/80 lg:col-span-8 lg:text-[18px]">
          <p>
            KJ started Daypack the same way most good products start &mdash; out
            of personal frustration. As an athlete and a working professional,
            he was tired of choosing between hitting his protein target and
            having a life. The status quo was three options: cook for hours, eat
            another chalky shake, or accept that he wasn&rsquo;t going to hit
            the number that day.
          </p>
          <p>
            None of those were good enough. So he started prototyping in his own
            kitchen &mdash; building meal packs around a single protein number,
            using real ingredients and real cooking techniques, with one rule:
            it had to taste like something he&rsquo;d actually want to eat after
            a long day.
          </p>
          <p>
            Daypack is what came out of that work. Three packs, three targets,
            zero guesswork. It&rsquo;s the product KJ wished existed &mdash;
            built for everyone who&rsquo;s ever stood in front of a fridge at
            9pm trying to do math.
          </p>
        </div>
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
        <p className="font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-paper/55">
          JOIN THE FIRST RUN
        </p>
        <h2 className="mx-auto mt-6 max-w-[900px] font-display text-[36px] font-medium uppercase leading-[1.05] tracking-wide-sm sm:text-[44px] lg:text-[56px]">
          BE FIRST. EAT FIRST. HIT THE NUMBER.
        </h2>
        <p className="mx-auto mt-6 max-w-[560px] font-sans text-[16px] leading-[1.55] text-paper/75 lg:text-[18px]">
          Reserve a pack for $1. Refundable any time. $20 off at launch. First
          run ships Q3 2026.
        </p>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" variant="invertedPaper">
            <a href="/#sku-170">RESERVE YOUR PACK &mdash; $1</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
