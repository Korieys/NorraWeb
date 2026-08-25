import Link from "next/link";
import { EmailDialog } from "@/components/EmailDialog";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/15">
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5 lg:px-10">
          <span className="font-display text-2xl font-semibold uppercase tracking-wide-sm">
            Daypack
          </span>
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-ink/55">
            A Daysworth product
          </span>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-content px-6 py-20 lg:px-10 lg:py-28">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/60">
            Pilot update
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl font-medium uppercase leading-[0.95] tracking-wide-sm sm:text-7xl lg:text-8xl">
            A full day of food, in one pack.
          </h1>
          <p className="mt-8 max-w-2xl font-sans text-lg leading-8 text-ink/75">
            Daypack is preparing a small direct-to-consumer pilot: a curated
            assortment of unopened, shelf-stable foods from third-party
            manufacturers, organized into one day. The exact pilot contents,
            verified nutrition, price, shipping window, and ordering terms will
            be published before paid orders open.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <EmailDialog
              trigger={
                <button
                  type="button"
                  className="rounded-[4px] bg-ink px-6 py-4 font-sans text-sm font-semibold uppercase tracking-wide-md text-paper"
                >
                  Get the pilot update
                </button>
              }
            />
            <a
              href="mailto:team@eatdaypack.com"
              className="font-sans text-sm font-medium underline underline-offset-4"
            >
              Questions or refund request
            </a>
          </div>

          <div className="mt-16 max-w-2xl border-t border-ink/15 pt-8">
            <h2 className="font-display text-2xl font-medium uppercase tracking-wide-sm">
              Paid reservations are paused
            </h2>
            <p className="mt-3 font-sans text-sm leading-6 text-ink/70">
              We are updating the pilot offer and merchant information. If you
              previously paid a $1 reservation and want a refund, email
              team@eatdaypack.com from the address used at checkout.
            </p>
          </div>

          <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-3 font-sans text-xs font-semibold uppercase tracking-wide-md">
            <Link href="/privacy" className="underline underline-offset-4">Privacy</Link>
            <Link href="/terms" className="underline underline-offset-4">Terms</Link>
            <Link href="/refunds" className="underline underline-offset-4">Refunds</Link>
            <Link href="/shipping" className="underline underline-offset-4">Shipping</Link>
          </nav>
        </section>
      </main>
      <Footer />
    </div>
  );
}
