"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import SpinningTreMark from "./SpinningTreMark";

const LINES = ["BRANDS.", "BUILT DIFFERENTLY."] as const;

const MOBILE_MEDIA = "(max-width: 1023px)";

function lineTextClass(lineIndex: number) {
  if (lineIndex === 0) {
    return "text-[clamp(2.1rem,9vw,3.75rem)] sm:text-[clamp(2.65rem,8vw,4.75rem)] md:text-7xl lg:text-[7rem] 2xl:text-[9rem]";
  }
  return "text-[clamp(1.45rem,5.2vw,2.5rem)] sm:text-[clamp(1.85rem,6vw,3.25rem)] md:text-[clamp(2.35rem,6.5vw,4.5rem)] lg:text-[7rem] 2xl:text-[9rem]";
}

export default function LetsTalkArt() {
  const containerRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: isMounted ? containerRef : undefined,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001,
  });

  const yLift = useTransform(
    smoothProgress,
    [0, 1],
    isMobile ? [40, -40] : [120, -120]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: {
      filter: "blur(12px)",
      opacity: 0,
      y: 40,
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className="w-full overflow-x-hidden px-5 pb-10 pt-8 sm:pb-12 sm:pt-10 lg:px-[55px] lg:py-12 lg:hidden"
    >
      <motion.div
        style={{ y: isMounted ? yLift : 0 }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid w-full max-w-full grid-cols-[minmax(0,1fr)_auto] items-end gap-x-3 sm:gap-x-6 md:gap-x-10 lg:flex lg:items-center lg:justify-between lg:gap-12"
      >
        <div className="min-w-0 max-w-full select-none overflow-hidden leading-[0.88] lg:flex-1 lg:leading-[0.85]">
          {LINES.map((line, lineIndex) => (
            <div
              key={line}
              className={`flex flex-nowrap whitespace-nowrap ${
                lineIndex === 0 ? "py-0.5 sm:py-1 lg:py-4" : "pb-0.5 pt-0 sm:pb-1 sm:pt-0 lg:py-4"
              }`}
            >
              {line.split("").map((char, index) => (
                <motion.span
                  key={`${lineIndex}-${index}`}
                  variants={letterVariants}
                  className={`inline-block shrink-0 font-custom uppercase tracking-[-0.02em] text-black leading-[0.92] lg:leading-[0.9] ${lineTextClass(lineIndex)}`}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
          ))}
        </div>

        <motion.div variants={letterVariants} className="shrink-0 justify-self-end">
          <SpinningTreMark className="relative h-[72px] w-[72px] sm:h-[100px] sm:w-[100px] md:h-[130px] md:w-[130px] lg:h-[180px] lg:w-[180px]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
