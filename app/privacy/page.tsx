import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 font-sans text-ink">
      <Link href="/" className="text-sm underline underline-offset-4">Back to Daypack</Link>
      <h1 className="mt-8 font-display text-5xl font-medium uppercase">Privacy Policy</h1>
      <p className="mt-4 text-sm text-ink/60">Effective August 24, 2026</p>
      <div className="mt-10 space-y-8 text-sm leading-7 text-ink/80">
        <section><h2 className="font-semibold text-ink">Who we are</h2><p>Daysworth Nutrition LLC operates the Daysworth brand and the Daypack website. Contact us at team@eatdaypack.com.</p></section>
        <section><h2 className="font-semibold text-ink">Information we collect</h2><p>We may collect contact information you submit, reservation or order details, communications, refund requests, device/browser information, IP address, cookie identifiers, and website interaction data. Payment-card data is handled by Stripe and is not stored by us in full.</p></section>
        <section><h2 className="font-semibold text-ink">How we use it</h2><p>We use information to operate the website and waitlist, process or refund payments, provide customer service, prevent fraud, measure marketing and website performance, comply with law, and prepare the Daypack pilot.</p></section>
        <section><h2 className="font-semibold text-ink">Service providers</h2><p>Our providers may include Stripe for payments, Vercel for hosting and analytics, Google Analytics, Meta Pixel and Conversions API, Klaviyo for email and customer-event tools, and Gmail/Google Workspace for communications. They process information under their own terms and privacy practices.</p></section>
        <section><h2 className="font-semibold text-ink">Cookies and analytics</h2><p>The site may use cookies or similar technologies for essential functions, analytics, attribution, and advertising. Browser settings and provider controls may let you limit some tracking. Disabling cookies can affect features.</p></section>
        <section><h2 className="font-semibold text-ink">Sharing</h2><p>We do not sell payment-card numbers. We may disclose information to service providers, professional advisers, regulators, law enforcement when legally required, or in a business transaction. Advertising providers may receive device and event data as described above.</p></section>
        <section><h2 className="font-semibold text-ink">Retention and security</h2><p>We retain information for as long as reasonably needed for the purposes above, including tax, payment, dispute, food-safety, and legal records. No system is completely secure, but we use reasonable safeguards and limit access to business needs.</p></section>
        <section><h2 className="font-semibold text-ink">Your choices</h2><p>You can unsubscribe from marketing using an email link and can request access, correction, or deletion by emailing team@eatdaypack.com. We may retain records required for transactions, safety, fraud prevention, or law.</p></section>
        <section><h2 className="font-semibold text-ink">Children</h2><p>Daypack is not directed to children under 13, and we do not knowingly collect their personal information.</p></section>
        <section><h2 className="font-semibold text-ink">Changes</h2><p>We may update this policy and will post the effective date. Material changes will apply prospectively as required by law.</p></section>
      </div>
    </main>
  );
}
