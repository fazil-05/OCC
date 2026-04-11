import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

/**
 * Next.js loading convention: shown automatically inside the Suspense boundary
 * while the dashboard page's server component resolves its data.
 * The user sees the skeleton instantly instead of a blank page.
 */
export default function DashboardLoading() {
  return <DashboardSkeleton />;
}
