"use client";

export default function ScrollToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3110EE] text-white transition hover:border-white hover:bg-white/10 md:h-12 md:w-12 cursor-pointer"
      aria-label="Scroll to top"
    >
      <svg className="h-3.5 w-3.5 md:h-[18px] md:w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 19V5M12 5L6 11M12 5L18 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
