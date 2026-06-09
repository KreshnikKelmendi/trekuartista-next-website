"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import SpinningTreMark from "./SpinningTreMark";

const SHOWREEL_MOBILE_URL =
  "https://res.cloudinary.com/dmzjjud3z/video/upload/v1779716236/showreel-2_q1vynk.mp4";

const SHOWREEL_DESKTOP_URL =
  "https://res.cloudinary.com/dmzjjud3z/video/upload/v1779716841/showreel-1_mxq4af.mp4";

const MOBILE_MEDIA = "(max-width: 1023px)";

const pagePx = "px-4 lg:px-[55px]";

const SPRING = {
  // Snappier transition (less “too smooth” feel)
  stiffness: 90,
  damping: 22,
  mass: 0.25,
  restDelta: 0.0006,
};

function MuteButton({
  isMuted,
  onClick,
  className = "",
}: {
  isMuted: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border border-white/15 bg-black/45 p-1.5 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/65 ${className}`}
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      )}
    </button>
  );
}

const VideoAnimation = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRefMobile = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const videoSrc = isMobile ? SHOWREEL_MOBILE_URL : SHOWREEL_DESKTOP_URL;

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

  useEffect(() => {
    const desktopVideo = videoRef.current;
    const mobileVideo = videoRefMobile.current;
    const active = isMobile ? mobileVideo : desktopVideo;
    const inactive = isMobile ? desktopVideo : mobileVideo;

    if (inactive) {
      inactive.pause();
      inactive.muted = true;
    }

    if (!active) return;

    setIsLoading(true);

    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);

    active.muted = true;
    active.playsInline = true;
    active.src = videoSrc;
    active.load();
    active.addEventListener("canplay", handleCanPlay);
    active.addEventListener("waiting", handleWaiting);
    active.addEventListener("playing", handlePlaying);
    void active.play().catch(() => undefined);

    return () => {
      active.removeEventListener("canplay", handleCanPlay);
      active.removeEventListener("waiting", handleWaiting);
      active.removeEventListener("playing", handlePlaying);
    };
  }, [videoSrc, isMobile]);

  useEffect(() => {
    const desktopVideo = videoRef.current;
    const mobileVideo = videoRefMobile.current;
    const active = isMobile ? mobileVideo : desktopVideo;
    const inactive = isMobile ? desktopVideo : mobileVideo;

    if (inactive) {
      inactive.pause();
      inactive.muted = true;
    }

    if (active) {
      active.muted = isMuted;
    }
  }, [isMuted, isMobile]);

  const { scrollYProgress } = useScroll({
    target: isMounted ? sectionRef : undefined,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING);

  /** 0 → split layout, 1 → full padded cinema frame */
  const expand = useTransform(smoothProgress, [0, 0.66], [0, 1]);

  // Hide text quickly so only the video is visible during the “expand” moment
  const headlineOpacity = useTransform(expand, [0, 0.12], [1, 0]);
  const headlineY = useTransform(expand, [0, 0.12], [0, -10]);
  const headlineScale = useTransform(expand, [0, 0.12], [1, 0.98]);
  const headlineMaxHeight = useTransform(expand, [0, 0.16], [200, 0]);
  const headlineMarginBottom = useTransform(expand, [0, 0.16], [20, 0]);

  const logoOpacity = useTransform(expand, [0, 0.15], [1, 0]);
  const logoX = useTransform(expand, [0, 0.15], [0, -32]);
  const logoScale = useTransform(expand, [0, 0.15], [1, 0.95]);

  /* Video frame inside lg:px-[55px] container — never bleeds past gutters */
  const videoLeft = useTransform(expand, [0, 1], ["40%", "0%"]);
  const videoWidth = useTransform(expand, [0, 1], ["60%", "100%"]);
  const videoTop = useTransform(expand, [0, 1], ["6%", "0%"]);
  const videoHeight = useTransform(expand, [0, 1], ["82%", "100%"]);
  const videoRadius = useTransform(expand, [0, 1], [14, 0]);


  const toggleMute = () => {
    const nextMuted = !isMuted;
    const active = isMobile ? videoRefMobile.current : videoRef.current;
    const inactive = isMobile ? videoRef.current : videoRefMobile.current;

    if (active) active.muted = nextMuted;
    if (inactive) {
      inactive.muted = true;
      inactive.pause();
    }
    setIsMuted(nextMuted);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent lg:h-[300vh]"
      aria-label="Showreel"
    >
      <div
        className={`flex flex-col justify-center pb-0 pt-6 lg:min-h-0 lg:justify-start lg:pb-0 lg:pt-0 lg:sticky lg:top-0 lg:h-screen ${pagePx}`}
      >
        {/* Desktop — headline fades on scroll expand */}
        <motion.header
          style={{
            opacity: headlineOpacity,
            y: headlineY,
            scale: headlineScale,
            maxHeight: headlineMaxHeight,
            marginBottom: headlineMarginBottom,
          }}
          className="relative z-30 hidden shrink-0 pt-10 will-change-transform lg:block"
        >
          <p className="text-[11px] font-roboto uppercase  text-black/50">
            Creative &amp; strategy studio — Prishtina
          </p>
          <h1 className="mt-3 max-w-[14ch] font-sfts text-[clamp(2.35rem,8.5vw,5.25rem)] uppercase leading-[0.92] tracking-[-0.02em] text-black">
            Brands.
            <br />
            Built differently.
          </h1>
        </motion.header>

        {/* Desktop */}
        <div className="relative hidden min-h-0 flex-1 lg:block">
          <div className="absolute inset-y-0 left-0 z-10 flex items-center">
            <SpinningTreMark
              opacity={logoOpacity}
              x={logoX}
              scale={logoScale}
              className="pointer-events-none relative z-10 h-[130px] w-[130px] shrink-0 will-change-transform lg:h-[180px] lg:w-[180px]"
            />
          </div>

          <motion.div
            className="absolute z-20 overflow-hidden will-change-[left,width,height,top]"
            style={{
              left: videoLeft,
              width: videoWidth,
              top: videoTop,
              height: videoHeight,
              borderRadius: videoRadius,
        
            }}
          >
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/55 backdrop-blur-sm">
                <div className="mb-4 h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/80">
                  Loading
                </p>
              </div>
            )}

            <video
              key={videoSrc}
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />

            <MuteButton
              isMuted={isMuted}
              onClick={toggleMute}
              className="absolute bottom-5 left-5 z-30"
            />
          </motion.div>

          {/* Scroll hint removed (video-first) */}
        </div>

        {/* Mobile — full-width video, no scroll expand */}
        <div className="relative min-h-0 flex-1 lg:hidden">
          <div className="relative h-[60vh] w-full overflow-hidden rounded-xl">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}

            <video
              key={`${videoSrc}-mobile`}
              ref={videoRefMobile}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />

            <MuteButton
              isMuted={isMuted}
              onClick={toggleMute}
              className="absolute bottom-4 left-4 z-30"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoAnimation;
