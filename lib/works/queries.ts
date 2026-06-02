import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getStaticWorkItems } from "./legacy-to-work-item";
import { mergeStaticAndDbWorks, sortWorksNewestFirst } from "./merge-works";
import type { DescriptionInput } from "./parse-descriptions";
import { legacyWorks } from "./workData";
import {
  rowToWork,
  rowToWorkDescription,
  rowToWorkMedia,
  type WorkDescriptionItem,
  type WorkDescriptionRow,
  type WorkItem,
  type WorkMediaItem,
  type WorkMediaRow,
  type WorkRow,
} from "./types";

const staticWorkItems = getStaticWorkItems(legacyWorks);

export async function getMediaByWorkIds(
  workIds: string[]
): Promise<Map<string, WorkMediaItem[]>> {
  const map = new Map<string, WorkMediaItem[]>();
  if (workIds.length === 0) return map;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("work_media")
    .select("*")
    .in("work_id", workIds)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getMediaByWorkIds:", error.message);
    return map;
  }

  for (const row of data as WorkMediaRow[]) {
    const item = rowToWorkMedia(row);
    const list = map.get(item.workId) ?? [];
    list.push(item);
    map.set(item.workId, list);
  }

  return map;
}

export async function getDescriptionsByWorkIds(
  workIds: string[]
): Promise<Map<string, WorkDescriptionItem[]>> {
  const map = new Map<string, WorkDescriptionItem[]>();
  if (workIds.length === 0) return map;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("work_descriptions")
    .select("*")
    .in("work_id", workIds)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getDescriptionsByWorkIds:", error.message);
    return map;
  }

  for (const row of data as WorkDescriptionRow[]) {
    const item = rowToWorkDescription(row);
    const list = map.get(item.workId) ?? [];
    list.push(item);
    map.set(item.workId, list);
  }

  return map;
}

async function attachRelations(works: WorkRow[]): Promise<WorkItem[]> {
  const ids = works.map((w) => w.id);
  const [mediaMap, descriptionsMap] = await Promise.all([
    getMediaByWorkIds(ids),
    getDescriptionsByWorkIds(ids),
  ]);

  return works.map((row) =>
    rowToWork(row, mediaMap.get(row.id) ?? [], descriptionsMap.get(row.id) ?? [])
  );
}

async function getDbWorks(): Promise<WorkItem[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getDbWorks:", error.message);
    return [];
  }

  return attachRelations(data as WorkRow[]);
}

/** Static workData + Supabase admin works (DB wins on duplicate id). */
export async function getWorks(): Promise<WorkItem[]> {
  const dbWorks = await getDbWorks();
  return sortWorksNewestFirst(
    mergeStaticAndDbWorks(staticWorkItems, dbWorks)
  );
}

async function getDbWorkById(id: string): Promise<WorkItem | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as WorkRow;
  const [mediaMap, descriptionsMap] = await Promise.all([
    getMediaByWorkIds([id]),
    getDescriptionsByWorkIds([id]),
  ]);
  return rowToWork(row, mediaMap.get(id) ?? [], descriptionsMap.get(id) ?? []);
}

export async function getWorkById(id: string): Promise<WorkItem | null> {
  const fromDb = await getDbWorkById(id);
  if (fromDb) return fromDb;
  return staticWorkItems.find((w) => w.id === id) ?? null;
}

export async function insertWork(input: {
  workName: string;
  specialCategory: string;
  description?: string;
  workImage: string;
  workThumbnail?: string | null;
}) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("works")
    .insert({
      work_name: input.workName,
      special_category: input.specialCategory,
      description: input.description ?? "",
      work_image: input.workImage,
      work_thumbnail: input.workThumbnail ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as WorkRow;
}

export async function insertWorkMedia(input: {
  workId: string;
  url: string;
  thumbnail?: string | null;
  mediaType: "image" | "video";
  sortOrder: number;
}) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("work_media")
    .insert({
      work_id: input.workId,
      url: input.url,
      thumbnail: input.thumbnail ?? null,
      media_type: input.mediaType,
      sort_order: input.sortOrder,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToWorkMedia(data as WorkMediaRow);
}

export async function deleteWorkMedia(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("work_media").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function syncWorkDescriptions(
  workId: string,
  items: DescriptionInput[]
) {
  const supabase = createServiceClient();
  const { data: existing, error: fetchError } = await supabase
    .from("work_descriptions")
    .select("id")
    .eq("work_id", workId);

  if (fetchError) throw new Error(fetchError.message);

  const keepIds = new Set(
    items.map((i) => i.id).filter((id): id is string => Boolean(id))
  );

  for (const row of existing ?? []) {
    const id = (row as { id: string }).id;
    if (!keepIds.has(id)) {
      await supabase.from("work_descriptions").delete().eq("id", id);
    }
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.id && !item.id.startsWith("legacy-desc-")) {
      const { error } = await supabase
        .from("work_descriptions")
        .update({ content: item.content, sort_order: i })
        .eq("id", item.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("work_descriptions").insert({
        work_id: workId,
        content: item.content,
        sort_order: i,
      });
      if (error) throw new Error(error.message);
    }
  }

  const summary = items.map((d) => d.content).join("\n\n");
  await supabase.from("works").update({ description: summary }).eq("id", workId);
}

export async function syncWorkCover(workId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("work_media")
    .select("*")
    .eq("work_id", workId)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (!data) {
    await supabase
      .from("works")
      .update({ work_image: "", work_thumbnail: null })
      .eq("id", workId);
    return;
  }

  const row = data as WorkMediaRow;
  await supabase
    .from("works")
    .update({
      work_image: row.url,
      work_thumbnail: row.thumbnail,
    })
    .eq("id", workId);
}

export async function getNextMediaSortOrder(workId: string): Promise<number> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("work_media")
    .select("sort_order")
    .eq("work_id", workId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? (data as { sort_order: number }).sort_order + 1 : 0;
}

export async function deleteWork(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("works").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateWork(
  id: string,
  input: {
    workName?: string;
    specialCategory?: string;
    description?: string;
    workImage?: string;
    workThumbnail?: string | null;
  }
) {
  const supabase = createServiceClient();
  const patch: Record<string, string | null> = {};
  if (input.workName !== undefined) patch.work_name = input.workName;
  if (input.specialCategory !== undefined) patch.special_category = input.specialCategory;
  if (input.description !== undefined) patch.description = input.description;
  if (input.workImage !== undefined) patch.work_image = input.workImage;
  if (input.workThumbnail !== undefined) patch.work_thumbnail = input.workThumbnail;

  if (Object.keys(patch).length === 0) {
    throw new Error("Nothing to update.");
  }

  const { data, error } = await supabase
    .from("works")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as WorkRow;
}

export async function uploadToStorage(
  path: string,
  body: Buffer,
  contentType: string
) {
  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from("works-media")
    .upload(path, body, { contentType, upsert: true });

  if (error) throw new Error(error.message);
}
