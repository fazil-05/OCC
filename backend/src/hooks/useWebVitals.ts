/**
 * Web Vitals reporting hook for Next.js.
 *
 * Logs Core Web Vitals (LCP, FID/INP, CLS, TTFB) to the console in
 * development so you can see the impact of each performance optimization.
 *
 * Usage — add to app/layout.tsx or any client component:
 *   import { useWebVitals } from "@/hooks/useWebVitals";
 *   useWebVitals();
 *
 * In production this is a silent no-op unless NEXT_PUBLIC_LOG_VITALS is set.
 */

"use client";

import { useEffect } from "react";

interface Metric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  id: string;
}

const THRESHOLDS: Record<string, { good: number; label: string }> = {
  LCP: { good: 2500, label: "Largest Contentful Paint" },
  FID: { good: 100, label: "First Input Delay" },
  INP: { good: 200, label: "Interaction to Next Paint" },
  CLS: { good: 0.1, label: "Cumulative Layout Shift" },
  TTFB: { good: 800, label: "Time to First Byte" },
  FCP: { good: 1800, label: "First Contentful Paint" },
};

function logMetric(metric: Metric) {
  const info = THRESHOLDS[metric.name];
  const unit = metric.name === "CLS" ? "" : "ms";
  const val = metric.name === "CLS" ? metric.value.toFixed(4) : `${Math.round(metric.value)}${unit}`;
  const emoji = metric.rating === "good" ? "🟢" : metric.rating === "needs-improvement" ? "🟡" : "🔴";

  console.log(
    `%c${emoji} ${metric.name} %c${val}%c ${info?.label ?? ""}`,
    "font-weight:bold;font-size:13px",
    `font-weight:bold;font-size:13px;color:${metric.rating === "good" ? "#22c55e" : metric.rating === "poor" ? "#ef4444" : "#f59e0b"}`,
    "color:#888;font-size:11px",
  );
}

export function useWebVitals() {
  const shouldLog =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_LOG_VITALS === "true";

  useEffect(() => {
    if (!shouldLog) return;
    if (typeof window === "undefined") return;

    // web-vitals is a tiny library (~1.5kb) that Next.js already includes
    import("web-vitals").then(({ onLCP, onCLS, onINP, onTTFB, onFCP }) => {
      onLCP(logMetric as any);
      onCLS(logMetric as any);
      onINP(logMetric as any);
      onTTFB(logMetric as any);
      onFCP(logMetric as any);
    }).catch(() => {
      // web-vitals not available — non-critical
    });
  }, [shouldLog]);
}
