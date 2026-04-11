import AdminSkeleton from "@/components/skeletons/AdminSkeleton";

/**
 * Next.js loading convention: shown automatically while the admin page
 * server component resolves its Promise.all database queries.
 */
export default function AdminLoading() {
  return <AdminSkeleton />;
}
