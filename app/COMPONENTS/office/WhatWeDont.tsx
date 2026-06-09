"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const dontStyle =
  "text-[#3110EE] line-through decoration-[2px] decoration-[#3110EE]/80";

const horizontalText =
  "font-custom uppercase tracking-[-0.04em] text-black leading-[0.92]";

const verticalText =
  "font-custom uppercase tracking-[0.08em] text-black whitespace-nowrap [writing-mode:vertical-rl] rotate-180 leading-[1]";

export default function WhatWeDont() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 18,
    mass: 0.9,
  });

  const y1 = useTransform(smoothProgress, [0, 1], [30, -45]);
  const y2 = useTransform(smoothProgress, [0, 1], [15, -28]);
  const y3 = useTransform(smoothProgress, [0, 1], [45, -60]);
  const y4 = useTransform(smoothProgress, [0, 1], [10, -22]);
  const y5 = useTransform(smoothProgress, [0, 1], [78, -48]);
  const y6 = useTransform(smoothProgress, [0, 1], [-45, -32]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-5 pt-20 pb-32 lg:px-[55px] lg:pt-16 lg:pb-32 2xl:pb-52"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="mb-14"
      >
        <span
          className={`font-custom text-[12px] uppercase tracking-[0.2em] lg:text-[16px] ${dontStyle}`}
        >
          / P.S WHAT WE DON&apos;T
        </span>
      </motion.div>

      <div className="hidden items-end justify-between gap-4 lg:flex 2xl:gap-8">
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-[22%]"
        >
          <h2
            className={`${horizontalText} rotate-12 text-[clamp(1.8rem,3vw,4rem)] 2xl:text-[5.2rem]`}
          >
            WORK ON <span className={dontStyle}>WEEKENDS</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ y: y2 }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex w-[6%] justify-center"
        >
          <h2
            className={`${verticalText} h-[180px] text-[1.4rem] 2xl:h-[240px] 2xl:text-[2rem]`}
          >
            SAY NO TO <span className={dontStyle}>COFFEE</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ y: y3 }}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.16,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-[23%]"
        >
          <h2
            className={`${horizontalText} text-[clamp(1.8rem,5vw,4rem)] 2xl:text-[4.8rem]`}
          >
            BELIEVE IN <span className={dontStyle}>BORING</span> DESIGN
          </h2>
        </motion.div>

        <motion.div
          style={{ y: y4 }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.24,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex w-[6%] justify-center"
        >
          <h2
            className={`${verticalText} h-[180px] text-[1.3rem] 2xl:h-[240px] 2xl:text-[1rem]`}
          >
            DESIGN BY <span className={dontStyle}>COMMITTEE</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ y: y5 }}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.32,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-[22%]"
        >
          <h2
            className={`${horizontalText} text-[clamp(1.8rem,4vw,4rem)] 2xl:text-[4.8rem]`}
          >
            ACCEPT <span className={dontStyle}>MEDIOCRITY</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ y: y6 }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex w-[6%] justify-center"
        >
          <h2
            className={`${verticalText} h-[180px] text-[0.9rem] lg:text-[1.8rem] 2xl:h-[240px] 2xl:text-[2rem]`}
          >
            IGNORE THE <span className={dontStyle}>DETAILS</span>
          </h2>
        </motion.div>
      </div>

      <div className="flex items-end justify-between gap-2 lg:hidden">
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            delay: 0,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-[32%]"
        >
          <h2 className={`${horizontalText} text-[1.8rem]`}>
            WORK ON <span className={dontStyle}>WEEKENDS</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ y: y2 }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex w-[10%] justify-center"
        >
          <h2 className={`${verticalText} h-[120px] text-[0.82rem]`}>
            SAY NO TO <span className={dontStyle}>COFFEE</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ y: y3 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-[40%]"
        >
          <h2 className={`${horizontalText} text-[1.8rem]`}>
            BELIEVE IN <span className={dontStyle}>BORING</span> DESIGN
          </h2>
        </motion.div>
      </div>

      <div className="mt-12 flex items-end justify-between gap-2 lg:hidden">
        <motion.div
          style={{ y: y4 }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            delay: 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex w-[12%] justify-center"
        >
          <h2 className={`${verticalText} h-[120px] text-[0.72rem]`}>
            DESIGN BY <span className={dontStyle}>COMMITTEE</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ y: y5 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            delay: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-[45%]"
        >
          <h2 className={`${horizontalText} -rotate-6 text-[2.8rem]`}>
            ACCEPT <span className={dontStyle}>MEDIOCRITY</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ y: y6 }}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            delay: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex w-[12%] justify-center"
        >
          <h2 className={`${verticalText} h-[120px] text-[0.72rem]`}>
            IGNORE THE <span className={dontStyle}>DETAILS</span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
