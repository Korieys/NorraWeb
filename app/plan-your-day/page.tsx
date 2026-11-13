import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DayPlanner } from "@/components/DayPlanner";
export const metadata = { title: "Free day planner | Daypack", description: "Plan breakfast, lunch, dinner, and snacks. Make a packing list, save a copy, or print your plan. No account or preorder needed." };
export default function PlanYourDay() {
  return <><Nav /><main className="dp-site dp-planner-page" id="main-content"><section className="dp-section"><div className="dp-wrap dp-planner-layout"><div className="dp-planner-intro"><Link href="/" className="dp-back">← Back to Daypack</Link><p className="dp-label">Free day planner</p><h1>Tomorrow,<br />on one page.</h1><p className="dp-lead">Write down the food you want to take. Check it off when it is packed.</p><p>Start with your schedule and food you already like. Add any utensils, water, or storage equipment to the notes.</p><Link className="dp-text-link" href="/guides/plan-a-day-away">Read the planning guide <span aria-hidden>↗</span></Link><div className="dp-planner-aside"><h2>Your plan stays yours.</h2><p>No account needed. The planner saves in this browser when storage is available. Download a copy to keep it elsewhere.</p><p>Follow the storage and preparation directions on your chosen food labels.</p></div></div><DayPlanner /></div></section></main><Footer /></>;
}
