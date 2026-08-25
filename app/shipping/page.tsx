import Link from "next/link";

export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 font-sans text-ink">
      <Link href="/" className="text-sm underline underline-offset-4">Back to Daypack</Link>
      <h1 className="mt-8 font-display text-5xl font-medium uppercase">Shipping Policy</h1>
      <p className="mt-4 text-sm text-ink/60">Effective August 24, 2026</p>
      <div className="mt-10 space-y-8 text-sm leading-7 text-ink/80">
        <section><h2 className="font-semibold text-ink">Not yet shipping</h2><p>Daypack is not currently accepting paid product orders or shipping the pilot. Joining the email list is not an order and does not create a shipment obligation.</p></section>
        <section><h2 className="font-semibold text-ink">Before ordering opens</h2><p>We will publish the available destinations, shipping charges, estimated processing and transit times, address-change cutoff, delay and cancellation rights, and damaged/lost package process before any paid order is accepted.</p></section>
      </div>
    </main>
  );
}
