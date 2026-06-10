"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import WorkListVideo, { isWorkVideoSrc } from "./WorkListVideo";

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
  const isVideo = isWorkVideoSrc(src);

  useEffect(() => {
    setLoading(true);
  }, [src]);

  const handleReady = () => setLoading(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading ? <CardMediaSpinner /> : null}

      {isVideo ? (
        <WorkListVideo
          src={src}
          poster={poster}
          className="h-full w-full"
          videoClassName={mediaClassName}
          onMediaReady={handleReady}
        />
      ) : useNativeImg ? (
        <img
          src={src}
          alt={alt}
          className={mediaClassName}
          onLoad={handleReady}
          onError={handleReady}
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
          onError={handleReady}
        />
      )}
    </div>
  );
}
