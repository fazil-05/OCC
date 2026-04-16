import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public API — no auth required.
 * Returns active orbit projects for the public-facing orbit page.
 */
export async function GET() {
  try {
    const projects = await prisma.orbitProject.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        imageUrl: true,
      },
    });

    return NextResponse.json({ projects }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    // If the table doesn't exist yet, return empty array
    return NextResponse.json({ projects: [] });
  }
}
