"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { TeamMember } from "@/lib/team/types";
import TeamMemberCard from "./TeamMemberCard";

function resetForm(setters: {
  setName: (v: string) => void;
  setPosition: (v: string) => void;
  setFile: (v: File | null) => void;
  setError: (v: string) => void;
  setEditingMember: (v: TeamMember | null) => void;
}) {
  setters.setName("");
  setters.setPosition("");
  setters.setFile(null);
  setters.setError("");
  setters.setEditingMember(null);
}

export default function TeamManager({
  initialMembers,
}: {
  initialMembers: TeamMember[];
}) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const isEditing = editingMember !== null;

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.position.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q)
    );
  }, [members, search]);

  function openAddModal() {
    setEditingMember(null);
    setName("");
    setPosition("");
    setFile(null);
    setError("");
    setFormKey((k) => k + 1);
    setModalOpen(true);
  }

  function openEditModal(member: TeamMember) {
    setEditingMember(member);
    setName(member.name);
    setPosition(member.position);
    setFile(null);
    setError("");
    setFormKey((k) => k + 1);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    resetForm({ setName, setPosition, setFile, setError, setEditingMember });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedPosition = position.trim();

    if (!trimmedName) {
      setError("Enter a name.");
      return;
    }
    if (!trimmedPosition) {
      setError("Enter a position.");
      return;
    }
    if (!isEditing && !file) {
      setError("Choose a photo.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("position", trimmedPosition);
      if (file) formData.append("file", file);

      const url = isEditing ? `/api/team/${editingMember.id}` : "/api/team";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        member?: TeamMember;
      };

      if (!res.ok) {
        throw new Error(data.error || `Save failed (${res.status})`);
      }

      if (!data.member) {
        throw new Error("Save failed: no member returned.");
      }

      if (isEditing) {
        setMembers((prev) =>
          prev.map((m) => (m.id === data.member.id ? data.member : m))
        );
      } else {
        setMembers((prev) => [...prev, data.member]);
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
    const member = members.find((m) => m.id === id);
    const label = member?.name ?? "this member";

    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || `Delete failed (${res.status})`);
      }

      setMembers((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      setError(message);
      alert(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-stone-900">Team</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="rounded-lg bg-[#0c1f1d] px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-900"
        >
          + Add member
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
            {members.length === 0 ? "No members yet." : "No results."}
          </p>
          {members.length === 0 && (
            <button
              type="button"
              onClick={openAddModal}
              className="mt-3 text-sm font-medium text-teal-700 hover:text-teal-900"
            >
              Add your first member
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={openEditModal}
              onDelete={handleDelete}
              deleting={deletingId === member.id}
            />
          ))}
        </div>
      )}

      {error && !modalOpen ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {modalOpen && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-stone-900">
                {isEditing ? "Edit member" : "Add member"}
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

            <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm text-stone-600">Name</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Jane Doe"
                />
              </label>

              <label className="block">
                <span className="text-sm text-stone-600">Position</span>
                <input
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Graphic Designer"
                />
              </label>

              <label className="block">
                <span className="text-sm text-stone-600">
                  Photo{isEditing ? " (optional — leave empty to keep current)" : ""}
                </span>
                {isEditing && editingMember && !file && (
                  <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-lg bg-stone-100">
                    <Image
                      src={editingMember.image}
                      alt={editingMember.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized={editingMember.image.includes("supabase.co")}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  required={!isEditing}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="mt-2 w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-sm file:text-white"
                />
              </label>

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
