import worksJson from "@/data/works.json";
import type { LegacyWorkDefinition, WorksDataFile } from "./legacy-work-types";

const data = worksJson as WorksDataFile & { __meta?: { instructions?: string } };

/**
 * Edit `data/works.json` — paste Cloudinary “Copy URL” links into
 * `cover`, `thumbnail`, and each item in `media`.
 * Supabase admin projects are merged in `lib/works/queries.ts`.
 */
export const legacyWorks: LegacyWorkDefinition[] = data.works;

export const HOMEPAGE_FEATURED_WORK_IDS = data.featuredIds;

export const WORK_FILTER_CATEGORIES =
  data.filterCategories ?? [
    "Brand Identity",
    "Social Media",
    "Campaigns",
    "Video Production",
    "Web / UI-UX",
    "3D / Motion",
    "Unassigned",
  ];

export { CLOUDINARY_CLOUD_NAME, toCloudinaryUrl, inferMediaKind } from "./cloudinary";
export type {
  LegacyWorkDefinition,
  LegacyMediaInput,
  WorksDataFile,
  YoutubeVideoEntry,
} from "./legacy-work-types";
