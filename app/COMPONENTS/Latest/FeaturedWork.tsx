"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import WorkCardMedia from "../Works/WorkCardMedia";
import { workDetailPath } from "@/lib/works/slug";
import type { WorkItem } from "@/lib/works/types";

const ease = [0.22, 1, 0.36, 1] as const;
const revealEase = [0.16, 1, 0.3, 1] as const;
const STRIP_COUNT = 5;
const ZOOM_HOLD_S = 0.5;
const IMAGE_REVEAL_BASE_S = 0.65;
const IMAGE_REVEAL_STAGGER_S = 0.09;
const INITIAL_CLUSTER_SCALE = 0.065;
const STRIP_GAP_PX = 4;
const STRIP_GAP_HOVER_PX = 30;
const TILE_ASPECT_RATIO = "10 / 11.5";
const HOVER_FLEX_GROW = 1.2;
const OTHER_FLEX_GROW = 0.9;
const stripZoomSpring = {
  type: "spring" as const,
  stiffness: 34,
  damping: 22,
  mass: 1.15,
};
const imageRevealSpring = {
  type: "spring" as const,
  stiffness: 48,
  damping: 24,
  mass: 1,
};
const hoverSpring = {
  type: "spring" as const,
  stiffness: 62,
  damping: 24,
  mass: 0.85,
};
const hoverEase = { duration: 0.38, ease: revealEase };
const imageHoverEase = { duration: 0.45, ease: revealEase };
const cursorSpring = { stiffness: 220, damping: 28, mass: 0.3 };
const hoverShadow = "0 8px 20px -12px rgba(17,17,17,0.1)";
const idleShadow = "0 0 0 rgba(0,0,0,0)";

