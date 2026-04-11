/**
 * Optional Cloudflare R2 (or any) public URL for frame JPEGs.
 * Local dev: omit VITE_FRAMES_CDN_BASE → paths stay /bikers-frames/ etc. from Vite.
 * Production: set VITE_FRAMES_CDN_BASE=https://pub-xxxxx.r2.dev (no trailing slash).
 */
export function framesPublicPath(pathFromRoot: string): string {
  // Use process.env only. Accessing import.meta in Next triggers webpack critical
  // dependency warnings and can destabilize hot reload in dev.
  const processBase =
    process.env.NEXT_PUBLIC_FRAMES_CDN_BASE ??
    process.env.VITE_FRAMES_CDN_BASE ??
    undefined;

  const raw = String(processBase ?? "").trim();
  // Treat "", "undefined", "null" as unset (bad .env copies)
  const base =
    !raw || raw === "undefined" || raw === "null" ? "" : raw.replace(/\/$/, "");
  let path = pathFromRoot.startsWith("/") ? pathFromRoot : `/${pathFromRoot}`;
  if (!path.endsWith("/")) path = `${path}/`;
  if (!base) return path;
  return `${base}${path}`;
}
