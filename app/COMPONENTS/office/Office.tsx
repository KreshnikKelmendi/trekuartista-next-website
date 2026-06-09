"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const imgs = [
  { src: "/assets/office/treku-office (1).jpg", alt: "Office layout perspective 1" },
  { src: "/assets/office/treku-office (2).jpg", alt: "Office layout perspective 2" },
  { src: "/assets/office/treku-office (3).jpg", alt: "Office layout perspective 3" },
  { src: "/assets/office/treku-office (4).jpg", alt: "Office layout perspective 4" },
  { src: "/assets/office/treku-office (5).jpg", alt: "Office layout perspective 5" },
  { src: "/assets/office/treku-office (6).jpg", alt: "Office layout perspective 6" },
  { src: "/assets/office/treku-office (7).jpg", alt: "Office layout perspective 7" },
  { src: "/assets/office/treku-office (8).jpg", alt: "Office layout perspective 8" },
  { src: "/assets/office/treku-office (9).jpg", alt: "Office layout perspective 9" },
  { src: "/assets/office/treku-office (10).jpg", alt: "Office layout perspective 10" },
];

const AUTO_DELAY = 1700;

const TEXT_LINES = [
  { text: "A VIBRANT HUB", size: "text-2xl md:text-3xl lg:text-7xl", opacity: "opacity-20", weight: "font-light" },
  { text: "WHERE IDEAS", size: "text-4xl md:text-5xl", opacity: "opacity-40", weight: "font-normal" },
  { text: "COME TO LIFE.", size: "text-4xl md:text-5xl", opacity: "opacity-100", weight: "font-medium" },
  { text: "FROM WARM COLLABORATIVE", size: "text-3xl md:text-4xl", opacity: "opacity-100", weight: "font-normal" },
  { text: "NOOKS TO TOP-NOTCH", size: "text-4xl md:text-5xl", opacity: "opacity-100", weight: "font-normal" },
  { text: "AMENITIES,", size: "text-4xl md:text-5xl", opacity: "opacity-70", weight: "font-light" },
  { text: "OUR SPACE IS DESIGNED", size: "text-3xl md:text-4xl", opacity: "opacity-50", weight: "font-light" },
  { text: "TO INSPIRE INNOVATION", size: "text-4xl md:text-5xl", opacity: "opacity-100", weight: "font-medium" },
  { text: "AND FOSTER COLLABORATION.", size: "text-2xl md:text-3xl", opacity: "opacity-30", weight: "font-extralight" },
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const lineVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  visible: (customOpacity: number) => ({
    opacity: customOpacity,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

export default function Office() {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setImgIndex((prev) => (prev === imgs.length - 1 ? 0 : prev + 1));
    }, AUTO_DELAY);
    return () => clearInterval(intervalRef);
  }, []);

  return (
    <section className="select-none overflow-hidden px-5 pt-24 pb-12 text-black lg:px-[55px] lg:py-40">
      <motion.div
        className="mb-10 lg:mb-16"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-custom mb-8 text-[14px] uppercase text-black lg:mb-10 lg:text-[20px]">
          / Our Space
        </p>
      </motion.div>

      <div className="flex flex-col items-center lg:flex-row">
        <div className="z-20 flex w-full flex-col justify-center lg:w-1/2">
          <motion.div
            className="flex flex-col space-y-1 font-sans uppercase tracking-tight md:space-y-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {TEXT_LINES.map((line, i) => {
              const targetOpacity =
                parseInt(line.opacity.replace("opacity-", ""), 10) / 100;

              return (
                <motion.div
                  key={line.text}
                  custom={targetOpacity}
                  variants={lineVariants}
                  className={`${line.size} ${line.weight} block leading-none tracking-wide text-black`}
                  style={{ transformOrigin: "left center" }}
                >
                  {line.text}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="relative mt-12 h-[30vh] w-full md:h-[80vh] lg:mt-0 lg:w-1/2">
          <div className="absolute right-0 bottom-20 mt-[-120px] h-full w-full overflow-hidden rounded-[8px] lg:bottom-16 lg:mt-0 lg:w-4/5">
            <AnimatePresence initial={false}>
              <motion.div
                key={`main-${imgIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 h-full w-full pl-40 lg:pl-0"
              >
                <Image
                  src={imgs[imgIndex].src}
                  alt={imgs[imgIndex].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority={imgIndex === 0}
                  className="rounded-[8px] object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 z-10 h-[15vh] w-1/2 rounded-[8px] lg:h-1/2">
            <AnimatePresence initial={false}>
              <motion.div
                key={`sub-${imgIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 h-full w-full pl-16 lg:pl-0"
              >
                <Image
                  src={imgs[(imgIndex + 1) % imgs.length].src}
                  alt={imgs[(imgIndex + 1) % imgs.length].alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 20vw"
                  className="rounded-[8px] object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
