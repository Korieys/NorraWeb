"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Page-level transition wrapper. Re-mounts on every route change, so the
 * `animate-page-in` keyframe re-fires each navigation. Subtle fade + 8px
 * lift — quick enough not to feel slow, soft enough not to feel jumpy.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset scroll on route change so the new page enters from the top.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't auto-scroll if the URL has a hash (let the browser handle it).
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div ref={containerRef} className="animate-page-in">
      {children}
    </div>
  );
}
