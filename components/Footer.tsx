import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(244,240,232,0.2) 0 1px, transparent 1px 18px)",
        }}
      />
      <div className="relative mx-auto max-w-content px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <p className="font-display text-[40px] font-medium uppercase leading-none tracking-wide-lg text-paper lg:text-[56px]">
              DAYPACK
            </p>
            <p className="mt-3 font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-paper/55">
              COMPLETE DAILY NUTRITION · DESIGNED FOR THE NUMBER
            </p>
            <p className="mt-8 max-w-[420px] font-sans text-[14px] leading-[1.6] text-paper/70">
              Hit your number. Fuel your day. Real food. Real fuel. No
              compromises.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-paper/45">
              CONTACT
            </p>
            <ul className="mt-4 space-y-2 font-sans text-[12px] font-semibold uppercase tracking-wide-md text-paper/85">
              <li>
                <a href="mailto:hello@eatdaypack.com" className="hover:text-paper">
                  HELLO@EATDAYPACK.COM
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/eatdaypack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paper"
                >
                  INSTAGRAM
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/eatdaypack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paper"
                >
                  TWITTER
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-wide-lg text-paper/45">
              LEGAL
            </p>
            <ul className="mt-4 space-y-2 font-sans text-[12px] font-semibold uppercase tracking-wide-md text-paper/85">
              <li>
                <Link href="/privacy" className="hover:text-paper">
                  PRIVACY
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-paper">
                  TERMS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-md text-paper/50">
            © 2026 DAYPACK. NOT YET SHIPPING. RESERVE TO BE FIRST.
          </p>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-md text-paper/40">
            DESIGNED IN THE PACIFIC NORTHWEST
          </p>
        </div>
      </div>
    </footer>
  );
}
