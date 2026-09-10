import Link from "next/link";

export default function RefundsPage() {
  return <main className="mx-auto max-w-3xl px-6 py-16 font-sans text-ink">
    <Link href="/" className="text-sm underline underline-offset-4">Back to Daypack</Link>
    <h1 className="mt-8 font-display text-5xl font-medium uppercase">Refund Policy</h1>
    <p className="mt-4 text-sm text-ink/60">Effective September 10, 2026</p>
    <div className="mt-10 space-y-8 text-sm leading-7 text-ink/80">
      <section><h2 className="font-semibold text-ink">Cancel before shipment</h2><p>You may cancel a Daypack 170 preorder for a full refund any time before it ships. Email team@eatdaypack.com from the checkout email and include your order details. We will submit the refund to the original payment method and confirm by email.</p></section>
      <section><h2 className="font-semibold text-ink">After shipment</h2><p>Because Daypack contains food, we cannot accept ordinary returns of shipped packs. If your order is damaged, missing, incorrect, or unsafe on arrival, contact us within 14 days of delivery with your order details and photos when relevant. We will replace or refund the affected order as appropriate.</p></section>
      <section><h2 className="font-semibold text-ink">Delays or material changes</h2><p>If fulfillment is materially delayed or the final offer materially changes, we will notify you and allow cancellation for a full refund before shipment.</p></section>
      <section><h2 className="font-semibold text-ink">Core 3 subscriptions</h2><p>Cancel future monthly renewals by emailing team@eatdaypack.com before the next charge. A cancellation does not automatically refund a renewal already being fulfilled. A subscription preorder that has not entered fulfillment remains eligible for the pre-shipment refund described above.</p></section>
      <section><h2 className="font-semibold text-ink">Prior $1 reservations</h2><p>Prior $1 reservations are refundable on request. Email team@eatdaypack.com from the address used at checkout.</p></section>
      <section><h2 className="font-semibold text-ink">Posting time and charge issues</h2><p>Your bank controls when a submitted refund appears. For an unauthorized or duplicate charge, contact team@eatdaypack.com promptly. Do not email full card numbers.</p></section>
    </div>
  </main>;
}
