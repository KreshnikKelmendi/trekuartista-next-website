/** Default Cloudinary cloud — override with NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME if needed. */
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dmzjjud3z";

export type MediaKind = "image" | "video";

export function isWorkVideoSrc(src?: string): boolean {
  if (!src) return false;
  return (
    /\.(mp4|webm|mov)(\?|#|$)/i.test(src) ||
    src.includes("/video/upload") ||
    src.includes("/videos/")
  );
}

/** True when `src` is a full URL (Cloudinary, Supabase, etc.). */
export function isAbsoluteMediaUrl(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

export function inferMediaKind(src: string): MediaKind {
  if (/\.(mp4|webm|mov)(\?|#|$)/i.test(src)) return "video";
  if (src.includes("/video/upload/")) return "video";
  return "image";
}

/**
 * Build a Cloudinary delivery URL.
 * - Full `https://...` URLs are returned as-is.
 * - Otherwise `src` is treated as a public ID (with or without extension).
 */
export function toCloudinaryUrl(
  src: string,
  kind?: MediaKind
): string {
  const trimmed = src.trim();
  if (!trimmed) return "";
  if (isAbsoluteMediaUrl(trimmed)) return trimmed;

  const mediaKind = kind ?? inferMediaKind(trimmed);
  const resource = mediaKind === "video" ? "video" : "image";
  const id = trimmed.replace(/^\//, "");
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resource}/upload/${id}`;
}
