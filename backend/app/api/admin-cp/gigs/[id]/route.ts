import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminMutationPermission } from "@/lib/admin-api-guard";
import { logAudit } from "@/lib/audit";
import { invalidateGigsListCache, broadcastEClubs } from "@/lib/gigs-realtime";
import { z } from "zod";

const gigPatchSchema = z
  .object({
    title: z.string().min(1).max(160).optional(),
    description: z.string().max(5000).optional(),
    payMin: z.number().finite().min(0).max(1_000_000).optional(),
    payMax: z.number().finite().min(0).max(1_000_000).optional(),
    deadline: z.string().nullable().optional(),
  })
  .strict();

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminMutationPermission(req, "gigs", "update", {
    rateAction: "gigs:update",
    limit: 30,
    windowMs: 60_000,
  });
  if (admin instanceof NextResponse) return admin;

  const { id } = await ctx.params;
  const parsed = gigPatchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid gig payload" }, { status: 400 });
  const body = parsed.data;
  const data: Record<string, any> = {};
  if (body.title) data.title = body.title;
  if (body.description) data.description = body.description;
  if (body.payMin !== undefined) data.payMin = body.payMin;
  if (body.payMax !== undefined) data.payMax = body.payMax;
  if (body.deadline !== undefined) {
    data.deadline = body.deadline ? new Date(body.deadline) : null;
  }

  const existing = await prisma.gig.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  await prisma.gig.update({ where: { id }, data });

  await logAudit({
    adminId: admin.id,
    adminEmail: admin.email,
    action: "UPDATE_GIG",
    entity: "gig",
    entityId: id,
    details: data,
  });

  invalidateGigsListCache();
  await broadcastEClubs({ type: "gig-updated", gigId: id });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminMutationPermission(req, "gigs", "delete", {
    rateAction: "gigs:delete",
    limit: 20,
    windowMs: 60_000,
  });
  if (admin instanceof NextResponse) return admin;

  const { id } = await ctx.params;

  const existing = await prisma.gig.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }

  await prisma.gig.delete({ where: { id } });

  await logAudit({
    adminId: admin.id,
    adminEmail: admin.email,
    action: "DELETE_GIG",
    entity: "gig",
    entityId: id,
  });

  invalidateGigsListCache();
  await broadcastEClubs({ type: "gig-deleted", gigId: id });

  return NextResponse.json({ success: true });
}
