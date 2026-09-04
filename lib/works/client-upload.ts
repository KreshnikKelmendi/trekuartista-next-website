import { createBrowserClient } from "@/lib/supabase/client";
import type { ProcessedWorkMedia } from "./process-media";

function extFromFile(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "video/mp4") return "mp4";
  if (file.type === "video/webm") return "webm";
  return "bin";
}

function publicStorageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("Missing Supabase URL.");
  return `${base}/storage/v1/object/public/works-media/${path}`;
}

/** Upload project media straight to Supabase (bypasses Vercel request size limits). */
export async function uploadWorkFilesFromBrowser(
  files: File[]
): Promise<ProcessedWorkMedia[]> {
  if (files.length === 0) return [];

  const supabase = createBrowserClient();
  const results: ProcessedWorkMedia[] = [];

  for (const file of files) {
    const mime = file.type || "application/octet-stream";
    const id = crypto.randomUUID();
    const ext = extFromFile(file);

    if (mime.startsWith("image/")) {
      const path = `images/${id}.${ext}`;
      const { error } = await supabase.storage
        .from("works-media")
        .upload(path, file, { contentType: mime, upsert: false });

      if (error) throw new Error(error.message);

      results.push({
        url: publicStorageUrl(path),
        thumbnail: null,
        mediaType: "image",
      });
      continue;
    }

    if (mime.startsWith("video/")) {
      const path = `videos/${id}.${ext}`;
      const { error } = await supabase.storage
        .from("works-media")
        .upload(path, file, { contentType: mime, upsert: false });

      if (error) throw new Error(error.message);

      results.push({
        url: publicStorageUrl(path),
        thumbnail: null,
        mediaType: "video",
      });
      continue;
    }

    throw new Error(`Unsupported file type: ${file.name}`);
  }

  return results;
}
