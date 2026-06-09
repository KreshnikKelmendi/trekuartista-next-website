"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-black/20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between py-6 text-left"
      >
        <span className="font-custom text-[15px] tracking-tight text-black md:text-[17px] lg:text-[24px]">
          {question}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="ml-4"
        >
          <svg
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M13.1421 0.5H1.14209L13.1421 13.5V0.5Z"
              fill="black"
              stroke="black"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 pr-12 font-custom text-[14px] leading-tight text-zinc-500 md:text-[15px] lg:w-3/4 lg:text-[24px]">
              {answer}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const faqData = [
    {
      question: "What makes your approach different?",
      answer:
        "We see every project as both a challenge and a canvas. Instead of applying one-size-fits-all solutions, we combine strategy with artistic thinking to create work that feels original, meaningful, and effective.",
    },
    {
      question: "What kind of clients do you work with?",
      answer:
        "We collaborate with brands of all sizes—from startups finding their voice to established companies looking to reinvent themselves. What matters most is a shared ambition to create something impactful.",
    },
    {
      question: "How long does a project usually take?",
      answer:
        "Timelines vary depending on the scope and complexity of the project. After our initial discussions, we provide a clear roadmap with milestones so you know exactly what to expect.",
    },
    {
      question: "How involved will I be in the process?",
      answer:
        "As involved as you'd like to be. We believe the best results come from collaboration, so we keep communication open and involve you at key stages along the way.",
    },
    {
      question: "Do you focus more on creativity or results?",
      answer:
        "We don't separate the two. Creativity is how we achieve results. Every idea we develop is designed not just to look good, but to perform and make a real impact.",
    },
    {
      question: "Do you follow trends or create them?",
      answer:
        "We stay aware of trends, but we don't chase them. Instead, we focus on building ideas that feel timeless and true to your brand—work that stands out today and still feels relevant tomorrow.",
    },
    {
      question: "Can you work with our existing brand?",
      answer:
        "Absolutely. Whether you need a full rebrand or just a fresh perspective, we can build on what you already have and elevate it to the next level.",
    },
  ];

  return (
    <section className="px-5 pt-12 pb-32 lg:px-[55px]">
      <div className="max-w-full">
        <h2 className="text-center font-custom text-[40px] tracking-tight text-black md:text-[60px] lg:text-left lg:text-[67px]">
          FAQs
        </h2>
        <div className="mt-8 flex flex-col lg:mt-16">
          {faqData.map((item) => (
            <FAQItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
