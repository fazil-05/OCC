import { logAudit } from "@/lib/audit";

type Actor = {
  id: string;
  email: string;
  role: "ADMIN" | "CLUB_HEADER";
};

export async function logPrivilegedMutation(params: {
  actor: Actor;
  method: string;
  path: string;
  module?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  await logAudit({
    adminId: params.actor.id,
    adminEmail: params.actor.email,
    action: "UPDATE_SETTINGS",
    entity: "security",
    entityId: params.entityId,
    details: {
      actorRole: params.actor.role,
      method: params.method,
      path: params.path,
      module: params.module ?? null,
      requestedAction: params.action ?? null,
      targetEntity: params.entity ?? null,
      ...(params.details ?? {}),
    },
    ipAddress: params.ipAddress,
  });
}
