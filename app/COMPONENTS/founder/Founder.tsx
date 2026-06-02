"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import founderImg from "../../../public/assets/team/ariani4-compress.webp";

const Founder: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
  });

  // Image drifts up slightly slower
  const yImage = useTransform(smoothProgress, [0, 1], [0, -80]);
  // Text content drifts up faster to create the parallax gap
  const yText = useTransform(smoothProgress, [0, 1], [0, -150]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full pt-20 lg:pb-16 px-5 lg:px-[55px] overflow-hidden"
    >
      {/* Top Left Tag */}
      <div className="mb-12">
        <span className="text-[14px] lg:text-[20px] font-custom uppercase text-black">
          / THE FOUNDER
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20">
        
        {/* LEFT SIDE: IMAGE & FOOTER */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <motion.div 
            style={{ y: yImage }}
            className="w-full h-auto overflow-hidden"
          >
            <Image 
              src={founderImg} 
              alt="Arian Ahmeti" 
              width={800}
              height={1000}
              priority
              className="w-full h-auto object-cover rounded-[8px]"
            />
          </motion.div>
        </div>

        {/* RIGHT SIDE: BIO & QUOTE */}
        <motion.div 
          style={{ y: yText }}
          className="w-full lg:w-1/2 lg:pt-32 flex flex-col items-end text-right"
        >
          {/* Main Title */}
          <div className="mb-10">
            <h2 className="text-5xl md:text-6xl font-custom text-black uppercase mb-2">
              ARIAN AHMETI
            </h2>
            <h3 className="text-2xl md:text-3xl font-custom text-zinc-500">
              Founder & Creative Director
            </h3>
          </div>

          {/* Bio Text */}
          <div className="max-w-md mb-20">
            <p className="text-[15px] md:text-[17px] leading-relaxed text-zinc-700 font-custom1 text-justify md:text-right">
              Arian Ahmeti is the Co-Founder and Creative Director of Trekuartista, 
              with 20+ years of experience in branding, design, and visual storytelling. 
              Raised in a creative environment influenced by his father, one of Kosovo's 
              most recognized caricaturists and illustrators, Arian developed a strong 
              instinct for aesthetics, emotion, and narrative. His work combines 
              strategic thinking with a refined visual approach across branding, 
              identity systems, packaging, digital, and creative direction. 
              At Trekuartista, he leads the agency's creative vision, focused on 
              building brands that feel distinctive, culturally aware, and emotionally driven.
            </p>
          </div>

          {/* Quote Section */}
          <div className="max-w-md italic border-none">
            <p className="text-2xl md:text-3xl font-custom font-bold text-black leading-tight">
              “Artists solve themselves, designers solve others. I do both, through art. That’s my path.”
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Founder;