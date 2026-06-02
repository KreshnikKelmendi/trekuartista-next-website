import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { compressImage, isImageMime } from "@/lib/media/compress";
import {
  deleteTeamMember,
  getTeamImageUrl,
  updateTeamMember,
  uploadTeamImage,
} from "@/lib/team/queries";

export const runtime = "nodejs";
export const maxDuration = 60;

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const nameRaw = formData.get("name");
    const positionRaw = formData.get("position");
    const file = formData.get("file");

    const updates: { name?: string; position?: string; image?: string } = {};

    if (nameRaw !== null) {
      const name = String(nameRaw).trim();
      if (!name) {
        return NextResponse.json({ error: "Name is required." }, { status: 400 });
      }
      updates.name = name;
    }

    if (positionRaw !== null) {
      const position = String(positionRaw).trim();
      if (!position) {
        return NextResponse.json({ error: "Position is required." }, { status: 400 });
      }
      updates.position = position;
    }

    if (file instanceof File && file.size > 0) {
      const mime = file.type || "application/octet-stream";
      if (!isImageMime(mime)) {
        return NextResponse.json({ error: "Only images are supported." }, { status: 400 });
      }

      const raw = Buffer.from(await file.arrayBuffer());
      const { buffer, contentType, ext } = await compressImage(raw);
      const path = `photos/${randomUUID()}.${ext}`;
      await uploadTeamImage(path, buffer, contentType);
      updates.image = getTeamImageUrl(path);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const member = await updateTeamMember(id, updates);
    return NextResponse.json({ member });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    const { id } = await params;
    await deleteTeamMember(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
