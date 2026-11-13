"use client";
import { Button } from "@/components/ui/Button";
export type OfferId = "single" | "core3" | "core3-subscription";
type Props = { offer?: OfferId; className?: string; label?: string; variant?: "primary" | "invertedPaper" | "outlinePaper" | "outlineInk" };
export function PreorderButton({ className, variant = "primary" }: Props) {
  return <div className={className}><Button type="button" size="lg" variant={variant} disabled className="w-full whitespace-normal sm:w-auto">PREORDERS PAUSED</Button><p className="mt-3 max-w-md font-sans text-sm leading-6">Planned reopening: January 25, 2027. This is not a shipping date.</p></div>;
}
