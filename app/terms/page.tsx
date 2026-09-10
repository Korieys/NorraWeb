import Link from "next/link";

export default function TermsPage() {
  return <main className="mx-auto max-w-3xl px-6 py-16 font-sans text-ink">
    <Link href="/" className="text-sm underline underline-offset-4">Back to Daypack</Link>
    <h1 className="mt-8 font-display text-5xl font-medium uppercase">Terms of Sale</h1>
    <p className="mt-4 text-sm text-ink/60">Effective September 10, 2026</p>
    <div className="mt-10 space-y-8 text-sm leading-7 text-ink/80">
      <section><h2 className="font-semibold text-ink">Seller</h2><p>This site and the Daypack product are operated and sold by Daysworth Nutrition LLC, a Texas limited liability company. Contact team@eatdaypack.com.</p></section>
      <section><h2 className="font-semibold text-ink">170 pack offers</h2><p>You may preorder one Daypack for $54.99, purchase the Core 3 once for $149.99, or subscribe to Core 3 for $139.99 per month. Each Core 3 contains three single-day Daypack 170 packs. A $9.99 standard U.S. shipping charge is added to each checkout or subscription renewal.</p></section>
      <section><h2 className="font-semibold text-ink">Subscription</h2><p>The Core 3 subscription renews monthly at $139.99 plus $9.99 shipping until canceled. You authorize recurring charges to your payment method. Cancel before the next renewal by emailing team@eatdaypack.com. Cancellation stops future renewals and does not automatically refund an order already in fulfillment.</p></section>
      <section><h2 className="font-semibold text-ink">Estimated fulfillment</h2><p>Fulfillment is estimated for Q4 2026. This is an estimate rather than a guaranteed ship date. We will send material production or timing updates to the checkout email. You may cancel for a full refund any time before shipment.</p></section>
      <section><h2 className="font-semibold text-ink">Product information</h2><p>Prototype images and the sample menu may change before fulfillment. Final products, manufacturers, flavors, ingredients, allergens, nutrition labels, storage, and preparation directions will appear on the delivered items. If we make a material change to the offer before shipment, we will notify you and provide an opportunity to cancel for a full refund.</p></section>
      <section><h2 className="font-semibold text-ink">Food and health</h2><p>Daypack is general food, not medical advice. Nutrition needs and allergies vary. Review all manufacturer labels before eating and do not consume an item containing an ingredient you cannot safely eat.</p></section>
      <section><h2 className="font-semibold text-ink">Prior $1 reservations</h2><p>Prior $1 Daypack reservations remain refundable. Email team@eatdaypack.com from the checkout address to request a refund.</p></section>
      <section><h2 className="font-semibold text-ink">Third-party products</h2><p>Third-party product and company names belong to their owners. Their inclusion does not imply sponsorship or endorsement unless expressly stated.</p></section>
      <section><h2 className="font-semibold text-ink">Liability and governing law</h2><p>To the extent permitted by law, Daysworth Nutrition LLC is not liable for indirect, incidental, special, consequential, or punitive damages. This does not limit rights or liability that cannot legally be limited. Texas law governs these terms, with venue in courts having jurisdiction over Harris County, Texas, unless consumer law requires otherwise.</p></section>
    </div>
  </main>;
}
