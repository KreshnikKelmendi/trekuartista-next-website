import { compressShowreelVideo } from "@/lib/media/compress";
import {
  downloadStorageFile,
  getStorageObjectSize,
  moveStorageFile,
  removeStorageFile,
  showreelPublicUrl,
  updateShowreelUrl,
  uploadShowreelToStorage,
} from "./queries";

/** Above this size we skip server download/compress and move the file in storage. */
const SKIP_COMPRESS_BYTES = 60 * 1024 * 1024;

export async function processShowreelUpload(
  variant: "desktop" | "mobile",
  incomingPath: string
) {
  const finalPath = `showreel/${variant}.mp4`;
  const size = await getStorageObjectSize(incomingPath);

  if (size && size > SKIP_COMPRESS_BYTES) {
    await moveStorageFile(incomingPath, finalPath);
  } else {
    const raw = await downloadStorageFile(incomingPath);

    try {
      const compressed = await compressShowreelVideo(raw);
      await uploadShowreelToStorage(
        finalPath,
        compressed.videoBuffer,
        compressed.videoContentType
      );
    } catch {
      await uploadShowreelToStorage(finalPath, raw, "video/mp4");
    }

    await removeStorageFile(incomingPath);
  }

  const url = showreelPublicUrl(finalPath);
  await updateShowreelUrl(variant, url);

  return url;
}
