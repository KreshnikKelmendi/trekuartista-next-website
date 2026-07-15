import { NextResponse } from "next/server";
import { clearShowreelUrl, getShowreelSettings } from "@/lib/showreel/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const showreel = await getShowreelSettings();
    return NextResponse.json(showreel);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load showreel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const variant = body.variant;

    if (variant !== "desktop" && variant !== "mobile") {
      return NextResponse.json({ error: "Invalid variant." }, { status: 400 });
    }

    await clearShowreelUrl(variant);
    const showreel = await getShowreelSettings();

    return NextResponse.json({ ok: true, showreel });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
