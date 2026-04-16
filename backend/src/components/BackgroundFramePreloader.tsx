"use client";

import { useEffect } from "react";
import { preloadAllFrames } from "@/lib/preload-frames";
import { registerServiceWorker } from "@/lib/sw-register";

/**
 * Invisible component — renders nothing.
 * Silently registers the service worker and starts preloading
 * all scroll-animation frames in the background.
 */
export function BackgroundFramePreloader() {
  useEffect(() => {
    registerServiceWorker();
    preloadAllFrames();
  }, []);

  return null;
}
