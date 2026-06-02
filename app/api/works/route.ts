import { NextResponse } from "next/server";
import { parseDescriptionsFromFormData } from "@/lib/works/parse-descriptions";
import { processWorkFile } from "@/lib/works/process-media";
import {
  getWorkById,
  getWorks,
  insertWork,
  insertWorkMedia,
  syncWorkDescriptions,
} from "@/lib/works/queries";

export const runtime = "nodejs";
export const maxDuration = 120;

function getFilesFromFormData(formData: FormData): File[] {
  const fromFiles = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (fromFiles.length > 0) return fromFiles;

  const single = formData.get("file");
  if (single instanceof File && single.size > 0) return [single];
  return [];
}

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
    const files = getFilesFromFormData(formData);

    if (!workName || !specialCategory) {
      return NextResponse.json(
        { error: "Name and category are required." },
        { status: 400 }
      );
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "Add at least one image or video." }, { status: 400 });
    }

    const processed = await Promise.all(files.map((file) => processWorkFile(file)));
    const first = processed[0];
    const summary = descriptionItems.map((d) => d.content).join("\n\n");

    const row = await insertWork({
      workName,
      specialCategory,
      description: summary,
      workImage: first.url,
      workThumbnail: first.thumbnail,
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
