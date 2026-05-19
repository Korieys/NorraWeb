"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-[72px] w-full bg-paper transition-shadow",
        scrolled ? "border-b border-ink/10" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-[22px] font-medium uppercase tracking-wide-lg text-ink">
            NORRA
          </span>
          <span className="mt-0.5 hidden font-sans text-[9px] font-semibold uppercase tracking-wide-lg text-ink/55 md:block">
            COMPLETE DAILY NUTRITION
          </span>
        </Link>
        <nav className="hidden items-center gap-7 font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/65 md:flex">
          <a href="#sku-170" className="hover:text-ink">PACKS</a>
          <a href="#why" className="hover:text-ink">WHY</a>
          <a href="#faq" className="hover:text-ink">FAQ</a>
        </nav>
        <Button asChild size="sm">
          <a href="#sku-170">RESERVE A PACK</a>
        </Button>
      </div>
    </header>
  );
}
