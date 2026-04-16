import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { ExploreClient } from "@/components/occ-dashboard/ExploreClient";

export default async function ExplorePage() {
  await requireUser();
  return (
    <Suspense
      fallback={
        <div className="space-y-4 pb-28 lg:pb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-200/60" />
          ))}
        </div>
      }
    >
      <ExploreClient />
    </Suspense>
  );
}
