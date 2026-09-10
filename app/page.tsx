import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PreorderButton } from "@/components/PreorderButton";
import { EmailDialog } from "@/components/EmailDialog";
import { FAQ } from "@/components/FAQ";
import { SKUS } from "@/lib/skus";

const pack = SKUS["170"];
const CONTENTS = [
  { meal: "Breakfast", items: ["Kodiak Chocolate Chip Protein Muffin Power Cup", "Quest Strawberry Protein Milkshake"] },
  { meal: "Lunch", items: ["One HMR shelf-stable entrée", "Quest Chocolate Protein Milkshake"] },
  { meal: "Dinner", items: ["One HMR shelf-stable entrée"] },
  { meal: "Snacks", items: ["Legendary Blueberry Protein Tasty Pastry", "think! 20g Protein Bar", "Two H-E-B Hit the Trail Mix packets"] },
];

const HMR_ROTATION = ["Chicken Pasta Parmesan", "Turkey Chili", "Rotini Chicken Alfredo", "Beef Stroganoff", "Penne Pasta with Meatballs", "Lasagna with Meat Sauce"];

export default function Home() {
  return (
    <>
      <Nav />
      <main className="bg-paper text-ink">
        <section className="relative overflow-hidden border-b border-ink/15 bg-pine text-paper">
          <div className="absolute inset-0 opacity-[0.07]" aria-hidden style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,.2) 0 1px, transparent 1px 18px)" }} />
          <div className="relative mx-auto grid max-w-content lg:min-h-[720px] lg:grid-cols-12">
            <div className="flex flex-col justify-center px-6 py-16 sm:px-8 lg:col-span-7 lg:px-10 lg:py-24">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-paper/65">First-run preorder · Daypack 170 · Three ways in</p>
              <h1 className="mt-6 max-w-4xl font-display text-[64px] font-medium uppercase leading-[0.86] tracking-wide-sm sm:text-[84px] lg:text-[108px]">The everyday pack is ready.</h1>
              <p className="mt-8 max-w-xl font-sans text-lg leading-8 text-paper/80 sm:text-xl">One complete day, packed and ready. Nine shelf-stable items deliver 170g+ of protein and roughly 2,000–2,100 calories without the grocery-store side quest.</p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <PreorderButton variant="invertedPaper" />
                <a href="#inside" className="font-sans text-sm font-semibold uppercase tracking-wide-md text-paper underline underline-offset-4">See what is inside</a>
              </div>
              <p className="mt-6 max-w-xl font-sans text-[11px] font-semibold uppercase leading-5 tracking-wide-md text-paper/55">From $54.99 + $9.99 shipping · Estimated Q4 2026 fulfillment · Cancel for a full refund before shipment</p>
            </div>
            <div className="relative min-h-[460px] bg-[#d5c39d] lg:col-span-5 lg:min-h-full">
              <Image src={pack.image.src} alt={pack.image.alt} fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
              <p className="absolute bottom-4 left-4 right-4 rounded bg-paper/90 px-3 py-2 font-sans text-[10px] leading-4 text-ink/65 backdrop-blur">Prototype packaging. Final brands, flavors, and presentation may vary; material changes will be shared before fulfillment.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-ink/15">
          <div className="mx-auto grid max-w-content grid-cols-2 lg:grid-cols-4">
            {[["170G+", "Working protein target"], ["9", "Individual items"], ["2,000–2,100", "Approx. calories"], ["$54.99", "Single-pack price"]].map(([value, label]) => (
              <div key={label} className="border-b border-r border-ink/15 px-6 py-8 last:border-r-0 lg:border-b-0 lg:px-8">
                <p className="font-display text-4xl font-medium uppercase tracking-wide-sm">{value}</p>
                <p className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-ink/50">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="inside" className="mx-auto grid max-w-content gap-14 px-6 py-20 lg:grid-cols-12 lg:px-10 lg:py-28">
          <div className="lg:col-span-5">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-pine">Built around your day</p>
            <h2 className="mt-5 font-display text-5xl font-medium uppercase leading-[0.95] tracking-wide-sm sm:text-6xl">Nine items. Your whole day.</h2>
            <p className="mt-6 max-w-md font-sans text-base leading-7 text-ink/70">A warm protein breakfast, two savory entrées, two protein milkshakes, a protein pastry, a 20g protein bar, and two trail mix packets—organized by the moment you need them.</p>
          </div>
          <div className="lg:col-span-7 lg:pl-10">
            <ol className="divide-y divide-ink/15 border-y border-ink/15">
              {CONTENTS.map((group, index) => (
                <li key={group.meal} className="grid grid-cols-[44px_1fr] gap-4 py-6 sm:grid-cols-[44px_120px_1fr]">
                  <span className="font-sans text-[10px] font-semibold tracking-wide-lg text-ink/35">0{index + 1}</span>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-pine">{group.meal}</p>
                  <ul className="space-y-2">{group.items.map((item) => <li key={item} className="font-display text-lg uppercase leading-6 tracking-wide-sm">{item}</li>)}</ul>
                </li>
              ))}
            </ol>
            <p className="mt-4 font-sans text-xs leading-5 text-ink/50">Nine individual items total. Nutrition varies with the two entrées selected. Always review the received labels for ingredients, allergens, nutrition, storage, and preparation directions.</p>
          </div>
        </section>

        <section className="border-y border-ink/15 bg-paper">
          <div className="mx-auto grid max-w-content gap-12 px-6 py-20 lg:grid-cols-12 lg:px-10 lg:py-24">
            <div className="lg:col-span-4"><p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-pine">Rotating HMR selection</p><h2 className="mt-5 font-display text-4xl font-medium uppercase leading-none tracking-wide-sm sm:text-5xl">Two savory entrées in every pack.</h2><p className="mt-6 font-sans text-sm leading-6 text-ink/65">The exact pair rotates while we finish received-label and taste validation. We will confirm the final combination before fulfillment.</p></div>
            <ul className="grid gap-px bg-ink/15 sm:grid-cols-2 lg:col-span-8">{HMR_ROTATION.map((item, index) => <li key={item} className="flex items-center gap-4 bg-paper p-5"><span className="font-sans text-[10px] font-semibold text-ink/35">{String(index + 1).padStart(2, "0")}</span><span className="font-display text-base uppercase tracking-wide-sm">{item}</span></li>)}</ul>
          </div>
        </section>

        <section className="bg-[#ded3bd]">
          <div className="mx-auto grid max-w-content gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
            <div><p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-pine">The first run</p><h2 className="mt-5 font-display text-5xl font-medium uppercase leading-none tracking-wide-sm sm:text-6xl">One focused pack.</h2></div>
            <div className="space-y-6 font-sans text-base leading-7 text-ink/75"><p>We are opening the 170 first because it is the most useful everyday baseline in the Daypack range. Start with one pack, stock three, or subscribe to a monthly Core 3 delivery.</p><p>You will receive production and fulfillment updates by email. If the timing or final product details no longer work for you, cancel before shipment for a full refund to the original payment method.</p></div>
          </div>
        </section>

        <FAQ />

        <section id="preorder" className="bg-ink text-paper">
          <div className="mx-auto max-w-content px-6 py-20 lg:px-10 lg:py-28">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-paper/50">Daypack 170 · Pine · First run</p>
            <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><h2 className="max-w-3xl font-display text-5xl font-medium uppercase leading-[0.95] tracking-wide-sm sm:text-7xl">Choose your standby.</h2><p className="max-w-sm font-sans text-sm leading-6 text-paper/60">Every option adds $9.99 standard U.S. shipping at checkout. First fulfillment is estimated for Q4 2026.</p></div>
            <div className="mt-14 grid gap-px overflow-hidden rounded bg-paper/15 lg:grid-cols-3">
              <Offer title="1 Daypack" price="$54.99" detail="One-time" copy="One full day. The simplest way to try the 170." offer="single" label="PREORDER 1 DAYPACK" />
              <Offer title="Core 3" price="$149.99" detail="One-time · Save $15" copy="Three full days, stocked once. No renewal." offer="core3" label="PREORDER CORE 3" featured />
              <Offer title="Core 3" price="$139.99" detail="Monthly subscription · Save $25" copy="Three packs delivered each month until you cancel." offer="core3-subscription" label="SUBSCRIBE TO CORE 3" />
            </div>
            <p className="mt-6 max-w-2xl font-sans text-xs leading-5 text-paper/50">Secure checkout by Stripe. Subscriptions renew monthly at $139.99 plus shipping until canceled. By ordering, you agree to the <Link href="/terms" className="underline">Terms</Link>, <Link href="/shipping" className="underline">Shipping Policy</Link>, and <Link href="/refunds" className="underline">Refund Policy</Link>.</p>
            <EmailDialog trigger={<button className="mt-5 text-left font-sans text-xs font-semibold uppercase tracking-wide-md text-paper/70 underline underline-offset-4">Not ready? Get production updates</button>} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Offer({ title, price, detail, copy, offer, label, featured = false }: { title: string; price: string; detail: string; copy: string; offer: "single" | "core3" | "core3-subscription"; label: string; featured?: boolean }) {
  return <article className={`flex min-h-[390px] flex-col p-8 lg:p-10 ${featured ? "bg-pine text-paper" : "bg-paper text-ink"}`}>
    <p className={`font-sans text-[10px] font-semibold uppercase tracking-wide-lg ${featured ? "text-paper/55" : "text-ink/45"}`}>{featured ? "Most popular" : "Daypack 170"}</p>
    <h3 className="mt-5 font-display text-4xl font-medium uppercase tracking-wide-sm">{title}</h3>
    <p className="mt-8 font-display text-5xl font-medium">{price}</p>
    <p className={`mt-2 font-sans text-[10px] font-semibold uppercase tracking-wide-md ${featured ? "text-paper/55" : "text-ink/45"}`}>{detail} · + shipping</p>
    <p className={`mt-6 font-sans text-sm leading-6 ${featured ? "text-paper/70" : "text-ink/65"}`}>{copy}</p>
    <PreorderButton offer={offer} className="mt-auto pt-8" variant={featured ? "invertedPaper" : "primary"} label={label} />
  </article>;
}
