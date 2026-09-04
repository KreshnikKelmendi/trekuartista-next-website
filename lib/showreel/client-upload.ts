import { createBrowserClient } from "@/lib/supabase/client";

function formatStorageError(message: string, fileSize: number) {
  const lower = message.toLowerCase();
  if (
    lower.includes("maximum") ||
    lower.includes("size") ||
    lower.includes("too large") ||
    lower.includes("payload")
  ) {
    const mb = (fileSize / (1024 * 1024)).toFixed(1);
    return `Upload failed (${mb} MB). Supabase limits file size — Free plan max is 50 MB. Go to Supabase Dashboard → Storage → Settings, increase the global file size limit, then run supabase/migrations/showreel_storage_limits.sql.`;
  }
  return message;
}

export async function uploadShowreelIncoming(
  file: File,
  variant: "desktop" | "mobile",
  onProgress?: (label: string) => void
): Promise<string> {
  const supabase = createBrowserClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
  const path = `showreel/incoming/${variant}-${crypto.randomUUID()}.${ext}`;

  onProgress?.("Uploading to storage…");

  const { error } = await supabase.storage.from("works-media").upload(path, file, {
    contentType: file.type || "video/mp4",
    upsert: false,
    cacheControl: "3600",
  });

  if (error) {
    throw new Error(formatStorageError(error.message, file.size));
  }

  return path;
}
