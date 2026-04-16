import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminMutationPermission, requireAdminPermission } from "@/lib/admin-api-guard";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const eventPatchSchema = z
  .object({
    title: z.string().min(1).max(160).optional(),
    description: z.string().max(5000).optional(),
    date: z.string().optional(),
    venue: z.string().max(240).optional(),
    price: z.number().finite().min(0).max(1_000_000).optional(),
    maxCapacity: z.number().int().min(1).max(1_000_000).optional().nullable(),
    imageUrl: z.string().max(2000).optional(),
  });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminMutationPermission(req, "events", "update", {
    rateAction: "events:update",
    limit: 30,
    windowMs: 60_000,
  });
  if (admin instanceof NextResponse) return admin;

  const parsed = eventPatchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
  const body = parsed.data;
  const data: Record<string, any> = {};

  if (body.title) data.title = body.title;
  if (body.description) data.description = body.description;
  if (body.date) data.date = new Date(body.date);
  if (body.venue) data.venue = body.venue;
  if (body.price !== undefined) data.price = body.price;
  if (body.maxCapacity !== undefined) data.maxCapacity = body.maxCapacity;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;

  await prisma.event.update({ where: { id: params.id }, data });

  await logAudit({
    adminId: admin.id, adminEmail: admin.email,
    action: "UPDATE_EVENT", entity: "event", entityId: params.id, details: data,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminMutationPermission(req, "events", "delete", {
    rateAction: "events:delete",
    limit: 20,
    windowMs: 60_000,
  });
  if (admin instanceof NextResponse) return admin;

  await prisma.event.delete({ where: { id: params.id } });

  await logAudit({
    adminId: admin.id, adminEmail: admin.email,
    action: "DELETE_EVENT", entity: "event", entityId: params.id,
  });

  return NextResponse.json({ success: true });
}
