import { createServiceClient } from "@/lib/supabase/service";
import type { WorkItem } from "./types";

export function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function getWorkSlug(work: Pick<WorkItem, "slug" | "workName" | "id">): string {
  if (work.slug?.trim()) return work.slug.trim();
  const fromTitle = slugify(work.workName);
  return fromTitle || String(work.id);
}

export function workDetailPath(work: Pick<WorkItem, "slug" | "workName" | "id">): string {
  return `/our-works/${getWorkSlug(work)}`;
}

/** Ensure every work has a unique slug within the list. */
export function assignUniqueSlugs(works: WorkItem[]): WorkItem[] {
  const used = new Set<string>();
  return works.map((work) => {
    let base = getWorkSlug(work);
    if (!base) base = String(work.id);
    let slug = base;
    let n = 2;
    while (used.has(slug)) {
      slug = `${base}-${n++}`;
    }
    used.add(slug);
    return slug === work.slug ? work : { ...work, slug };
  });
}

export async function ensureUniqueDbSlug(
  workName: string,
  excludeId?: string
): Promise<string> {
  const supabase = createServiceClient();
  let base = slugify(workName) || "project";
  let slug = base;
  let n = 2;

  while (true) {
    let query = supabase.from("works").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    slug = `${base}-${n++}`;
  }
}
