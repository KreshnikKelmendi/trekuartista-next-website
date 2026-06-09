"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminAuth } from "@/lib/admin/client-auth";

const nav = [
  { href: "/admin/projects", label: "Projects", icon: "◆" },
  { href: "/admin/team", label: "Team", icon: "◎" },
];

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAdminAuth();
    onClose();
    router.refresh();
    window.location.href = "/admin/projects";
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[min(100%,280px)] shrink-0 flex-col border-r border-white/10 bg-black text-white transition-transform duration-300 ease-out lg:relative lg:z-auto lg:w-72 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-6">
          <Link href="/admin/projects" className="flex items-center gap-3" onClick={onClose}>
            <Image
              src="/assets/logo/trekuartistaLogoFooter.png"
              alt="Trekuartista"
              width={140}
              height={40}
              className="h-9 w-auto object-contain brightness-0 invert"
              priority
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-black"
                    : "text-white/55 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base opacity-80">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto shrink-0 space-y-2 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/60 transition hover:border-red-400/50 hover:text-red-300"
          >
            Sign out
          </button>
          <Link
            href="/"
            className="flex items-center justify-center rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/60 transition hover:border-white/30 hover:text-white"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}
