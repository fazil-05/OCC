/**
 * Registers the OCC service worker for frame caching.
 * Call once from a client component (e.g. layout effect).
 * Safe no-op when SW is unavailable or disabled via env.
 */
export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (process.env.NODE_ENV === "development") {
    void navigator.serviceWorker
      .getRegistrations()
      .then((regs) => Promise.all(regs.map((r) => r.unregister())))
      .catch(() => {});
    return;
  }

  const enabled = process.env.NEXT_PUBLIC_SW_ENABLED;
  if (enabled === "false") return;

  navigator.serviceWorker
    .register("/sw.js", { scope: "/" })
    .catch(() => {});
}
