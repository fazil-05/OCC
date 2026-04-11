"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApprovalCard, type ApprovalRow } from "@/components/admin/ApprovalCard";
import { RealtimeApprovalFeed } from "@/components/admin/RealtimeApprovalFeed";
import { pusherClient } from "@/lib/pusher";
import { toast } from "sonner";

export function ApprovalsClient({ initial }: { initial: ApprovalRow[] }) {
  const router = useRouter();
  const [list, setList] = useState<ApprovalRow[]>(initial);

  const remove = useCallback((id: string) => {
    setList((prev) => prev.filter((a) => a.id !== id));
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (!pusherClient) return;
    const client = pusherClient;
    const ch = client.subscribe("admin");
    ch.bind(
      "new-application",
      (data: { application: { id: string; fullName: string; email: string; club: string } }) => {
        toast.message("New club header application", {
          description: `${data.application.fullName} · ${data.application.club}`,
        });
        router.refresh();
      },
    );
    return () => {
      ch.unbind_all();
      client.unsubscribe("admin");
    };
  }, [router]);

  const feedItems = list.map((a) => ({
    id: a.id,
    fullName: a.fullName,
    club: a.clubManaged?.name ?? "Club",
    email: a.email,
  }));

  return (
    <div className="space-y-8">
      <RealtimeApprovalFeed initialApplications={feedItems} />
      <div className="space-y-4">
        <h1 className="font-serif text-3xl italic text-[#F5F1EB] md:text-4xl">Pending club headers</h1>
        {list.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/60">
            No pending applications. You&apos;re all caught up.
          </p>
        ) : (
          list.map((a) => <ApprovalCard key={a.id} approval={a} onRemoved={remove} />)
        )}
      </div>
    </div>
  );
}
