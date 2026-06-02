'use client';

import React, { useRef, useEffect, useState } from "react";

/** Cloudinary showreels — mobile vs desktop */
const SHOWREEL_MOBILE_URL =
  "https://res.cloudinary.com/dmzjjud3z/video/upload/v1779716236/showreel-2_q1vynk.mp4";

const SHOWREEL_DESKTOP_URL =
  "https://res.cloudinary.com/dmzjjud3z/video/upload/v1779716841/showreel-1_mxq4af.mp4";

const MOBILE_MEDIA = "(max-width: 1023px)";

const VideoAnimation = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const videoSrc = isMobile ? SHOWREEL_MOBILE_URL : SHOWREEL_DESKTOP_URL;

  // Track window media queries safely inside the browser environment
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    video.muted = true;
    video.playsInline = true;
    video.src = videoSrc;
    video.load();

    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        console.log("Autoplay prevented:", err);
      }
    };

    playVideo();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, [videoSrc]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  return (
    <div className="relative h-[60vh] w-full overflow-hidden rounded-[10px] px-4 pt-6 lg:h-screen lg:px-[55px]">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center lg:px-[55px]">
          <div className="mb-6 h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent lg:h-16 lg:w-16" />
          <div className="text-center text-black">
            <p className="font-custom text-xs font-bold lg:text-sm">
              loading...
            </p>
          </div>
        </div>
      )}

      {/* The key={videoSrc} attribute forces a clean re-render when switching between desktop and mobile links */}
      <video
        key={videoSrc}
        ref={videoRef}
        className="h-full w-full rounded-[8px] object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      <button
        type="button"
        onClick={toggleMute}
        className="absolute bottom-2 left-6 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 lg:bottom-4 lg:left-[60px]"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg
            className="h-4 w-4 lg:h-6 lg:w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          <svg
            className="h-4 w-4 lg:h-6 lg:w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default VideoAnimation;