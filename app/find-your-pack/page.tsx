import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FindYourPack } from "@/components/FindYourPack";

export const metadata: Metadata = {
  title: "Find Your Pack | Daypack",
  description:
    "Match your body weight and goal to a daily protein target. Five Daypack sizes from 110 to 230 grams.",
};

export default function FindYourPackPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(28,28,26,1) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
            }}
          />
          <div className="relative mx-auto max-w-content px-6 pb-10 pt-14 lg:px-10 lg:pb-16 lg:pt-24">
            <p className="animate-fade-in-down font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-ink/55 [animation-delay:80ms]">
              SIZING TOOL · NO ACCOUNT NEEDED
            </p>
            <h1 className="mt-6 max-w-[820px] font-display text-[48px] font-medium uppercase leading-[0.95] tracking-wide-sm text-ink sm:text-[64px] lg:text-[80px]">
              <span className="block animate-fade-in-up-lg [animation-delay:180ms]">FIND YOUR PACK.</span>
            </h1>
            <p className="mt-7 max-w-[640px] animate-fade-in-up font-sans text-[17px] leading-[1.55] text-ink/80 lg:text-[19px] [animation-delay:380ms]">
              Enter your body weight, pick a goal, set your activity level.
              We will recommend the daily protein pack that matches.
            </p>
          </div>
        </section>
        <FindYourPack />
      </main>
      <Footer />
    </>
  );
}
