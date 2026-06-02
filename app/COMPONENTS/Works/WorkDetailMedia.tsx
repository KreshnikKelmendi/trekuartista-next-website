"use client";

import { useState } from "react";
import Image from "next/image";
import LoadingSpinner from "@/app/COMPONENTS/ui/LoadingSpinner";
import { isWorkVideoSrc } from "./WorkListVideo";

type WorkDetailMediaProps = {
  src: string;
  poster?: string | null;
  alt: string;
  variant?: "default" | "hero";
};

export default function WorkDetailMedia({
  src,
  poster,
  alt,
  variant = "default",
}: WorkDetailMediaProps) {
  const [loaded, setLoaded] = useState(false);
  const isVideo = isWorkVideoSrc(src);
  const isHero = variant === "hero";

  return (
    <div
      className={`relative w-full overflow-hidden ${
        isHero ? "h-full bg-black" : "rounded-xl bg-zinc-100 md:rounded-2xl"
      }`}
    >
      <div
        className={`relative w-full ${
          isHero ? "h-full min-h-[55vh] md:min-h-[70vh]" : "aspect-4/3 md:aspect-video"
        }`}
      >
        {!loaded && (
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center ${
              isHero ? "bg-black" : "bg-zinc-100"
            }`}
          >
            <LoadingSpinner
              label="Loading media"
              className={isHero ? "[&_span]:text-white/50 [&_div]:border-white/20 [&_div]:border-t-white" : ""}
            />
          </div>
        )}

        {isVideo ? (
          <video
            src={src}
            poster={poster ?? undefined}
            className={`h-full w-full bg-black transition-opacity duration-500 ${
              isHero ? "object-cover" : "object-contain"
            } ${loaded ? "opacity-100" : "opacity-0"}`}
            controls={!isHero}
            autoPlay={isHero}
            muted={isHero}
            loop={isHero}
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
            className={`transition-opacity duration-500 ${
              isHero ? "object-cover" : "object-contain"
            } ${loaded ? "opacity-100" : "opacity-0"}`}
            sizes="100vw"
            priority
            unoptimized={src.includes("supabase.co")}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        )}
      </div>
    </div>
  );
}
