import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Apple 9 — Find Your Path to Global Education",
    template: "%s | Apple 9",
  },
  description:
    "Apple 9 helps high school graduates find the right college worldwide, navigate visa applications, and book flights — all in one platform.",
  keywords: [
    "college admissions",
    "study abroad",
    "international students",
    "university applications",
    "student visa",
    "scholarships",
  ],
  openGraph: {
    title: "Apple 9 — Find Your Path to Global Education",
    description:
      "Discover colleges worldwide, apply with expert guidance, handle visas, and book flights — Apple 9 is your all-in-one education abroad platform.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-page antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
