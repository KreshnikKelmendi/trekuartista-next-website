import { isWorkVideoSrc } from "./cloudinary";
import type { WorkItem } from "./types";

/** Best still/video source for portfolio grid cards — prefers thumbnails over autoplay video. */
export function pickWorkCardMedia(work: WorkItem): {
  src: string;
  poster?: string;
} {
  const cover = work.workImage?.trim() ?? "";
  const rawThumbnail = work.workThumbnail?.trim() || undefined;
  // A "thumbnail" that is itself a video file is not a still — ignore it so
  // the grid card falls back to a real image instead of autoplaying video.
  const thumbnail =
    rawThumbnail && !isWorkVideoSrc(rawThumbnail) ? rawThumbnail : undefined;
  const firstImage = work.media.find((item) => item.mediaType === "image")?.url;
  const still = thumbnail || firstImage;

  if (still && isWorkVideoSrc(cover)) {
    return { src: still };
  }

  if (cover) {
    return {
      src: cover,
      poster: still && still !== cover ? still : undefined,
    };
  }

  if (still) return { src: still };
  return { src: "" };
}
