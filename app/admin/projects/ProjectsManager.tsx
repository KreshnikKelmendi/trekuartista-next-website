"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { WorkItem, WorkMediaItem } from "@/lib/works/types";
import ProjectCard from "./ProjectCard";

type DescriptionField = {
  key: string;
  id?: string;
  content: string;
};

function newDescriptionField(content = "", id?: string): DescriptionField {
  return {
    key: typeof crypto !== "undefined" ? crypto.randomUUID() : String(Math.random()),
    id,
    content,
  };
}

function resetForm(setters: {
  setWorkName: (v: string) => void;
  setSpecialCategory: (v: string) => void;
  setDescriptionFields: (v: DescriptionField[]) => void;
  setNewFiles: (v: File[]) => void;
  setRemoveMediaIds: (v: string[]) => void;
  setError: (v: string) => void;
  setEditingWork: (v: WorkItem | null) => void;
}) {
  setters.setWorkName("");
  setters.setSpecialCategory("");
  setters.setDescriptionFields([]);
  setters.setNewFiles([]);
  setters.setRemoveMediaIds([]);
  setters.setError("");
  setters.setEditingWork(null);
}

function ThumbnailPreview({ src, label }: { src: string; label: string }) {
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(src) || src.includes("/video/upload");

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-medium uppercase tracking-wide text-teal-800">
        {label}
      </span>
      <div className="relative h-20 w-20 overflow-hidden rounded-lg ring-2 ring-teal-600/40 bg-stone-100">
        {isVideo ? (
          <video
            src={src}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="80px"
            unoptimized={
              src.includes("supabase.co") || src.includes("res.cloudinary.com")
            }
          />
        )}
      </div>
    </div>
  );
}

