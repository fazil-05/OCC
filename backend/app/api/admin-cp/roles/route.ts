import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminPermission } from "@/lib/admin-api-guard";
import { buildMatrixFromLevel } from "@/lib/admin-permissions";

async function ensureBuiltInTemplates() {
  const count = await prisma.adminRoleTemplate.count();
  if (count > 0) return;
  const modPerms = buildMatrixFromLevel("MODERATOR");
  await prisma.adminRoleTemplate.create({
    data: {
      name: "Standard moderator",
      slug: "standard-moderator",
      description: "Matches legacy moderator: posts, users read/suspend, approvals read.",
      permissions: modPerms as object,
    },
  });
}

export async function GET() {
  const admin = await requireAdminPermission("roles", "read");
  if (admin instanceof NextResponse) return admin;

  await ensureBuiltInTemplates();

  const templates = await prisma.adminRoleTemplate.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { users: true } } },
  });

  return NextResponse.json({
    templates: templates.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: t.description,
      permissions: t.permissions,
      userCount: t._count.users,
      updatedAt: t.updatedAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdminPermission("roles", "create");
  if (admin instanceof NextResponse) return admin;
  return NextResponse.json(
    { error: "Role template editing is disabled by security policy." },
    { status: 403 },
  );
}
