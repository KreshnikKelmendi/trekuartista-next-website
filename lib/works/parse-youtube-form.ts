export function parseYoutubeFromFormData(formData: FormData) {
  const youtubeLink = String(formData.get("youtubeLink") ?? "").trim();
  const youtubeOnly = formData.get("youtubeOnly") === "true";
  return {
    youtubeLink: youtubeLink || null,
    youtubeOnly,
  };
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
