export async function readApiError(
  res: Response,
  fallback = "Request failed"
): Promise<string> {
  const text = await res.text();

  try {
    const data = JSON.parse(text) as { error?: string; message?: string };
    return data.error || data.message || fallback;
  } catch {
    if (res.status === 413 || text.includes("Request Entity Too Large")) {
      return "Upload is too large for the server. Try smaller files or upload one video at a time.";
    }
    if (text.trim()) return text.trim().slice(0, 240);
    return `${fallback} (${res.status})`;
  }
}

export async function readApiJson<T>(res: Response): Promise<T> {
  const text = await res.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(await readApiError(res, "Invalid server response"));
  }
}
