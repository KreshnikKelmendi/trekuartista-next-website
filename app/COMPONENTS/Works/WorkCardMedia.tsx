"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { isWorkVideoSrc } from "@/lib/works/cloudinary";
import WorkListVideo from "./WorkListVideo";

type WorkCardMediaProps = {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
  mediaClassName?: string;
  useNativeImg?: boolean;
  unoptimized?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
};

const LOAD_TIMEOUT_MS = 8000;

function CardMediaSpinner() {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100"
      aria-hidden
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-800" />
    </div>
  );
}

function CardMediaFallback({ alt }: { alt: string }) {
  return (
    <div className="flex h-full w-full items-end bg-zinc-100 p-4">
      <p className="font-custom text-[10px] uppercase leading-tight tracking-wide text-black/35">
        {alt}
      </p>
    </div>
  );
}

export default function WorkCardMedia({
  src,
  poster,
  alt,
  className = "h-full w-full",
  mediaClassName = "h-full w-full object-cover",
  useNativeImg = false,
  unoptimized = false,
  sizes,
  width = 800,
  height = 1000,
}: WorkCardMediaProps) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const isVideo = isWorkVideoSrc(src);

  useEffect(() => {
    setLoading(true);
    setFailed(false);
  }, [src, poster]);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [loading, src]);

  const handleReady = () => setLoading(false);
  const handleError = () => {
    setFailed(true);
    setLoading(false);
  };

  if (!src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <CardMediaFallback alt={alt} />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading ? <CardMediaSpinner /> : null}

      {failed ? (
        <CardMediaFallback alt={alt} />
      ) : isVideo ? (
        <WorkListVideo
          src={src}
          poster={poster}
          className="h-full w-full"
          videoClassName={mediaClassName}
          onMediaReady={handleReady}
          onMediaError={handleError}
        />
      ) : useNativeImg ? (
        <img
          src={src}
          alt={alt}
          className={mediaClassName}
          onLoad={handleReady}
          onError={handleError}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          unoptimized={unoptimized}
          className={mediaClassName}
          onLoad={handleReady}
          onError={handleError}
        />
      )}
    </div>
  );
}
