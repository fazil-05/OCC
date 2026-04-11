import { serverCache } from "@/lib/server-cache";
import { isPusherServerConfigured, pusherServer } from "@/lib/pusher";

export const ECLUBS_PUSHER_CHANNEL = "occ-e-clubs";

export function invalidateGigsListCache() {
  serverCache.invalidate("gigs:list");
}

export type EClubsPusherPayload =
  | { type: "gig-created"; gigId: string }
  | { type: "gig-updated"; gigId: string }
  | { type: "gig-deleted"; gigId: string }
  | { type: "gig-application"; gigId: string; applicationId: string }
  | {
      type: "gig-application-status";
      gigId: string;
      applicationId: string;
      status: "APPROVED" | "REJECTED";
    };

export async function broadcastEClubs(payload: EClubsPusherPayload) {
  if (!isPusherServerConfigured()) return;
  try {
    await pusherServer.trigger(ECLUBS_PUSHER_CHANNEL, "update", payload);
  } catch (e) {
    console.warn("[gigs-realtime] pusher trigger failed:", e);
  }
}
