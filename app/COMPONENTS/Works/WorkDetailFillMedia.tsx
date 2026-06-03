"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import LoadingSpinner from "@/app/COMPONENTS/ui/LoadingSpinner";
import VideoMuteButton from "@/app/COMPONENTS/ui/VideoMuteButton";
import { useWorkDetailVideoAudio } from "./WorkDetailVideoAudioContext";
import { isWorkVideoSrc } from "./WorkListVideo";

type WorkDetailFillMediaProps = {
  mediaId: string;
  src: string;
  poster?: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
  mediaType?: "image" | "video";
  /** Square tiles for 3-column galleries (e.g. EMONA) */
  square?: boolean;
  /** Shorter tiles for 2-column detail grids */
  compact?: boolean;
};

function isVideoMedia(
  src: string,
  mediaType?: "image" | "video"
): boolean {
  if (mediaType === "video") return true;
  if (mediaType === "image") return false;
  return isWorkVideoSrc(src);
}

export default function WorkDetailFillMedia({
  mediaId,
  src,
  poster,
  alt,
  priority = false,
  className = "",
  mediaType,
  square = false,
  compact = false,
}: WorkDetailFillMediaProps) {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audio = useWorkDetailVideoAudio();
  const isVideo = isVideoMedia(src, mediaType);
  const isMuted = audio ? audio.unmutedId !== mediaId : true;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    video.muted = isMuted;
    if (!isMuted) {
      void video.play().catch(() => undefined);
    }
  }, [isMuted, isVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;
    video.muted = true;
    video.playsInline = true;
    void video.play().catch(() => undefined);
  }, [src, isVideo]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;

    if (audio) {
      if (nextMuted) {
        audio.setUnmutedId(null);
      } else {
        audio.setUnmutedId(mediaId);
        void video.play().catch(() => undefined);
      }
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-zinc-100/80 ${className}`}
    >
      <div
        className={
          square
            ? "relative aspect-square w-full min-h-0"
            : compact
              ? "relative aspect-4/5 w-full max-md:min-h-[320px] lg:aspect-5/4 lg:min-h-0"
              : "relative aspect-4/5 w-full min-h-0 md:aspect-3/4"
        }
      >
        {!loaded && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-zinc-100/80">
            <LoadingSpinner label="Loading" />
          </div>
        )}

        {isVideo ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster ?? undefined}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setLoaded(true)}
            onCanPlay={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-cover transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
            unoptimized={
              src.includes("supabase.co") || src.includes("res.cloudinary.com")
            }
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        )}
      </div>

      {isVideo ? (
        <VideoMuteButton
          isMuted={isMuted}
          onClick={toggleMute}
          className="absolute bottom-4 left-4 z-50"
        />
      ) : null}
    </div>
  );
}
