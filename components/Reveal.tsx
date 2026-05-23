"use client";

import { cn } from "@/lib/utils";
import { useReveal } from "@/lib/useReveal";
import type { ElementType, ReactNode } from "react";

type Variant = "fade-up" | "fade-scale" | "rule";

type Props = {
  children: ReactNode;
  variant?: Variant;
  delayMs?: number;
  className?: string;
  as?: ElementType;
  rootMargin?: string;
  threshold?: number;
};

const variantClass: Record<Variant, string> = {
  "fade-up": "reveal",
  "fade-scale": "reveal-scale",
  rule: "reveal-rule",
};

/**
 * Declarative scroll reveal wrapper. Pairs with `.reveal`* utilities in
 * globals.css. Stagger by passing incrementing delayMs to siblings
 * (e.g. 0, 80, 160, 240).
 */
export function Reveal({
  children,
  variant = "fade-up",
  delayMs = 0,
  className,
  as: Tag = "div",
  rootMargin,
  threshold,
}: Props) {
  const { ref, revealed } = useReveal<HTMLElement>({
    rootMargin,
    threshold,
  });

  return (
    <Tag
      ref={ref as never}
      data-revealed={revealed}
      className={cn(variantClass[variant], className)}
      style={{ ["--reveal-delay" as string]: `${delayMs}ms` }}
    >
      {children}
    </Tag>
  );
}
