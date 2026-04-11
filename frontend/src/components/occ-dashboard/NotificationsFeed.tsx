"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck } from "lucide-react";
import { pusherClient } from "@/lib/pusher";

type Row = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
};

export function NotificationsFeed({
  initial,
  userId,
}: {
  initial: Row[];
  userId: string;
}) {
  const [items, setItems] = useState<Row[]>(initial);

  const merge = useCallback((n: Row) => {
    setItems((prev) => {
      if (prev.some((x) => x.id === n.id)) return prev;
      return [n, ...prev];
    });
  }, []);

  useEffect(() => {
    if (!pusherClient || !userId) return;
    const ch = `user-${userId}`;
    const channel = pusherClient.subscribe(ch);

    const onGeneric = (data: { title?: string; message?: string }) => {
      merge({
        id: crypto.randomUUID(),
        type: "push",
        title: data.title || "Update",
        message: data.message || "",
        read: false,
        createdAt: new Date().toISOString(),
      });
    };

    channel.bind("notification", onGeneric);
    channel.bind("approved", (data: { message?: string }) =>
      onGeneric({ title: "Application update", message: data.message }),
    );
    channel.bind("rejected", (data: { reason?: string }) =>
      onGeneric({ title: "Application update", message: data.reason }),
    );

    return () => {
      channel.unbind("notification", onGeneric);
      channel.unbind("approved");
      channel.unbind("rejected");
      pusherClient.unsubscribe(ch);
    };
  }, [userId, merge]);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-28 lg:pb-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Notifications</h1>
          <p className="mt-1 text-xs text-slate-500">
            Posts, likes, gigs, announcements, and approvals — live when Pusher is configured.
          </p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all read
        </button>
      </div>

      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-black/10 bg-white px-6 py-14 text-center text-sm text-slate-500">
            <Bell className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            Nothing here yet.
          </li>
        ) : (
          items.map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl border px-4 py-3 sm:px-5 sm:py-4 ${
                n.read ? "border-black/[0.04] bg-white" : "border-[#5227FF]/20 bg-[#5227FF]/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-wider text-slate-400">
                    {n.type} · {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!n.read ? (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#5227FF]" aria-hidden />
                ) : null}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
