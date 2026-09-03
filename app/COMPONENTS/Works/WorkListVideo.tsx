"use client";

import { useEffect, useState } from "react";
import { isWorkVideoSrc } from "@/lib/works/cloudinary";

export { isWorkVideoSrc };

type WorkListVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  videoClassName?: string;
  onMediaReady?: () => void;
  onMediaError?: () => void;
};

export default function WorkListVideo({
  src,
  poster,
  className = "",
  videoClassName = "",
  onMediaReady,
  onMediaError,
}: WorkListVideoProps) {
  const [usePosterFallback, setUsePosterFallback] = useState(false);

  useEffect(() => {
    setUsePosterFallback(false);
  }, [src, poster]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onMediaReady?.();
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [src, onMediaReady]);

  const handleError = () => {
    if (poster && !usePosterFallback) {
      setUsePosterFallback(true);
      return;
    }
    onMediaError?.();
    onMediaReady?.();
  };

  if (usePosterFallback && poster) {
    return (
      <div className={className}>
        <img
          src={poster}
          alt=""
          className={videoClassName}
          onLoad={() => onMediaReady?.()}
          onError={() => {
            onMediaError?.();
            onMediaReady?.();
          }}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <video
        src={src}
        poster={poster}
        className={videoClassName}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => onMediaReady?.()}
        onLoadedMetadata={() => onMediaReady?.()}
        onCanPlay={() => onMediaReady?.()}
        onError={handleError}
      />
    </div>
  );
}
