import type { Metadata } from "next";
import { Inter, Outfit, Oswald } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
  title: "fls.tv | Live Football In Home.",
  description: "Premium live football streaming platform with zero lag and cinematic experience.",
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

        {/* Adsterra Popunder */}
        <Script 
          src="https://pl29757567.effectivecpmnetwork.com/a9/1b/97/a91b9725da5d701ed1e28dbdeedac1a2.js"
          strategy="afterInteractive"
        />
        {/* Adsterra Social Bar */}
        <Script 
          src="https://pl29757570.effectivecpmnetwork.com/36/2a/1d/362a1db63ab722b8c2e62906a1b253b4.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
