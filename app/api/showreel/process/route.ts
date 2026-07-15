import { NextResponse } from "next/server";
import { processShowreelUpload } from "@/lib/showreel/process-upload";
import { getShowreelSettings } from "@/lib/showreel/queries";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const variant = body.variant;
    const storagePath = String(body.storagePath ?? "").trim();

    if (variant !== "desktop" && variant !== "mobile") {
      return NextResponse.json({ error: "Invalid variant." }, { status: 400 });
    }

    if (!storagePath.startsWith("showreel/incoming/")) {
      return NextResponse.json({ error: "Invalid storage path." }, { status: 400 });
    }

    await processShowreelUpload(variant, storagePath);
    const showreel = await getShowreelSettings();

    return NextResponse.json({ ok: true, showreel });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
