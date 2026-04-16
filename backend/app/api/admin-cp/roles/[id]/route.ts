import { NextRequest, NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin-api-guard";
export async function PATCH(_req: NextRequest) {
  const admin = await requireAdminPermission("roles", "update");
  if (admin instanceof NextResponse) return admin;
  return NextResponse.json(
    { error: "Role template editing is disabled by security policy." },
    { status: 403 },
  );
}

export async function DELETE(_req: NextRequest) {
  const admin = await requireAdminPermission("roles", "delete");
  if (admin instanceof NextResponse) return admin;
  return NextResponse.json(
    { error: "Role template editing is disabled by security policy." },
    { status: 403 },
  );
}
