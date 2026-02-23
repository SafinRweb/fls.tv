"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLoading } from "@/components/layout/LoadingProvider";
import clsx from "clsx";

const NAV_LINKS = [
    { href: "/matches", label: "Matches" },
    { href: "/leagues", label: "Leagues" },
    { href: "/standings", label: "Standings" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [prevPathname, setPrevPathname] = useState(pathname);
    const { isPageLoaded } = useLoading();

    const isHome = pathname === "/";

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Simulate loading shimmer on route change
    useEffect(() => {
        if (pathname !== prevPathname) {
            setIsNavigating(true);
            setPrevPathname(pathname);
            const timer = setTimeout(() => setIsNavigating(false), 800);
            return () => clearTimeout(timer);
        }
    }, [pathname, prevPathname]);

    return (
        <>
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={isPageLoaded ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={clsx(
                    "top-0 z-50 pt-4 px-4 sm:px-6 lg:px-8",
                    isHome ? "fixed inset-x-0" : "sticky w-full"
                )}
            >
                <div className="max-w-[1440px] mx-auto">
                    <div className={clsx(
                        "rounded-full h-16 flex items-center justify-between px-6 lg:px-10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative overflow-hidden",
                        isHome ? "bg-white/5 backdrop-blur-lg border border-white/10" : "glass"
                    )}>

                        {/* Shimmer Effect */}
                        <AnimatePresence>
                            {isNavigating && (
                                <motion.div
                                    initial={{ x: "-100%", opacity: 0 }}
                                    animate={{ x: "200%", opacity: 0.15 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-20deg]"
                                />
                            )}
                        </AnimatePresence>

                        {/* Left: Logo */}
                        <Link href="/" className="flex flex-row items-baseline group">
                            <span className="text-2xl font-display font-bold text-white tracking-tight">fls</span>
                            <span className="text-2xl font-display font-bold text-accent transition-all duration-300 group-hover:text-white drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]">.tv</span>
                        </Link>

                        {/* Center: Nav Pills */}
                        <nav className="hidden md:flex items-center space-x-1 bg-white/5 rounded-full p-1 border border-white/10">
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={clsx(
                                            "relative px-5 py-2 text-sm font-medium transition-colors rounded-full uppercase tracking-wider",
                                            isActive ? "text-white" : "text-soft hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-white/10 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right: Search + Mobile Menu Toggle */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-soft hover:text-white transition-colors hover:bg-white/5 rounded-full"
                                aria-label="Search matches"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 text-soft hover:text-white transition-colors hover:bg-white/5 rounded-full"
                                aria-label="Toggle Navigation Menu"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.nav
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden mt-2 overflow-hidden glass rounded-3xl"
                            >
                                <div className="p-4 flex flex-col space-y-2">
                                    {NAV_LINKS.map((link) => {
                                        const isActive = pathname.startsWith(link.href);
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={clsx(
                                                    "px-6 py-4 rounded-xl text-center font-display font-black tracking-widest uppercase transition-colors text-lg",
                                                    isActive ? "bg-accent/10 text-accent border border-accent/20" : "text-white hover:bg-white/5"
                                                )}
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.nav>
                        )}
                    </AnimatePresence>
                </div>
            </motion.header>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4 backdrop-blur-xl bg-base/80"
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -20, opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl bg-layer border border-white/10 rounded-3xl p-6 shadow-neon-strong"
                        >
                            <div className="flex items-center border-b border-white/10 pb-4">
                                <Search className="w-6 h-6 text-accent mr-3" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search matches, teams, or leagues..."
                                    className="w-full bg-transparent text-xl font-display text-white placeholder:text-soft focus:outline-none"
                                />
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className="text-soft hover:text-white px-3 py-1 bg-white/5 rounded-full text-xs uppercase tracking-widest font-bold"
                                >
                                    Esc
                                </button>
                            </div>
                            <div className="pt-6 min-h-[200px] flex items-center justify-center text-soft">
                                <p>Start typing to search live and upcoming matches</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
