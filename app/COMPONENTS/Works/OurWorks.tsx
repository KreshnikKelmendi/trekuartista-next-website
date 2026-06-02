"use client";

import { Fragment, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import type { WorkItem } from "@/lib/works/types";
import WorkListVideo, { isWorkVideoSrc } from "./WorkListVideo";

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
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
      className={`group flex w-full flex-col ${className}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-[8px]"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
          <div className="aspect-4/5 w-full overflow-hidden bg-zinc-900 md:aspect-3/4 lg:aspect-square">
            {isWorkVideoSrc(item.workImage) ? (
              <WorkListVideo
                src={item.workImage}
                poster={item.workThumbnail ?? undefined}
                className="h-full w-full"
                videoClassName="h-full w-full object-cover"
              />
            ) : (
              <Image
                className="h-full w-full object-cover"
                src={item.workImage}
                alt={item.workName}
                width={800}
                height={1000}
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized={
                  item.workImage.includes("supabase.co") ||
                  item.workImage.includes("res.cloudinary.com")
                }
              />
            )}
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

export default function OurWorks({ works }: OurWorksProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Work");

  const categories = useMemo(() => {
    const specialCategories = Array.from(
      new Set(works.map((item) => item.specialCategory).filter(Boolean))
    );
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

  const col1 = orderedWorks.filter((_, i) => i % 3 === 0);
  const col2 = orderedWorks.filter((_, i) => i % 3 === 1);
  const col3 = orderedWorks.filter((_, i) => i % 3 === 2);

  if (works.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-5 pb-32 pt-24">
        <p className="text-center font-custom text-lg text-black/40">
          No projects to show yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="px-5 pb-16 pt-16 lg:px-[55px]">
        <div className="flex flex-wrap items-center gap-y-4 leading-[0.95] lg:w-[80%]">
          {categories.map((category, index) => {
            const isActive = selectedCategory === category;
            return (
              <Fragment key={category}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`text-left font-custom text-[24px] font-bold transition-all duration-300 lg:text-5xl 2xl:text-[6vh] ${
                    isActive ? "text-black" : "text-black/20 hover:text-black/50"
                  }`}
                >
                  {category}
                </button>
                {index < categories.length - 1 && (
                  <span className="mx-3 text-2xl font-bold text-black/20 lg:text-4xl">
                    ▪
                  </span>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="px-5 md:hidden">
        <div className="flex flex-col gap-12">
          {orderedWorks.map((item) => (
            <WorkCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="hidden px-5 md:block lg:px-[55px]">
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-3 lg:gap-x-12">
          <div className="flex flex-col gap-24 lg:gap-40">
            {col1.map((item) => (
              <WorkCard key={item.id} item={item} />
            ))}
          </div>
          <div className="flex flex-col gap-24 lg:mt-44 lg:gap-40">
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
      </div>
    </div>
  );
}
