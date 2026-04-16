import GigsSkeleton from "@/components/skeletons/GigsSkeleton";

/**
 * Next.js loading convention: shown automatically while the gigs page
 * server component resolves its database query.
 */
export default function GigsLoading() {
  return <GigsSkeleton />;
}
