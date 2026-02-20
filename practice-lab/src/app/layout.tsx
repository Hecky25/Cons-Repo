import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Practice Lab — Sports Drills for Every Coach",
  description: "Find the perfect drill for any sport, age group, and skill level. Practice Lab gives coaches instant access to a library of structured, ready-to-run drills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased bg-white text-gray-900`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
