"use client";

import Image from "next/image";
import { isWorkVideoSrc } from "@/app/COMPONENTS/Works/WorkListVideo";
import type { WorkItem } from "@/lib/works/types";

type ProjectCardProps = {
  work: WorkItem;
  onEdit: (work: WorkItem) => void;
  onDelete: (id: string) => void;
  deleting?: boolean;
};

export default function ProjectCard({
  work,
  onEdit,
  onDelete,
  deleting,
}: ProjectCardProps) {
  const isVideo = isWorkVideoSrc(work.workImage);
  const preview =
    work.workThumbnail ||
    work.media.find((m) => m.mediaType === "image")?.url ||
    work.media[0]?.thumbnail ||
    work.workImage;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white px-4 py-3">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
        {isVideo && !work.workThumbnail ? (
          <video
            src={work.workImage}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
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
        )}
        {isVideo && (
          <span className="absolute bottom-0.5 right-0.5 rounded bg-black/60 px-1 text-[8px] text-white">
            ▶
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-stone-900">{work.workName}</p>
        <p className="truncate text-sm text-stone-500">
          {work.specialCategory}
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
