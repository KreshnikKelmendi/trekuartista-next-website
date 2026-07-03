import { slugify } from "./slug";
import { inferMediaKind, isAbsoluteMediaUrl, toCloudinaryUrl } from "./cloudinary";
import type { LegacyMediaInput, LegacyWorkDefinition } from "./legacy-work-types";
import type { WorkDescriptionItem, WorkItem, WorkMediaItem } from "./types";

function isLegacyYoutubeOnly(entry: LegacyWorkDefinition): boolean {
  if (entry.youtubeOnly) return true;
  const hasYoutube = Boolean(
    entry.youtubeLink?.trim() ||
      (entry.youtubeVideos && entry.youtubeVideos.length > 0)
  );
  return hasYoutube && entry.specialCategory === "TV AD";
}

function staticId(workId: string | number, suffix: string) {
  return `static-${workId}-${suffix}`;
}

function resolveMediaSrc(input: LegacyMediaInput): {
  url: string;
  thumbnail?: string;
} | null {
  if (typeof input === "string") {
    const url = input.trim();
    return url ? { url } : null;
  }
  const url = input.url?.trim();
  if (!url) return null;
  const thumbnail = input.thumbnail?.trim();
  return thumbnail ? { url, thumbnail } : { url };
}

function mediaFromInputs(workId: string, inputs: LegacyMediaInput[]): WorkMediaItem[] {
  const items: WorkMediaItem[] = [];
  inputs.forEach((input, index) => {
    const resolved = resolveMediaSrc(input);
    if (!resolved) return;

    const kind = inferMediaKind(resolved.url);
    const url = toCloudinaryUrl(resolved.url, kind);
    if (!url) return;

    let thumbnail: string | null = null;
    if (resolved.thumbnail) {
      thumbnail = toCloudinaryUrl(
        resolved.thumbnail,
        inferMediaKind(resolved.thumbnail)
      );
    }

    items.push({
      id: staticId(workId, `media-${index}`),
      workId,
      url,
      thumbnail: kind === "video" ? thumbnail : thumbnail,
      mediaType: kind,
      sortOrder: index,
    });
  });
  return items;
}

function descriptionsFromStrings(
  workId: string,
  texts: string[] | undefined
): WorkDescriptionItem[] {
  if (!texts?.length) return [];
  return texts
    .map((content, index) => ({
      id: staticId(workId, `desc-${index}`),
      workId,
      content: content.trim(),
      sortOrder: index,
    }))
    .filter((d) => d.content.length > 0);
}

export function legacyWorkToWorkItem(entry: LegacyWorkDefinition): WorkItem {
  const id = String(entry.id);
  const youtubeOnly = isLegacyYoutubeOnly(entry);

  const orderedMedia: LegacyMediaInput[] = youtubeOnly
    ? []
    : entry.media.length > 0
      ? entry.media
      : [entry.cover];
  let media = mediaFromInputs(id, orderedMedia);
  const descriptions = descriptionsFromStrings(id, entry.descriptions);

  const coverSrc = entry.cover.trim();
  const coverKind = inferMediaKind(coverSrc);
  const coverUrl = toCloudinaryUrl(coverSrc, coverKind);

  // List/card uses `cover`; gallery uses `media` — keep first slot in sync when only cover was pasted
  if (coverUrl && isAbsoluteMediaUrl(coverSrc) && media[0] && media[0].url !== coverUrl) {
    media[0] = {
      ...media[0],
      url: coverUrl,
      mediaType: coverKind,
    };
  }

  const workImage = coverUrl || media[0]?.url || "";

  const thumbSrc = entry.thumbnail?.trim();
  const posterUrl =
    thumbSrc && isAbsoluteMediaUrl(thumbSrc)
      ? toCloudinaryUrl(thumbSrc, inferMediaKind(thumbSrc))
      : thumbSrc
        ? toCloudinaryUrl(thumbSrc, inferMediaKind(thumbSrc))
        : null;

  if (media[0]?.mediaType === "video" && posterUrl) {
    media[0].thumbnail = posterUrl;
  }

  const workThumbnail =
    posterUrl ?? media.find((m) => m.mediaType === "image")?.url ?? null;

  const combinedDescription = descriptions.map((d) => d.content).join("\n\n");

  return {
    id,
    slug: slugify(entry.workName) || id,
    workName: entry.workName,
    specialCategory: entry.specialCategory,
    description: combinedDescription,
    descriptions,
    workImage,
    workThumbnail,
    media: media.length > 0 ? media : legacyCoverOnly(id, coverSrc, thumbSrc),
    createdAt: entry.createdAt ?? "2020-01-01T00:00:00.000Z",
    source: "static",
    category: entry.category,
    workDescription: entry.workDescription,
    youtubeLink: entry.youtubeLink,
    youtubeVideos: entry.youtubeVideos,
    youtubeOnly,
    filterCategory: entry.filterCategory,
    hoverText: entry.hoverText,
    color: entry.color,
    buttonTextColor: entry.buttonTextColor,
    detailGridCols: entry.detailGridCols,
    detailMediaStyle: entry.detailMediaStyle,
  };
}

function legacyCoverOnly(
  workId: string,
  cover: string,
  thumb?: string
): WorkMediaItem[] {
  if (!cover.trim()) return [];
  const kind = inferMediaKind(cover);
  const url = toCloudinaryUrl(cover, kind);
  if (!url) return [];
  const thumbUrl = thumb ? toCloudinaryUrl(thumb, inferMediaKind(thumb)) : null;
  return [
    {
      id: staticId(workId, "media-0"),
      workId,
      url,
      thumbnail: kind === "video" ? thumbUrl : thumbUrl,
      mediaType: kind,
      sortOrder: 0,
    },
  ];
}

export function getStaticWorkItems(
  entries: LegacyWorkDefinition[]
): WorkItem[] {
  return entries.map(legacyWorkToWorkItem);
}
