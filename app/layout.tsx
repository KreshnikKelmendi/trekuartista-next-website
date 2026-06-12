import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Trekuartista | Creative Advertising Agency",
    template: "%s | Trekuartista",
  },
  description:
    "Trekuartista is a creative advertising agency in Prishtinë, Kosovo — branding, campaigns, design, and digital experiences for brands built differently.",
  icons: {
    icon: "/assets/logo/whiteLogoTreku.png",
    shortcut: "/assets/logo/whiteLogoTreku.png",
    apple: "/assets/logo/whiteLogoTreku.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
