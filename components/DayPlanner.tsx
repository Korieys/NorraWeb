"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, Check, Printer } from "lucide-react";

type Meal = { id: string; name: string; food: string; packed: boolean };
type Plan = { day: string; notes: string; meals: Meal[] };
const STORAGE_KEY = "daypack-day-plan-v1";
const blankPlan = (): Plan => ({ day: "", notes: "", meals: [
  { id: "breakfast", name: "Breakfast", food: "", packed: false },
  { id: "lunch", name: "Lunch", food: "", packed: false },
  { id: "dinner", name: "Dinner", food: "", packed: false },
  { id: "snacks", name: "Snacks & backup", food: "", packed: false },
] });

export function DayPlanner({ compact = false }: { compact?: boolean }) {
  const [plan, setPlan] = useState<Plan>(blankPlan);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        const empty = blankPlan();
        if (typeof stored.day === "string" && typeof stored.notes === "string" && Array.isArray(stored.meals)) {
          setPlan({ day: stored.day.slice(0, 80), notes: stored.notes.slice(0, 500), meals: empty.meals.map((meal) => {
            const item = stored.meals.find((entry: Meal) => entry?.id === meal.id);
            return { ...meal, food: typeof item?.food === "string" ? item.food.slice(0, 240) : "", packed: item?.packed === true };
          }) });
        }
      }
    } catch { /* The planner remains usable when browser storage is unavailable. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      setSaved(true);
    } catch { setSaved(false); }
  }, [plan, ready]);

  const count = plan.meals.filter((meal) => meal.food.trim()).length;
  const packed = plan.meals.filter((meal) => meal.food.trim() && meal.packed).length;

  function updateMeal(id: string, value: string) {
    setPlan((current) => ({ ...current, meals: current.meals.map((meal) => meal.id === id ? { ...meal, food: value, packed: false } : meal) }));
  }

  function download() {
    const copy = ["DAYPACK / YOUR DAY PLAN", plan.day || "My day", "", ...plan.meals.map((meal) => `${meal.packed ? "[x]" : "[ ]"} ${meal.name}: ${meal.food.trim() || "Not planned"}`), "", "Equipment & notes", plan.notes || "None added", "", "Follow each product's storage and preparation instructions.", "Made at eatdaypack.com"].join("\n");
    const url = URL.createObjectURL(new Blob([copy], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "daypack-my-day-plan.txt";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Your plan has been downloaded.");
  }

  return <div className={`day-planner ${compact ? "day-planner--compact" : ""}`}>
    <div className="planner-heading"><span className="dp-label">Your day, on one page</span><span className="planner-number">01—04</span></div>
    <label className="planner-day" htmlFor="plan-day">Plan for<input id="plan-day" maxLength={80} placeholder="Tomorrow, a long shift, a day out…" value={plan.day} onChange={(e) => setPlan({ ...plan, day: e.target.value })} /></label>
    <div className="planner-meals">
      {plan.meals.map((meal, index) => <div className="planner-meal" key={meal.id}>
        <span className="planner-index" aria-hidden>{String(index + 1).padStart(2, "0")}</span>
        <div className="planner-field"><label htmlFor={`food-${meal.id}`}>{meal.name}</label><input id={`food-${meal.id}`} maxLength={240} placeholder="Add your food" value={meal.food} onChange={(e) => updateMeal(meal.id, e.target.value)} /></div>
        <label className={`planner-check ${meal.packed ? "is-checked" : ""}`} title={`Mark ${meal.name.toLowerCase()} packed`}><input type="checkbox" aria-label={`${meal.name} packed`} checked={meal.packed} disabled={!meal.food.trim()} onChange={(e) => setPlan((current) => ({ ...current, meals: current.meals.map((entry) => entry.id === meal.id ? { ...entry, packed: e.target.checked } : entry) }))} /><Check size={18} aria-hidden /></label>
      </div>)}
    </div>
    {!compact && <div className="planner-notes"><label htmlFor="plan-notes">Equipment & notes</label><textarea id="plan-notes" maxLength={500} rows={3} placeholder="Utensils, water, storage, anything to remember…" value={plan.notes} onChange={(e) => setPlan({ ...plan, notes: e.target.value })} /></div>}
    <div className="planner-bottom"><p><strong>{count}/4</strong> planned <span>·</span> <strong>{packed}</strong> packed</p>{compact ? <a className="dp-text-link" href="/plan-your-day">Open full planner <span aria-hidden>↗</span></a> : <div className="planner-actions"><button type="button" onClick={download} className="dp-button dp-button--small"><ArrowDownToLine size={16} aria-hidden /> Save a copy</button><button type="button" onClick={() => window.print()} className="dp-button dp-button--outline dp-button--small"><Printer size={16} aria-hidden /> Print plan</button></div>}</div>
    {!compact && <div className="planner-storage"><p>{saved ? "Saved in this browser. Your plan stays on this device." : "Your plan stays on this page. Use Save a copy to keep it."}</p><button type="button" className="dp-text-link" onClick={() => { setPlan(blankPlan()); setMessage("The plan has been cleared."); }}>Clear plan</button></div>}
    <p className="sr-only" role="status">{message}</p>
  </div>;
}
