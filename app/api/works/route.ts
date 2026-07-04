import { NextResponse } from "next/server";
import { parseDescriptionsFromFormData } from "@/lib/works/parse-descriptions";
import { parseYoutubeFromFormData } from "@/lib/works/parse-youtube-form";
import {
  getWorkById,
  getWorks,
  insertWork,
  insertWorkMedia,
  syncWorkDescriptions,
} from "@/lib/works/queries";
import { resolveUploadedWorkMedia } from "@/lib/works/resolve-upload-media";
import { youtubeThumbnailUrl } from "@/lib/works/youtube";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  try {
    const works = await getWorks();
    return NextResponse.json({ works });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load works";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const workName = String(formData.get("workName") ?? "").trim();
    const specialCategory = String(formData.get("specialCategory") ?? "").trim();
    const descriptionItems = parseDescriptionsFromFormData(formData) ?? [];
    const { youtubeLink, youtubeOnly } = parseYoutubeFromFormData(formData);
    const processed = await resolveUploadedWorkMedia(formData);

    if (!workName || !specialCategory) {
      return NextResponse.json(
        { error: "Name and category are required." },
        { status: 400 }
      );
    }

    if (processed.length === 0 && !(youtubeOnly && youtubeLink)) {
      return NextResponse.json(
        { error: "Add at least one image or video, or enable YouTube-only with a link." },
        { status: 400 }
      );
    }

    if (youtubeOnly && !youtubeLink) {
      return NextResponse.json(
        { error: "Add a YouTube link for YouTube-only projects." },
        { status: 400 }
      );
    }

    const fallbackThumb = youtubeLink ? youtubeThumbnailUrl(youtubeLink) : null;
    const first = processed[0];
    const summary = descriptionItems.map((d) => d.content).join("\n\n");

    const row = await insertWork({
      workName,
      specialCategory,
      description: summary,
      workImage: first?.url ?? fallbackThumb ?? "",
      workThumbnail: first?.thumbnail ?? fallbackThumb,
      youtubeLink,
      youtubeOnly,
    });

    await Promise.all(
      processed.map((item, index) =>
        insertWorkMedia({
          workId: row.id,
          url: item.url,
          thumbnail: item.thumbnail,
          mediaType: item.mediaType,
          sortOrder: index,
        })
      )
    );

    if (descriptionItems.length > 0) {
      await syncWorkDescriptions(row.id, descriptionItems);
    }

    const work = await getWorkById(row.id);
    return NextResponse.json({ work }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
