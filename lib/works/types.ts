export type WorkMediaItem = {
  id: string;
  workId: string;
  url: string;
  thumbnail: string | null;
  mediaType: "image" | "video";
  sortOrder: number;
};

export type WorkDescriptionItem = {
  id: string;
  workId: string;
  content: string;
  sortOrder: number;
};

export type YoutubeVideoEntry = {
  url: string;
  title: string;
  description: string;
};

export type WorkItem = {
  id: string;
  workName: string;
  specialCategory: string;
  /** Combined text for search / legacy */
  description: string;
  descriptions: WorkDescriptionItem[];
  workImage: string;
  workThumbnail?: string | null;
  media: WorkMediaItem[];
  createdAt: string;
  /** `static` = workData.ts; `db` = Supabase admin */
  source?: "static" | "db";
  category?: string;
  workDescription?: string;
  youtubeLink?: string;
  youtubeVideos?: YoutubeVideoEntry[];
  /** No gallery — only YouTube on detail (TV ads) */
  youtubeOnly?: boolean;
  /** Detail gallery columns on large screens (default 3) */
  detailGridCols?: 2 | 3;
  /** Square media tiles in a uniform 3-column gallery */
  detailMediaStyle?: "square";
  filterCategory?: string;
  hoverText?: string;
  color?: string;
  buttonTextColor?: string;
};

export type WorkRow = {
  id: string;
  work_name: string;
  special_category: string;
  description?: string | null;
  work_image: string;
  work_thumbnail: string | null;
  sort_order: number;
  created_at: string;
};

export type WorkMediaRow = {
  id: string;
  work_id: string;
  url: string;
  thumbnail: string | null;
  media_type: string;
  sort_order: number;
  created_at: string;
};

export type WorkDescriptionRow = {
  id: string;
  work_id: string;
  content: string;
  sort_order: number;
  created_at: string;
};

export function rowToWorkMedia(row: WorkMediaRow): WorkMediaItem {
  return {
    id: row.id,
    workId: row.work_id,
    url: row.url,
    thumbnail: row.thumbnail,
    mediaType: row.media_type === "video" ? "video" : "image",
    sortOrder: row.sort_order,
  };
}

export function rowToWorkDescription(row: WorkDescriptionRow): WorkDescriptionItem {
  return {
    id: row.id,
    workId: row.work_id,
    content: row.content,
    sortOrder: row.sort_order,
  };
}

export function rowToWork(
  row: WorkRow,
  media: WorkMediaItem[] = [],
  descriptions: WorkDescriptionItem[] = []
): WorkItem {
  const sortedMedia = [...media].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedDescriptions = [...descriptions].sort((a, b) => a.sortOrder - b.sortOrder);
  const cover = sortedMedia[0];

  const descItems =
    sortedDescriptions.length > 0
      ? sortedDescriptions
      : legacyDescriptionFromRow(row);

  const combinedDescription = descItems
    .map((d) => d.content.trim())
    .filter(Boolean)
    .join("\n\n");

  return {
    id: row.id,
    workName: row.work_name,
    specialCategory: row.special_category,
    description: combinedDescription || (row.description ?? ""),
    descriptions: descItems,
    workImage: cover?.url ?? row.work_image,
    workThumbnail: cover?.thumbnail ?? row.work_thumbnail,
    media: sortedMedia.length > 0 ? sortedMedia : legacyMediaFromRow(row),
    createdAt: row.created_at,
    source: "db",
  };
}

function legacyDescriptionFromRow(row: WorkRow): WorkDescriptionItem[] {
  const text = row.description?.trim();
  if (!text) return [];
  return [
    {
      id: `legacy-desc-${row.id}`,
      workId: row.id,
      content: text,
      sortOrder: 0,
    },
  ];
}

function legacyMediaFromRow(row: WorkRow): WorkMediaItem[] {
  if (!row.work_image) return [];
  const isVideo =
    /\.(mp4|webm|mov)(\?|#|$)/i.test(row.work_image) ||
    row.work_image.includes("/video/upload") ||
    row.work_image.includes("/videos/");
  return [
    {
      id: `legacy-${row.id}`,
      workId: row.id,
      url: row.work_image,
      thumbnail: row.work_thumbnail,
      mediaType: isVideo ? "video" : "image",
      sortOrder: 0,
    },
  ];
}
