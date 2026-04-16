export function clubDiveInHref(slug: string | undefined | null): string {
  if (!slug?.trim()) return "/clubs";
  return `/clubs/${slug}`;
}
