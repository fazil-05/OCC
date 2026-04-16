import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminMutationPermission } from "@/lib/admin-api-guard";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const orbitPatchSchema = z
  .object({
    title: z.string().min(1).max(160).optional(),
    category: z.string().min(1).max(120).optional(),
    description: z.string().max(5000).optional(),
    imageUrl: z.string().max(2000).optional(),
    sortOrder: z.number().int().min(0).max(100000).optional(),
    active: z.boolean().optional(),
  })
  .strict();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminMutationPermission(req, "orbit", "update", {
    rateAction: "orbit:update",
    limit: 30,
    windowMs: 60_000,
  });
  if (admin instanceof NextResponse) return admin;

  const parsed = orbitPatchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid orbit payload" }, { status: 400 });
  const body = parsed.data;
  const data: Record<string, any> = {};

  if (body.title !== undefined) data.title = body.title;
  if (body.category !== undefined) data.category = body.category;
  if (body.description !== undefined) data.description = body.description;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
  if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;
  if (body.active !== undefined) data.active = body.active;

  await prisma.orbitProject.update({ where: { id: params.id }, data });

  await logAudit({
    adminId: admin.id,
    adminEmail: admin.email,
    action: "UPDATE_EVENT" as any,
    entity: "event" as any,
    entityId: params.id,
    details: { ...data, type: "orbit_project" },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminMutationPermission(req, "orbit", "delete", {
    rateAction: "orbit:delete",
    limit: 20,
    windowMs: 60_000,
  });
  if (admin instanceof NextResponse) return admin;

  await prisma.orbitProject.delete({ where: { id: params.id } });

  await logAudit({
    adminId: admin.id,
    adminEmail: admin.email,
    action: "DELETE_EVENT" as any,
    entity: "event" as any,
    entityId: params.id,
    details: { type: "orbit_project" },
  });

  return NextResponse.json({ success: true });
}
