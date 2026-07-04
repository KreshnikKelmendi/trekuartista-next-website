import type { YoutubeVideoEntry } from "./types";

export function parseYoutubeFromFormData(formData: FormData) {
  const youtubeOnly = formData.get("youtubeOnly") === "true";
  let youtubeVideos: YoutubeVideoEntry[] = [];

  const raw = formData.get("youtubeVideos");
  if (raw) {
    try {
      const parsed = JSON.parse(String(raw));
      if (Array.isArray(parsed)) {
        youtubeVideos = parsed
          .filter((item): item is Record<string, unknown> => item && typeof item === "object")
          .map((item) => ({
            url: String(item.url ?? "").trim(),
            title: String(item.title ?? "").trim(),
            description: String(item.description ?? "").trim(),
          }))
          .filter((item) => item.url.length > 0);
      }
    } catch {
      youtubeVideos = [];
    }
  }

  const youtubeLink =
    String(formData.get("youtubeLink") ?? "").trim() || youtubeVideos[0]?.url || null;

  return { youtubeLink, youtubeVideos, youtubeOnly };
}

export function parseMediaOrder(formData: FormData): string[] | null {
  const raw = formData.get("mediaOrder");
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(String(raw));
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}
