import { parseUploadedMedia } from "@/lib/works/parse-uploaded-media";
import { processWorkFile, type ProcessedWorkMedia } from "@/lib/works/process-media";

function getFilesFromFormData(formData: FormData): File[] {
  const fromFiles = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (fromFiles.length > 0) return fromFiles;

  const single = formData.get("file");
  if (single instanceof File && single.size > 0) return [single];
  return [];
}

export async function resolveUploadedWorkMedia(
  formData: FormData
): Promise<ProcessedWorkMedia[]> {
  const uploaded = parseUploadedMedia(formData);
  if (uploaded.length > 0) return uploaded;

  const files = getFilesFromFormData(formData);
  if (files.length === 0) return [];

  return Promise.all(files.map((file) => processWorkFile(file)));
}

export { getFilesFromFormData };
