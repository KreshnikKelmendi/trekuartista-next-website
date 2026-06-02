import type { WorkItem } from "./types";

export function workHasYoutube(work: WorkItem): boolean {
  return Boolean(
    work.youtubeLink?.trim() ||
      (work.youtubeVideos && work.youtubeVideos.length > 0)
  );
}

/** TV ads / youtube-only entries — no image gallery on the detail page */
export function isYoutubeOnlyWork(work: WorkItem): boolean {
  if (work.youtubeOnly) return true;
  if (!workHasYoutube(work)) return false;
  return work.specialCategory === "TV AD";
}
