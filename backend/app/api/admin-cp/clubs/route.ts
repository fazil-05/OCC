import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminMutationPermission, requireAdminPermission } from "@/lib/admin-api-guard";
import { logAudit } from "@/lib/audit";
import { z } from "zod";
import { randomMemberDisplayBase } from "@/lib/socialDisplay";

const createSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().min(5).max(1000),
  icon: z.string().min(1).max(10),
  theme: z.string().min(1).max(30),
  coverImage: z.string().optional(),
  headerId: z.string().optional(),
});

export async function GET() {
  const admin = await requireAdminPermission("clubs", "read");
  if (admin instanceof NextResponse) return admin;

  const clubs = await prisma.club.findMany({
    include: {
      header: { select: { id: true, fullName: true, email: true } },
      _count: { select: { members: true, posts: true, events: true, gigs: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ clubs });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdminMutationPermission(req, "clubs", "create", {
    rateAction: "clubs:create",
    limit: 15,
    windowMs: 60_000,
  });
  if (admin instanceof NextResponse) return admin;

  const parsed = createSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid club payload" }, { status: 400 });
  const body = parsed.data;

  const existing = await prisma.club.findUnique({ where: { slug: body.slug } });
  if (existing) {
    return NextResponse.json({ error: "A club with this slug already exists" }, { status: 400 });
  }

  const club = await prisma.club.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon,
      theme: body.theme,
      coverImage: body.coverImage || null,
      headerId: body.headerId || null,
      memberDisplayBase: randomMemberDisplayBase(),
    },
  });

  await logAudit({
    adminId: admin.id, adminEmail: admin.email,
    action: "CREATE_CLUB", entity: "club", entityId: club.id,
    details: { name: body.name, slug: body.slug },
  });

  return NextResponse.json({ success: true, club });
}
