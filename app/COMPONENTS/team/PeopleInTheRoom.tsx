"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

interface SlotItem {
  src: string;
  isTall: boolean;
}

const peopleSectionBg = "/assets/people/office12.jpg";

const PeopleInTheRoom: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Structural composition array defining distinct dimensions for asymmetrical distribution
  const slotLayoutSettings = useMemo(() => [
    { isTall: true },   { isTall: false },  { isTall: true }, 
    { isTall: false },  { isTall: true },   { isTall: false },
  ], []);

  const [slots, setSlots] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const slotCursorRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlots((currentSlots) => {
        const nextSlots = [...currentSlots];
        const slotIndexToUpdate = slotCursorRef.current % nextSlots.length;
        const availableImages = reel
          .map((_, index) => index)
          .filter((index) => !nextSlots.includes(index));

        if (availableImages.length > 0) {
          nextSlots[slotIndexToUpdate] = availableImages[Math.floor(Math.random() * availableImages.length)];
        }
        slotCursorRef.current += 1;
        return nextSlots;
      });
    }, 2400); // Slower interval for clean, unhurried visual state swaps

    return () => clearInterval(interval);
  }, [reel]);

  const getSlotData = (index: number): SlotItem => ({
    src: reel[slots[index]] || reel[0],
    isTall: !!slotLayoutSettings[index]?.isTall,
  });

  // --- SCIENTIFIC PARALLAX INTERPOLATION ---
  const { scrollYProgress } = useScroll({
    target: canvasRef,
    offset: ["start end", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 15,
    mass: 0.6,
  });

  // Balanced depth offsets mapping various elements to separate simulated visual fields
  const dynamicYLayer1 = useTransform(smoothScroll, [0, 1], [40, -60]);
  const dynamicYLayer2 = useTransform(smoothScroll, [0, 1], [-20, -140]);
  const dynamicYLayer3 = useTransform(smoothScroll, [0, 1], [90, -220]);
  const dynamicYLayer4 = useTransform(smoothScroll, [0, 1], [-50, -90]);

  // Premium Image Card Subcomponent
  const EditorialCard: React.FC<{ item: SlotItem }> = ({ item }) => {
    return (
      <motion.div 
        layout
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        className="group relative w-full h-full overflow-hidden"
        style={{ borderRadius: "12px" }}
      >
        <motion.div 
          className="relative w-full h-full grayscale transition-all duration-700 ease-out"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <Image
            src={item.src}
            alt="Team member asset portrait"
            fill
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </motion.div>
        
        {/* Sophisticated inner shadow edge gradient */}
      </motion.div>
    );
  };

  return (
    <main className="overflow-hidden text-black">
      <section className="w-full border-b border-black/5 px-5 pt-20 pb-16 lg:px-[55px] lg:pt-32 lg:pb-24">
        <div className="flex w-full flex-col space-y-2">
          <span className="font-stfs mb-4 block text-[20px] uppercase text-zinc-400">
            / this is us
          </span>

          <div className="grid w-full grid-cols-1 items-end gap-6 lg:grid-cols-12">
            <div className="overflow-hidden lg:col-span-8">
              <motion.h1
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-sfts text-[12vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[10vw] lg:text-[7.5vw]"
              >
                THE PEOPLE <br />
                <span className="font-sfts italic tracking-tight text-zinc-300">
                  in the
                </span>{" "}
                ROOM.
              </motion.h1>
            </div>

            <div className="pb-2 lg:col-span-4 lg:pl-8">
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-roboto text-base tracking-wide text-zinc-600 md:text-lg"
              >
                A collaborative collective of visionary thinkers, strategic
                designers, and pixel architects rewriting visual identities for
                global disruptors.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      <section ref={canvasRef} className="relative h-auto 2xl:h-screen w-full px-5 py-8 lg:px-[55px] lg:py-12">
        <div className="pointer-events-none absolute inset-0 z-0 ">
          <Image
            src={peopleSectionBg}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center grayscale"
          />
        </div>

        <div className="relative z-10 grid w-full h-fit grid-cols-4 items-start gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="col-span-2 flex flex-col space-y-4 lg:col-span-3 lg:space-y-6">
            <motion.div style={{ y: isMobile ? 0 : dynamicYLayer1 }} className="h-[200px] w-full sm:h-[280px] lg:h-[360px]">
              <EditorialCard item={getSlotData(0)} />
            </motion.div>

            <motion.div style={{ y: isMobile ? 0 : dynamicYLayer3 }} className="h-[140px] w-full sm:h-[190px] lg:h-[240px] lg:w-[85%]">
              <EditorialCard item={getSlotData(1)} />
            </motion.div>
          </div>

          <div className="col-span-2 flex flex-col space-y-4 pt-8 lg:col-span-5 lg:space-y-6 lg:pt-12">
            <motion.div style={{ y: isMobile ? 0 : dynamicYLayer2 }} className="h-[240px] w-full sm:h-[320px] lg:h-[460px] shadow-2xl">
              <EditorialCard item={getSlotData(2)} />
            </motion.div>
          </div>

          <div className="col-span-4 flex flex-col space-y-4 pt-4 lg:col-span-4 lg:space-y-6 lg:pt-6">
            <motion.div style={{ y: isMobile ? 0 : dynamicYLayer4 }} className="mx-auto h-[160px] w-full sm:h-[220px] lg:h-[300px] lg:w-[90%]">
              <EditorialCard item={getSlotData(3)} />
            </motion.div>

            <div className="grid w-full grid-cols-2 gap-4 lg:gap-6">
              <motion.div style={{ y: isMobile ? 0 : dynamicYLayer1 }} className="h-[120px] sm:h-[170px] lg:h-[220px]">
                <EditorialCard item={getSlotData(4)} />
              </motion.div>

              <motion.div style={{ y: isMobile ? 0 : dynamicYLayer3 }} className="mt-4 h-[120px] sm:h-[170px] lg:mt-8 lg:h-[220px]">
                <EditorialCard item={getSlotData(5)} />
              </motion.div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default PeopleInTheRoom;