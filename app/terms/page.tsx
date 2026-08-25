import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 font-sans text-ink">
      <Link href="/" className="text-sm underline underline-offset-4">Back to Daypack</Link>
      <h1 className="mt-8 font-display text-5xl font-medium uppercase">Terms of Use</h1>
      <p className="mt-4 text-sm text-ink/60">Effective August 24, 2026</p>
      <div className="mt-10 space-y-8 text-sm leading-7 text-ink/80">
        <section><h2 className="font-semibold text-ink">Seller and site</h2><p>This site is operated by Daysworth Nutrition LLC, a Texas limited liability company. Daypack is a product and business line of Daysworth. Contact team@eatdaypack.com.</p></section>
        <section><h2 className="font-semibold text-ink">Pilot status</h2><p>Paid Daypack ordering and paid reservations are currently paused. Joining the email list does not purchase a product, reserve inventory, guarantee a price, or guarantee a launch or shipment date.</p></section>
        <section><h2 className="font-semibold text-ink">Prior $1 reservations</h2><p>If you previously paid a $1 Daypack reservation, you may request a refund at any time by emailing team@eatdaypack.com from the checkout email address. See the Refund Policy.</p></section>
        <section><h2 className="font-semibold text-ink">Product information</h2><p>Prototype images and descriptions may change. Exact pilot contents, third-party manufacturers, allergens, nutrition, price, shipping, storage, and preparation instructions will be disclosed before paid ordering opens. Manufacturer labels and safety instructions must be followed.</p></section>
        <section><h2 className="font-semibold text-ink">Third-party products</h2><p>Third-party product and company names belong to their owners. Their inclusion or reference does not imply sponsorship or endorsement unless expressly stated.</p></section>
        <section><h2 className="font-semibold text-ink">Acceptable use</h2><p>Do not misuse the site, interfere with security, scrape it unlawfully, submit false information, infringe rights, or use it for unlawful activity.</p></section>
        <section><h2 className="font-semibold text-ink">Disclaimers</h2><p>Website content is general product information, not medical advice. Nutrition needs and allergies vary. The site is provided as available to the extent permitted by law. We do not exclude warranties or liability that cannot legally be excluded.</p></section>
        <section><h2 className="font-semibold text-ink">Liability</h2><p>To the extent permitted by law, Daysworth Nutrition LLC is not liable for indirect, incidental, special, consequential, or punitive damages from use of this informational site. This limitation does not apply where prohibited or to liability that cannot be limited.</p></section>
        <section><h2 className="font-semibold text-ink">Governing law</h2><p>Texas law governs these terms without regard to conflict rules. Before filing a claim, contact us so we can try to resolve it. Venue lies in courts with jurisdiction over Harris County, Texas, unless consumer law requires otherwise.</p></section>
        <section><h2 className="font-semibold text-ink">Changes</h2><p>We may update these terms prospectively by posting a new effective date. Separate purchase or subscription terms will be presented before any future paid order.</p></section>
      </div>
    </main>
  );
}
