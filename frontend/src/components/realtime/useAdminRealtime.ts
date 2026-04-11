"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { toast } from "sonner";

type Application = { id: string; fullName: string; club: string; email: string };

export function useAdminRealtime(initialApplications: Application[]) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  useEffect(() => {
    if (!pusherClient) return;
    const client = pusherClient;
    const channel = client.subscribe("admin");
    channel.bind("new-application", (data: { application: Application }) => {
      setApplications((prev) => [data.application, ...prev]);
      toast.message("New Club Leader Application", {
        description: `${data.application.fullName} wants to lead ${data.application.club}`,
      });
    });
    return () => {
      channel.unbind_all();
      client.unsubscribe("admin");
    };
  }, []);

  return { applications, setApplications };
}
