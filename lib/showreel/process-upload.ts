import { compressShowreelVideo } from "@/lib/media/compress";
import {
  downloadStorageFile,
  removeStorageFile,
  showreelPublicUrl,
  updateShowreelUrl,
  uploadShowreelToStorage,
} from "./queries";

export async function processShowreelUpload(
  variant: "desktop" | "mobile",
  incomingPath: string
) {
  const raw = await downloadStorageFile(incomingPath);
  const compressed = await compressShowreelVideo(raw);
  const finalPath = `showreel/${variant}.mp4`;

  await uploadShowreelToStorage(
    finalPath,
    compressed.videoBuffer,
    compressed.videoContentType
  );

  const url = showreelPublicUrl(finalPath);
  await updateShowreelUrl(variant, url);
  await removeStorageFile(incomingPath);

  return url;
}
