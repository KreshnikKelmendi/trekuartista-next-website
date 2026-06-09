"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { partnerLogos } from "@/app/COMPONENTS/clients/partnerLogos";

const Clients: React.FC = () => {
  const logos = partnerLogos;

  // Split logos into two arrays for two different marquee rows
  const half = Math.ceil(logos.length / 2);
  const firstRow = logos.slice(0, half);
  const secondRow = logos.slice(half);

  // Animation settings for the infinite loop marquee rows
  const marqueeVariants = (direction: "left" | "right" = "left"): Variants => ({
    animate: {
      x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30, // Adjust for speed (higher values = slower)
          ease: "linear",
        },
      },
    },
  });

  return (
    <section className="pt-24 lg:pt-20 pb-32 overflow-hidden">
      <div className="px-5 lg:px-[55px] mb-12">
        <p className="mb-6 text-[14px] lg:text-[20px] font-roboto uppercase text-black">
          / CLIENTS
        </p>
      </div>

      <div className="flex flex-col gap-y-12 lg:gap-y-16">
        {/* First Row: Moving Left */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap gap-x-16 items-center"
            variants={marqueeVariants("left")}
            animate="animate"
          >
            {/* Render twice for seamless infinite looping updates */}
            {[...firstRow, ...firstRow].map((logo, index) => (
              <div
                key={`row1-${index}`}
                className="relative h-8 md:h-12 w-[120px] shrink-0 brightness-0 hover:opacity-100 transition-opacity duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt || "Client Logo"}
                  fill
                  sizes="120px"
                  className="object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second Row: Moving Right */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap gap-x-16 items-center"
            variants={marqueeVariants("right")}
            animate="animate"
          >
            {[...secondRow, ...secondRow].map((logo, index) => (
              <div
                key={`row2-${index}`}
                className="relative h-8 md:h-12 w-[120px] shrink-0 brightness-0 hover:opacity-100 transition-opacity duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt || "Client Logo"}
                  fill
                  sizes="120px"
                  className="object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Clients;