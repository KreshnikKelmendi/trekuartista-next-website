"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import type { WorkItem } from "@/lib/works/types";
import LoadingSpinner from "@/app/COMPONENTS/ui/LoadingSpinner";
import WorkCardMedia from "./WorkCardMedia";

const pagePx = "px-5 lg:px-[55px]";
const ease = [0.22, 1, 0.36, 1] as const;
const FILTER_LOAD_MS = 380;

function sortNewestFirst(items: WorkItem[]) {
  return [...items].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function WorkCard({ item, className = "" }: { item: WorkItem; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease }}
      className={`group flex w-full flex-col ${className}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-[8px]"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
          <div className="aspect-4/5 w-full overflow-hidden bg-zinc-100 md:aspect-3/4 lg:aspect-square">
            <WorkCardMedia
              src={item.workImage}
              poster={item.workThumbnail ?? undefined}
              alt={item.workName}
              className="h-full w-full"
              mediaClassName="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized={
                item.workImage.includes("supabase.co") ||
                item.workImage.includes("res.cloudinary.com")
              }
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-30 hidden md:block">
          <motion.div
            animate={{
              opacity: isHovering ? 1 : 0,
              x: cursorPos.x - 42,
              y: cursorPos.y - 42,
              scale: isHovering ? 1 : 0.8,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-white/90 text-[9px] uppercase tracking-[0.14em] text-black shadow-lg backdrop-blur-sm"
          >
            See More
          </motion.div>
        </div>

        <Link href={`/our-works/${item.id}`} className="absolute inset-0 z-20" scroll />
      </div>

      <div className="mt-3 flex items-center gap-2 font-custom text-[12px] tracking-tight lg:text-base">
        <span className="font-bold uppercase text-black">{item.workName}</span>
        <span className="font-light text-zinc-700">/</span>
        <span className="font-medium uppercase text-zinc-500">
          {item.specialCategory || ""}
        </span>
      </div>
    </motion.div>
  );
}

type OurWorksProps = { works: WorkItem[] };

function WorkCategoryFilters({
  categories,
  selected,
  onSelect,
  disabled,
}: {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  disabled?: boolean;
}) {
  return (
    <nav className="mt-10 md:mt-12" aria-label="Work categories">
      <div
        className={`-mx-5 flex items-center gap-7 overflow-x-auto px-5 pb-2 scrollbar-none sm:mx-0 sm:flex-wrap sm:gap-x-9 sm:overflow-visible sm:px-0 md:gap-x-11 lg:gap-x-14 ${disabled ? "pointer-events-none opacity-50" : ""}`}
        role="tablist"
      >
        {categories.map((category) => {
          const isActive = selected === category;

          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={disabled}
              onClick={() => onSelect(category)}
              className="group flex shrink-0 cursor-pointer items-center gap-3 py-1 text-left"
            >
              <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
                {isActive ? (
                  <motion.span
                    layoutId="our-works-active-dot"
                    className="absolute h-2 w-2 rounded-full bg-[#DF319A]"
                    transition={{
                      type: "spring",
                      stiffness: 480,
                      damping: 32,
                    }}
                  />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-black/10 transition-colors group-hover:bg-black/20" />
                )}
              </span>
              <span
                className={`whitespace-nowrap font-custom text-[12px] uppercase tracking-[0.06em] transition-colors duration-300 md:text-[13px] lg:tracking-[0.08em] ${
                  isActive
                    ? "text-black"
                    : "text-black/25 group-hover:text-black/45"
                }`}
              >
                {category}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function OurWorksPageHeader() {
  return (
    <header className="flex items-end justify-between gap-6">
      <div className="flex items-end gap-3 md:gap-5">
        <h1 className="font-custom text-[clamp(2.5rem,9vw,4.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em] text-black">
          Our
        </h1>
        <h1 className="font-custom text-[clamp(2.5rem,9vw,4.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em] text-black/25">
          Work
        </h1>
      </div>
    </header>
  );
}

function WorksGrid({
  works,
  layoutKey,
}: {
  works: WorkItem[];
  layoutKey: string;
}) {
  const col1 = works.filter((_, i) => i % 3 === 0);
  const col2 = works.filter((_, i) => i % 3 === 1);
  const col3 = works.filter((_, i) => i % 3 === 2);

  if (works.length === 0) {
    return (
      <p className="py-24 text-center font-custom text-sm uppercase tracking-[0.08em] text-black/35">
        No projects in this category
      </p>
    );
  }

  return (
    <motion.div
      key={layoutKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
    >
      <div className="flex flex-col gap-12 md:hidden">
        {works.map((item) => (
          <WorkCard key={item.id} item={item} />
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-x-12">
        <div className="flex flex-col gap-24 lg:gap-40">
          {col1.map((item) => (
            <WorkCard key={item.id} item={item} />
          ))}
        </div>
        <div className="flex flex-col gap-24 lg:mt-44 lg:gap-44">
          {col2.map((item) => (
            <WorkCard key={item.id} item={item} />
          ))}
        </div>
        <div className="flex flex-col gap-24 lg:mt-16 lg:gap-40">
          {col3.map((item) => (
            <WorkCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function OurWorks({ works }: OurWorksProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Work");
  const [isFiltering, setIsFiltering] = useState(false);
  const skipFilterSpinner = useRef(true);

  const categories = useMemo(() => {
    const specialCategories = Array.from(
      new Set(works.map((item) => item.specialCategory).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
    return ["All Work", ...specialCategories];
  }, [works]);

  const filteredWorks = useMemo(() => {
    if (selectedCategory === "All Work") return works;
    return works.filter((item) => item.specialCategory === selectedCategory);
  }, [selectedCategory, works]);

  const orderedWorks = useMemo(
    () => sortNewestFirst(filteredWorks),
    [filteredWorks]
  );

  const handleSelectCategory = (category: string) => {
    if (category === selectedCategory || isFiltering) return;
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (skipFilterSpinner.current) {
      skipFilterSpinner.current = false;
      return;
    }
    setIsFiltering(true);
    const timer = window.setTimeout(() => setIsFiltering(false), FILTER_LOAD_MS);
    return () => window.clearTimeout(timer);
  }, [selectedCategory]);

  if (works.length === 0) {
    return (
      <div
        className={`flex min-h-[50vh] items-center justify-center pb-32 pt-24 ${pagePx}`}
      >
        <p className="text-center font-custom text-lg text-black/40">
          No projects to show yet.
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-32 ${pagePx}`}>
      <div className="pb-8 pt-10 md:pb-10 md:pt-14 lg:pt-16">
        <OurWorksPageHeader />

        <WorkCategoryFilters
          categories={categories}
          selected={selectedCategory}
          onSelect={handleSelectCategory}
          disabled={isFiltering}
        />
      </div>

      <div className="relative min-h-[50vh]">
        <AnimatePresence>
          {isFiltering ? (
            <motion.div
              key="filter-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-20 flex min-h-[280px] items-center justify-center bg-[#F8F8F8]/75 backdrop-blur-[3px] md:min-h-[360px]"
            >
              <LoadingSpinner label="Curating" />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div
          className={`transition-opacity duration-300 ${isFiltering ? "pointer-events-none opacity-25" : "opacity-100"}`}
        >
          <WorksGrid works={orderedWorks} layoutKey={selectedCategory} />
        </div>
      </div>
    </div>
  );
}
