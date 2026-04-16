import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isPusherServerConfigured, pusherServer } from "@/lib/pusher";

export const ACTIVITY_CATEGORIES = {
  auth: "auth",
  social: "social",
  content: "content",
  moderation: "moderation",
  profile: "profile",
  admin: "admin",
} as const;

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[keyof typeof ACTIVITY_CATEGORIES];

export type ActivityActor = {
  userId?: string | null;
  name: string;
  role?: string | null;
};

export type ActivityEventInput = {
  actor: ActivityActor;
  eventType: string;
  category: ActivityCategory;
  summary: string;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  broadcast?: boolean;
};

const BLOCKED_METADATA_KEYS = ["password", "otp", "token", "secret", "authorization"];
export const DEFAULT_ACTIVITY_WINDOW_DAYS = 7;

export function sanitizeActivityMetadata(input?: Record<string, unknown> | null) {
  if (!input) return undefined;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    const lower = key.toLowerCase();
    if (BLOCKED_METADATA_KEYS.some((s) => lower.includes(s))) continue;
    out[key] = value;
  }
  return out;
}

export function clampActivityWindowDays(days: number, min = 1, max = 30) {
  if (Number.isNaN(days)) return DEFAULT_ACTIVITY_WINDOW_DAYS;
  return Math.max(min, Math.min(max, Math.floor(days)));
}

export async function logActivityEvent(input: ActivityEventInput) {
  try {
    const metadata = sanitizeActivityMetadata(input.metadata);
    const row = await prisma.activityEvent.create({
      data: {
        actorUserId: input.actor.userId ?? null,
        actorName: input.actor.name,
        actorRole: input.actor.role ?? null,
        eventType: input.eventType,
        category: input.category,
        entityType: input.entityType ?? null,
        entityId: input.entityId ?? null,
        summary: input.summary,
        metadata:
          metadata === undefined ? undefined : (metadata as Prisma.InputJsonValue),
        ipAddress: input.ipAddress ?? null,
      },
    });

    if (input.broadcast && isPusherServerConfigured()) {
      await pusherServer.trigger("admin-global", "activity-event", {
        id: row.id,
        actorName: row.actorName,
        actorRole: row.actorRole,
        eventType: row.eventType,
        category: row.category,
        entityType: row.entityType,
        entityId: row.entityId,
        summary: row.summary,
        createdAt: row.createdAt.toISOString(),
      });
    }
  } catch (e) {
    console.warn("[activity-events] failed to persist activity:", e);
  }
}

export function extractRequestIp(req: Request) {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0]?.trim() || null;
  return req.headers.get("x-real-ip");
}

