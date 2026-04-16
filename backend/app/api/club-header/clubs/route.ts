import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureOccDefaultClubs } from "@/lib/occDefaultClubs";

/**
 * Public list for club leader registration — same rows the admin creates/updates.
 * No auth required; only slug, display name, and icon are exposed.
 */
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ clubs: [] as { slug: string; name: string; icon: string }[] });
    }

    await ensureOccDefaultClubs(prisma);

    const clubs = await prisma.club.findMany({
      select: { slug: true, name: true, icon: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ clubs });
  } catch (e) {
    console.error("[club-header/clubs GET]", e);
    return NextResponse.json(
      { clubs: [] as { slug: string; name: string; icon: string }[], error: "load_failed" },
      { status: 500 },
    );
  }
}
