"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Reveal } from "@/components/Reveal";
import { track, getMetaCookies } from "@/lib/analytics";
import { SKUS, SKU_ORDER, type SkuId } from "@/lib/skus";

export function ConversionBlock() {
  const [sku, setSku] = useState<SkuId>("170");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  const selected = SKUS[sku];

  async function reserve() {
    setLoading(true);
    track("InitiateCheckout", { sku, value: 1, currency: "USD" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, ...getMetaCookies() }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Checkout failed");
      }
    } catch (err) {
      setLoading(false);
      alert("Checkout temporarily unavailable. Try again shortly.");
    }
  }

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setEmailStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "conversion_block" }),
      });
      if (!res.ok) throw new Error("Subscribe failed");
      track("Lead", { value: 0, source: "conversion_block" });
      setEmailStatus("ok");
      setEmail("");
    } catch (err) {
      setEmailStatus("err");
    }
  }

  return (
    <section id="reserve" className="relative overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(244,240,232,0.18) 0 1px, transparent 1px 18px)",
        }}
      />
      <div className="relative mx-auto max-w-content px-6 py-24 lg:px-10 lg:py-32">
        <Reveal as="p" className="text-center font-sans text-[12px] font-semibold uppercase tracking-wide-lg text-tan">
          JOIN THE FIRST RUN
        </Reveal>
        <Reveal as="h2" delayMs={100} className="mx-auto mt-6 max-w-[900px] text-center font-display text-[40px] font-medium uppercase leading-[1.05] tracking-wide-sm text-paper sm:text-[56px] lg:text-[72px]">
          RESERVE YOUR SPOT.
        </Reveal>
        <Reveal as="p" delayMs={200} className="mx-auto mt-6 max-w-[560px] text-center font-sans text-[16px] leading-[1.55] text-paper/70 lg:text-[18px]">
          First shipment Q3 2026. Founder pricing for early reservations.
        </Reveal>
        <Reveal as="p" delayMs={280} className="mx-auto mt-3 max-w-[560px] text-center font-sans text-[11px] leading-[1.5] text-paper/45">
          Final flavors, ingredients &amp; packaging may change before launch.
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Primary: $1 deposit, 3/5 width */}
          <Reveal variant="fade-scale" delayMs={300} className="bg-paper p-8 text-ink lg:col-span-3 lg:p-12">
            <div className="flex items-baseline justify-between">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/55">
                OPTION 01 · RECOMMENDED
              </p>
              <span className={`font-display text-[11px] font-medium uppercase tracking-wide-md ${selected.color.text}`}>
                {selected.color.name.toUpperCase()}
              </span>
            </div>
            <h3 className="mt-4 font-display text-[36px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[48px]">
              PUT DOWN $1.
            </h3>
            <p className="mt-4 max-w-[440px] font-sans text-[15px] leading-[1.55] text-ink/75">
              Get $20 off launch. Refundable any time. Locks in founder pricing
              and early access.
            </p>
            <div className="mt-8">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/55">
                SELECT YOUR TARGET
              </p>
              <div className="mt-3 inline-flex flex-wrap rounded-[4px] border border-ink/15 p-1">
                {SKU_ORDER.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSku(s)}
                    aria-pressed={sku === s}
                    className={`h-11 px-4 font-sans text-[13px] font-semibold uppercase tracking-wide-md transition-colors sm:px-5 ${
                      sku === s
                        ? "bg-ink text-paper"
                        : "text-ink hover:bg-ink/5"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-3 font-sans text-[12px] leading-[1.5] text-ink/60">
                Not sure which number is yours?{" "}
                <a
                  href="/find-your-pack"
                  className="font-semibold uppercase tracking-wide-md text-ink underline underline-offset-4 hover:text-ink/70"
                >
                  FIND YOUR PACK →
                </a>
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
              <Button onClick={reserve} disabled={loading} size="lg" className="w-full sm:w-auto">
                {loading ? "REDIRECTING..." : `RESERVE THE ${sku} — $1`}
              </Button>
              <span className="font-sans text-[11px] font-semibold uppercase tracking-wide-md text-ink/50">
                SECURE CHECKOUT VIA STRIPE
              </span>
            </div>
          </Reveal>

          {/* Secondary: email, 2/5 width */}
          <Reveal variant="fade-scale" delayMs={420} className="bg-tan p-8 text-ink lg:col-span-2 lg:p-12">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/60">
              OPTION 02
            </p>
            <h3 className="mt-4 font-display text-[36px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[44px]">
              JUST GET UPDATES.
            </h3>
            <p className="mt-4 font-sans text-[15px] leading-[1.55] text-ink/80">
              Email only. We&apos;ll tell you when it ships.
            </p>
            <form onSubmit={subscribe} className="mt-8 flex flex-col gap-3">
              <Input
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-ink/25 bg-paper"
                aria-label="Email address"
              />
              <Button
                type="submit"
                variant="outlineInk"
                disabled={emailStatus === "loading"}
              >
                {emailStatus === "loading" ? "SENDING..." : "NOTIFY ME"}
              </Button>
              {emailStatus === "ok" && (
                <p className="text-[12px] font-semibold uppercase tracking-wide-md text-olive">
                  You&apos;re on the list.
                </p>
              )}
              {emailStatus === "err" && (
                <p className="text-[12px] font-semibold uppercase tracking-wide-md text-sienna">
                  Try again.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
