"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Modal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-sm border border-black bg-white p-8 text-center">
        <p className="font-custom uppercase tracking-tight text-black">
          Message received. Thank you for reaching out!
        </p>
      </div>
    </div>
  );
}

function FormField({
  name,
  label,
  type = "text",
  required,
  multiline,
  resetKey,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  resetKey: number;
}) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = inputRef.current;
    if (el) el.value = "";
    setActive(false);
  }, [resetKey]);

  const updateActive = () => {
    const el = inputRef.current;
    setActive(
      document.activeElement === el || Boolean(el?.value && el.value.length > 0)
    );
  };

  const fieldClass =
    "w-full rounded-none border-b bg-transparent py-4 text-[15px] font-normal normal-case tracking-normal text-black caret-black transition-colors duration-300 placeholder:text-transparent focus:outline-none";

  const borderClass = active
    ? "border-black"
    : "border-black/20 hover:border-black/40";

  return (
    <div className="relative pt-5">
      <label
        htmlFor={name}
        className={`pointer-events-none absolute left-0 transition-all duration-200 ${
          active
            ? "top-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50"
            : "top-7 text-[13px] font-medium uppercase tracking-[0.12em] text-black/35"
        }`}
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          id={name}
          name={name}
          required={required}
          rows={4}
          className={`${fieldClass} ${borderClass} min-h-[100px] resize-none`}
          onFocus={updateActive}
          onBlur={updateActive}
          onChange={updateActive}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          id={name}
          name={name}
          type={type}
          required={required}
          className={`${fieldClass} ${borderClass}`}
          onFocus={updateActive}
          onBlur={updateActive}
          onChange={updateActive}
        />
      )}
    </div>
  );
}

export default function ContactForm() {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          company: formData.get("company"),
          role: formData.get("role"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to send message.");
      }

      form.reset();
      setResetKey((k) => k + 1);
      setIsSent(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send message.";
      setError(message);
      console.error("Submission failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const formFieldsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="px-5 py-12 text-black lg:px-[55px]">
      <div className="mb-10 lg:mb-20">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em]">
          / Contact
        </span>
      </div>

      <div className="flex flex-col justify-between gap-16 lg:flex-row lg:gap-24">
        <div className="mx-auto w-full text-center lg:mx-0 lg:w-[40%] lg:text-left">
          <h1 className="font-custom text-5xl leading-[0.9] tracking-tighter md:text-7xl lg:text-8xl">
            GET IN TOUCH
          </h1>
          <p className="mt-4 text-[15px] font-medium text-zinc-800 lg:max-w-[320px]">
            We&apos;re here to help you with your next project.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="w-full lg:w-[50%]"
        >
          <form onSubmit={handleSubmit} className="flex flex-col space-y-1">
            <motion.div variants={formFieldsVariants}>
              <FormField
                name="fullName"
                label="Your Name"
                required
                resetKey={resetKey}
              />
            </motion.div>

            <motion.div variants={formFieldsVariants}>
              <FormField
                name="company"
                label="Company Name"
                resetKey={resetKey}
              />
            </motion.div>

            <motion.div variants={formFieldsVariants}>
              <FormField name="role" label="Your Role" resetKey={resetKey} />
            </motion.div>

            <motion.div variants={formFieldsVariants}>
              <FormField
                name="phone"
                label="Phone Number"
                type="tel"
                resetKey={resetKey}
              />
            </motion.div>

            <motion.div variants={formFieldsVariants}>
              <FormField
                name="email"
                label="Email Address"
                type="email"
                required
                resetKey={resetKey}
              />
            </motion.div>

            <motion.div variants={formFieldsVariants} className="pt-2">
              <FormField
                name="message"
                label="Tell us how we can help"
                required
                multiline
                resetKey={resetKey}
              />
            </motion.div>

            <motion.div variants={formFieldsVariants} className="pt-10">
              {error ? (
                <p className="mb-4 text-[12px] tracking-wide text-red-600">
                  {error}
                </p>
              ) : null}
              <button
                className="h-[55px] w-[180px] rounded-[8px] border border-zinc-400 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:bg-black hover:text-white disabled:opacity-50"
                type="submit"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Submit"}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {isSent ? <Modal onClose={() => setIsSent(false)} /> : null}
    </div>
  );
}
