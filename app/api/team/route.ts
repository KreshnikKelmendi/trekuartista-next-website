import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  compressTeamImage,
  formatTeamImageError,
  isImageMime,
} from "@/lib/media/compress";
import {
  getTeamMembers,
  getTeamImageUrl,
  insertTeamMember,
  uploadTeamImage,
} from "@/lib/team/queries";
import { revalidateTeamPages } from "@/lib/team/revalidate";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  try {
    const members = await getTeamMembers();
    return NextResponse.json({ members });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const position = String(formData.get("position") ?? "").trim();
    const file = formData.get("file");

    if (!name || !position) {
      return NextResponse.json(
        { error: "Name and position are required." },
        { status: 400 }
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Photo is required." }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Photo is too large. Use an image under 4 MB." },
        { status: 413 }
      );
    }

    const mime = file.type || "application/octet-stream";
    if (!isImageMime(mime)) {
      return NextResponse.json({ error: "Only images are supported." }, { status: 400 });
    }

    const raw = Buffer.from(await file.arrayBuffer());
    const { buffer, contentType, ext } = await compressTeamImage(raw);
    const path = `photos/${randomUUID()}.${ext}`;
    await uploadTeamImage(path, buffer, contentType);

    const member = await insertTeamMember({
      name,
      position,
      image: getTeamImageUrl(path),
    });

    revalidateTeamPages();

    return NextResponse.json({ member }, { status: 201 });
  } catch (err) {
    const message = formatTeamImageError(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
