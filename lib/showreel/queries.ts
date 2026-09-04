import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  DEFAULT_SHOWREEL_DESKTOP_URL,
  type ShowreelSettings,
} from "./defaults";

type ShowreelRow = {
  desktop_url: string | null;
  mobile_url: string | null;
};

export async function getShowreelSettings(): Promise<ShowreelSettings> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("showreel_settings")
    .select("desktop_url, mobile_url")
    .eq("id", "default")
    .maybeSingle();

  if (error || !data) {
    return {
      desktopUrl: DEFAULT_SHOWREEL_DESKTOP_URL,
      mobileUrl: DEFAULT_SHOWREEL_DESKTOP_URL,
      hasCustomDesktop: false,
      hasCustomMobile: false,
    };
  }

  const row = data as ShowreelRow;
  const hasCustomDesktop = Boolean(row.desktop_url?.trim());
  const hasCustomMobile = Boolean(row.mobile_url?.trim());
  const desktopUrl = row.desktop_url?.trim() || DEFAULT_SHOWREEL_DESKTOP_URL;

  return {
    desktopUrl,
    mobileUrl: row.mobile_url?.trim() || desktopUrl,
    hasCustomDesktop,
    hasCustomMobile,
  };
}

export async function clearShowreelUrl(variant: "desktop" | "mobile") {
  const supabase = createServiceClient();
  await removeStorageFile(`showreel/${variant}.mp4`);

  const patch =
    variant === "desktop"
      ? { desktop_url: null, updated_at: new Date().toISOString() }
      : { mobile_url: null, updated_at: new Date().toISOString() };

  const { error } = await supabase
    .from("showreel_settings")
    .update(patch)
    .eq("id", "default");

  if (error) throw new Error(error.message);
}

export async function updateShowreelUrl(
  variant: "desktop" | "mobile",
  url: string
) {
  const supabase = createServiceClient();
  const patch =
    variant === "desktop"
      ? { desktop_url: url, updated_at: new Date().toISOString() }
      : { mobile_url: url, updated_at: new Date().toISOString() };

  const { error } = await supabase
    .from("showreel_settings")
    .update(patch)
    .eq("id", "default");

  if (error) throw new Error(error.message);
}

export async function uploadShowreelToStorage(
  path: string,
  body: Buffer,
  contentType: string
) {
  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from("works-media")
    .upload(path, body, { contentType, upsert: true });

  if (error) throw new Error(error.message);
}

export function showreelPublicUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("Missing Supabase URL.");
  return `${base}/storage/v1/object/public/works-media/${path}`;
}

export async function downloadStorageFile(path: string): Promise<Buffer> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from("works-media").download(path);
  if (error || !data) throw new Error(error?.message || "Could not download file.");
  return Buffer.from(await data.arrayBuffer());
}

export async function removeStorageFile(path: string) {
  const supabase = createServiceClient();
  await supabase.storage.from("works-media").remove([path]);
}

export async function getStorageObjectSize(path: string): Promise<number | null> {
  const slash = path.lastIndexOf("/");
  if (slash === -1) return null;

  const dir = path.slice(0, slash);
  const name = path.slice(slash + 1);
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from("works-media").list(dir, {
    search: name,
    limit: 1,
  });

  if (error || !data?.length) return null;

  const item = data.find((entry) => entry.name === name);
  const size = item?.metadata?.size;
  return typeof size === "number" ? size : null;
}

export async function moveStorageFile(from: string, to: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.storage.from("works-media").move(from, to);

  if (error) {
    const { error: copyError } = await supabase.storage
      .from("works-media")
      .copy(from, to);
    if (copyError) throw new Error(copyError.message);
    await removeStorageFile(from);
  }
}
