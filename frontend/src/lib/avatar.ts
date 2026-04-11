/** Public path — keep in sync with `public/default-avatar.svg`. */
export const DEFAULT_AVATAR_URL = "/default-avatar.svg";

export function avatarSrc(avatar: string | null | undefined): string {
  if (!avatar || !avatar.trim()) return DEFAULT_AVATAR_URL;
  return avatar.trim();
}
