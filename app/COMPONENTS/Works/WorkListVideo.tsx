"use client";

type WorkListVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  videoClassName?: string;
};

export function isWorkVideoSrc(src?: string) {
  if (!src) return false;
  return (
    /\.(mp4|webm|mov)(\?|$)/i.test(src) ||
    src.includes("/video/upload") ||
    src.includes("/videos/")
  );
}

export default function WorkListVideo({
  src,
  poster,
  className = "",
  videoClassName = "",
}: WorkListVideoProps) {
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
      />
    </div>
  );
}
