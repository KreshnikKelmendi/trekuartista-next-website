"use client";

import Image from "next/image";
import type { TeamMember } from "@/lib/team/types";

type TeamMemberCardProps = {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
  deleting?: boolean;
};

export default function TeamMemberCard({
  member,
  onEdit,
  onDelete,
  deleting,
}: TeamMemberCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white px-4 py-3">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
          sizes="56px"
          unoptimized={member.image.includes("supabase.co")}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-stone-900">{member.name}</p>
        <p className="truncate text-sm text-stone-500">{member.position}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(member)}
          className="rounded-lg px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-100"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(member.id)}
          disabled={deleting}
          className="rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
