'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const logoTreku = "/assets/logo/logo-treku.png";
const trek = "/assets/logo/trekuartistaLogoFooter.png";

const hamburgerMenu = (
  <svg width="53" height="15" viewBox="0 0 53 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <line x1="0" y1="1.5" x2="53" y2="1.5" stroke="black" strokeWidth="3" />
    <line x1="18" y1="13.5" x2="53" y2="13.5" stroke="black" strokeWidth="3" />
  </svg>
);

const closeIcon = (
  <svg width="53" height="20" viewBox="0 0 53 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="10" x2="53" y2="10" stroke="black" strokeWidth="2" />
    <line x1="18" y1="10" x2="53" y2="10" stroke="black" strokeWidth="2" />
  </svg>
);

const scrollTopSmooth = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

// --- Sub-Component: LogoComponent ---
function LogoComponent({ className = "" }: { className?: string }) {
  const [showFirstLogo, setShowFirstLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstLogo(false); // Switch to the second logo after a delay
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const logoVariants = {
    initial: { x: -100, opacity: 0, scale: 0.8 },
    enter: { x: 0, opacity: 1, scale: 1 },
    exit: { x: 100, opacity: 0, scale: 0.8 },
  };

  const typingVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: "easeInOut" as const } },
  };

  return (
    <div className="block font-custom">
      <Link href="/" onClick={() => window.scrollTo({ top: 0, left: 0 })} className="cursor-pointer">
        {showFirstLogo ? (
          <motion.div
            className={`w-[175px] h-[47px] relative ${className}`}
            variants={logoVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Image
              src={trek}
              alt=""
              fill
              sizes="175px"
              priority
              className="object-contain"
            />
          </motion.div>
        ) : (
          <motion.svg
            className={className}
            width="56"
            height="37"
            viewBox="0 0 56 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            variants={typingVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <motion.path
              d="M18.7207 0L22.6107 3.85517L26.8897 8.09425L30.2125 11.4055L35.4154 16.5724L41.0721 22.1872L45.8698 26.9542L49.7112 30.7613L52.807 33.8327L56 37V0H18.7207Z"
              fill="black"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
            <motion.path
              d="M0 0L18.7207 18.476V0H0Z"
              fill="black"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            />
            <motion.path
              d="M0 18.4919L18.7207 36.9679V18.4919H0Z"
              fill="black"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            />
          </motion.svg>
        )}
      </Link>
    </div>
  );
}

// --- Sub-Component: MenuLink ---
function MenuLink({
  to,
  label,
  num,
  onNavigate,
}: {
  to: string;
  label: string;
  num: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={to}
      onClick={() => {
        scrollTopSmooth();
        onNavigate();
      }}
      className="group relative inline-block cursor-pointer font-sfts"
    >
      <span className="relative inline-block">
        <span className="block text-[clamp(2.5rem,10vw,4.5rem)] uppercase leading-none tracking-tight text-black transition-opacity group-hover:opacity-60 lg:text-[clamp(3.25rem,4.5vw,5.25rem)]">
          {label}
        </span>
        <span className="absolute -right-5 top-0 text-[clamp(0.7rem,1.2vw,1rem)] font-normal leading-none text-zinc-300 lg:-right-7 lg:-top-0.5 lg:text-[1.05rem]">
          {num}
        </span>
      </span>
    </Link>
  );
}

function MenuSlash() {
  return (
    <motion.span
      variants={slashVariants}
      className="select-none text-[clamp(2rem,4vw,3.25rem)] font-light leading-none text-zinc-300"
      aria-hidden
    >
      /
    </motion.span>
  );
}

const slashVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.1, duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  },
};

