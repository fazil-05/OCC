/**
 * Thin animated progress bar at the top of the page during navigation.
 * Uses Next.js router events to show/hide automatically.
 *
 * Usage — add once to app/layout.tsx:
 *   <NavigationProgress />
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const start = useCallback(() => {
    setProgress(0);
    setVisible(true);
    // Animate to 80% quickly, then slow down waiting for completion
    let p = 0;
    const tick = () => {
      p += (90 - p) * 0.08;
      setProgress(p);
      if (p < 88) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const done = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, []);

  // Complete on every route change
  useEffect(() => {
    done();
  }, [pathname, searchParams, done]);

  // Start on click of any internal link
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) return;
      // Only trigger for internal navigations
      if (anchor.target === "_blank") return;
      start();
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [start]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        height: "3px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #6366f1, #a855f7, #6366f1)",
          transition: progress === 100
            ? "width 200ms ease-out, opacity 300ms ease-out"
            : "width 50ms linear",
          opacity: visible ? 1 : 0,
          borderRadius: "0 2px 2px 0",
          boxShadow: "0 0 8px rgba(99, 102, 241, 0.5)",
        }}
      />
    </div>
  );
}
