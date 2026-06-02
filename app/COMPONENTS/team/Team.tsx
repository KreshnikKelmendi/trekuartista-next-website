"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useScroll,
  useTransform,
  Variants,
} from "framer-motion";
import Image from "next/image";
import type { TeamMember } from "@/lib/team/types";

function matchesFilter(position: string, filter: string | null): boolean {
  if (!filter) return true;
  return position.toLowerCase() === filter.toLowerCase();
}

const Team: React.FC<{ members: TeamMember[] }> = ({ members }) => {
  const [hoveredMember, setHoveredMember] = useState<TeamMember | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [mobileIndex, setMobileIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  const positionFilters = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const m of members) {
      const key = m.position.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(m.position);
      }
    }
    return list;
  }, [members]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredMembers = useMemo(() => {
    if (!activeFilter) return members;
    return members.filter((m) => matchesFilter(m.position, activeFilter));
  }, [activeFilter, members]);

  useEffect(() => {
    setMobileIndex(0);
  }, [activeFilter]);

  /**
   * PARALLAX
   */
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: isMounted ? sectionRef : undefined,
    offset: ["start end", "end start"],
  });

  const parallaxRaw = useTransform(scrollYProgress, [0, 1], [120, -120]);

  const parallaxY = useSpring(parallaxRaw, {
    stiffness: 45,
    damping: 18,
    mass: 0.7,
  });

  /**
   * ANIMATION VARIANTS
   */
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 35,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const mobileSliderMax = Math.max(0, filteredMembers.length - 1);
  const mobileCurrentMember = filteredMembers[mobileIndex] ?? filteredMembers[0];

  if (members.length === 0) return null;

  return (
    <div
      ref={sectionRef}
      className="relative bg-black overflow-hidden font-sans"
    >
      {/* --- MOBILE VIEW --- */}
      <motion.div
        style={{ y: isMounted ? parallaxY : 0 }}
        className="relative mx-auto w-full px-5 pb-28 pt-28 md:hidden flex flex-col min-h-screen"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          className="text-white text-5xl font-custom mb-8 tracking-tighter uppercase text-center"
        >
          THIS IS US
        </motion.h1>

        {/* Mobile role filters */}
        <div className="mb-8 -mx-1 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-min flex-nowrap items-center gap-2 px-1">
            {positionFilters.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() =>
                  setActiveFilter(
                    activeFilter && matchesFilter(activeFilter, role)
                      ? null
                      : role
                  )
                }
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-widest transition-colors ${
                  activeFilter && matchesFilter(activeFilter, role)
                    ? "border-white bg-white/15 text-white"
                    : "border-white/15 text-gray-500 hover:border-white/30 hover:text-gray-300"
                }`}
              >
                {role}
              </button>
            ))}
            {activeFilter ? (
              <button
                type="button"
                onClick={() => setActiveFilter(null)}
                className="shrink-0 rounded-full border border-white/20 p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                aria-label="Clear filter"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1 1L9 9M9 1L1 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        <div className="relative flex flex-1 flex-col justify-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="z-10 mb-10 space-y-1"
          >
            {members.map((member, idx) => {
              const isMatch = matchesFilter(member.position, activeFilter);
              const filterDim = activeFilter !== null && !isMatch;
              const scrollDim = activeFilter === null && idx !== mobileIndex;
              const dimmed = filterDim || scrollDim;

              return (
                <motion.div
                  key={`${member.id}-mobile`}
                  variants={itemVariants}
                  className="grid w-full grid-cols-[1fr_auto] items-center gap-x-3 py-2"
                  animate={{
                    opacity: dimmed ? 0.15 : 1,
                    scale:
                      !dimmed && activeFilter === null && idx === mobileIndex
                        ? 1.05
                        : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                >
                  <span className="text-xl text-white font-medium uppercase tracking-tight">
                    {member.name}
                  </span>
                  <span className="text-[9px] text-white/60 uppercase tracking-widest">
                    {member.position}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* IMAGE */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[320px] w-[240px] -translate-x-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {mobileCurrentMember?.image ? (
                <motion.div
                  key={mobileCurrentMember.id}
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
                  className="absolute inset-0 h-full w-full rounded-sm border border-white/10 overflow-hidden"
                >
                  <Image
                    src={mobileCurrentMember.image}
                    alt={mobileCurrentMember.name}
                    fill
                    sizes="240px"
                    priority
                    className="object-cover"
                    unoptimized={mobileCurrentMember.image.includes("supabase.co")}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Slider: native range for reliable touch */}
        <div className="mt-auto flex flex-col items-center gap-3">
          {filteredMembers.length === 0 ? (
            <p className="text-center text-xs uppercase tracking-widest text-white/40">
              No team members in this role
            </p>
          ) : (
            <div className="relative mx-auto w-[min(100%,280px)] py-3">
              <input
                type="range"
                min={0}
                max={mobileSliderMax}
                step={1}
                value={Math.min(mobileIndex, mobileSliderMax)}
                onChange={(e) => setMobileIndex(Number(e.target.value))}
                className="absolute inset-x-0 top-1/2 z-40 h-11 w-full -translate-y-1/2 cursor-pointer opacity-0 touch-manipulation"
                aria-label="Browse team members"
              />
              <div className="relative h-1 w-full rounded-full bg-white/10">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-white/30 transition-[width] duration-150 ease-out"
                  style={{
                    width:
                      mobileSliderMax === 0
                        ? "100%"
                        : `${(mobileIndex / mobileSliderMax) * 100}%`,
                  }}
                />
                <div
                  className="pointer-events-none absolute top-1/2 z-30 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md transition-[left] duration-150 ease-out"
                  style={{
                    left:
                      mobileSliderMax === 0
                        ? "50%"
                        : `${(mobileIndex / mobileSliderMax) * 100}%`,
                  }}
                >
                  <div className="flex h-full items-center justify-center gap-0.5">
                    <div className="h-3 w-0.5 bg-black/20" />
                    <div className="h-3 w-0.5 bg-black/20" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* --- DESKTOP VIEW --- */}
      <motion.div
        style={{ y: isMounted ? parallaxY : 0 }}
        className="hidden flex-col items-center justify-center py-20 px-4 md:flex min-h-screen"
      >
        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          className="text-white text-7xl font-custom mb-16 tracking-tighter uppercase"
        >
          THIS IS US
        </motion.h1>

        {/* NAMES */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-wrap justify-center max-w-6xl gap-x-10 gap-y-12 z-10"
        >
          {members.map((member) => {
            const isMatch = matchesFilter(member.position, activeFilter);
            const isAnyFilterActive = activeFilter !== null;
            const dimmed = isAnyFilterActive && !isMatch;

            return (
              <motion.div
                key={member.id}
                layout
                variants={itemVariants}
                animate={{
                  opacity: dimmed ? 0.15 : 1,
                  scale: dimmed ? 0.95 : 1,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.23, 1, 0.32, 1] as const,
                }}
                onMouseEnter={() => isMatch && setHoveredMember(member)}
                onMouseLeave={() => setHoveredMember(null)}
                className={`group relative ${
                  dimmed ? "pointer-events-none cursor-default" : "cursor-pointer"
                }`}
              >
                <span
                  className={`text-3xl font-custom1 uppercase tracking-widest transition-colors duration-300 ${
                    dimmed
                      ? "text-gray-600"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                >
                  {member.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* HOVER IMAGE */}
        <AnimatePresence>
          {hoveredMember?.image && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                x: "-50%",
                y: "-45%",
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: "-50%",
                y: "-50%",
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                x: "-50%",
                y: "-45%",
                filter: "blur(8px)",
              }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              className="fixed pointer-events-none z-50 w-[400px] h-[550px] left-1/2 top-1/2 rounded-sm border border-white/10 shadow-2xl overflow-hidden"
            >
              <Image
                src={hoveredMember.image}
                alt={hoveredMember.name}
                fill
                sizes="400px"
                className="object-cover"
                unoptimized={hoveredMember.image.includes("supabase.co")}
              />

              <div className="absolute bottom-8 left-8 border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-md z-10">
                <p className="font-custom1 text-[10px] uppercase tracking-widest text-white">
                  {hoveredMember.position}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.4,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          className="z-20 mt-24"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 rounded-full border border-white/10 bg-[#111]/80 px-8 py-3 backdrop-blur-xl">
            {positionFilters.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() =>
                  setActiveFilter(
                    activeFilter && matchesFilter(activeFilter, role)
                      ? null
                      : role
                  )
                }
                className={`text-[12px] uppercase tracking-widest transition-all ${
                  activeFilter && matchesFilter(activeFilter, role)
                    ? "font-custom text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {role}
              </button>
            ))}

            {activeFilter && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                type="button"
                onClick={() => setActiveFilter(null)}
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                aria-label="Clear filter"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1 1L9 9M9 1L1 9"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Team;