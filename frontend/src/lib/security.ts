import { prisma } from "@/lib/prisma";

export type SuspiciousSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export async function logSuspiciousAccess(params: {
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  path: string;
  reason: string;
  severity?: SuspiciousSeverity;
}) {
  try {
    await prisma.suspiciousAccess.create({
      data: {
        userId: params.userId ?? null,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent ?? null,
        path: params.path,
        reason: params.reason,
        severity: params.severity ?? "MEDIUM",
      },
    });
  } catch (e) {
    console.error("[security] Failed to write suspicious access:", e);
  }
}
