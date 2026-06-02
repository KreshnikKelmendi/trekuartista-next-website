"use client";

import { useState } from "react";
import Image from "next/image";
import LoadingSpinner from "@/app/COMPONENTS/ui/LoadingSpinner";
import { isWorkVideoSrc } from "./WorkListVideo";

type WorkDetailFillMediaProps = {
  src: string;
  poster?: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
};

export default function WorkDetailFillMedia({
  src,
  poster,
  alt,
  priority = false,
  className = "",
}: WorkDetailFillMediaProps) {
  const [loaded, setLoaded] = useState(false);
  const isVideo = isWorkVideoSrc(src);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg bg-zinc-100/80 ${className}`}
    >
      <div className="relative aspect-4/5 w-full min-h-[58vh] max-md:min-h-[420px] md:aspect-3/4 md:min-h-0">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100/80">
            <LoadingSpinner label="Loading" />
          </div>
        )}

        {isVideo ? (
          <video
            src={src}
            poster={poster ?? undefined}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
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
    </div>
  );
}
