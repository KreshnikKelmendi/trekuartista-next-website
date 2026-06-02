import type { ReactNode } from "react";
import Header from "../COMPONENTS/Header/Header";
import Footer from "../COMPONENTS/footer/Footer";

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
