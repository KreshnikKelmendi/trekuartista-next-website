import { NextResponse } from "next/server";
import { reorderWorks } from "@/lib/works/queries";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const orderedIds = body.orderedIds;

    if (!Array.isArray(orderedIds) || orderedIds.some((id) => typeof id !== "string")) {
      return NextResponse.json({ error: "orderedIds must be a string array." }, { status: 400 });
    }

    await reorderWorks(orderedIds);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Reorder failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
