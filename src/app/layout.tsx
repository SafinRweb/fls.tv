import type { Metadata } from "next";
import { Inter, Outfit, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "fls.tv | Live Football. Redefined.",
  description: "Premium live football streaming platform with real-time updates and cinematic experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${oswald.variable}`}>
      <body className="relative min-h-screen flex flex-col font-sans selection:bg-accent selection:text-base">
        {/* Global Background Elements */}
        <div className="bg-grid-overlay" />
        <div className="bg-radial-glow" />

        {/* Content wrapper */}
        <div className="flex-grow flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
