import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { requireAdminPermission } from "@/lib/admin-api-guard";
import { checkAdminMutationRateLimit } from "@/lib/admin-rate-limit";

const patchSchema = z.object({
  suspended: z.boolean().optional(),
  resetPassword: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const base = await requireAdminPermission("users", "update");
  if (base instanceof NextResponse) return base;
  const rl = checkAdminMutationRateLimit({ req, adminId: base.id, action: "admin-cp-user-patch", limit: 40 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please retry shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const body = patchSchema.parse(await req.json());
  const data: Record<string, unknown> = {};
  let passwordResetRequested = false;

  if (params.id === base.id && body.suspended) {
    return NextResponse.json({ error: "Cannot suspend yourself" }, { status: 400 });
  }

  if (body.suspended === true) {
    const s = await requireAdminPermission("users", "suspend");
    if (s instanceof NextResponse) return s;
  }

  if (body.suspended !== undefined) data.suspended = body.suspended;

  if (body.resetPassword) {
    const tempPassword =
      Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 4).toUpperCase();
    data.password = await bcrypt.hash(tempPassword, 12);
    passwordResetRequested = true;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: params.id }, data: data as any });

  const action = body.resetPassword
    ? "RESET_PASSWORD"
    : body.suspended !== undefined
      ? body.suspended
        ? "SUSPEND_USER"
        : "UNSUSPEND_USER"
      : "UPDATE_USER";

  await logAudit({
    adminId: base.id,
    adminEmail: base.email,
    action: action as any,
    entity: "user",
    entityId: params.id,
    details: { ...data, password: body.resetPassword ? "[REDACTED]" : undefined },
  });

  return NextResponse.json({
    success: true,
    passwordResetRequested,
    // Never return raw temporary credentials in API responses.
    tempPassword: null,
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminPermission("users", "delete");
  if (admin instanceof NextResponse) return admin;
  const rl = checkAdminMutationRateLimit({ req, adminId: admin.id, action: "admin-cp-user-delete", limit: 20 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please retry shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  if (params.id === admin.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: params.id }, select: { fullName: true, email: true } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.user.delete({ where: { id: params.id } });

  await logAudit({
    adminId: admin.id,
    adminEmail: admin.email,
    action: "DELETE_USER",
    entity: "user",
    entityId: params.id,
    details: { name: user.fullName, email: user.email },
  });

  return NextResponse.json({ success: true });
}
