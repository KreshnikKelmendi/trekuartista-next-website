import type { WorkItem } from "./types";

/** DB entries replace static entries with the same id (after admin migration). */
export function mergeStaticAndDbWorks(
  staticWorks: WorkItem[],
  dbWorks: WorkItem[]
): WorkItem[] {
  const byId = new Map<string, WorkItem>();
  for (const work of staticWorks) {
    byId.set(String(work.id), work);
  }
  for (const work of dbWorks) {
    byId.set(String(work.id), work);
  }
  return Array.from(byId.values());
}

export function sortWorksNewestFirst(works: WorkItem[]): WorkItem[] {
  return [...works].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function sortWorksByDisplayOrder(
  works: WorkItem[],
  orderMap: Map<string, number>
): WorkItem[] {
  if (orderMap.size === 0) return sortWorksNewestFirst(works);

  return [...works].sort((a, b) => {
    const aOrder = orderMap.get(a.id);
    const bOrder = orderMap.get(b.id);

    if (aOrder !== undefined && bOrder !== undefined) {
      if (aOrder !== bOrder) return aOrder - bOrder;
    } else if (aOrder !== undefined) {
      return -1;
    } else if (bOrder !== undefined) {
      return 1;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function pickFeaturedWorks(
  works: WorkItem[],
  featuredIds: (string | number)[]
): WorkItem[] {
  const byId = new Map(works.map((w) => [String(w.id), w]));
  const picked: WorkItem[] = [];
  const used = new Set<string>();

  for (const id of featuredIds) {
    const work = byId.get(String(id));
    if (work && !used.has(work.id)) {
      picked.push(work);
      used.add(work.id);
    }
  }

  for (const work of works) {
    if (!used.has(work.id)) {
      picked.push(work);
      used.add(work.id);
    }
  }

  return picked;
}
