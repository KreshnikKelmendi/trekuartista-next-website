"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";

const image1 = "/assets/about/pho.jpg";
const image2 = "/assets/about/office10.jpg";
const image3 = "/assets/about/office11.jpg";
const image5 = "/assets/about/office12.jpg";

const Services = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Safely track mounting state to prevent Next.js hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // SMOOTH CURSOR
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 120,
    damping: 18,
    mass: 0.3,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 120,
    damping: 18,
    mass: 0.3,
  });

  const services = useMemo(
    () => [
      {
        id: "01",
        title: "Digital Strategy",
        image: image1,
      },
      {
        id: "02",
        title: "Branding",
        image: image2,
      },
      {
        id: "03",
        title: "Advertising",
        image: image3,
      },
      {
        id: "04",
        title: "Media Production",
        image: image1,
      },
      {
        id: "05",
        title: "Web + App Development",
        image: image5,
      },
    ],
    []
  );

  const rows = [
    [services[0], services[1]],
    [services[2], services[3]],
    [services[4]],
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY + 20);
  };

  return (
    <section className="w-full px-5 pt-24 lg:px-[55px] lg:py-16">
      {/* TOP TITLE */}
      <p
        className="
          mb-8 lg:mb-10
          text-[14px] lg:text-[20px]
          font-custom
          uppercase
          text-black
        "
      >
        / WHAT WE DO
      </p>

      {/* CONTENT */}
      <div
        className="relative flex flex-col gap-y-10 lg:gap-y-14"
        onMouseLeave={() => setHoveredItem(null)}
        onMouseMove={handleMouseMove}
      >
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="
              flex
              flex-wrap
              items-center
              gap-x-6
              lg:gap-x-14
              gap-y-8
              md:gap-y-10
              lg:gap-y-12
            "
          >
            {row.map((service, index) => {
              const isHovered = hoveredItem === service.id;

              const isDimmed =
                hoveredItem !== null && hoveredItem !== service.id;

              return (
                <React.Fragment key={service.id}>
                  {/* ITEM */}
                  <motion.div
                    onMouseEnter={() => setHoveredItem(service.id)}
                    className="relative cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="relative inline-block">
                      {/* NUMBER */}
                      <span
                        className="
                          absolute
                          -top-3
                          right-[-22px]
                          text-[12px]
                          text-black/35
                          font-light
                        "
                      >
                        {service.id}
                      </span>

                      {/* TITLE */}
                      <h2
                        className={`
                          text-[30px]
                          md:text-[46px]
                          lg:text-[56px]
                          leading-[1.1]
                          tracking-[-0.04em]
                          text-black
                          transition-all
                          duration-500
                          font-custom7
                          ${
                            isDimmed
                              ? "opacity-25"
                              : "opacity-100"
                          }
                        `}
                      >
                        {service.title}
                      </h2>
                    </div>

                    {/* CURSOR FOLLOW IMAGE */}
                    <AnimatePresence>
                      {isMounted && isHovered && (
                        <motion.div
                          style={{
                            x: smoothX,
                            y: smoothY,
                          }}
                          initial={{
                            opacity: 0,
                            scale: 0.8,
                            rotate: -4,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.8,
                            rotate: 4,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1] as const,
                          }}
                          className="
                            fixed
                            top-0
                            left-0
                            z-999
                            pointer-events-none
                            hidden
                            lg:block
                          "
                        >
                          <div
                            className="
                              relative
                              h-[240px]
                              w-[180px]
                              overflow-hidden
                              rounded-[10px]
                              shadow-[0_20px_60px_rgba(0,0,0,0.2)]
                            "
                          >
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              sizes="180px"
                              className="object-cover"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* SLASH */}
                  {index !== row.length - 1 && (
                    <span
                      className="
                        text-[28px]
                        md:text-[38px]
                        lg:text-[48px]
                        text-black/40
                        font-light
                        leading-none
                      "
                    >
                      /
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;