"use client";

import Image from "next/image";
import { isWorkVideoSrc } from "@/app/COMPONENTS/Works/WorkListVideo";
import type { WorkItem } from "@/lib/works/types";

type ProjectCardProps = {
  work: WorkItem;
  index: number;
  onEdit: (work: WorkItem) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  reordering?: boolean;
  deleting?: boolean;
};

export default function ProjectCard({
  work,
  index,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  reordering,
  deleting,
}: ProjectCardProps) {
  const isVideo = isWorkVideoSrc(work.workImage);
  const preview =
    work.workThumbnail ||
    work.media.find((m) => m.mediaType === "image")?.url ||
    work.media[0]?.thumbnail ||
    work.workImage;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <button
          type="button"
          onClick={() => onMoveUp(work.id)}
          disabled={!canMoveUp || reordering}
          className="rounded px-1.5 py-0.5 text-xs text-stone-500 hover:bg-stone-100 disabled:opacity-30"
          aria-label="Move up"
        >
          ↑
        </button>
        <span className="text-[10px] font-medium tabular-nums text-stone-400">
          {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onMoveDown(work.id)}
          disabled={!canMoveDown || reordering}
          className="rounded px-1.5 py-0.5 text-xs text-stone-500 hover:bg-stone-100 disabled:opacity-30"
          aria-label="Move down"
        >
          ↓
        </button>
      </div>

      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
        {isVideo && !work.workThumbnail ? (
          <video
            src={work.workImage}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : preview ? (
          <Image
            src={preview}
            alt={work.workName}
            fill
            className="object-cover"
            sizes="56px"
            unoptimized={
              preview.includes("supabase.co") ||
              preview.includes("res.cloudinary.com")
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-400">
            ▶
          </div>
        )}
        {isVideo && preview && (
          <span className="absolute bottom-0.5 right-0.5 rounded bg-black/60 px-1 text-[8px] text-white">
            ▶
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-stone-900">{work.workName}</p>
        <p className="truncate text-sm text-stone-500">
          {work.specialCategory}
          {work.youtubeLink || work.youtubeVideos?.length ? " · YouTube" : ""}
          {work.media.length > 1 ? ` · ${work.media.length} media` : ""}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(work)}
          className="rounded-lg px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-100"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(work.id)}
          disabled={deleting}
          className="rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
