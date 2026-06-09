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
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredMembers = useMemo(() => {
    if (!activeFilter) return members;
    return members.filter((m) => matchesFilter(m.position, activeFilter));
  }, [activeFilter, members]);

  useEffect(() => {
    setHoveredMember(null);
  }, [activeFilter]);

  const selectMember = (member: TeamMember) => {
    if (!matchesFilter(member.position, activeFilter)) return;
    setHoveredMember((prev) => (prev?.id === member.id ? null : member));
  };

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

  if (members.length === 0) return null;

  return (
    <div
      ref={sectionRef}
      className="relative bg-black overflow-hidden font-sans"
    >
      {/* --- MOBILE VIEW --- */}
      <motion.div
        style={{ y: isMounted ? parallaxY : 0 }}
        className="relative mx-auto flex min-h-screen w-full flex-col px-5 pb-28 pt-28 md:hidden"
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
            {members.map((member) => {
              const isMatch = matchesFilter(member.position, activeFilter);
              const filterDim = activeFilter !== null && !isMatch;
              const selectionDim =
                hoveredMember !== null && hoveredMember.id !== member.id;
              const dimmed = filterDim || selectionDim;
              const isSelected = hoveredMember?.id === member.id;

              return (
                <motion.button
                  key={`${member.id}-mobile`}
                  type="button"
                  variants={itemVariants}
                  disabled={filterDim}
                  onClick={() => selectMember(member)}
                  className="grid w-full grid-cols-[1fr_auto] items-center gap-x-3 py-2 text-left"
                  animate={{
                    opacity: dimmed ? 0.15 : 1,
                    scale: isSelected ? 1.05 : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                >
                  <span className="text-xl font-medium uppercase tracking-tight text-white">
                    {member.name}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-white/60">
                    {member.position}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[320px] w-[240px] -translate-x-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {hoveredMember?.image ? (
                <motion.div
                  key={hoveredMember.id}
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                  className="absolute inset-0 overflow-hidden rounded-sm border border-white/10"
                >
                  <Image
                    src={hoveredMember.image}
                    alt={hoveredMember.name}
                    fill
                    sizes="240px"
                    className="object-cover"
                    unoptimized={hoveredMember.image.includes("supabase.co")}
                  />
                  <div className="absolute bottom-4 left-4 border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    <p className="font-custom1 text-[9px] uppercase tracking-widest text-white">
                      {hoveredMember.position}
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <p className="text-center text-xs uppercase tracking-widest text-white/40">
            No team members in this role
          </p>
        ) : null}
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
                onMouseLeave={() => !isMobile && setHoveredMember(null)}
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

      {/* Desktop hover preview */}
      <AnimatePresence>
        {!isMobile && hoveredMember?.image ? (
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
            className="pointer-events-none fixed left-1/2 top-1/2 z-50 h-[min(62vh,440px)] w-[min(82vw,320px)] overflow-hidden rounded-sm border border-white/10 shadow-2xl md:h-[550px] md:w-[400px]"
          >
            <Image
              src={hoveredMember.image}
              alt={hoveredMember.name}
              fill
              sizes="(max-width: 768px) 82vw, 400px"
              className="object-cover"
              unoptimized={hoveredMember.image.includes("supabase.co")}
            />

            <div className="absolute bottom-6 left-6 z-10 border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-md md:bottom-8 md:left-8">
              <p className="font-custom1 text-[10px] uppercase tracking-widest text-white">
                {hoveredMember.position}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Team;