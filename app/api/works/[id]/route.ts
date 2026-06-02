import { NextResponse } from "next/server";
import { parseDescriptionsFromFormData } from "@/lib/works/parse-descriptions";
import { processWorkFile } from "@/lib/works/process-media";
import {
  deleteWork,
  deleteWorkMedia,
  getNextMediaSortOrder,
  getWorkById,
  syncWorkCover,
  syncWorkDescriptions,
  updateWork,
  insertWorkMedia,
} from "@/lib/works/queries";

export const runtime = "nodejs";
export const maxDuration = 120;

type Props = { params: Promise<{ id: string }> };

function getFilesFromFormData(formData: FormData): File[] {
  const fromFiles = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (fromFiles.length > 0) return fromFiles;

  const single = formData.get("file");
  if (single instanceof File && single.size > 0) return [single];
  return [];
}

function parseRemoveMediaIds(formData: FormData): string[] {
  const raw = formData.get("removeMediaIds");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return String(raw)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const workNameRaw = formData.get("workName");
    const specialCategoryRaw = formData.get("specialCategory");
    const descriptionItems = parseDescriptionsFromFormData(formData);
    const files = getFilesFromFormData(formData);
    const removeIds = parseRemoveMediaIds(formData).filter((mid) => !mid.startsWith("legacy-"));

    const metaUpdates: {
      workName?: string;
      specialCategory?: string;
    } = {};

    let changed = false;

    if (workNameRaw !== null) {
      const workName = String(workNameRaw).trim();
      if (!workName) {
        return NextResponse.json({ error: "Title is required." }, { status: 400 });
      }
      metaUpdates.workName = workName;
      changed = true;
    }

    if (specialCategoryRaw !== null) {
      const specialCategory = String(specialCategoryRaw).trim();
      if (!specialCategory) {
        return NextResponse.json({ error: "Category is required." }, { status: 400 });
      }
      metaUpdates.specialCategory = specialCategory;
      changed = true;
    }

    if (Object.keys(metaUpdates).length > 0) {
      await updateWork(id, metaUpdates);
    }

    if (descriptionItems !== null) {
      await syncWorkDescriptions(id, descriptionItems);
      changed = true;
    }

    for (const mediaId of removeIds) {
      await deleteWorkMedia(mediaId);
      changed = true;
    }

    if (removeIds.length > 0) {
      await syncWorkCover(id);
    }

    let sortOrder = await getNextMediaSortOrder(id);
    for (const file of files) {
      const item = await processWorkFile(file);
      await insertWorkMedia({
        workId: id,
        url: item.url,
        thumbnail: item.thumbnail,
        mediaType: item.mediaType,
        sortOrder: sortOrder++,
      });
      changed = true;
    }

    if (!changed) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const work = await getWorkById(id);
    if (!work) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    if (work.media.length === 0) {
      return NextResponse.json(
        { error: "Project must have at least one image or video." },
        { status: 400 }
      );
    }

    await syncWorkCover(id);
    const updated = await getWorkById(id);
    return NextResponse.json({ work: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    const { id } = await params;
    await deleteWork(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
