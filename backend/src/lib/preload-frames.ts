/**
 * Silent background preloader for scroll-animation frames.
 *
 * Starts downloading all frame sequences while the user browses the landing page.
 * Uses requestIdleCallback + low-priority fetch so the landing page is never affected.
 * The service worker (public/sw.js) automatically caches every fetched frame.
 *
 * Respects:
 *  - navigator.connection.saveData (skip on data-saver)
 *  - navigator.connection.effectiveType (skip on 2g/slow-2g)
 *  - Visibility change (pause when tab is hidden)
 */

import { framesPublicPath } from "@/config/framesAssetBase";

interface FrameSequence {
  path: string;
  count: number;
}

const SEQUENCES: FrameSequence[] = [
  { path: "/bikers-frames/", count: 783 },
  { path: "/football-frames/", count: 384 },
  { path: "/photography-frames/", count: 546 },
  { path: "/fashion-frames/", count: 510 },
  { path: "/fitness-frames/", count: 621 }, // ADDED: Fitness total frames
  { path: "/music-frames/", count: 441 },   // Fixed: Music has 441 frames
];

const CONCURRENCY = 4;
const IDLE_DELAY_MS = 3000;
const INITIAL_FRAMES_PER_SEQUENCE = 120;

let started = false;

function shouldPreload(): boolean {
  if (typeof navigator === "undefined") return false;

  const conn = (navigator as any).connection;
  if (conn?.saveData) return false;

  const etype = conn?.effectiveType;
  if (etype === "slow-2g" || etype === "2g") return false;

  return true;
}

function buildUrls(): string[] {
  const urls: string[] = [];
  for (const seq of SEQUENCES) {
    const base = framesPublicPath(seq.path);
    const maxFrames = Math.min(seq.count, INITIAL_FRAMES_PER_SEQUENCE);
    for (let i = 1; i <= maxFrames; i++) {
      const padded = String(i).padStart(4, "0");
      urls.push(`${base}${padded}.jpg`);
    }
  }
  return urls;
}

async function runPreload() {
  const urls = buildUrls();
  let index = 0;
  let paused = false;

  const onVisibility = () => {
    paused = document.hidden;
  };
  document.addEventListener("visibilitychange", onVisibility);

  const next = async () => {
    while (index < urls.length) {
      if (paused) {
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }

      const url = urls[index++];
      try {
        await fetch(url, {
          mode: "no-cors",
          priority: "low",
          credentials: "omit",
        } as RequestInit);
      } catch {
        // Frame missing or network hiccup — skip silently
      }
    }
  };

  const workers: Promise<void>[] = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(next());
  }
  await Promise.all(workers);

  document.removeEventListener("visibilitychange", onVisibility);
}

/**
 * Call once from the landing page. Safe to call multiple times — only runs once.
 * Waits for the page to be idle before starting, so it never competes
 * with the hero video, LiquidEther WebGL, or visible content.
 */
export function preloadAllFrames() {
  if (started) return;
  if (typeof window === "undefined") return;
  if (!shouldPreload()) return;
  started = true;

  const start = () => {
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(() => runPreload(), {
        timeout: 10_000,
      });
    } else {
      setTimeout(() => runPreload(), IDLE_DELAY_MS);
    }
  };

  // Wait a few seconds after page load so hero/video/WebGL finish first
  if (document.readyState === "complete") {
    setTimeout(start, IDLE_DELAY_MS);
  } else {
    window.addEventListener("load", () => setTimeout(start, IDLE_DELAY_MS), {
      once: true,
    });
  }
}
