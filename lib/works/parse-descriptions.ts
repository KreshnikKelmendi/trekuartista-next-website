export type DescriptionInput = {
  id?: string;
  content: string;
};

export function parseDescriptionsFromFormData(formData: FormData): DescriptionInput[] | null {
  const raw = formData.get("descriptions");
  if (raw === null) return null;

  try {
    const parsed = JSON.parse(String(raw));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        id: typeof item?.id === "string" ? item.id : undefined,
        content: String(item?.content ?? "").trim(),
      }))
      .filter((item) => item.content.length > 0);
  } catch {
    return [];
  }
}
