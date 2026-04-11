"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";

export default function PendingPage() {
  const router = useRouter();

  useEffect(() => {
    let channelName = "";
    const load = async () => {
      const me = await fetch("/api/profile").then((r) => r.json()).catch(() => null);
      if (!me?.user?.id || !pusherClient) return;
      channelName = `user-${me.user.id}`;
      const ch = pusherClient.subscribe(channelName);
      ch.bind("approved", async () => {
        await fetch("/api/auth/refresh-session", { method: "POST", credentials: "include" });
        router.push("/header/dashboard");
        router.refresh();
      });
    };
    load();
    return () => {
      if (pusherClient && channelName) pusherClient.unsubscribe(channelName);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C0C0A] p-6 text-[#F5F1EB]">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 h-20 w-20 animate-pulse rounded-full border-2 border-[#C9A96E]" />
        <p className="text-xs uppercase tracking-[0.5em] text-[#C9A96E]">Application under review</p>
        <h1 className="mt-3 text-5xl">Hang Tight</h1>
        <p className="mt-4 text-white/70">
          Your Club Leader application is with our team. We will notify you once approved.
        </p>
      </div>
    </div>
  );
}
