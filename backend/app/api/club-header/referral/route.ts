import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { logPrivilegedMutation } from "@/lib/mutation-audit";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "CLUB_HEADER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.approvalStatus !== "APPROVED") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    referralCode: user.referralCode,
    approved: true,
    club: user.clubManaged,
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "CLUB_HEADER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.approvalStatus !== "APPROVED") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { newCode } = await req.json();
    if (!newCode || typeof newCode !== "string" || newCode.length < 3) {
      return NextResponse.json({ error: "Code must be at least 3 characters long." }, { status: 400 });
    }

    const sanitizedCode = newCode.trim().toUpperCase();

    // Check if taken
    const existing = await prisma.user.findUnique({
      where: { referralCode: sanitizedCode },
    });
    
    if (existing && existing.id !== user.id) {
      return NextResponse.json({ error: "This referral code is already taken." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: sanitizedCode },
    });
    const forwarded = req.headers.get("x-forwarded-for") || "";
    const ip = forwarded.split(",")[0]?.trim() || "unknown";
    await logPrivilegedMutation({
      actor: { id: user.id, email: user.email, role: "CLUB_HEADER" },
      method: req.method,
      path: "/api/club-header/referral",
      module: "club-header",
      action: "update-referral",
      entity: "user",
      entityId: user.id,
      details: { referralCode: sanitizedCode },
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, referralCode: sanitizedCode });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "This referral code is already taken." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update referral code" }, { status: 500 });
  }
}
