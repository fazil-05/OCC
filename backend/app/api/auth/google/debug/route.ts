import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        ok: true,
        version: "v2-persistent-polling-rev1",
        timestamp: new Date().toISOString(),
        message: "If you see this, the new deployment is LIVE."
    });
}
