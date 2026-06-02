import { randomUUID } from "crypto";
import {
  compressImage,
  compressVideo,
  isImageMime,
  isVideoMime,
} from "@/lib/media/compress";
import { getPublicMediaUrl } from "@/lib/supabase/service";
import { uploadToStorage } from "./queries";

export type ProcessedWorkMedia = {
  url: string;
  thumbnail: string | null;
  mediaType: "image" | "video";
};

export async function processWorkFile(file: File): Promise<ProcessedWorkMedia> {
  const mime = file.type || "application/octet-stream";
  const raw = Buffer.from(await file.arrayBuffer());
  const baseId = randomUUID();

  if (isImageMime(mime)) {
    const { buffer, contentType, ext } = await compressImage(raw);
    const path = `images/${baseId}.${ext}`;
    await uploadToStorage(path, buffer, contentType);
    return {
      url: getPublicMediaUrl(path),
      thumbnail: null,
      mediaType: "image",
    };
  }

  if (isVideoMime(mime)) {
    const { videoBuffer, thumbnailBuffer, videoContentType, videoExt } =
      await compressVideo(raw);
    const videoPath = `videos/${baseId}.${videoExt}`;
    const thumbPath = `thumbnails/${baseId}.webp`;
    await uploadToStorage(videoPath, videoBuffer, videoContentType);
    await uploadToStorage(thumbPath, thumbnailBuffer, "image/webp");
    return {
      url: getPublicMediaUrl(videoPath),
      thumbnail: getPublicMediaUrl(thumbPath),
      mediaType: "video",
    };
  }

  throw new Error("Only images and videos are supported.");
}
