export type YoutubeVideoEntry = {
  url: string;
  title: string;
  description: string;
};

/** Paste a Cloudinary delivery URL, or `{ "url", "thumbnail" }` for video + poster. */
export type LegacyMediaInput =
  | string
  | {
      url: string;
      thumbnail?: string;
    };

/**
 * One project in `data/works.json`.
 * Paste full links from Cloudinary (Copy URL) into `cover`, `thumbnail`, and `media`.
 */
export type LegacyWorkDefinition = {
  id: string | number;
  workName: string;
  specialCategory: string;
  category?: string;
  workDescription?: string;
  /** Card / hero cover — Cloudinary https URL */
  cover: string;
  /** Video poster or list thumb — Cloudinary https URL */
  thumbnail?: string;
  /** Gallery order for the detail page */
  media: LegacyMediaInput[];
  descriptions?: string[];
  youtubeLink?: string;
  youtubeVideos?: YoutubeVideoEntry[];
  /** True for TV ads: no `media` gallery, only YouTube on the project page */
  youtubeOnly?: boolean;
  /** Detail page gallery columns on large screens (default 3) */
  detailGridCols?: 2 | 3;
  /** Square tiles in a simple 3-column gallery (e.g. EMONA) */
  detailMediaStyle?: "square";
  filterCategory?: string;
  hoverText?: string;
  color?: string;
  buttonTextColor?: string;
  createdAt?: string;
};

/** Root shape of `data/works.json` */
export type WorksDataFile = {
  featuredIds: (string | number)[];
  filterCategories?: string[];
  works: LegacyWorkDefinition[];
};
