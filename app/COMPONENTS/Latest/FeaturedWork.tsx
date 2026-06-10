"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WorkCardMedia from "../Works/WorkCardMedia";
import { pickFeaturedWorks } from "@/lib/works/merge-works";
import { HOMEPAGE_FEATURED_WORK_IDS } from "@/lib/works/workData";
import type { WorkItem } from "@/lib/works/types";

const ease = [0.22, 1, 0.36, 1] as const;

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
          strokeWidth="1.5"
        />
      </svg>
    </Link>
  );
}

function featuredFirstDescription(work: WorkItem): string {
  const sorted = [...work.descriptions].sort((a, b) => a.sortOrder - b.sortOrder);
  const first = sorted.find((d) => d.content.trim());
  return first?.content.trim() ?? work.description?.trim() ?? "";
}

function FeaturedWorkMedia({ work }: { work: WorkItem }) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 140, damping: 22, mass: 0.35 });
  const smoothY = useSpring(mouseY, { stiffness: 140, damping: 22, mass: 0.35 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <Link
      href={`/our-works/${work.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative block aspect-16/11 w-full cursor-none overflow-hidden rounded-[8px] bg-zinc-100"
    >
      <WorkCardMedia
        src={work.workImage}
        poster={work.workThumbnail ?? undefined}
        alt={work.workName}
        className="h-full w-full rounded-[8px]"
        mediaClassName="h-full w-full rounded-[8px] object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        useNativeImg
      />

      <div className="absolute inset-0 rounded-[8px] bg-black/0 transition-all duration-500 group-hover:bg-black/10" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            style={{ left: smoothX, top: smoothY, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.25, ease }}
            className="pointer-events-none absolute z-30 hidden items-center justify-center lg:flex"
          >
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-[80px] w-[80px] items-center justify-center rounded-full border border-white/40 bg-white/90 shadow-[0_10px_60px_rgba(0,0,0,0.15)] backdrop-blur-xl"
            >
              <span className="whitespace-nowrap font-custom text-[10px] uppercase text-black">
                See More
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}

function DesktopFeaturedScroll({ works }: { works: WorkItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastProgress = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const count = works.length;
  const safeIndex = count > 0 ? Math.min(activeIndex, count - 1) : 0;
  const activeWork = works[safeIndex];

  useEffect(() => {
    if (count === 0) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex > count - 1) {
      setActiveIndex(count - 1);
    }
  }, [activeIndex, count]);

  const { scrollYProgress } = useScroll({
    target: isMounted ? sectionRef : undefined,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const isScrollingDown = latest > lastProgress.current;
    const currentDirection = isScrollingDown ? 1 : -1;
    lastProgress.current = latest;

    const rawIndex = Math.floor(latest * count);
    const targetIndex = Math.max(0, Math.min(count - 1, rawIndex));
    
    if (targetIndex !== activeIndex) {
      setDirection(currentDirection);
      setActiveIndex(targetIndex);
    }
  });

  const textVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      y: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? -30 : 30,
    }),
  };

  if (!activeWork) return null;

  const firstDescription = featuredFirstDescription(activeWork);

  return (
    <div
      ref={sectionRef}
      className="relative hidden md:block"
      style={{ height: `${count * 100}vh` }}
    >
      <div className="sticky top-0 z-10 flex h-screen items-center overflow-hidden">
        <div className="grid w-full grid-cols-[1fr_1.5fr] items-center gap-20 lg:gap-32">
          
          {/* Left Side — Copy Wrapper */}
          <div className="relative h-[60vh] py-10">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={activeWork.id}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease }}
                className="absolute inset-x-0 top-10 flex h-full flex-col justify-between"
              >
                <div className="space-y-8">
                  <h3 className="font-sfts text-base uppercase leading-[45px] text-[#111] lg:text-[45px]">
                    {activeWork.workName}
                  </h3>
                  {firstDescription ? (
                    <p className=" whitespace-pre-wrap font-roboto text-[12px] leading-snug text-black md:max-w-[380px] md:text-base lg:max-w-[480px] lg:text-xl lg:leading-[1.4] xl:text-[1.35rem]">
                      {firstDescription}
                    </p>
                  ) : null}
                </div>

                <div>
                  <SeeMoreLink
                    href={`/our-works/${activeWork.id}`}
                    label="See more"
                    className="text-base lg:text-xl"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side — Media Container */}
          <div className="relative flex items-center">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={`media-${activeWork.id}`}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease }}
                className="w-full"
              >
                <FeaturedWorkMedia work={activeWork} />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
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

        {/* Desktop Layout */}
        {displayWorks.length > 0 && (
          <DesktopFeaturedScroll works={displayWorks} />
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