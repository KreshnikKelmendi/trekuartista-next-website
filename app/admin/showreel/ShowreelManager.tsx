"use client";

import { useRef, useState } from "react";
import LoadingSpinner from "@/app/COMPONENTS/ui/LoadingSpinner";
import { readApiError, readApiJson } from "@/lib/admin/parse-api-response";
import { uploadShowreelIncoming } from "@/lib/showreel/client-upload";
import { isCustomShowreelUrl, type ShowreelSettings } from "@/lib/showreel/defaults";

type Variant = "desktop" | "mobile";

function ShowreelRow({
  label,
  url,
  busy,
  onUpload,
  onDelete,
}: {
  label: string;
  url: string;
  busy: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isCustom = isCustomShowreelUrl(url);

  return (
    <div className="relative rounded-lg border border-stone-200 bg-white p-4">
      {busy && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80">
          <LoadingSpinner label="Processing" />
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="w-full shrink-0 overflow-hidden rounded-md bg-black sm:w-48">
          <video
            src={url}
            className="aspect-video w-full object-cover"
            muted
            playsInline
            preload="metadata"
            controls
          />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-sm font-medium text-stone-900">{label}</p>
            <p className="text-xs text-stone-500">
              {isCustom ? "Custom upload" : "Default video"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-stone-900 px-3 py-1.5 text-xs text-white disabled:opacity-50"
            >
              Upload
            </button>

            {isCustom && (
              <button
                type="button"
                disabled={busy}
                onClick={onDelete}
                className="rounded-md border border-stone-300 px-3 py-1.5 text-xs text-stone-700 disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ShowreelManager({
  initialSettings,
}: {
  initialSettings: ShowreelSettings;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [busyVariant, setBusyVariant] = useState<Variant | null>(null);
  const [error, setError] = useState("");

  async function handleUpload(variant: Variant, file: File) {
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }

    setBusyVariant(variant);
    setError("");

    try {
      const storagePath = await uploadShowreelIncoming(file, variant);
      const res = await fetch("/api/showreel/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant, storagePath }),
      });

      if (!res.ok) {
        throw new Error(await readApiError(res, "Upload failed"));
      }

      const data = await readApiJson<{ showreel: ShowreelSettings }>(res);
      setSettings(data.showreel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusyVariant(null);
    }
  }

  async function handleDelete(variant: Variant) {
    const label = variant === "desktop" ? "desktop" : "mobile";
    if (!window.confirm(`Remove custom ${label} showreel? The default video will be used.`)) {
      return;
    }

    setBusyVariant(variant);
    setError("");

    try {
      const res = await fetch("/api/showreel", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant }),
      });

      if (!res.ok) {
        throw new Error(await readApiError(res, "Delete failed"));
      }

      const data = await readApiJson<{ showreel: ShowreelSettings }>(res);
      setSettings(data.showreel);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyVariant(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-sm text-stone-500">Homepage hero videos.</p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <ShowreelRow
        label="Desktop"
        url={settings.desktopUrl}
        busy={busyVariant === "desktop"}
        onUpload={(file) => void handleUpload("desktop", file)}
        onDelete={() => void handleDelete("desktop")}
      />

      <ShowreelRow
        label="Mobile"
        url={settings.mobileUrl}
        busy={busyVariant === "mobile"}
        onUpload={(file) => void handleUpload("mobile", file)}
        onDelete={() => void handleDelete("mobile")}
      />
    </div>
  );
}