function SeeMoreLink({
  href,
  label,
  onClick,
  className = "",
}: {
  href: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group inline-flex w-max items-center gap-2.5 font-sfts text-[#3110EE] transition-colors duration-300 hover:text-black ${className}`}
    >
      <span>{label}</span>
      <svg
        width="22"
        height="14"
        viewBox="0 0 48 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5"
        aria-hidden
      >
        <path
          d="M34 2L46 14M46 14L34 26M46 14H0"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

function FeaturedWorkSquareTile({
  work,
  index,
  isInView,
  hoveredIndex,
  onHover,
  onLeave,
}: {
  work: WorkItem;
  index: number;
  isInView: boolean;
  hoveredIndex: number | null;
  onHover: () => void;
  onLeave: () => void;
}) {
  const isHovered = hoveredIndex === index;
  const isAnyHovered = hoveredIndex !== null && !isHovered;
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothCursorX = useSpring(cursorX, cursorSpring);
  const smoothCursorY = useSpring(cursorY, cursorSpring);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      className="relative min-w-0"
      style={{ flex: 1 }}
      animate={{
        flexGrow: isHovered
          ? HOVER_FLEX_GROW
          : isAnyHovered
            ? OTHER_FLEX_GROW
            : 1,
      }}
      transition={hoverSpring}
    >
      <motion.div
        className="relative w-full will-change-transform"
        style={{ transformOrigin: "center center", zIndex: isHovered ? 10 : 1 }}
        animate={{
          aspectRatio: TILE_ASPECT_RATIO,
          scale: isHovered ? 1.03 : isAnyHovered ? 0.94 : 1,
          boxShadow: isHovered ? hoverShadow : idleShadow,
        }}
        transition={hoverSpring}
      >
        <div
          className="relative h-full w-full cursor-none overflow-hidden bg-black"
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
          onMouseMove={handleMouseMove}
          onFocus={onHover}
          onBlur={onLeave}
        >
          <motion.div
            className="absolute inset-0 will-change-transform"
            initial={false}
            animate={
              !isInView
                ? { opacity: 0, scale: 1.08 }
                : { opacity: 1, scale: 1 }
            }
            transition={
              !isInView
                ? {
                    ...imageRevealSpring,
                    delay: IMAGE_REVEAL_BASE_S + index * IMAGE_REVEAL_STAGGER_S,
                  }
                : imageHoverEase
            }
          >
            <WorkCardMedia
              src={work.workImage}
              poster={work.workThumbnail ?? undefined}
              alt={work.workName}
              className="h-full w-full"
              mediaClassName="h-full w-full object-cover"
              useNativeImg
            />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-10 origin-center bg-black will-change-transform"
            initial={false}
            animate={
              isInView
                ? { scale: 0, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{
              ...imageRevealSpring,
              delay: IMAGE_REVEAL_BASE_S + index * IMAGE_REVEAL_STAGGER_S,
            }}
          />

          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/85 via-black/40 to-transparent px-2.5 pb-2.5 pt-10"
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 6,
            }}
            transition={hoverEase}
          >
            <p className="font-sfts text-[10px] uppercase leading-tight tracking-wide text-white sm:text-[11px]">
              {work.workName}
            </p>
          </motion.div>

          <div className="pointer-events-none absolute inset-0 z-30 hidden md:block">
            <motion.div
              style={{
                left: smoothCursorX,
                top: smoothCursorY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.92,
              }}
              transition={hoverSpring}
              className="absolute flex h-[84px] w-[84px] items-center justify-center rounded-full border border-white/35 bg-white/94 font-custom text-[9px] uppercase tracking-[0.14em] text-black shadow-[0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur-md"
            >
              See More
            </motion.div>
          </div>

          <Link
            href={workDetailPath(work)}
            className="absolute inset-0 z-20"
            scroll
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function FeaturedWorkSquareStrip({ works }: { works: WorkItem[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [ref, isInView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
    rootMargin: "-6% 0px -4% 0px",
  });

  const stripWorks = works.slice(0, STRIP_COUNT);

  return (
    <div
      ref={ref}
      className="flex w-full items-center justify-center overflow-visible py-8 sm:py-10 lg:min-h-[30vw] lg:py-12 xl:min-h-[360px]"
    >
      <motion.div
        className="flex w-full origin-center items-center gap-1 overflow-visible will-change-transform"
        initial={{ scale: INITIAL_CLUSTER_SCALE }}
        animate={{
          scale: isInView ? 1 : INITIAL_CLUSTER_SCALE,
          gap: hoveredIndex !== null ? STRIP_GAP_HOVER_PX : STRIP_GAP_PX,
        }}
        transition={{
          scale: {
            ...stripZoomSpring,
            delay: isInView ? ZOOM_HOLD_S : 0,
          },
          gap: hoverSpring,
        }}
      >
        {stripWorks.map((work, index) => (
          <FeaturedWorkSquareTile
            key={work.id}
            work={work}
            index={index}
            isInView={isInView}
            hoveredIndex={hoveredIndex}
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(null)}
          />
        ))}
      </motion.div>
    </div>
  );
}

function DesktopFeaturedStrip({ works }: { works: WorkItem[] }) {
  if (works.length === 0) return null;

  return (
    <div className="hidden w-full md:block">
      <FeaturedWorkSquareStrip works={works} />
    </div>
  );
}

function MobileFeaturedCard({
  work,
  index,
}: {
  work: WorkItem;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 18,
    mass: 0.7,
  });
  const y = useTransform(
    smoothProgress,
    [0, 1],
    [28 + index * 10, -40 - index * 8]
  );

  return (
    <motion.div ref={cardRef} style={{ y }} className="space-y-3">
      <Link
        href={workDetailPath(work)}
        className="block aspect-4/5 w-full overflow-hidden rounded-[8px] bg-zinc-100"
      >
        <WorkCardMedia
          src={work.workImage}
          poster={work.workThumbnail ?? undefined}
          alt={work.workName}
          className="h-full w-full rounded-[8px]"
          mediaClassName="h-full w-full rounded-[8px] object-cover"
          useNativeImg
        />
      </Link>
      <div className="flex items-center justify-between">
        <h3 className="font-sfts text-[16px] uppercase">{work.workName}</h3>
        <Link href={workDetailPath(work)}>
          <svg
            className="h-6 w-6 -rotate-45"
            width="40"
            height="20"
            viewBox="0 0 48 28"
            fill="none"
          >
            <path
              d="M34 2L46 14M46 14L34 26M46 14H0"
              stroke="#3110EE"
              strokeWidth="1.5"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

export default function FeaturedWork() {
  const router = useRouter();
  const [works, setWorks] = useState<WorkItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/works");
        const data = await res.json();
        if (!cancelled && res.ok && Array.isArray(data.works)) {
          setWorks(data.works);
        }
      } catch {
        if (!cancelled) setWorks([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayWorks = useMemo(() => works.slice(0, STRIP_COUNT), [works]);

  const goToAllWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/our-works");
    // Next.js handles route transitions immediately; window scroll provides the clean reset anchor
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <section className="relative px-5 py-10 md:py-20 lg:px-[55px] lg:pt-32 lg:pb-20">
      <div className="mx-auto w-full">
        <div className="mb-12 flex items-end justify-between border-b border-[#0000006e] pb-1">
          <h2 className="font-roboto text-[20px] uppercase text-[#111] md:text-[24px] lg:text-[28px]">
            Featured
          </h2>
          <span className="font-roboto text-[20px] uppercase text-[#111] md:text-[24px] lg:text-[28px]">
            Work
          </span>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col space-y-16 md:hidden">
          {displayWorks.map((work: WorkItem, index: number) => (
            <MobileFeaturedCard
              key={`mobile-${work.id}`}
              work={work}
              index={index}
            />
          ))}
        </div>

        {displayWorks.length > 0 && (
          <DesktopFeaturedStrip works={displayWorks} />
        )}

        <div className="flex items-center justify-end pb-10 pt-16 lg:pt-0">
          <SeeMoreLink
            href="/our-works"
            onClick={goToAllWorks}
            label="See all works"
            className="text-sm lg:text-xl"
          />
        </div>
      </div>
    </section>
  );
}