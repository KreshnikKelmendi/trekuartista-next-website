import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isUuid, storagePathFromPublicUrl } from "./ids";
import { getStaticWorkItems } from "./legacy-to-work-item";
import { mergeStaticAndDbWorks, sortWorksByDisplayOrder } from "./merge-works";
import type { DescriptionInput } from "./parse-descriptions";
import { assignUniqueSlugs, ensureUniqueDbSlug, getWorkSlug } from "./slug";
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
  type YoutubeVideoEntry,
} from "./types";

const staticWorkItems = getStaticWorkItems(legacyWorks);

async function getHiddenStaticWorkIds(): Promise<Set<string>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("hidden_static_works")
    .select("work_id");

  if (error) {
    console.error("getHiddenStaticWorkIds:", error.message);
    return new Set();
  }

  return new Set((data ?? []).map((row) => String((row as { work_id: string }).work_id)));
}

async function getWorkDisplayOrderMap(): Promise<Map<string, number>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("work_display_order")
    .select("work_id, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getWorkDisplayOrderMap:", error.message);
    return new Map();
  }

  const map = new Map<string, number>();
  for (const row of data ?? []) {
    const item = row as { work_id: string; sort_order: number };
    map.set(String(item.work_id), item.sort_order);
  }
  return map;
}

function findStaticWork(param: string, hiddenIds: Set<string>): WorkItem | null {
  for (const work of staticWorkItems) {
    if (hiddenIds.has(work.id)) continue;
    if (work.id === param || getWorkSlug(work) === param) return work;
  }
  return null;
}

export async function getMediaByWorkIds(
  workIds: string[]
): Promise<Map<string, WorkMediaItem[]>> {
  const map = new Map<string, WorkMediaItem[]>();
  if (workIds.length === 0) return map;

  const supabase = createServerClient();
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

  const supabase = createServerClient();
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
  const [dbWorks, hiddenIds, orderMap] = await Promise.all([
    getDbWorks(),
    getHiddenStaticWorkIds(),
    getWorkDisplayOrderMap(),
  ]);
  const visibleStatic = staticWorkItems.filter(
    (work) => !hiddenIds.has(String(work.id))
  );
  const merged = assignUniqueSlugs(
    mergeStaticAndDbWorks(visibleStatic, dbWorks)
  );
  return sortWorksByDisplayOrder(merged, orderMap);
}

async function getDbWorkBySlugOrId(param: string): Promise<WorkItem | null> {
  const supabase = createServerClient();
  const query = isUuid(param)
    ? supabase.from("works").select("*").eq("id", param)
    : supabase.from("works").select("*").eq("slug", param);

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;

  const row = data as WorkRow;
  const [mediaMap, descriptionsMap] = await Promise.all([
    getMediaByWorkIds([row.id]),
    getDescriptionsByWorkIds([row.id]),
  ]);
  return rowToWork(row, mediaMap.get(row.id) ?? [], descriptionsMap.get(row.id) ?? []);
}

async function getDbWorkById(id: string): Promise<WorkItem | null> {
  return getDbWorkBySlugOrId(id);
}

export async function getWorkById(id: string): Promise<WorkItem | null> {
  return getWorkBySlugOrId(id);
}

export async function getWorkBySlugOrId(param: string): Promise<WorkItem | null> {
  const hiddenIds = await getHiddenStaticWorkIds();
  if (hiddenIds.has(String(param))) return null;

  const fromDb = await getDbWorkBySlugOrId(param);
  if (fromDb) return fromDb;

  return findStaticWork(param, hiddenIds);
}

