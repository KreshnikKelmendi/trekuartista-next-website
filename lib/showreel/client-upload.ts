import { createBrowserClient } from "@/lib/supabase/client";

export async function uploadShowreelIncoming(
  file: File,
  variant: "desktop" | "mobile"
): Promise<string> {
  const supabase = createBrowserClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
  const path = `showreel/incoming/${variant}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("works-media")
    .upload(path, file, {
      contentType: file.type || "video/mp4",
      upsert: false,
    });

  if (error) throw new Error(error.message);
  return path;
}
