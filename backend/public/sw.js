/* eslint-disable no-restricted-globals */

const CACHE_NAME = "occ-frames-v1";
const FRAME_EXTS = /\.(jpg|jpeg|webp|png)$/i;
const MAX_FRAME_CACHE_ENTRIES = 500;

/**
 * Matches requests that look like scroll-animation frames.
 * Covers both R2 CDN URLs and same-origin /bikers-frames/ etc.
 */
function isFrameRequest(url) {
  if (!FRAME_EXTS.test(url.pathname)) return false;
  const p = url.pathname.toLowerCase();
  return (
    p.includes("frames") ||
    p.includes("bikers") ||
    p.includes("football") ||
    p.includes("astronaut") ||
    p.includes("photography") ||
    p.includes("fashion")
  );
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (!isFrameRequest(url)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        if (cached) return cached;

        return fetch(event.request).then((response) => {
          if (response.ok) {
            cache.put(event.request, response.clone()).then(() =>
              cache.keys().then((keys) => {
                if (keys.length <= MAX_FRAME_CACHE_ENTRIES) return;
                const pruneCount = keys.length - MAX_FRAME_CACHE_ENTRIES;
                return Promise.all(keys.slice(0, pruneCount).map((k) => cache.delete(k)));
              }),
            );
          }
          return response;
        });
      }),
    ),
  );
});