export async function insertWork(input: {
  workName: string;
  specialCategory: string;
  description?: string;
  workImage: string;
  workThumbnail?: string | null;
  slug?: string;
  youtubeLink?: string | null;
  youtubeVideos?: YoutubeVideoEntry[];
  youtubeOnly?: boolean;
}) {
  const supabase = createServiceClient();
  const slug = input.slug ?? (await ensureUniqueDbSlug(input.workName));
  const fullRow = {
    work_name: input.workName,
    special_category: input.specialCategory,
    description: input.description ?? "",
    work_image: input.workImage,
    work_thumbnail: input.workThumbnail ?? null,
    slug,
    youtube_link: input.youtubeLink ?? null,
    youtube_videos: input.youtubeVideos ?? [],
    youtube_only: input.youtubeOnly ?? false,
  };

  let { data, error } = await supabase.from("works").insert(fullRow).select().single();

  if (error?.message?.includes("column")) {
    ({ data, error } = await supabase
      .from("works")
      .insert({
        work_name: input.workName,
        special_category: input.specialCategory,
        description: input.description ?? "",
        work_image: input.workImage,
        work_thumbnail: input.workThumbnail ?? null,
      })
      .select()
      .single());
  }

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

async function hideStaticWork(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("hidden_static_works")
    .upsert({ work_id: String(id) }, { onConflict: "work_id" });
  if (error) throw new Error(error.message);
}

export async function deleteWork(id: string) {
  const supabase = createServiceClient();
  const { data: media, error: mediaError } = await supabase
    .from("work_media")
    .select("url, thumbnail")
    .eq("work_id", id);

  if (mediaError) throw new Error(mediaError.message);

  const storagePaths = new Set<string>();
  for (const row of media ?? []) {
    const item = row as { url: string; thumbnail: string | null };
    const urlPath = storagePathFromPublicUrl(item.url);
    if (urlPath) storagePaths.add(urlPath);
    if (item.thumbnail) {
      const thumbPath = storagePathFromPublicUrl(item.thumbnail);
      if (thumbPath) storagePaths.add(thumbPath);
    }
  }

  if (storagePaths.size > 0) {
    const { error: storageError } = await supabase.storage
      .from("works-media")
      .remove([...storagePaths]);
    if (storageError) throw new Error(storageError.message);
  }

  const { error } = await supabase.from("works").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Deletes a Supabase project or hides a legacy static project from the site. */
export async function deleteWorkById(id: string) {
  if (isUuid(id)) {
    await deleteWork(id);
    return;
  }

  const exists = staticWorkItems.some((work) => work.id === String(id));
  if (!exists) {
    throw new Error("Project not found.");
  }

  await hideStaticWork(id);
}

export async function syncWorkMediaOrder(workId: string, orderedIds: string[]) {
  const supabase = createServiceClient();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("work_media")
      .update({ sort_order: i })
      .eq("id", orderedIds[i])
      .eq("work_id", workId);
    if (error) throw new Error(error.message);
  }
  await syncWorkCover(workId);
}

export async function reorderWorks(orderedIds: string[]) {
  const supabase = createServiceClient();
  const rows = orderedIds.map((work_id, sort_order) => ({ work_id, sort_order }));
  const { error } = await supabase
    .from("work_display_order")
    .upsert(rows, { onConflict: "work_id" });
  if (error) throw new Error(error.message);

  for (let i = 0; i < orderedIds.length; i++) {
    if (isUuid(orderedIds[i])) {
      await supabase.from("works").update({ sort_order: i }).eq("id", orderedIds[i]);
    }
  }
}

export async function updateWork(
  id: string,
  input: {
    workName?: string;
    specialCategory?: string;
    description?: string;
    workImage?: string;
    workThumbnail?: string | null;
    slug?: string;
    youtubeLink?: string | null;
    youtubeVideos?: YoutubeVideoEntry[];
    youtubeOnly?: boolean;
  }
) {
  const supabase = createServiceClient();
  const patch: Record<string, string | boolean | null | YoutubeVideoEntry[]> = {};
  if (input.workName !== undefined) {
    patch.work_name = input.workName;
    if (input.slug === undefined) {
      patch.slug = await ensureUniqueDbSlug(input.workName, id);
    }
  }
  if (input.specialCategory !== undefined) patch.special_category = input.specialCategory;
  if (input.description !== undefined) patch.description = input.description;
  if (input.workImage !== undefined) patch.work_image = input.workImage;
  if (input.workThumbnail !== undefined) patch.work_thumbnail = input.workThumbnail;
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.youtubeLink !== undefined) patch.youtube_link = input.youtubeLink;
  if (input.youtubeVideos !== undefined) patch.youtube_videos = input.youtubeVideos;
  if (input.youtubeOnly !== undefined) patch.youtube_only = input.youtubeOnly;

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
