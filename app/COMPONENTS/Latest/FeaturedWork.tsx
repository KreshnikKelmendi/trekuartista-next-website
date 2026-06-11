"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useSpring, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import WorkCardMedia from "../Works/WorkCardMedia";
import { pickFeaturedWorks } from "@/lib/works/merge-works";
import { HOMEPAGE_FEATURED_WORK_IDS } from "@/lib/works/workData";
import type { WorkItem } from "@/lib/works/types";

const ease = [0.22, 1, 0.36, 1] as const;
const revealEase = [0.16, 1, 0.3, 1] as const;
const STRIP_COUNT = 5;
const ZOOM_HOLD_S = 0.5;
const IMAGE_REVEAL_BASE_S = 0.65;
const IMAGE_REVEAL_STAGGER_S = 0.09;
const INITIAL_CLUSTER_SCALE = 0.065;
const STRIP_GAP_PX = 4;
const STRIP_GAP_HOVER_PX = 14;
const stripZoomSpring = {
  type: "spring" as const,
  stiffness: 38,
  damping: 20,
  mass: 1.2,
};
const imageRevealSpring = {
  type: "spring" as const,
  stiffness: 52,
  damping: 22,
  mass: 0.95,
};
const tileHoverSpring = {
  type: "spring" as const,
  stiffness: 65,
  damping: 20,
  mass: 0.95,
};

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

  return (
    <div
      className="relative min-w-0 flex-1"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
    >
      <motion.div
        className="relative aspect-10/11 w-full overflow-hidden bg-black will-change-transform"
        style={{ transformOrigin: "center center", zIndex: isHovered ? 10 : 1 }}
        animate={{
          scaleX: isHovered ? 1.05 : isAnyHovered ? 0.86 : 1,
          scaleY: isHovered ? 1.08 : isAnyHovered ? 0.86 : 1,
          opacity: isAnyHovered ? 0.82 : 1,
        }}
        transition={tileHoverSpring}
      >
        <Link
          href={`/our-works/${work.id}`}
          className="group relative block h-full w-full"
        >
          <motion.div
            className="absolute inset-0 will-change-transform"
            initial={false}
            animate={
              isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 1.14 }
            }
            transition={{
              ...imageRevealSpring,
              delay: IMAGE_REVEAL_BASE_S + index * IMAGE_REVEAL_STAGGER_S,
            }}
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
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/80 via-black/40 to-transparent px-2.5 pb-2.5 pt-10"
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 8,
            }}
            transition={tileHoverSpring}
          >
            <p className="font-sfts text-[10px] uppercase leading-tight tracking-wide text-white sm:text-[11px]">
              {work.workName}
            </p>
          </motion.div>
        </Link>
      </motion.div>
    </div>
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
      className="flex w-full items-center justify-center overflow-visible py-8 sm:py-10 lg:min-h-[30vw] lg:py-12 xl:min-h-[340px]"
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
          gap: tileHoverSpring,
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
        href={`/our-works/${work.id}`}
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
        <Link href={`/our-works/${work.id}`}>
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

  const displayWorks = useMemo(
    () => pickFeaturedWorks(works, HOMEPAGE_FEATURED_WORK_IDS).slice(0, 6),
    [works]
  );

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