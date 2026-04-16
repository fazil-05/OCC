import type { Prisma } from "@prisma/client";

export const CLUB_HUB_CATEGORIES = [
  { key: "all", label: "All Clubs" },
  { key: "sports", label: "Elite Sports" },
  { key: "music", label: "Global Music" },
  { key: "art", label: "Art & Design" },
  { key: "tech", label: "Technology" },
  { key: "fashion", label: "Fashion Explorer" },
] as const;

export type ClubHubCategoryKey = (typeof CLUB_HUB_CATEGORIES)[number]["key"];

/** Server-side filter for /clubs ?cat= & ?q= */
export function clubHubWhere(cat: string | undefined, q: string | undefined): Prisma.ClubWhereInput {
  const qTrim = (q ?? "").trim();
  const search: Prisma.ClubWhereInput | undefined =
    qTrim.length > 0
      ? {
          OR: [
            { name: { contains: qTrim, mode: "insensitive" } },
            { description: { contains: qTrim, mode: "insensitive" } },
            { slug: { contains: qTrim, mode: "insensitive" } },
          ],
        }
      : undefined;

  const catKey = !cat || cat === "all" ? "all" : cat;
  let category: Prisma.ClubWhereInput | undefined;
  switch (catKey) {
    case "sports":
      category = {
        OR: [{ slug: "sports" }, { name: { contains: "sport", mode: "insensitive" } }],
      };
      break;
    case "music":
      category = {
        OR: [{ slug: "music" }, { name: { contains: "music", mode: "insensitive" } }],
      };
      break;
    case "art":
      category = {
        OR: [
          { slug: "photography" },
          { slug: "fashion" },
          { name: { contains: "photo", mode: "insensitive" } },
          { name: { contains: "fashion", mode: "insensitive" } },
          { name: { contains: "design", mode: "insensitive" } },
        ],
      };
      break;
    case "tech":
      category = {
        OR: [
          { slug: { contains: "tech", mode: "insensitive" } },
          { slug: { contains: "gaming", mode: "insensitive" } },
          { name: { contains: "tech", mode: "insensitive" } },
          { name: { contains: "gaming", mode: "insensitive" } },
          { name: { contains: "code", mode: "insensitive" } },
        ],
      };
      break;
    case "fashion":
      category = {
        OR: [{ slug: "fashion" }, { name: { contains: "fashion", mode: "insensitive" } }],
      };
      break;
    default:
      category = undefined;
  }

  const parts = [search, category].filter(Boolean) as Prisma.ClubWhereInput[];
  return parts.length ? { AND: parts } : {};
}
