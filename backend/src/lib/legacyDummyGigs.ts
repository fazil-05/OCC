/** Fixed IDs from an old `prisma/seed` gig demo — never show in product UI. */
export const LEGACY_DUMMY_GIG_IDS: string[] = [
  "seed-gig-photo-reel-cut",
  "seed-gig-ride-poster-pack",
];

/** Prisma `where` fragment for public listings (exclude legacy demo rows). */
export const gigWhereNotLegacyDummy = {
  id: { notIn: LEGACY_DUMMY_GIG_IDS },
};
