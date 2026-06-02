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
      <Link href="/" onClick={() => window.scrollTo({ top: 0, left: 0 })}>
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
function MenuLink({ to, label, num, onNavigate }: { to: string; label: string; num: string; onNavigate: () => void }) {
  return (
    <Link
      href={to}
      onClick={() => {
        scrollTopSmooth();
        onNavigate();
      }}
      className="group relative flex items-start font-custom text-black"
    >
      <span className="text-[clamp(2.5rem,8vw,5.5rem)] font-light uppercase leading-none tracking-tight transition-opacity group-hover:opacity-60">
        {label}
      </span>
      <span className="ml-2 mt-2 font-sans text-[clamp(0.8rem,1.5vw,1.2rem)] font-medium text-zinc-300">
        {num}
      </span>
    </Link>
  );
}

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
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, when: "beforeChildren" as const } 
    },
    exit: { 
      opacity: 0, 
      transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, when: "afterChildren" as const } 
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: 0.2 + i * 0.1, 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as const
      },
    }),
    exit: {
      opacity: 0,
      y: 18,
      transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  const slashVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 0.2, 
      scale: 1, 
      transition: { delay: 0.4, duration: 0.8 } 
    },
    exit: {
      opacity: 0,
      scale: 0.92,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
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
              className="fixed inset-0 z-10060 flex h-screen w-full flex-col bg-[#F0F0F0]"
            >
              <div className="flex w-full items-center justify-between px-6 pt-6 md:px-10">
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
                  className="flex min-h-[40px] min-w-[53px] items-center justify-end text-black"
                  aria-label="Close menu"
                >
                  {closeIcon}
                </button>
              </div>
              <div className="flex h-full w-full items-center justify-center px-6">
                <div className="grid w-full max-w-7xl grid-cols-1 items-center justify-center gap-y-12 md:grid-cols-[1fr_auto_1fr] md:gap-x-12 lg:gap-x-20">
                  
                  {/* Column 1 */}
                  <div className="flex flex-col items-center gap-y-12 md:items-end">
                    <motion.div variants={menuItemVariants} custom={0}>
                      <MenuLink to="/" label="HOME" num="01" onNavigate={closeMenu} />
                    </motion.div>
                    <motion.div variants={menuItemVariants} custom={2}>
                      <MenuLink to="/our-works" label="ALL WORK" num="02" onNavigate={closeMenu} />
                    </motion.div>
                  </div>

                  {/* Desktop Divider Slashes */}
                  <div className="hidden h-full flex-col justify-center gap-y-40 md:flex">
                    <motion.span variants={slashVariants} className="text-5xl font-light text-black">/</motion.span>
                    <motion.span variants={slashVariants} className="text-5xl font-light text-black">/</motion.span>
                  </div>

                  {/* Column 2 */}
                  <div className="flex flex-col items-center gap-y-12 md:items-start">
                    <motion.div variants={menuItemVariants} custom={1}>
                      <MenuLink to="/about-trekuartista" label="ABOUT US" num="03" onNavigate={closeMenu} />
                    </motion.div>
                    <motion.div variants={menuItemVariants} custom={3}>
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