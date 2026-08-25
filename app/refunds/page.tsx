import Link from "next/link";

export default function RefundsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 font-sans text-ink">
      <Link href="/" className="text-sm underline underline-offset-4">Back to Daypack</Link>
      <h1 className="mt-8 font-display text-5xl font-medium uppercase">Refund Policy</h1>
      <p className="mt-4 text-sm text-ink/60">Effective August 24, 2026</p>
      <div className="mt-10 space-y-8 text-sm leading-7 text-ink/80">
        <section><h2 className="font-semibold text-ink">Prior $1 reservations</h2><p>Prior $1 Daypack reservations are refundable. Email team@eatdaypack.com from the address used at checkout and state that you want a refund. We will submit the refund to the original payment method and confirm when submitted. Your bank or card issuer controls final posting time.</p></section>
        <section><h2 className="font-semibold text-ink">No current paid orders</h2><p>Paid pilot ordering is not currently open. Product return, damage, delay, and preorder rules will be published and presented before paid product orders begin.</p></section>
        <section><h2 className="font-semibold text-ink">Unauthorized or duplicate charge</h2><p>Contact team@eatdaypack.com promptly with the checkout email and charge date. Do not send full card numbers by email.</p></section>
      </div>
    </main>
  );
}
