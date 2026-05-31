"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PackMockup } from "@/components/PackMockup";
import { Reveal } from "@/components/Reveal";
import { SKUS, recommendSku } from "@/lib/skus";
import { track, getMetaCookies } from "@/lib/analytics";

type Goal = "lose" | "maintain" | "gain";
type Activity = "sedentary" | "moderate" | "active";

const GOALS: { value: Goal; label: string; sub: string }[] = [
  { value: "lose", label: "LOSE WEIGHT", sub: "In a deficit" },
  { value: "maintain", label: "HOLD STEADY", sub: "At maintenance" },
  { value: "gain", label: "BUILD MUSCLE", sub: "In a surplus" },
];

const ACTIVITIES: { value: Activity; label: string; sub: string }[] = [
  { value: "sedentary", label: "SEDENTARY", sub: "Desk job, light walking" },
  { value: "moderate", label: "MODERATE", sub: "Train 3 to 4 days a week" },
  { value: "active", label: "ACTIVE", sub: "Train 5+ days, manual work" },
];

export function FindYourPack() {
  const [weight, setWeight] = useState<string>("");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [submitted, setSubmitted] = useState(false);
  const [reserving, setReserving] = useState(false);

  const weightNum = Number(weight);
  const validWeight = weightNum >= 80 && weightNum <= 400;

  const result = useMemo(() => {
    if (!validWeight) return null;
    return recommendSku({
      bodyweightLb: weightNum,
      goal,
      activity,
    });
  }, [weightNum, goal, activity, validWeight]);

  const sku = result ? SKUS[result.skuId] : null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validWeight) return;
    setSubmitted(true);
    if (result) {
      track("FindYourPack", {
        bodyweight: weightNum,
        goal,
        activity,
        recommended: result.skuId,
        target_grams: result.targetGrams,
      });
    }
  }

  async function reserve() {
    if (!result) return;
    setReserving(true);
    track("InitiateCheckout", {
      sku: result.skuId,
      value: 1,
      currency: "USD",
      source: "find_your_pack",
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: result.skuId, ...getMetaCookies() }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Checkout failed");
      }
    } catch (err) {
      console.error(err);
      setReserving(false);
      alert("Checkout temporarily unavailable. Try again shortly.");
    }
  }

  return (
    <section className="border-t border-ink/10 bg-paper pb-32 pt-12 lg:pb-40 lg:pt-16">
      <div className="mx-auto max-w-content px-6 lg:px-10">
        <Reveal variant="fade-scale" className="grid grid-cols-1 gap-px overflow-hidden border border-ink/10 bg-ink/10 lg:grid-cols-12">
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="bg-paper p-8 lg:col-span-7 lg:p-12"
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/55">
              STEP 01
            </p>
            <label
              htmlFor="bodyweight"
              className="mt-3 block font-display text-[24px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[28px]"
            >
              YOUR BODY WEIGHT
            </label>
            <div className="mt-4 flex items-center gap-3">
              <Input
                id="bodyweight"
                type="number"
                inputMode="numeric"
                min={80}
                max={400}
                step={1}
                placeholder="160"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setSubmitted(false);
                }}
                className="max-w-[200px] border-ink/25 bg-paper text-[20px]"
                aria-label="Body weight in pounds"
                required
              />
              <span className="font-sans text-[14px] font-semibold uppercase tracking-wide-md text-ink/55">
                LB
              </span>
            </div>

            <div className="mt-10">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/55">
                STEP 02
              </p>
              <p className="mt-3 font-display text-[24px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[28px]">
                YOUR GOAL
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => {
                      setGoal(g.value);
                      setSubmitted(false);
                    }}
                    aria-pressed={goal === g.value}
                    className={`flex flex-col items-start gap-1 border p-4 text-left transition-colors ${
                      goal === g.value
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/15 bg-paper text-ink hover:border-ink/40"
                    }`}
                  >
                    <span className="font-sans text-[12px] font-semibold uppercase tracking-wide-md">
                      {g.label}
                    </span>
                    <span
                      className={`font-sans text-[11px] ${
                        goal === g.value ? "text-paper/65" : "text-ink/55"
                      }`}
                    >
                      {g.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/55">
                STEP 03
              </p>
              <p className="mt-3 font-display text-[24px] font-medium uppercase leading-tight tracking-wide-sm text-ink lg:text-[28px]">
                YOUR ACTIVITY LEVEL
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {ACTIVITIES.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => {
                      setActivity(a.value);
                      setSubmitted(false);
                    }}
                    aria-pressed={activity === a.value}
                    className={`flex flex-col items-start gap-1 border p-4 text-left transition-colors ${
                      activity === a.value
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/15 bg-paper text-ink hover:border-ink/40"
                    }`}
                  >
                    <span className="font-sans text-[12px] font-semibold uppercase tracking-wide-md">
                      {a.label}
                    </span>
                    <span
                      className={`font-sans text-[11px] ${
                        activity === a.value ? "text-paper/65" : "text-ink/55"
                      }`}
                    >
                      {a.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <Button type="submit" size="lg" disabled={!validWeight}>
                CALCULATE MY PACK
              </Button>
              {!validWeight && weight !== "" && (
                <p className="mt-3 font-sans text-[12px] text-sienna">
                  Enter a body weight between 80 and 400 lb.
                </p>
              )}
            </div>
          </form>

          {/* Result */}
          <div className="bg-paper p-8 lg:col-span-5 lg:p-12">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/55">
              YOUR RECOMMENDATION
            </p>
            {submitted && result && sku ? (
              <div key={result.skuId} className="mt-6 animate-fade-in-up">
                <div className="flex animate-fade-in-scale items-center justify-center [animation-delay:120ms]">
                  <PackMockup sku={sku} size="md" />
                </div>
                <p className="mt-8 animate-fade-in font-display text-[12px] font-medium uppercase tracking-wide-md text-ink/55 [animation-delay:280ms]">
                  TARGET · {result.targetGrams} G PROTEIN PER DAY
                </p>
                <p className="mt-2 animate-fade-in-up font-display text-[40px] font-medium uppercase leading-none tracking-wide-sm text-ink lg:text-[52px] [animation-delay:360ms]">
                  {sku.title}
                </p>
                <p className="mt-4 animate-fade-in-up font-sans text-[15px] leading-[1.55] text-ink/75 [animation-delay:440ms]">
                  {result.rationale}
                </p>
                <div className="mt-6 animate-fade-in-up border-t border-ink/15 pt-6 [animation-delay:520ms]">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/55">
                    FOUNDER PRICING
                  </p>
                  <p className="mt-1 font-display text-[28px] font-medium leading-none tracking-wide-sm text-ink">
                    ${sku.pricePerDay.toFixed(2)}
                    <span className="ml-2 font-sans text-[12px] font-semibold uppercase tracking-wide-md text-ink/55">
                      / DAY
                    </span>
                  </p>
                </div>
                <div className="mt-6 flex animate-fade-in-up flex-col gap-3 [animation-delay:620ms]">
                  <Button onClick={reserve} disabled={reserving} size="lg">
                    {reserving ? "REDIRECTING..." : `RESERVE THE ${sku.id} · $1`}
                  </Button>
                  <a
                    href={`/#sku-${sku.id}`}
                    className="group font-sans text-[12px] font-semibold uppercase tracking-wide-md text-ink/65 underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    SEE THE FULL {sku.id} PACK{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center gap-3 border border-dashed border-ink/20 p-8 text-center">
                <p className="font-display text-[20px] font-medium uppercase tracking-wide-sm text-ink/40">
                  AWAITING INPUT
                </p>
                <p className="max-w-[260px] font-sans text-[13px] leading-[1.5] text-ink/55">
                  Fill in the form. We will snap your daily target to the
                  closest pack.
                </p>
              </div>
            )}
          </div>
        </Reveal>

        <p className="mt-6 max-w-[820px] font-sans text-[11px] leading-[1.55] text-ink/45">
          Sizing uses standard protein targets. About 0.8 g per pound of body
          weight at maintenance, 1.0 g for fat loss, 1.05 g for muscle gain,
          adjusted by activity level. Not medical advice. If you have
          specific dietary needs, talk to a registered dietitian.
        </p>
      </div>
    </section>
  );
}
