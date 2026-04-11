import ClubsSkeleton from "@/components/skeletons/ClubsSkeleton";

/**
 * Next.js loading convention: shown automatically while the clubs page
 * server component resolves its database query.
 */
export default function ClubsLoading() {
  return <ClubsSkeleton />;
}
