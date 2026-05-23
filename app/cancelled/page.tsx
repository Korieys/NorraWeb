import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Cancelled — Daypack",
  description: "No charge. Take another look when you're ready.",
};

export default function Cancelled() {
  return (
    <>
      <Nav />
      <main className="bg-paper">
        <section className="mx-auto flex max-w-content flex-col items-start gap-8 px-6 py-32 lg:px-10 lg:py-40">
          <p className="animate-fade-in-down font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan [animation-delay:80ms]">
            NO CHARGE
          </p>
          <h1 className="font-display text-[48px] font-medium uppercase leading-[0.95] tracking-wide-sm text-ink sm:text-[64px] lg:text-[80px]">
            <span className="block animate-fade-in-up-lg [animation-delay:180ms]">COME BACK</span>
            <span className="block animate-fade-in-up-lg [animation-delay:300ms]">ANY TIME.</span>
          </h1>
          <p className="max-w-[600px] animate-fade-in-up font-sans text-[18px] leading-[1.55] text-ink/80 lg:text-[20px] [animation-delay:460ms]">
            The first run is small. Founder pricing locks once it&apos;s gone.
            Reserve when you&apos;re ready.
          </p>
          <div className="animate-fade-in-up [animation-delay:620ms]">
            <Button asChild>
              <Link href="/#reserve">← RESERVE A PACK</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
