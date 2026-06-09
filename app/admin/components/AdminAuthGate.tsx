"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/app/COMPONENTS/ui/LoadingSpinner";
import { isAdminAuthed } from "@/lib/admin/client-auth";
import AdminLogin from "./AdminLogin";

type AuthStatus = "loading" | "guest" | "authed";

export default function AdminAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    setStatus(isAdminAuthed() ? "authed" : "guest");
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c1f1d]">
        <LoadingSpinner label="Loading admin" />
      </div>
    );
  }

  if (status === "guest") {
    return <AdminLogin onSuccess={() => setStatus("authed")} />;
  }

  return <>{children}</>;
}
