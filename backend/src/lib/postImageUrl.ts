/** Static club art shipped with the app (always available on Vercel). */
export const OCC_PREMIUM_CLUB_IMAGES = {
  bikers: "/premium-assets/club_bikers_premium_169_1775157327855.png",
  music: "/premium-assets/club_music_premium_169_1775157345029.png",
  football: "/premium-assets/club_football_premium_169_1775157363794.png",
  photography: "/premium-assets/club_photography_premium_169_1775157399055.png",
  fitness: "/premium-assets/club_fitness_premium_occ.png",
  fashion: "/premium-assets/club_fashion_premium.png",
} as const;

export function premiumClubImageForName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("biker")) return OCC_PREMIUM_CLUB_IMAGES.bikers;
  if (n.includes("music")) return OCC_PREMIUM_CLUB_IMAGES.music;
  if (n.includes("football") || n.includes("sport")) return OCC_PREMIUM_CLUB_IMAGES.football;
  if (n.includes("photography") || n.includes("photo")) return OCC_PREMIUM_CLUB_IMAGES.photography;
  if (n.includes("fitness") || n.includes("gym")) return OCC_PREMIUM_CLUB_IMAGES.fitness;
  if (n.includes("fashion") || n.includes("style")) return OCC_PREMIUM_CLUB_IMAGES.fashion;
  return OCC_PREMIUM_CLUB_IMAGES.bikers;
}

function getUploadsCdnBase(): string | null {
  const b = process.env.NEXT_PUBLIC_UPLOADS_CDN_BASE?.trim();
  if (!b) return null;
  return b.replace(/\/$/, "");
}

/** If DB has `/uploads/...` and files are mirrored on R2 at the same path under the public bucket. */
function absoluteUrlForUploadPath(path: string): string | null {
  const base = getUploadsCdnBase();
  if (!base || !path.startsWith("/uploads/")) return null;
  return `${base}${path}`;
}

/**
 * Resolves post image URLs for the feed.
 * - Full `https://` URLs (Blob, R2, etc.) pass through.
 * - `/uploads/...` uses `NEXT_PUBLIC_UPLOADS_CDN_BASE` when set (R2 mirror); otherwise keeps `/uploads/...`
 *   so local dev serves files from `public/uploads/` correctly. (Do not substitute premium club art.)
 */
export function resolvePostImageUrlForFeed(
  imageUrl: string | null | undefined,
  clubName: string,
): string {
  const fallback = premiumClubImageForName(clubName);
  const raw = imageUrl?.trim();
  if (!raw || raw === "/") return fallback;

  if (raw.startsWith("/uploads/")) {
    const abs = absoluteUrlForUploadPath(raw);
    return abs ?? raw;
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      if (u.pathname.startsWith("/uploads/")) {
        const abs = absoluteUrlForUploadPath(u.pathname);
        return abs ?? raw;
      }
      return raw;
    } catch {
      return fallback;
    }
  }

  return raw;
}
export function resolveClubAvatar(
  userAvatar: string | null | undefined,
  _clubName: string,
): string {
  if (userAvatar?.trim() && userAvatar.startsWith("http")) return userAvatar.trim();
  if (userAvatar?.trim() && userAvatar.startsWith("/uploads/")) {
     const abs = absoluteUrlForUploadPath(userAvatar.trim());
     return abs ?? userAvatar.trim();
  }

  return "";
}
