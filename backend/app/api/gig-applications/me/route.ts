import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Current user's application for a gig (for apply vs deliver UI). */
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gigId = req.nextUrl.searchParams.get("gigId");
  if (!gigId?.trim()) {
    return NextResponse.json({ error: "gigId required" }, { status: 400 });
  }

  const application = await prisma.gigApplication.findUnique({
    where: { userId_gigId: { userId: user.id, gigId } },
    select: {
      id: true,
      status: true,
      workDescription: true,
      submissionFileUrl: true,
      submissionFileName: true,
    },
  });

  return NextResponse.json({ application });
}
