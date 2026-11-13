import Link from "next/link";

export default function TermsPage() {
  return <main className="mx-auto max-w-3xl px-6 py-16 font-sans text-ink">
    <Link href="/" className="text-sm underline underline-offset-4">Back to Daypack</Link>
    <h1 className="mt-8 font-display text-5xl font-medium uppercase">Terms of Sale</h1>
    <p className="mt-4 text-sm text-ink/60">Updated November 13, 2026</p>
    <div className="mt-10 space-y-8 text-sm leading-7 text-ink/80">
      <section><h2 className="font-semibold text-ink">Seller</h2><p>This site and the Daypack product are operated and sold by Daysworth Nutrition LLC, a Texas limited liability company. Contact team@eatdaypack.com.</p></section>
      <section><h2 className="font-semibold text-ink">170 pack offers</h2><p>Full product preorders are paused. The planned reopening is January 25, 2027, subject to readiness. Final products, prices, and shipping costs will be stated before ordering reopens.</p></section>
      <section><h2 className="font-semibold text-ink">Subscription</h2><p>New product subscriptions are not available during the preorder pause. No future recurring offer is finalized by this page. Contact team@eatdaypack.com with questions about a previous payment.</p></section>
      <section><h2 className="font-semibold text-ink">Estimated fulfillment</h2><p>Exact fulfillment timing is unconfirmed. January 25, 2027 is the planned preorder reopening date, not a guaranteed ship date. We will share updated fulfillment details before full preorders reopen. Existing refund rights are unchanged.</p></section>
      <section><h2 className="font-semibold text-ink">Product information</h2><p>Daypack is in advanced pilot development. Final food selection, nutrition and allergens, packaging, assembly, pricing, and fulfillment remain unfinished. At least 170g of protein and approximately 2,000 calories are design targets, not finalized commercial nutrition figures. Final ingredients, allergens, nutrition, storage, and preparation directions are stated on the received manufacturer labels. We will notify you of material changes before shipment and provide an opportunity to cancel for a full refund.</p></section>
      <section><h2 className="font-semibold text-ink">Food and health</h2><p>Daypack is general food, not medical advice. Nutrition needs and allergies vary. Review all manufacturer labels before eating and do not consume an item containing an ingredient you cannot safely eat.</p></section>
      <section><h2 className="font-semibold text-ink">Prior $1 reservations</h2><p>Prior $1 payments are fully refundable reservations for a future preorder opportunity, not full product orders. A future order credit has not been established. Email team@eatdaypack.com from the checkout address to request a refund.</p></section>
      <section><h2 className="font-semibold text-ink">Third-party products</h2><p>Third-party product and company names belong to their owners. Their inclusion does not imply sponsorship or endorsement unless expressly stated.</p></section>
      <section><h2 className="font-semibold text-ink">Liability and governing law</h2><p>To the extent permitted by law, Daysworth Nutrition LLC is not liable for indirect, incidental, special, consequential, or punitive damages. This does not limit rights or liability that cannot legally be limited. Texas law governs these terms, with venue in courts having jurisdiction over Harris County, Texas, unless consumer law requires otherwise.</p></section>
    </div>
  </main>;
}
