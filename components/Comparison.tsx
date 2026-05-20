"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

type Row = {
  brand: string;
  what: string;
  protein: string;
  cost: string;
  catch_: string;
  highlight: boolean;
};

const ROWS: Row[] = [
  {
    brand: "DAYPACK",
    what: "A protein number. 4 meals per day, pre-portioned to hit your target.",
    protein: "170 / 200 / 230g",
    cost: "$24.99 / day",
    catch_: "None. That's the point.",
    highlight: true,
  },
  {
    brand: "FACTOR",
    what: "Frozen single meals. You pick 5-18 per week.",
    protein: "~30g/meal, varies",
    cost: "$39-45 / day",
    catch_: "You still pick meals. You still count protein. You need freezer space.",
    highlight: false,
  },
  {
    brand: "HUEL",
    what: "Powdered meal replacement. You mix and drink it.",
    protein: "~30g/shake",
    cost: "$8-12 / day",
    catch_: "It's not food. Texture fatigue is real. Try eating a shake at a work lunch.",
    highlight: false,
  },
  {
    brand: "KEVIN'S",
    what: "Refrigerated protein pouches. You assemble meals yourself.",
    protein: "~25g/pouch",
    cost: "$8-12 / pouch (you need 3-4)",
    catch_: "You're still building your own day. The math is still on you.",
    highlight: false,
  },
  {
    brand: "PEAK REFUEL",
    what: "Freeze-dried backpacking meals. Add water, wait, eat.",
    protein: "~30-50g/meal",
    cost: "$12-18 / meal",
    catch_: "Built for the mountain, not Monday. Texture and prep time make it occasional food.",
    highlight: false,
  },
];

export function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firedRef.current) {
          firedRef.current = true;
          track("ViewComparison");
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6 lg:px-10">
        <p className="text-center font-sans text-[13px] font-semibold uppercase tracking-wide-md text-tan">
          THE OBVIOUS CHOICE
        </p>
        <h2 className="mt-4 text-center font-display text-[36px] font-medium uppercase leading-[0.95] tracking-wide-sm text-ink lg:text-[56px]">
          EVERYTHING ELSE ASKS YOU TO THINK.
        </h2>
        <p className="mx-auto mt-6 max-w-[640px] text-center font-sans text-[18px] leading-[1.5] text-ink/80 lg:text-[20px]">
          Daypack is the only brand that ships you a target instead of a menu.
          Compare for yourself.
        </p>

        {/* Desktop table */}
        <div className="mt-12 hidden overflow-hidden rounded-sm lg:block">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="border-b border-ink/12">
                <th className="w-[180px] border-b border-ink/12 pb-3 text-left font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/50">
                  Brand
                </th>
                <th className="w-[200px] border-b border-ink/12 pb-3 text-left font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/50">
                  What They Sell
                </th>
                <th className="w-[120px] border-b border-ink/12 pb-3 text-center font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/50">
                  Daily Protein
                </th>
                <th className="w-[140px] border-b border-ink/12 pb-3 text-center font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/50">
                  Daily Cost
                </th>
                <th className="border-b border-ink/12 pb-3 text-left font-sans text-[11px] font-semibold uppercase tracking-wide-lg text-ink/50">
                  The Catch
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.brand}
                  className={
                    row.highlight
                      ? "bg-olive"
                      : i < ROWS.length - 1
                      ? "border-b border-ink/8 bg-white"
                      : "bg-white"
                  }
                >
                  <td
                    className={`py-5 pr-4 font-display text-[15px] font-medium uppercase tracking-wide-sm ${
                      row.highlight ? "text-paper" : "text-ink"
                    }`}
                  >
                    {row.brand}
                  </td>
                  <td
                    className={`py-5 pr-6 font-sans text-[14px] leading-[1.45] ${
                      row.highlight ? "text-paper/90" : "text-ink/75"
                    }`}
                  >
                    {row.what}
                  </td>
                  <td
                    className={`py-5 pr-6 text-center font-sans text-[14px] ${
                      row.highlight ? "text-paper/90" : "text-ink/75"
                    }`}
                  >
                    {row.protein}
                  </td>
                  <td
                    className={`py-5 pr-6 text-center font-sans text-[14px] font-semibold ${
                      row.highlight ? "text-paper" : "text-ink"
                    }`}
                  >
                    {row.cost}
                  </td>
                  <td
                    className={`py-5 font-sans text-[14px] leading-[1.45] ${
                      row.highlight ? "text-paper/85" : "text-ink/60"
                    }`}
                  >
                    {row.catch_}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-10 space-y-3 lg:hidden">
          {ROWS.map((row) => (
            <div
              key={row.brand}
              className={`rounded-sm px-5 py-5 ${
                row.highlight ? "bg-olive" : "bg-white"
              }`}
            >
              <p
                className={`font-display text-[17px] font-medium uppercase tracking-wide-sm ${
                  row.highlight ? "text-paper" : "text-ink"
                }`}
              >
                {row.brand}
              </p>
              <div className="mt-4 space-y-3">
                <div>
                  <p
                    className={`font-sans text-[10px] font-semibold uppercase tracking-wide-lg ${
                      row.highlight ? "text-paper/55" : "text-ink/45"
                    }`}
                  >
                    What They Sell
                  </p>
                  <p
                    className={`mt-1 font-sans text-[14px] leading-[1.4] ${
                      row.highlight ? "text-paper/90" : "text-ink/75"
                    }`}
                  >
                    {row.what}
                  </p>
                </div>
                <div className="flex gap-8">
                  <div>
                    <p
                      className={`font-sans text-[10px] font-semibold uppercase tracking-wide-lg ${
                        row.highlight ? "text-paper/55" : "text-ink/45"
                      }`}
                    >
                      Daily Protein
                    </p>
                    <p
                      className={`mt-1 font-sans text-[14px] ${
                        row.highlight ? "text-paper/90" : "text-ink/75"
                      }`}
                    >
                      {row.protein}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`font-sans text-[10px] font-semibold uppercase tracking-wide-lg ${
                        row.highlight ? "text-paper/55" : "text-ink/45"
                      }`}
                    >
                      Daily Cost
                    </p>
                    <p
                      className={`mt-1 font-sans text-[14px] font-semibold ${
                        row.highlight ? "text-paper" : "text-ink"
                      }`}
                    >
                      {row.cost}
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    className={`font-sans text-[10px] font-semibold uppercase tracking-wide-lg ${
                      row.highlight ? "text-paper/55" : "text-ink/45"
                    }`}
                  >
                    The Catch
                  </p>
                  <p
                    className={`mt-1 font-sans text-[14px] leading-[1.4] ${
                      row.highlight ? "text-paper/85" : "text-ink/60"
                    }`}
                  >
                    {row.catch_}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-[560px] text-center font-sans text-[18px] italic leading-[1.5] text-ink/70">
          Every competitor sells food and asks you to do the math. Daypack sells
          the math. The box is the answer.
        </p>
      </div>
    </section>
  );
}
