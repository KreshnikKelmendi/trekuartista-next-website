"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

const pageLabels: Record<string, string> = {
  "/admin/projects": "Projects",
  "/admin/team": "Team",
};

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const pageLabel =
    Object.entries(pageLabels).find(([path]) => pathname.startsWith(path))?.[1] ??
    "Dashboard";

  return (
    <div className="flex min-h-screen bg-[#f0f4f3]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-teal-900/10 bg-[#f0f4f3]/90 px-4 py-4 backdrop-blur-md lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-teal-900/15 bg-white px-3 py-2 text-sm font-medium text-stone-800 shadow-sm lg:hidden"
          >
            Menu
          </button>
          <p className="hidden text-sm font-medium text-stone-500 lg:block">
            Trekuartista Admin
          </p>
          <span className="rounded-full bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-700">
            {pageLabel}
          </span>
        </header>

        <main className="flex-1 p-4 lg:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}
