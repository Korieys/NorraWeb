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
              DAILY PROTEIN, SORTED · 110 TO 230 GRAMS
            </p>
            <p className="mt-8 max-w-[420px] font-sans text-[14px] leading-[1.6] text-paper/70">
              Pick your daily protein target. Eat the pouch. Real food. Shelf
              stable. Built for any adult who wants the number handled.
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
                <a href="mailto:team@eatdaypack.com" className="hover:text-paper">
                  REFUNDS · TEAM@EATDAYPACK.COM
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
                  href="https://facebook.com/eatdaypack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paper"
                >
                  FACEBOOK
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@EatDaypack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paper"
                >
                  YOUTUBE
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
        </div>
      </div>
    </footer>
  );
}
