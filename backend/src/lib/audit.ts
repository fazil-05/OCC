import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AuditAction =
  | "CREATE_CLUB" | "UPDATE_CLUB" | "DELETE_CLUB"
  | "CREATE_USER" | "UPDATE_USER" | "DELETE_USER" | "SUSPEND_USER" | "UNSUSPEND_USER"
  | "CHANGE_ROLE" | "RESET_PASSWORD" | "PROMOTE_ADMIN" | "DEMOTE_ADMIN"
  | "CREATE_POST" | "UPDATE_POST" | "DELETE_POST" | "HIDE_POST" | "PIN_POST"
  | "CREATE_EVENT" | "UPDATE_EVENT" | "DELETE_EVENT"
  | "CREATE_GIG" | "UPDATE_GIG" | "DELETE_GIG"
  | "APPROVE_APPLICATION" | "REJECT_APPLICATION"
  | "APPROVE_HEADER" | "REJECT_HEADER"
  | "UPDATE_SETTINGS"
  | "EXPORT_CSV"
  | "RESOLVE_ALERT"
  | "ADMIN_ROLE_CREATE"
  | "ADMIN_ROLE_UPDATE"
  | "ADMIN_ROLE_DELETE"
  | "MODERATION_TICKET"
  | "ADMIN_BROADCAST"
  | "COMPLIANCE_EXPORT_USER";

export type AuditEntity =
  | "club"
  | "user"
  | "post"
  | "event"
  | "gig"
  | "gig_application"
  | "settings"
  | "security"
  | "admin_role"
  | "moderation"
  | "broadcast";

const SENSITIVE_DETAIL_KEYS = [
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "otp",
  "referralcode",
  "apikey",
] as const;

function sanitizeAuditDetails(input: unknown): unknown {
  if (input == null) return input;
  if (Array.isArray(input)) return input.slice(0, 100).map((v) => sanitizeAuditDetails(v));
  if (typeof input !== "object") return input;

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    const keyNorm = k.toLowerCase().replace(/[\s_-]/g, "");
    if (SENSITIVE_DETAIL_KEYS.some((s) => keyNorm.includes(s))) {
      out[k] = "[REDACTED]";
      continue;
    }
    out[k] = sanitizeAuditDetails(v);
  }
  return out;
}

export async function logAudit(params: {
  adminId: string;
  adminEmail: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: params.adminId,
        adminEmail: params.adminEmail,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        details: params.details
          ? (sanitizeAuditDetails(params.details) as Prisma.InputJsonValue)
          : undefined,
        ipAddress: params.ipAddress ?? null,
      },
    });
  } catch (e) {
    console.error("[audit] Failed to write audit log:", e);
  }
}
