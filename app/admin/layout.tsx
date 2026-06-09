import type { Metadata } from "next";
import AdminAuthGate from "./components/AdminAuthGate";
import AdminShell from "./components/AdminShell";

export const metadata: Metadata = {
  title: "Admin | Trekuartista",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGate>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGate>
  );
}
