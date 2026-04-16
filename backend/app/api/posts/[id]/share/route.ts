import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Increment sharesCount
  const post = await prisma.post.update({
    where: { id: params.id },
    data: { 
      sharesCount: { increment: 1 } 
    },
    select: { id: true, clubId: true, sharesCount: true }
  });

  // Realtime Trigger
  await pusherServer.trigger(`club-${post.clubId}`, "new-share", { 
    postId: params.id, 
    sharesCount: post.sharesCount 
  });

  return NextResponse.json({ success: true, sharesCount: post.sharesCount });
}
