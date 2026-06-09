"use client";

import Image from "next/image";
import { useState } from "react";
import {
  setAdminAuthed,
  validateAdminLogin,
} from "@/lib/admin/client-auth";

type AdminLoginProps = {
  onSuccess: () => void;
};

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsernameError(null);
    setPasswordError(null);
    setFormError(null);
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 450));

    const result = validateAdminLogin(username, password);

    if (!result.ok) {
      if (result.field === "username") setUsernameError(result.message);
      else if (result.field === "password") setPasswordError(result.message);
      else setFormError(result.message);
      setIsSubmitting(false);
      return;
    }

    setAdminAuthed();
    onSuccess();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c1f1d] px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Image
            src="/assets/logo/trekuartistaLogoFooter.png"
            alt="Trekuartista"
            width={160}
            height={48}
            className="h-10 w-auto object-contain brightness-0 invert"
            priority
          />
        </div>

        <div className="rounded-2xl border border-teal-800/50 bg-[#0f2825] p-8 shadow-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-teal-400/80">
            Admin access
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Sign in</h1>
          <p className="mt-2 text-sm text-teal-100/50">
            Enter your credentials to manage projects and team.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="admin-username"
                className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-teal-100/60"
              >
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(null);
                  setFormError(null);
                }}
                disabled={isSubmitting}
                className={`w-full rounded-xl border bg-[#0c1f1d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-teal-100/25 focus:border-teal-500 disabled:opacity-60 ${
                  usernameError
                    ? "border-red-400/70"
                    : "border-teal-800/60"
                }`}
                placeholder="Username"
              />
              {usernameError ? (
                <p className="mt-2 text-xs text-red-400">{usernameError}</p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-teal-100/60"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null);
                  setFormError(null);
                }}
                disabled={isSubmitting}
                className={`w-full rounded-xl border bg-[#0c1f1d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-teal-100/25 focus:border-teal-500 disabled:opacity-60 ${
                  passwordError
                    ? "border-red-400/70"
                    : "border-teal-800/60"
                }`}
                placeholder="Password"
              />
              {passwordError ? (
                <p className="mt-2 text-xs text-red-400">{passwordError}</p>
              ) : null}
            </div>

            {formError ? (
              <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