function MediaThumb({ item, index }: { item: WorkMediaItem; index: number }) {
  const preview =
    item.mediaType === "video" ? item.thumbnail || item.url : item.url;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-stone-400">{index + 1}</span>
      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-stone-100">
        {item.mediaType === "video" && !item.thumbnail ? (
          <video
            src={item.url}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <Image
            src={preview}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
            unoptimized={
              preview.includes("supabase.co") ||
              preview.includes("res.cloudinary.com")
            }
          />
        )}
        {item.mediaType === "video" && (
          <span className="absolute bottom-0.5 right-0.5 rounded bg-black/60 px-1 text-[8px] text-white">
            ▶
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProjectsManager({
  initialWorks,
}: {
  initialWorks: WorkItem[];
}) {
  const router = useRouter();
  const [works, setWorks] = useState(initialWorks);
  const [workName, setWorkName] = useState("");
  const [specialCategory, setSpecialCategory] = useState("");
  const [descriptionFields, setDescriptionFields] = useState<DescriptionField[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [removeMediaIds, setRemoveMediaIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isEditing = editingWork !== null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return works;
    return works.filter(
      (w) =>
        w.workName.toLowerCase().includes(q) ||
        w.specialCategory.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q)
    );
  }, [works, search]);

  function openAddModal() {
    setEditingWork(null);
    setWorkName("");
    setSpecialCategory("");
    setDescriptionFields([]);
    setNewFiles([]);
    setRemoveMediaIds([]);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(work: WorkItem) {
    setEditingWork(work);
    setWorkName(work.workName);
    setSpecialCategory(work.specialCategory);
    setDescriptionFields(
      work.descriptions.length > 0
        ? work.descriptions.map((d) =>
            newDescriptionField(
              d.content,
              d.id.startsWith("legacy-desc-") ? undefined : d.id
            )
          )
        : []
    );
    setNewFiles([]);
    setRemoveMediaIds([]);
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    resetForm({
      setWorkName,
      setSpecialCategory,
      setDescriptionFields,
      setNewFiles,
      setRemoveMediaIds,
      setError,
      setEditingWork,
    });
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length > 0) {
      setNewFiles((prev) => [...prev, ...picked]);
    }
    e.target.value = "";
  }

  function markMediaRemoved(id: string) {
    if (id.startsWith("legacy-")) return;
    setRemoveMediaIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!workName.trim()) {
      setError("Enter a title.");
      return;
    }
    if (!specialCategory.trim()) {
      setError("Enter a category.");
      return;
    }

    const totalMedia = isEditing
      ? (editingWork.media.filter((m) => !removeMediaIds.includes(m.id)).length +
          newFiles.length)
      : newFiles.length;

    if (totalMedia === 0) {
      setError("Add at least one image or video.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("workName", workName.trim());
      formData.append("specialCategory", specialCategory.trim());
      const descriptionsPayload = descriptionFields
        .map(({ id, content }) => ({
          id,
          content: content.trim(),
        }))
        .filter((d) => d.content.length > 0);
      formData.append("descriptions", JSON.stringify(descriptionsPayload));
      newFiles.forEach((f) => formData.append("files", f));
      if (removeMediaIds.length > 0) {
        formData.append("removeMediaIds", JSON.stringify(removeMediaIds));
      }

      const url = isEditing ? `/api/works/${editingWork.id}` : "/api/works";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      if (isEditing) {
        setWorks((prev) =>
          prev.map((w) => (w.id === data.work.id ? data.work : w))
        );
      } else {
        setWorks((prev) => [data.work, ...prev]);
      }

      closeModal();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);

    const res = await fetch(`/api/works/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Delete failed");
      setDeletingId(null);
      return;
    }

    setWorks((prev) => prev.filter((w) => w.id !== id));
    setDeletingId(null);
    router.refresh();
  }

  const visibleExisting =
    editingWork?.media.filter(
      (m) => !removeMediaIds.includes(m.id)
    ) ?? [];

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-stone-900">Projects</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="rounded-lg bg-[#0c1f1d] px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-900"
        >
          + Add project
        </button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search…"
        className="mb-4 w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
      />

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-200 bg-white py-16 text-center">
          <p className="text-sm text-stone-500">
            {works.length === 0 ? "No projects yet." : "No results."}
          </p>
          {works.length === 0 && (
            <button
              type="button"
              onClick={openAddModal}
              className="mt-3 text-sm font-medium text-teal-700 hover:text-teal-900"
            >
              Add your first project
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((work) => (
            <ProjectCard
              key={work.id}
              work={work}
              onEdit={openEditModal}
              onDelete={handleDelete}
              deleting={deletingId === work.id}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900">
                {isEditing ? "Edit project" : "Add project"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm text-stone-600">Title</span>
                <input
                  required
                  value={workName}
                  onChange={(e) => setWorkName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Nova Brand"
                />
              </label>

              <label className="block">
                <span className="text-sm text-stone-600">Category</span>
                <input
                  required
                  value={specialCategory}
                  onChange={(e) => setSpecialCategory(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Branding"
                />
              </label>

              <div className="block">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-stone-600">Descriptions</span>
                  <button
                    type="button"
                    onClick={() =>
                      setDescriptionFields((prev) => [...prev, newDescriptionField()])
                    }
                    className="text-sm font-medium text-teal-700 hover:text-teal-900"
                  >
                    + Add description
                  </button>
                </div>

                {descriptionFields.length === 0 ? (
                  <p className="mt-2 text-xs text-stone-400">
                    Click &quot;Add description&quot; to add text blocks for the project page.
                  </p>
                ) : (
                  <div className="mt-2 space-y-3">
                    {descriptionFields.map((field, index) => (
                      <div
                        key={field.key}
                        className="rounded-lg border border-stone-200 bg-stone-50/50 p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-stone-500">
                            {index === 0
                              ? "Block 1 — page header"
                              : index === 1
                                ? "Block 2 — beside images 4–5"
                                : index === 2
                                  ? "Block 3 — after 6 media (center)"
                                  : `Block ${index + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setDescriptionFields((prev) =>
                                prev.filter((f) => f.key !== field.key)
                              )
                            }
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <textarea
                          value={field.content}
                          onChange={(e) =>
                            setDescriptionFields((prev) =>
                              prev.map((f) =>
                                f.key === field.key
                                  ? { ...f, content: e.target.value }
                                  : f
                              )
                            )
                          }
                          rows={3}
                          className="w-full resize-y rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                          placeholder="Write about this project…"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="block">
                <span className="text-sm text-stone-600">
                  Media {isEditing ? "(add more or remove)" : ""}
                </span>

                {(isEditing &&
                  (editingWork.workThumbnail || editingWork.workImage)) ||
                visibleExisting.length > 0 ? (
                  <div className="mt-2 flex flex-wrap items-end gap-3">
                    {isEditing &&
                    (editingWork.workThumbnail || editingWork.workImage) ? (
                      <ThumbnailPreview
                        src={editingWork.workThumbnail || editingWork.workImage}
                        label="Thumbnail"
                      />
                    ) : null}
                    {visibleExisting.map((item, index) => (
                      <div key={item.id} className="relative">
                        <MediaThumb item={item} index={index} />
                        {!item.id.startsWith("legacy-") && (
                          <button
                            type="button"
                            onClick={() => markMediaRemoved(item.id)}
                            className="absolute -right-1 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                            aria-label="Remove"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}

                {newFiles.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {newFiles.map((f, i) => (
                      <li
                        key={`${f.name}-${i}`}
                        className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-600"
                      >
                        <span className="truncate">{f.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setNewFiles((prev) => prev.filter((_, j) => j !== i))
                          }
                          className="ml-2 shrink-0 text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFilesSelected}
                  className="mt-2 w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-sm file:text-white"
                />
                <p className="mt-1 text-xs text-stone-400">
                  Select one or more images or videos
                </p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-stone-200 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-[#0c1f1d] py-2.5 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-50"
                >
                  {loading ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
