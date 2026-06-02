"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

interface SlotItem {
  src: string;
  bw: boolean;
}

const PeopleInTheRoom: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const collageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Updated to look inside your public/assets/people/ directory
  const reel = useMemo<string[]>(
    () => [
      "/assets/people/people-1.png",
      "/assets/people/people-2.png",
      "/assets/people/people-3.png",
      "/assets/people/people-4.png",
      "/assets/people/people-5.png",
      "/assets/people/people-6.png",
      "/assets/people/image.jpg",
      "/assets/people/people-8.jpg",
      "/assets/people/people-9.jpg",
      "/assets/people/people-10.jpg",
      "/assets/people/BM4I3949.jpg",
      "/assets/people/treku-office (2).jpg",
      "/assets/people/IMG_4606.JPG",
      "/assets/people/IMG_5410.JPG",
      "/assets/people/IMG_1409.jpg",
    ],
    []
  );

  const slotLooks = useMemo(() => [
    { bw: false }, { bw: true }, { bw: false }, 
    { bw: true }, { bw: true }, { bw: false },
  ], []);

  // --- ONE-BY-ONE SEQUENTIAL SWAP ---
  const [slots, setSlots] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const slotCursorRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlots((currentSlots) => {
        const nextSlots = [...currentSlots];
        const slotIndexToUpdate = slotCursorRef.current % nextSlots.length;

        // Ensure unique selection (no image appears twice on screen)
        const availableImages = reel
          .map((_, index) => index)
          .filter((index) => !nextSlots.includes(index));

        if (availableImages.length > 0) {
          nextSlots[slotIndexToUpdate] = availableImages[Math.floor(Math.random() * availableImages.length)];
        }

        slotCursorRef.current += 1;
        return nextSlots;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [reel]);

  const pick = (slotIdx: number): SlotItem => ({
    src: reel[slots[slotIdx]],
    bw: !!slotLooks[slotIdx]?.bw,
  });

  // --- PARALLAX ---
  const { scrollYProgress } = useScroll({
    target: collageRef,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 20,
    mass: 0.7,
  });

  const ySlow = useTransform(smooth, [0, 1], [0, isMobile ? -15 : -70]);
  const yMed = useTransform(smooth, [0, 1], [0, isMobile ? -25 : -130]);
  const yFast = useTransform(smooth, [0, 1], [0, isMobile ? -35 : -190]);

  const Frame: React.FC<{ item: SlotItem }> = ({ item }) => (
    <div className="relative h-full w-full overflow-hidden rounded-sm">
      <Image
        src={item.src}
        alt=""
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className={`absolute inset-0 h-full w-full object-contain rounded-[8px] lg:object-top transition-none ${
          item.bw ? "grayscale" : ""
        }`}
      />
    </div>
  );

  return (
    <main className="text-black">
      {/* HEADER SECTION: Title Left, Description Right */}
      <section className="mx-auto px-5 pt-6 pb-16 lg:px-[55px] lg:pt-6 lg:pb-24">
        <header className="mb-8">
          <span className="text-[14px] lg:text-[20px] font-custom uppercase text-black">
            / MEET OUR TEAM
          </span>
        </header>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          {/* Title on the Left */}
          <div className="relative">
            <div className="relative inline-flex items-end">
              <span className="text-[10px] tracking-tighter font-custom opacity-70 mb-2 mr-2">
                THIS IS US
              </span>
              <h1 className="text-6xl md:text-8xl font-custom tracking-tighter leading-none uppercase">
                THE PEOPLE
              </h1>
            </div>
            <h1 className="text-6xl md:text-8xl font-custom tracking-tighter leading-none uppercase block">
              IN THE ROOM
            </h1>
          </div>

          {/* Description on the Right */}
          <div className="lg:max-w-sm">
            <p className="text-sm md:text-base leading-relaxed opacity-70 font-custom1">
              a fusion of creative minds dedicated to crafting dream
              brands, groundbreaking campaigns, and mesmerizing visuals.
            </p>
          </div>
        </div>
      </section>

      {/* COLLAGE SECTION */}
      <section ref={collageRef} className="relative mx-auto overflow-hidden bg-people pb-20">
        <div className="grid h-[500px] grid-cols-12 gap-2 md:h-[600px] md:gap-3 lg:h-screen 2xl:h-[86vh]">
          
          <motion.div style={{ y: yMed }} className="col-span-4 h-full">
            <Frame item={pick(0)} />
          </motion.div>

          <motion.div style={{ y: ySlow }} className="col-span-5 row-span-1 h-[60%]">
            <Frame item={pick(1)} />
          </motion.div>

          <motion.div style={{ y: yFast }} className="col-span-3 h-full">
            <Frame item={pick(2)} />
          </motion.div>

          {/* Absolute Overlays */}
          <motion.div 
            style={{ y: yFast }} 
            className="absolute left-[12%] bottom-8 z-20 h-[34%] w-[26%]"
          >
            <Frame item={pick(3)} />
          </motion.div>

          <motion.div 
            style={{ y: yMed }} 
            className="absolute left-[48%] bottom-3 z-10 h-[30%] w-[26%] shadow-xl"
          >
            <Frame item={pick(4)} />
          </motion.div>

          <motion.div 
            style={{ y: ySlow }} 
            className="absolute right-6 bottom-8 z-10 h-[28%] w-[24%] shadow-xl"
          >
            <Frame item={pick(5)} />
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default PeopleInTheRoom;