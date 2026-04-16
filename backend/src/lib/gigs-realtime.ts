import { serverCache } from "@/lib/server-cache";
import { isPusherServerConfigured, pusherServer } from "@/lib/pusher";

export const ECLUBS_PUSHER_CHANNEL = "occ-e-clubs";
export const ECLUBS_PUSHER_EVENT = "update";
export const GIGS_LIST_CACHE_KEY = "gigs:list:v2-no-legacy-seed";

export function invalidateGigsListCache() {
  serverCache.invalidate(GIGS_LIST_CACHE_KEY);
}

export type EClubsPusherPayload =
  | { type: "gig-created"; gigId: string }
  | { type: "gig-updated"; gigId: string }
  | { type: "gig-deleted"; gigId: string }
  | { type: "gig-application"; gigId: string; applicationId: string; userId: string }
  | {
      type: "gig-application-status";
      gigId: string;
      applicationId: string;
      status: "APPROVED" | "REJECTED";
      userId: string;
    }
  | { type: "gig-submission"; gigId: string; applicationId: string; userId: string };

export async function broadcastEClubs(payload: EClubsPusherPayload) {
  if (!isPusherServerConfigured()) return;
  try {
    await pusherServer.trigger(ECLUBS_PUSHER_CHANNEL, ECLUBS_PUSHER_EVENT, payload);
  } catch (e) {
    console.warn("[gigs-realtime] pusher trigger failed:", e);
  }
}
