import type { ProcessedWorkMedia } from "./process-media";

export function parseUploadedMedia(formData: FormData): ProcessedWorkMedia[] {
  const raw = formData.get("uploadedMedia");
  if (!raw) return [];

  try {
    const parsed = JSON.parse(String(raw));
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is Record<string, unknown> => item && typeof item === "object")
      .map((item) => ({
        url: String(item.url ?? "").trim(),
        thumbnail: item.thumbnail ? String(item.thumbnail).trim() : null,
        mediaType: (item.mediaType === "video" ? "video" : "image") as "image" | "video",
      }))
      .filter((item) => item.url.length > 0);
  } catch {
    return [];
  }
}
