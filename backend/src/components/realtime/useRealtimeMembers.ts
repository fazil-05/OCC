"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";

type Member = {
  id: string;
  fullName: string;
  collegeName: string;
  registeredAt: string;
};

export function useRealtimeMembers(headerId: string, initialMembers: Member[]) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [newMemberAlert, setNewMemberAlert] = useState<Member | null>(null);

  useEffect(() => {
    if (!pusherClient || !headerId) return;
    const client = pusherClient;
    const channelName = `header-${headerId}`;
    const channel = client.subscribe(channelName);
    channel.bind("new-member", (data: { member: Member }) => {
      setMembers((prev) => [data.member, ...prev].slice(0, 20));
      setNewMemberAlert(data.member);
      window.setTimeout(() => setNewMemberAlert(null), 5000);
    });
    return () => {
      channel.unbind_all();
      client.unsubscribe(channelName);
    };
  }, [headerId]);

  return { members, newMemberAlert };
}
