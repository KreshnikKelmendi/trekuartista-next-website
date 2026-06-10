import type { ReactNode } from "react";
import Header from "../COMPONENTS/Header/Header";
import Footer from "../COMPONENTS/footer/Footer";
import PageTransition from "../COMPONENTS/ui/PageTransition";

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </>
  );
}
