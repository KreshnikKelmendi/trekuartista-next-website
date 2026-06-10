"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const WIPE_DURATION = 0.72;
const CONTENT_DURATION = 0.55;

const ease = [0.65, 0, 0.35, 1] as const;

type Phase = "idle" | "cover" | "reveal" | "enter";

function WipeOverlay({
  phase,
  onComplete,
}: {
  phase: "cover" | "reveal";
  onComplete: () => void;
}) {
  const isCover = phase === "cover";

  return (
    <motion.div
      className="pointer-events-auto fixed inset-0 z-200 h-screen w-screen bg-black"
      aria-hidden
      initial={{ x: isCover ? "-100%" : "0%" }}
      animate={{ x: isCover ? "0%" : "100%" }}
      transition={{ duration: WIPE_DURATION, ease }}
      onAnimationComplete={onComplete}
    />
  );
}

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const pendingChildren = useRef(children);
  const isFirstLoad = useRef(true);
  const prevPathname = useRef(pathname);

  const [renderedChildren, setRenderedChildren] = useState(children);
  const [phase, setPhase] = useState<Phase>("idle");

  const isTransitioning = phase !== "idle" && phase !== "enter";
  const showContent = phase === "idle" || phase === "enter";

  pendingChildren.current = children;

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      prevPathname.current = pathname;
      setRenderedChildren(children);
      return;
    }

    if (pathname === prevPathname.current || phase !== "idle") {
      return;
    }

    prevPathname.current = pathname;
    setPhase("cover");
  }, [pathname, phase, children]);

  useEffect(() => {
    if (phase === "cover" || phase === "reveal") {
      window.scrollTo(0, 0);
    }
  }, [phase]);

  const handleCoverComplete = useCallback(() => {
    setRenderedChildren(pendingChildren.current);
    setPhase("reveal");
  }, []);

  const handleRevealComplete = useCallback(() => {
    setPhase("enter");
  }, []);

  const handleContentEnterComplete = useCallback(() => {
    setPhase("idle");
  }, []);

  if (reduceMotion) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <>
      <motion.div
        className="flex-1"
        initial={false}
        animate={{
          opacity: showContent ? 1 : 0,
          y: showContent ? 0 : 20,
        }}
        transition={{
          duration: phase === "enter" ? CONTENT_DURATION : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        onAnimationComplete={
          phase === "enter" ? handleContentEnterComplete : undefined
        }
        aria-hidden={isTransitioning}
      >
        {renderedChildren}
      </motion.div>

      <AnimatePresence>
        {phase === "cover" && (
          <WipeOverlay key="cover" phase="cover" onComplete={handleCoverComplete} />
        )}
        {phase === "reveal" && (
          <WipeOverlay key="reveal" phase="reveal" onComplete={handleRevealComplete} />
        )}
      </AnimatePresence>
    </>
  );
}
