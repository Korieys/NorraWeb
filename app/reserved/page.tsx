import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PurchaseTracker } from "./PurchaseTracker";
import { getStripe } from "@/lib/stripe";
import { SKUS, type SkuId } from "@/lib/skus";

export const metadata = {
  title: "Reserved — Daypack",
  description: "You're on the first run.",
};

type Search = { sku?: string; session_id?: string; dev?: string };

async function resolveSession(search: Search) {
  // Dev fallback path bypasses Stripe.
  if (search.dev === "1") {
    return { ok: true, sku: search.sku, email: undefined as string | undefined };
  }

  const stripe = getStripe();
  if (!stripe || !search.session_id) {
    return { ok: false as const };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(search.session_id);
    if (session.payment_status !== "paid") {
      return { ok: false as const };
    }
    return {
      ok: true as const,
      sku: (session.metadata?.sku as string | undefined) || search.sku,
      email:
        session.customer_details?.email ||
        session.customer_email ||
        undefined,
    };
  } catch {
    return { ok: false as const };
  }
}

export default async function Reserved({
  searchParams,
}: {
  searchParams: Search;
}) {
  const session = await resolveSession(searchParams);
  if (!session.ok) {
    redirect("/cancelled");
  }

  const sku = (session.sku as SkuId) || "200";
  const skuData = SKUS[sku] ?? SKUS["200"];

  return (
    <>
      <Nav />
      <main className="bg-paper">
        <section className="mx-auto flex max-w-content flex-col items-start gap-8 px-6 py-32 lg:px-10 lg:py-40">
          <p className="animate-fade-in-down font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan [animation-delay:80ms]">
            CONFIRMED · FIRST RUN
          </p>
          <h1 className="font-display text-[48px] font-medium uppercase leading-[0.95] tracking-wide-sm text-ink sm:text-[64px] lg:text-[80px]">
            <span className="block animate-fade-in-up-lg [animation-delay:200ms]">YOU&apos;RE IN.</span>
          </h1>
          <p className="max-w-[600px] animate-fade-in-up font-sans text-[18px] leading-[1.55] text-ink/80 lg:text-[20px] [animation-delay:420ms]">
            Your $1 deposit is held. You&apos;re locked in for founder pricing
            and early access to the{" "}
            <span className={`font-display uppercase ${skuData.color.text}`}>
              {skuData.protein}
            </span>{" "}
            pack. Refund any time from your confirmation email.
          </p>
          <div className="animate-fade-in-up [animation-delay:580ms]">
            <Button asChild>
              <Link href="/" className="group">
                <span className="inline-block transition-transform group-hover:-translate-x-1">
                  ←
                </span>{" "}
                BACK TO HOME
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <PurchaseTracker sku={sku} />
    </>
  );
}
