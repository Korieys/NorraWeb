"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Pixel/rem rootMargin offset. Default: trigger 80px before entering viewport. */
  rootMargin?: string;
  /** Threshold ratio. Default: 0.1. */
  threshold?: number;
  /** Reveal only once, never hide again. Default: true. */
  once?: boolean;
};

/**
 * IntersectionObserver-based scroll reveal.
 *
 * Returns a ref to attach to your element and a boolean for whether it has
 * entered the viewport. Pair with the `.reveal` / `.reveal-scale` /
 * `.reveal-rule` classes in globals.css, applying the boolean as a
 * `data-revealed` attribute.
 *
 * @example
 * const { ref, revealed } = useReveal<HTMLDivElement>();
 * return <div ref={ref} data-revealed={revealed} className="reveal">...</div>;
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: Options = {}
) {
  const { rootMargin = "0px 0px -80px 0px", threshold = 0.1, once = true } =
    options;
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { rootMargin, threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, revealed };
}

/**
 * Counts a number from 0 (or a starting value) up to the target when the
 * referenced element enters the viewport. For the big SKU protein digits.
 *
 * Uses ease-out curve so the number snaps in then settles.
 */
export function useCountUp(
  target: number,
  options: { durationMs?: number; from?: number } & Options = {}
) {
  const { durationMs = 1200, from = 0, ...obsOptions } = options;
  const { ref, revealed } = useReveal<HTMLElement>(obsOptions);
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!revealed) return;
    let frame = 0;
    const start = performance.now();
    const delta = target - from;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / durationMs, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + delta * eased));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [revealed, target, from, durationMs]);

  return { ref, value, revealed };
}
