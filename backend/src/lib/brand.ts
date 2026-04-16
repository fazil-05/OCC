/**
 * OCC app mark — must exist under `public/` so crawlers (Google) and browsers resolve the same URL.
 * (Previously `/occ-logo.png` was missing from the repo, so search showed Vercel’s default icon.)
 */
export const OCC_BRAND_ICON = "/favicon.png" as const;
