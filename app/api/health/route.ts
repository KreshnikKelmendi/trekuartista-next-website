import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function timestamp() {
  return new Date().toISOString();
}

export async function GET() {
  try {
    const supabase = createServerClient();

    const { error } = await supabase
      .from("works")
      .select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          database: "disconnected",
          message: error.message,
          timestamp: timestamp(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: timestamp(),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Health check failed";

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message,
        timestamp: timestamp(),
      },
      { status: 503 }
    );
  }
}
