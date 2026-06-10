"use client";

import Link from "next/link";
import { isYoutubeOnlyWork } from "@/lib/works/is-youtube-only-work";
import type {
  WorkDescriptionItem,
  WorkItem,
  WorkMediaItem,
  YoutubeVideoEntry,
} from "@/lib/works/types";
import WorkDetailFillMedia from "./WorkDetailFillMedia";
import { WorkDetailVideoAudioProvider } from "./WorkDetailVideoAudioContext";

type WorkDetailProps = {
  work: WorkItem;
};

const pagePx = "px-5 lg:px-[55px]";
const blockGap = "gap-4 md:gap-5";
const sectionGap = "space-y-5 md:space-y-12";

/** Shared body copy — matches block 2 & 3 (featured) descriptions */
const descriptionBodyClass =
  "font-roboto whitespace-pre-wrap text-base leading-relaxed md:text-xl md:leading-relaxed lg:text-[1.55rem] lg:leading-[1.42] xl:leading-[1.35]";

const titleLinkClass = "font-sfts";

function DescriptionBlockSmall({
  text,
  index,
}: {
  text: WorkDescriptionItem;
  index: number;
}) {
  return (
    <div className="space-y-2 border-t border-black/10 pt-6">
      <p className={`${titleLinkClass} text-[10px] uppercase tracking-[0.35em] text-black/40`}>
        {String(index + 1).padStart(2, "0")}
      </p>
      <p className={`${descriptionBodyClass} text-zinc-600`}>
        {text.content}
      </p>
    </div>
  );
}

function DescriptionBlockFeatured({ text }: { text: WorkDescriptionItem }) {
  return (
    <p className={`${descriptionBodyClass} text-zinc-800`}>
      {text.content}
    </p>
  );
}

function youtubeEmbedId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {
    return null;
  }
  return null;
}

