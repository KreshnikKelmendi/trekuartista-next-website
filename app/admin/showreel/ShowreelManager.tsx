"use client";

import { useRef, useState } from "react";
import LoadingSpinner from "@/app/COMPONENTS/ui/LoadingSpinner";
import { readApiError, readApiJson } from "@/lib/admin/parse-api-response";
import { uploadShowreelIncoming } from "@/lib/showreel/client-upload";
import type { ShowreelSettings } from "@/lib/showreel/defaults";

type Variant = "desktop" | "mobile";

function ShowreelRow({
  label,
  hint,
  url,
  busy,
  progressLabel,
  isCustom,
  onUpload,
  onDelete,
}: {
  label: string;
  hint: string;
  url: string;
  busy: boolean;
  progressLabel: string;
  isCustom: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative rounded-lg border border-stone-200 bg-white p-4">
      {busy && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-white/85">
          <LoadingSpinner label={progressLabel} />
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
            <p className="text-xs text-stone-500">{hint}</p>
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
  const [progressLabel, setProgressLabel] = useState("Processing");
  const [error, setError] = useState("");

  async function handleUpload(variant: Variant, file: File) {
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file.");
      return;
    }

    setBusyVariant(variant);
    setProgressLabel("Uploading");
    setError("");

    try {
      const storagePath = await uploadShowreelIncoming(file, variant, setProgressLabel);
      setProgressLabel("Compressing");

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
      setProgressLabel("Processing");
    }
  }

  async function handleDelete(variant: Variant) {
    const message =
      variant === "mobile"
        ? "Remove mobile video? Phones will use the desktop showreel."
        : "Remove desktop showreel? The default video will be used.";

    if (!window.confirm(message)) return;

    setBusyVariant(variant);
    setProgressLabel("Removing");
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
      setProgressLabel("Processing");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-sm text-stone-500">
        Upload one desktop video for the homepage. Mobile uses the same video unless you upload a separate one.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <ShowreelRow
        label="Desktop"
        hint={settings.hasCustomDesktop ? "Custom upload" : "Default video"}
        url={settings.desktopUrl}
        busy={busyVariant === "desktop"}
        progressLabel={progressLabel}
        isCustom={settings.hasCustomDesktop}
        onUpload={(file) => void handleUpload("desktop", file)}
        onDelete={() => void handleDelete("desktop")}
      />

      <ShowreelRow
        label="Mobile (optional)"
        hint={
          settings.hasCustomMobile
            ? "Custom mobile upload"
            : "Uses desktop video"
        }
        url={settings.mobileUrl}
        busy={busyVariant === "mobile"}
        progressLabel={progressLabel}
        isCustom={settings.hasCustomMobile}
        onUpload={(file) => void handleUpload("mobile", file)}
        onDelete={() => void handleDelete("mobile")}
      />
    </div>
  );
}
