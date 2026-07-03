import type { YoutubeVideoEntry } from "./types";

export function youtubeVideoId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {
    return null;
  }
  return null;
}

export function youtubeThumbnailUrl(url: string): string | null {
  const id = youtubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function parseYoutubeVideos(raw: unknown): YoutubeVideoEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => item && typeof item === "object")
    .map((item) => ({
      url: String(item.url ?? "").trim(),
      title: String(item.title ?? "").trim(),
      description: String(item.description ?? "").trim(),
    }))
    .filter((item) => item.url.length > 0);
}
