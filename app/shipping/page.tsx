import Link from "next/link";

export default function ShippingPage() {
  return <main className="mx-auto max-w-3xl px-6 py-16 font-sans text-ink">
    <Link href="/" className="text-sm underline underline-offset-4">Back to Daypack</Link>
    <h1 className="mt-8 font-display text-5xl font-medium uppercase">Shipping Policy</h1>
    <p className="mt-4 text-sm text-ink/60">Updated November 13, 2026</p>
    <div className="mt-10 space-y-8 text-sm leading-7 text-ink/80">
      <section><h2 className="font-semibold text-ink">Where we ship</h2><p>Full product preorders are paused. The initial plan is U.S. fulfillment. Final service areas and delivery details will be stated before preorders reopen.</p></section>
      <section><h2 className="font-semibold text-ink">Cost and timing</h2><p>January 25, 2027 is the planned preorder reopening date, not a shipping date. Exact fulfillment timing and final shipping costs are not confirmed. Updated costs and timing will be shared before full product preorders reopen.</p></section>
      <section><h2 className="font-semibold text-ink">Address changes</h2><p>Email team@eatdaypack.com as soon as possible to change an address. We can update it until the order enters fulfillment; after that, a change may not be possible.</p></section>
      <section><h2 className="font-semibold text-ink">Delays, loss, and damage</h2><p>We will communicate material production delays by email. For a lost, damaged, or incorrect delivery, contact team@eatdaypack.com within 14 days of delivery or the carrier&apos;s expected delivery date so we can investigate and arrange a replacement or refund as appropriate.</p></section>
    </div>
  </main>;
}
