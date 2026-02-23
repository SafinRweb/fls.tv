"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLoading } from "@/components/layout/LoadingProvider";

export function Hero() {
    const { isPageLoaded } = useLoading();
    return (
        <section className="relative min-h-[450px] md:min-h-[550px] flex items-center justify-center overflow-hidden pb-16 pt-24 md:pb-20 md:pt-28">

            {/* Subtle glow specifically for the hero content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isPageLoaded ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-x-0 top-0 h-[80vh] bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.15)_0%,transparent_70%)] z-0 pointer-events-none"
            />

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={isPageLoaded ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black leading-[0.9] tracking-tight uppercase"
                >
                    <span className="text-white drop-shadow-neon">Live</span> <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-soft">Football.</span><br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600 drop-shadow-neon-strong">
                        Redefined.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={isPageLoaded ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mt-8 text-lg md:text-xl text-soft max-w-2xl text-balance"
                >
                    The most completely immersive sports broadcast experience. Real-time stats, cinematic streams, and no delay.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={isPageLoaded ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="mt-10 mb-5"
                >
                    <Link
                        href="/matches"
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-base bg-white rounded-full transition-all duration-300 hover:scale-105 hover:bg-accent hover:shadow-neon"
                    >
                        Explore Matches
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
