import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const start = Date.now();

  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {}

  const payload = {
    status: dbOk ? "ok" : "degraded",
    uptime: process.uptime(),
    db: dbOk ? "connected" : "unreachable",
    latencyMs: Date.now() - start,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status: dbOk ? 200 : 503 });
}
