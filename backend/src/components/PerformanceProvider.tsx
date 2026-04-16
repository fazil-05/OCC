/**
 * Client-side performance utilities — rendered once from the root layout.
 * Includes:
 *   - Navigation progress bar (thin animated bar at top)
 *   - Web Vitals logging in development
 *   - Service worker registration
 *
 * All features are isolated — removing this component reverts everything.
 */

"use client";

import { Suspense } from "react";
import { NavigationProgress } from "@/components/NavigationProgress";
import { useWebVitals } from "@/hooks/useWebVitals";
import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/sw-register";

function Inner() {
  useWebVitals();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return <NavigationProgress />;
}

/**
 * Wrap in Suspense because NavigationProgress uses useSearchParams()
 * which requires a Suspense boundary in the App Router.
 */
export function PerformanceProvider() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
