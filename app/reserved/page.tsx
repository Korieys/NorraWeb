import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getStripe } from "@/lib/stripe";
import { OFFERS, SHIPPING_CENTS, orderOffer } from "@/lib/daypack-offers";

export const metadata = {
  title: "Reserved — Daypack",
  description: "You're on the first run.",
  robots: { index: false, follow: false },
};

type Search = { sku?: string; session_id?: string };

async function resolveSession(search: Search) {
  const stripe = getStripe();
  if (!search.session_id) {
    return { ok: false as const };
  }
  if (!stripe) return { ok: false as const, retry: true };

  try {
    const session = await stripe.checkout.sessions.retrieve(search.session_id);
    const offer = orderOffer(session.metadata);
    if (!offer || session.status !== "complete" || session.currency !== "usd"
      || !session.amount_total || session.amount_total <= 0
      || session.mode !== (OFFERS[offer].recurring ? "subscription" : "payment")
      || !["paid", "unpaid"].includes(session.payment_status)) {
      return { ok: false as const };
    }
    return {
      ok: true as const,
      offer,
      pending: session.payment_status === "unpaid",
      amount: session.amount_total / 100,
      reference: session.id,
    };
  } catch {
    return { ok: false as const, retry: true };
  }
}

export default async function Reserved({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const session = await resolveSession(await searchParams);
  if (!session.ok) {
    if (session.retry) return (
      <><Nav /><main className="mx-auto max-w-3xl px-6 py-32 font-sans text-ink">
        <h1 className="font-display text-4xl uppercase">We couldn&apos;t check your payment yet.</h1>
        <p className="mt-6 leading-7">This does not mean your payment failed. Please do not place another order. Refresh this page in a moment, or email <a href="mailto:team@eatdaypack.com" className="underline underline-offset-4">team@eatdaypack.com</a> for help.</p>
      </main><Footer /></>
    );
    redirect("/cancelled");
  }

  const offer = OFFERS[session.offer];
  const dollars = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <>
      <Nav />
      <main className="bg-paper">
        <section className="mx-auto flex max-w-content flex-col items-start gap-8 px-6 py-32 lg:px-10 lg:py-40">
          <p className="animate-fade-in-down font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan [animation-delay:80ms]">
            {session.pending ? "PAYMENT PROCESSING" : "CONFIRMED · FIRST RUN"}
          </p>
          <h1 className="font-display text-[48px] font-medium uppercase leading-[0.95] tracking-wide-sm text-ink sm:text-[64px] lg:text-[80px]">
            <span className="block animate-fade-in-up-lg [animation-delay:200ms]">{session.pending ? "ONE MORE STEP." : "YOU'RE IN."}</span>
          </h1>
          <p className="max-w-[600px] animate-fade-in-up font-sans text-[18px] leading-[1.55] text-ink/80 lg:text-[20px] [animation-delay:420ms]">
            {session.pending ? "Your payment is still processing. Your preorder is not confirmed until payment succeeds. Check back here for its status; please do not place a second order."
              : `Your ${offer.name} preorder is confirmed: ${offer.quantity} single-day pack${offer.quantity > 1 ? "s" : ""}. ${dollars(session.amount)} paid, including shipping.`}
          </p>
          <div className="max-w-[600px] space-y-4 font-sans text-base leading-7 text-ink/80">
            <p>First fulfillment is estimated for Q4 2026. You may cancel for a full refund before shipment.</p>
            {offer.recurring && <p>Core 3 renews monthly at {dollars((offer.amount + SHIPPING_CENTS) / 100)}, including $9.99 shipping, until canceled. Email <a href="mailto:team@eatdaypack.com" className="underline underline-offset-4">team@eatdaypack.com</a> before the next renewal to cancel.</p>}
            <p>For order updates or help, email <a href="mailto:team@eatdaypack.com" className="underline underline-offset-4">team@eatdaypack.com</a> with the reference below.</p>
            <p className="break-all text-xs text-ink/60">Order reference: {session.reference}</p>
          </div>
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
    </>
  );
}