// --- Main Component: Header ---
const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  useEffect(() => {
    let prevY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (isMenuOpen) {
        setHeaderVisible(true);
        prevY = y;
        return;
      }
      if (y < 24) {
        setHeaderVisible(true);
      } else if (y > prevY && y > 72) {
        setHeaderVisible(false);
      } else if (y < prevY) {
        setHeaderVisible(true);
      }
      prevY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMenuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setShowTagline(false);
    const timer = window.setTimeout(() => setShowTagline(true), 900);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // --- Animations ---
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1] as const,
        when: "beforeChildren" as const,
        staggerChildren: 0.04,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.18,
        ease: [0.4, 0, 0.2, 1] as const,
        when: "afterChildren" as const,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
    exit: {
      opacity: 0,
      y: 12,
      transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <>
      <header
        className={`sticky top-0 flex w-full items-center justify-between px-4 py-3 md:py-4 lg:px-[55px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
          headerVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        } ${isMenuOpen ? 'z-10050' : 'z-900'}`}
      >
        <div className="relative z-510 flex shrink-0 items-center">
          <LogoComponent />
        </div>

        <button
          type="button"
          className={`relative z-600 flex min-h-[40px] min-w-[53px] items-center justify-end text-black cursor-pointer active:scale-95 transition-transform ${
            isMenuOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          onClick={toggleMenu}
        >
          {isMenuOpen ? closeIcon : hamburgerMenu}
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              className="fixed inset-0 z-10060 flex h-screen w-full flex-col bg-white lg:bg-[#F8F8F8]"
            >
              <div className="flex w-full items-center justify-between px-6 pt-6 md:px-10 lg:px-[55px]">
                <Image 
                  src={logoTreku} 
                  alt="Treku logo" 
                  width={120}
                  height={48}
                  className="h-10 w-auto object-contain md:h-12" 
                  priority 
                />
                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex min-h-[40px] min-w-[53px] cursor-pointer items-center justify-end text-black transition-transform active:scale-95"
                  aria-label="Close menu"
                >
                  {closeIcon}
                </button>
              </div>

              {/* Mobile menu */}
              <div className="flex h-full w-full items-center justify-center px-6 lg:hidden">
                <div className="flex w-full max-w-md flex-col items-center gap-y-12">
                  <motion.div variants={menuItemVariants} custom={0}>
                    <MenuLink to="/" label="HOME" num="01" onNavigate={closeMenu} />
                  </motion.div>
                  <motion.div variants={menuItemVariants} custom={1}>
                    <MenuLink to="/about-trekuartista" label="ABOUT US" num="02" onNavigate={closeMenu} />
                  </motion.div>
                  <motion.div variants={menuItemVariants} custom={2}>
                    <MenuLink to="/our-works" label="ALL WORK" num="03" onNavigate={closeMenu} />
                  </motion.div>
                  <motion.div variants={menuItemVariants} custom={3}>
                    <MenuLink to="/contact" label="CONTACT" num="04" onNavigate={closeMenu} />
                  </motion.div>
                </div>
              </div>

              {/* Desktop menu — 2×2 grid with slash between each pair */}
              <div className="hidden h-full w-full items-center justify-center px-[55px] lg:flex">
                <div className="flex w-full max-w-[1100px] flex-col gap-y-[clamp(4rem,10vh,7.5rem)]">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-[clamp(2.5rem,6vw,5.5rem)]">
                    <motion.div
                      variants={menuItemVariants}
                      custom={0}
                      className="flex justify-end"
                    >
                      <MenuLink to="/" label="HOME" num="01" onNavigate={closeMenu} />
                    </motion.div>
                    <MenuSlash />
                    <motion.div
                      variants={menuItemVariants}
                      custom={1}
                      className="flex justify-start"
                    >
                      <MenuLink to="/about-trekuartista" label="ABOUT US" num="02" onNavigate={closeMenu} />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-[clamp(2.5rem,6vw,5.5rem)]">
                    <motion.div
                      variants={menuItemVariants}
                      custom={2}
                      className="flex justify-end"
                    >
                      <MenuLink to="/our-works" label="ALL WORK" num="03" onNavigate={closeMenu} />
                    </motion.div>
                    <MenuSlash />
                    <motion.div
                      variants={menuItemVariants}
                      custom={3}
                      className="flex justify-start"
                    >
                      <MenuLink to="/contact" label="CONTACT" num="04" onNavigate={closeMenu} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;