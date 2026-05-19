import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PurchaseTracker } from "./PurchaseTracker";

export const metadata = {
  title: "Reserved — Norra",
  description: "You're on the first run.",
};

export default function Reserved({
  searchParams,
}: {
  searchParams: { sku?: string };
}) {
  const sku = searchParams?.sku;

  return (
    <>
      <Nav />
      <main className="bg-paper">
        <section className="mx-auto flex max-w-content flex-col items-start gap-8 px-6 py-32 lg:px-10 lg:py-40">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan">
            CONFIRMED · FIRST RUN
          </p>
          <h1 className="font-display text-[48px] font-medium uppercase leading-[0.95] tracking-wide-sm text-ink sm:text-[64px] lg:text-[80px]">
            YOU&apos;RE IN.
          </h1>
          <p className="max-w-[600px] font-sans text-[18px] leading-[1.55] text-ink/80 lg:text-[20px]">
            Your $1 deposit is held. You&apos;re locked in for founder pricing
            and early access to the {sku || "Norra"} pack. Refund any time from
            your confirmation email.
          </p>
          <Button asChild>
            <Link href="/">← BACK TO HOME</Link>
          </Button>
        </section>
      </main>
      <Footer />
      <PurchaseTracker sku={sku} />
    </>
  );
}