function youtubeEmbedSrc(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function YoutubeEmbed({
  video,
  className = "",
}: {
  video: YoutubeVideoEntry;
  className?: string;
}) {
  const embedId = youtubeEmbedId(video.url);

  if (!embedId) {
    return (
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${titleLinkClass} inline-block text-sm text-[#DF319A] underline ${className}`}
      >
        Watch on YouTube
      </a>
    );
  }

  return (
    <div
      className={`aspect-video w-full overflow-hidden rounded-lg bg-black shadow-sm ${className}`}
    >
      <iframe
        title={video.title || "YouTube video"}
        src={youtubeEmbedSrc(embedId)}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function YoutubeVideoText({ video }: { video: YoutubeVideoEntry }) {
  if (!video.title && !video.description) return null;

  return (
    <div className="flex flex-col justify-center gap-4">
      {video.title ? (
        <h3 className={`${titleLinkClass} text-xl uppercase leading-tight text-black md:text-2xl`}>
          {video.title}
        </h3>
      ) : null}
      {video.description ? (
        <p className={`${descriptionBodyClass} text-zinc-600`}>
          {video.description}
        </p>
      ) : null}
    </div>
  );
}

function WorkYoutubeSection({ work }: { work: WorkItem }) {
  const videos =
    work.youtubeVideos && work.youtubeVideos.length > 0
      ? work.youtubeVideos
      : work.youtubeLink
        ? [{ url: work.youtubeLink, title: work.workName, description: "" }]
        : [];

  if (videos.length === 0) return null;

  const heading =
    videos.length === 1 ? "Video" : "Films & campaigns";

  if (videos.length === 1) {
    const video = videos[0];
    return (
      <section className={`${pagePx} ${sectionGap}`}>
        <h2 className={`${titleLinkClass} text-[11px] uppercase tracking-[0.35em] text-black/40`}>
          {heading}
        </h2>
        <div className="space-y-5 md:space-y-8">
          <YoutubeEmbed video={video} />
          <YoutubeVideoText video={video} />
        </div>
      </section>
    );
  }

  return (
    <section className={`${pagePx} ${sectionGap}`}>
      <h2 className={`${titleLinkClass} text-[11px] uppercase tracking-[0.35em] text-black/40`}>
        {heading}
      </h2>
      <div className="space-y-8 md:space-y-16">
        {videos.map((video, index) => {
          const flip = index % 2 === 1;

          return (
            <div
              key={`${video.url}-${index}`}
              className={`flex flex-col ${blockGap} md:grid md:grid-cols-2 md:items-center md:gap-10`}
            >
              {/* Mobile: video then text. Desktop: alternating sides */}
              <div className={flip ? "order-1 md:order-1" : "order-1 md:order-2"}>
                <YoutubeEmbed video={video} />
              </div>
              <div className={flip ? "order-2 md:order-2" : "order-2 md:order-1"}>
                <YoutubeVideoText video={video} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MediaBlock({
  item,
  workName,
  priority,
  square,
  compact,
}: {
  item: WorkMediaItem;
  workName: string;
  priority?: boolean;
  square?: boolean;
  compact?: boolean;
}) {
  return (
    <WorkDetailFillMedia
      mediaId={item.id}
      src={item.url}
      poster={item.thumbnail}
      alt={workName}
      priority={priority}
      mediaType={item.mediaType}
      square={square}
      compact={compact}
    />
  );
}

export default function WorkDetail({ work }: WorkDetailProps) {
  const youtubeOnly = isYoutubeOnlyWork(work);
  const descriptions = work.descriptions.filter((d) => d.content.trim());
  const media = youtubeOnly ? [] : work.media;
  const intro = descriptions[0];
  const featuredDescription = descriptions[1];
  const thirdDescription = descriptions[2];
  const moreDescriptions = descriptions.slice(3);

  const topThree = media.slice(0, 3);
  const middlePair = media.slice(3, 5);
  /** 6th & 7th assets flank description 3 in the center column */
  const centerLeftMedia = media[5];
  const centerRightMedia = media[6];
  const restMedia = media.slice(7);

  const hasTopRow = topThree.length > 0;
  const hasMiddleRow = middlePair.length > 0 || featuredDescription != null;
  const useSquareGrid =
    work.detailMediaStyle === "square" || work.id === "1";
  const useTwoColGrid = work.detailGridCols === 2 && !useSquareGrid;
  const mediaGridClass = `grid grid-cols-1 ${blockGap} ${
    useTwoColGrid ? "lg:grid-cols-2" : "md:grid-cols-3"
  }`;
  const useSimpleGallery = useSquareGrid || useTwoColGrid;

  return (
    <WorkDetailVideoAudioProvider>
    <article className={`bg-transparent pb-12 text-black md:pb-24 ${sectionGap}`}>
      <div className={` py-3 md:py-5 ${pagePx}`}>
        <Link
          href="/our-works"
          className={`${titleLinkClass} text-[11px] uppercase tracking-[0.25em] text-black/45 transition hover:text-black`}
        >
          ← All Work
        </Link>
      </div>

      <header className={`py-5 md:pt-0 md:pb-0 ${pagePx}`}>
        <p className={`${titleLinkClass} text-[11px] uppercase tracking-[0.35em] text-[#3110EE]`}>
          {work.specialCategory}
        </p>
        <h1 className={`${titleLinkClass} mt-2 max-w-5xl text-4xl font-bold uppercase leading-[0.92] tracking-tight md:mt-4 md:text-6xl lg:text-7xl`}>
          {work.workName}
        </h1>
        {intro ? (
          <p className={`mt-4 max-w-3xl md:mt-8 ${descriptionBodyClass} text-zinc-600`}>
            {intro.content}
          </p>
        ) : null}
      </header>

      {youtubeOnly ? (
        <WorkYoutubeSection work={work} />
      ) : (
      <div className={`${pagePx} ${sectionGap}`}>
        {useSimpleGallery && media.length > 0 ? (
          <div className={mediaGridClass}>
            {media.map((item, i) => (
              <MediaBlock
                key={item.id}
                item={item}
                workName={work.workName}
                priority={i === 0}
                square={useSquareGrid}
                compact={useTwoColGrid}
              />
            ))}
          </div>
        ) : null}

        {!useSimpleGallery && hasTopRow ? (
          <div className={mediaGridClass}>
            {topThree.map((item, i) => (
              <MediaBlock
                key={item.id}
                item={item}
                workName={work.workName}
                priority={i === 0}
              />
            ))}
          </div>
        ) : null}

        {!useSimpleGallery && hasMiddleRow ? (
          <div
            className={`flex flex-col ${blockGap} md:grid md:grid-cols-3 md:items-stretch`}
          >
            {middlePair.length > 0 ? (
              <div
                className={`order-1 grid grid-cols-1 sm:grid-cols-2 ${blockGap} md:order-0 md:col-span-2`}
              >
                {middlePair.map((item) => (
                  <MediaBlock key={item.id} item={item} workName={work.workName} />
                ))}
              </div>
            ) : null}

            {featuredDescription ? (
              <div
                className={`order-2 flex flex-col justify-center md:order-0 md:col-start-3 md:py-4 ${
                  middlePair.length === 0 ? "md:col-span-3" : ""
                }`}
              >
                <DescriptionBlockFeatured text={featuredDescription} />
              </div>
            ) : null}
          </div>
        ) : null}

        {!useSimpleGallery && (thirdDescription || centerLeftMedia || centerRightMedia) ? (
          <div
            className={`grid grid-cols-1 ${blockGap} md:grid-cols-3 md:items-center`}
          >
            <div className="order-1 md:order-0">
              {centerLeftMedia ? (
                <MediaBlock item={centerLeftMedia} workName={work.workName} />
              ) : (
                <div className="hidden md:block" aria-hidden />
              )}
            </div>

            {thirdDescription ? (
              <div className="order-2 flex items-center justify-center px-0 py-4 md:order-0 md:px-6 md:py-10">
                <DescriptionBlockFeatured text={thirdDescription} />
              </div>
            ) : (
              <div className="hidden md:block" aria-hidden />
            )}

            <div className="order-3 md:order-0">
              {centerRightMedia ? (
                <MediaBlock item={centerRightMedia} workName={work.workName} />
              ) : (
                <div className="hidden md:block" aria-hidden />
              )}
            </div>
          </div>
        ) : null}

        {moreDescriptions.length > 0 ? (
          <div className={`mx-auto max-w-3xl space-y-6 ${blockGap}`}>
            {moreDescriptions.map((text, i) => (
              <DescriptionBlockSmall key={text.id} text={text} index={i + 3} />
            ))}
          </div>
        ) : null}

        {!useSimpleGallery && restMedia.length > 0 ? (
          <div className={mediaGridClass}>
            {restMedia.map((item) => (
              <MediaBlock key={item.id} item={item} workName={work.workName} />
            ))}
          </div>
        ) : null}

        <WorkYoutubeSection work={work} />
      </div>
      )}

      <div className={`border-t border-black/10 pt-6 text-center md:pt-8 ${pagePx}`}>
        <Link
          href="/our-works"
          className={`${titleLinkClass} text-[11px] uppercase tracking-[0.25em] text-black/40 transition hover:text-black`}
        >
          Back to all work
        </Link>
      </div>
    </article>
    </WorkDetailVideoAudioProvider>
  );
}
