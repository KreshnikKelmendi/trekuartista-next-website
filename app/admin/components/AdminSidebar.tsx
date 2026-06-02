"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(100%,280px)] flex-col border-r border-teal-900/30 bg-[#0c1f1d] text-white shadow-2xl transition-transform duration-300 ease-out lg:static lg:z-0 lg:w-72 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-teal-800/40 px-5 py-6">
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
            className="rounded-lg p-2 text-teal-100/70 hover:bg-teal-800/30 lg:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                    : "text-teal-100/60 hover:bg-teal-900/40 hover:text-white"
                }`}
              >
                <span className="text-base opacity-80">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-teal-800/40 p-4">
          <Link
            href="/"
            className="flex items-center justify-center rounded-xl border border-teal-700/50 px-4 py-2.5 text-sm text-teal-100/70 transition hover:border-teal-500/50 hover:text-white"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}
