"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 h-[72px] w-full bg-paper transition-shadow",
        scrolled ? "border-b border-ink/10" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex flex-col leading-none" onClick={close}>
          <span className="font-display text-[22px] font-medium uppercase tracking-wide-lg text-ink">
            DAYPACK
          </span>
          <span className="mt-0.5 hidden font-sans text-[9px] font-semibold uppercase tracking-wide-lg text-ink/55 md:block">
            COMPLETE DAILY NUTRITION
          </span>
        </Link>
        <nav className="hidden items-center gap-7 font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/65 md:flex">
          <a href="/#sku-110" className="hover:text-ink">PACKS</a>
          <Link href="/find-your-pack" className="hover:text-ink">FIND YOUR PACK</Link>
          <Link href="/story" className="hover:text-ink">STORY</Link>
          <a href="/#faq" className="hover:text-ink">FAQ</a>
        </nav>
        <div className="hidden md:block">
          <Button asChild size="sm">
            <a href="/find-your-pack">FIND YOUR PACK</a>
          </Button>
        </div>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center text-ink md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={cn(
                "absolute left-0 top-0 block h-[2px] w-full bg-current transition-transform",
                open && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[7px] block h-[2px] w-full bg-current transition-opacity",
                open && "opacity-0"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[14px] block h-[2px] w-full bg-current transition-transform",
                open && "-translate-y-[7px] -rotate-45"
              )}
            />
          </span>
        </button>
      </div>
    </header>

    {/* Mobile menu — outside <header> so fixed positioning escapes the sticky stacking context */}
    <div
      id="mobile-nav"
      className={cn(
        "fixed inset-x-0 top-[72px] z-40 origin-top overflow-hidden border-b border-ink/10 bg-paper transition-[max-height] duration-300 ease-out md:hidden",
        open ? "max-h-[80vh]" : "max-h-0"
      )}
    >
      <nav className="flex flex-col px-6 py-4 font-sans text-sm font-semibold uppercase tracking-wide-lg text-ink">
        <a href="/#sku-110" onClick={close} className="border-b border-ink/10 py-4 active:bg-ink/5">PACKS</a>
        <Link href="/find-your-pack" onClick={close} className="border-b border-ink/10 py-4 active:bg-ink/5">FIND YOUR PACK</Link>
        <Link href="/story" onClick={close} className="border-b border-ink/10 py-4 active:bg-ink/5">STORY</Link>
        <a href="/#faq" onClick={close} className="border-b border-ink/10 py-4 active:bg-ink/5">FAQ</a>
        <div className="py-5">
          <Button asChild size="lg" className="w-full">
            <a href="/find-your-pack" onClick={close}>FIND YOUR PACK</a>
          </Button>
        </div>
      </nav>
    </div>

    {/* Backdrop — outside <header> for the same reason; z-30 keeps it below the menu and header */}
    {open && (
      <div
        aria-hidden
        className="fixed inset-x-0 bottom-0 top-[72px] z-30 bg-ink/20 backdrop-blur-[2px] md:hidden"
        onClick={close}
      />
    )}
    </>
  );
}
