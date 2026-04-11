const NEXT_PUBLIC_FRAMES_CDN_BASE = "https://pub-123.r2.dev";
const basePath = "https://pub-123.r2.dev/football-frames/";

function normalizeBase(basePath) {
  const b = basePath.trim();
  if (!b) return "/";
  if (b.startsWith("http")) {
    return b.endsWith("/") ? b : `${b}/`;
  }
  let path = b.startsWith("/") ? b : `/${b}`;
  if (!path.endsWith("/")) path += "/";
  return path;
}

const cdnBase = NEXT_PUBLIC_FRAMES_CDN_BASE.replace(/\/$/, "");
const normalizedBase = normalizeBase(basePath);
const base = normalizedBase.startsWith("http")
? normalizedBase
: `${cdnBase}${normalizedBase}`;

console.log("normalizedBase:", normalizedBase);
console.log("base:", base);
