"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLoading } from "@/components/layout/LoadingProvider";
import clsx from "clsx";

export function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const { isPageLoaded } = useLoading();
    return (
        <motion.header
            initial={{ y: -30, opacity: 0 }}
            animate={isPageLoaded ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={clsx("top-0 z-50 pt-4 px-4 sm:px-6 lg:px-8", isHome ? "fixed inset-x-0" : "sticky w-full")}
        >
            <div className="max-w-[1440px] mx-auto">
                <div className={clsx("rounded-full h-16 flex items-center justify-between px-6 lg:px-10", isHome ? "bg-white/5 backdrop-blur-lg border border-white/10" : "glass")}>
                    <Link href="/" aria-label="fls.tv home" className="flex items-baseline group">
                        <span className="text-2xl font-display font-bold text-white tracking-tight">fls</span>
                        <span className="text-2xl font-display font-bold text-accent group-hover:text-white transition-colors">.tv</span>
                    </Link>
                    <Link href="/matches" aria-label="Browse football matches" title="Matches" className={clsx("flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent", pathname === "/matches" ? "border-accent/40 bg-accent/10 text-accent" : "border-white/10 text-soft hover:text-accent hover:border-accent/40")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" />
                            <path d="m12 7.5 4.3 3.1-1.6 5.1H9.3l-1.6-5.1L12 7.5ZM12 3v4.5m8.6 1.7-4.3 1.4m1 8.7-2.6-3.6m-8 3.6 2.6-3.6M3.4 9.2l4.3 1.4" />
                        </svg>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
