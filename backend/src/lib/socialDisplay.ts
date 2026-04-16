/**
 * Deterministic dummy social counts (1–799) per entity so feeds feel alive;
 * real DB counts are added on top so likes/followers increment for everyone.
 */
export function dummySocialSeed(entityId: string, salt: string): number {
  let h = 2166136261;
  const s = `${salt}:${entityId}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 1 + (Math.abs(h) % 799);
}

export function displayPostLikes(postId: string, realLikes: number): number {
  return dummySocialSeed(postId, "post-likes") + Math.max(0, realLikes);
}

/** Random 3-digit display base in [100, 799] for new clubs. */
export function randomMemberDisplayBase(): number {
  return 100 + Math.floor(Math.random() * 700);
}

/**
 * Public-facing member count: stored base (when set) or legacy per-club seed, plus real memberships.
 */
export function displayClubMembers(
  clubId: string,
  realMembers: number,
  storedBase?: number | null,
): number {
  const base =
    storedBase != null && storedBase >= 100 && storedBase < 800
      ? storedBase
      : dummySocialSeed(clubId, "club-followers");
  return base + Math.max(0, realMembers);
}

export function formatSocialCount(n: number): string {
  if (n >= 10_000) {
    const k = n / 1000;
    return (Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1)) + "k";
  }
  return n.toLocaleString("en-IN");
}
