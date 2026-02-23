"use client";

import { useState } from "react";
import type { Match } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Activity, Server, Globe2, ChevronLeft, MapPin } from "lucide-react";
import clsx from "clsx";

interface StreamClientProps {
    match: Match;
    servers: {
        id: string;
        name: string;
        url: string;
        quality: string;
        latency: string;
        region: string;
    }[];
}

export function StreamClient({ match, servers }: StreamClientProps) {
    const [activeServer, setActiveServer] = useState(servers[0]);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    // Use the match poster from the API, or a fallback
    const bgImage = match.poster || `https://images.unsplash.com/photo-1518605389456-02e07120fc6c?w=1920&q=80&auto=format&fit=crop&sig=${match.id}`;

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-base text-white selection:bg-accent selection:text-base">

            {/* Background layer */}
            <div
                className="absolute inset-0 bg-contain md:bg-cover bg-no-repeat bg-center transition-transform duration-1000 scale-105"
                style={{ backgroundImage: `url(${bgImage})` }}
            />
            <div className="absolute inset-0 bg-base/80 backdrop-blur-md" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-base to-transparent" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-base to-transparent" />

            {/* Top Bar: Nav Back, League, Team Names, Live Indicator */}
            <header className="absolute top-0 inset-x-0 p-6 lg:p-10 flex items-center justify-between z-20">
                <div className="flex items-center space-x-6">
                    <a
                        href="/"
                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:-translate-x-1 transition-all backdrop-blur cursor-pointer"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </a>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase tracking-widest text-accent">
                            {match.leagueName}
                        </span>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold flex flex-col sm:flex-row sm:items-center sm:space-x-3 mt-1 sm:mt-0">
                            <span className="truncate max-w-[200px] sm:max-w-none">{match.homeTeam.shortName || match.homeTeam.name}</span>
                            <span className="hidden sm:inline text-white/30 text-lg">vs</span>
                            <span className="truncate max-w-[200px] sm:max-w-none">{match.awayTeam.shortName || match.awayTeam.name}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {match.stadium && (
                        <div className="hidden sm:flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur">
                            <MapPin className="w-3.5 h-3.5 text-accent/70" />
                            <span className="text-sm text-soft uppercase tracking-wider font-medium">
                                {match.stadium}
                            </span>
                        </div>
                    )}

                    {match.status === "live" && (
                        <div className="flex items-center space-x-3 bg-live/10 border border-live/20 px-4 py-2 rounded-full backdrop-blur">
                            <span className="w-3 h-3 rounded-full bg-live animate-pulse shadow-[0_0_10px_rgba(255,43,43,0.8)]" />
                            <span className="font-bold tracking-widest uppercase text-live text-sm drop-shadow-[0_0_8px_rgba(255,43,43,0.8)]">
                                Live Broadcast
                            </span>
                        </div>
                    )}
                </div>
            </header>

            {/* Center Layout Container */}
            <main className="absolute inset-0 flex flex-col md:flex-row items-center justify-center px-6 lg:px-20 pt-20 pb-24 z-10">

                {/* Left/Center: Huge Transparent Score */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    {match.status === "live" && match.homeScore !== undefined ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, type: "spring" }}
                            className="flex items-center space-x-8 md:space-x-16"
                        >
                            <span className="text-[120px] md:text-[200px] lg:text-[250px] font-score leading-none tracking-tighter text-white/30 mix-blend-overlay font-bold">
                                {match.homeScore}
                            </span>
                            <span className="text-8xl md:text-[120px] font-score text-accent/30 mix-blend-overlay font-black">:</span>
                            <span className="text-[120px] md:text-[200px] lg:text-[250px] font-score leading-none tracking-tighter text-white/30 mix-blend-overlay font-bold">
                                {match.awayScore}
                            </span>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-black tracking-tight text-white/50 uppercase text-balance">
                                Match Starts Soon
                            </h2>
                        </motion.div>
                    )}
                </div>

                {/* Right side: Servers */}
                <div className="w-full md:w-80 lg:w-96 flex flex-col space-y-4 md:ml-12 mt-12 md:mt-0">
                    <div className={clsx("flex items-center space-x-2 text-white/50 uppercase tracking-widest text-xs font-bold mb-2", servers.length === 0 ? "hidden sm:flex" : "flex")}>
                        <Server className="w-4 h-4" />
                        <span>Available Streams</span>
                    </div>

                    {servers.length > 0 ? servers.map((server, idx) => (
                        <button
                            key={server.id || idx}
                            onClick={() => setActiveServer(server)}
                            className={clsx(
                                "w-full text-left p-4 rounded-xl border backdrop-blur-md transition-all duration-300 group flex items-center justify-between",
                                activeServer?.id === server.id
                                    ? "bg-accent/10 border-accent shadow-neon"
                                    : "bg-layer/40 border-white/10 hover:border-white/30 hover:bg-layer/60"
                            )}
                        >
                            <div className="flex flex-col">
                                <span className={clsx(
                                    "font-bold font-display text-lg",
                                    activeServer?.id === server.id ? "text-accent" : "text-white"
                                )}>{server.name}</span>
                                <span className="text-xs text-soft mt-1 flex items-center">
                                    <Globe2 className="w-3 h-3 mr-1" /> {server.region}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-white">
                                    {server.quality}
                                </span>
                                <span className={clsx(
                                    "text-[10px] mt-2 font-bold uppercase tracking-widest",
                                    server.latency === "low" ? "text-green-400" : "text-yellow-400"
                                )}>
                                    {server.latency} latency
                                </span>
                            </div>
                        </button>
                    )) : (
                        <div className="hidden sm:block w-full p-6 rounded-xl border border-white/5 bg-layer/20 backdrop-blur-md text-center">
                            <p className="text-soft text-sm uppercase tracking-widest font-bold">No streams available yet</p>
                            <p className="text-white/30 text-xs mt-2">Streams become available when the match goes live.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Bottom Footer Area (Absolute) */}
            <footer className="absolute bottom-0 inset-x-0 p-6 lg:p-10 flex items-end justify-between z-10 w-full">

                {/* Bottom Left: Demo Metric Text (Hidden on mobile to prevent overlap) */}
                <div className="hidden sm:flex flex-col space-y-2 opacity-60 font-mono text-xs text-accent" suppressHydrationWarning>
                    <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span>Receiving data stream...</span>
                    </div>
                    <span>SERVER_REGION: {activeServer?.region?.toUpperCase() || "EU-WEST"}</span>
                    <span>LATENCY: 24ms</span>
                    <span>PACKETS: OPTIMAL</span>
                </div>

                {/* Bottom Middle: Play Button */}
                <div
                    className={clsx(
                        "absolute left-1/2 bottom-8 sm:bottom-10 -translate-x-1/2 flex flex-col items-center",
                        match.status === "live" && servers.length > 0 ? "group cursor-pointer" : "opacity-30 pointer-events-none"
                    )}
                    onClick={() => match.status === "live" && servers.length > 0 && setIsVideoModalOpen(true)}
                >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mb-2 sm:mb-4">
                        {match.status === "live" && <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />}
                        <div className="absolute inset-2 rounded-full border-2 border-accent/50 group-hover:border-accent transition-colors" />
                        <button
                            disabled={match.status !== "live" || servers.length === 0}
                            className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:text-base group-hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.2)] group-hover:shadow-[0_0_50px_rgba(0,212,255,0.6)]"
                        >
                            <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ml-1 sm:ml-2 fill-current" />
                        </button>
                    </div>
                    {match.status === "live" && (
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-soft group-hover:text-white transition-colors">
                            Initialize Stream
                        </span>
                    )}
                </div>

                {/* Bottom Right: Live Minute OR Date */}
                <div className="text-right ml-auto">
                    {match.status === "live" ? (
                        <div className="flex flex-col items-end">
                            <span className="text-5xl md:text-6xl font-score font-bold text-white drop-shadow-neon">
                                {match.liveMinute || "LIVE"}
                            </span>
                            <span className="text-soft uppercase tracking-widest text-xs font-bold mt-1">
                                Match Time
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-display font-bold text-white">
                                {new Date(match.timestamp).toLocaleDateString()}
                            </span>
                            <span className="text-soft uppercase tracking-widest text-xs font-bold mt-1">
                                Scheduled
                            </span>
                        </div>
                    )}
                </div>

            </footer>

            {/* Video Modal Overlay */}
            <AnimatePresence>
                {isVideoModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-base/95 backdrop-blur-xl"
                    >
                        <button
                            onClick={() => setIsVideoModalOpen(false)}
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:rotate-90 transition-all z-[60]"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,212,255,0.2)] border border-white/10 relative"
                        >
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="flex flex-col items-center text-soft">
                                    <Activity className="w-12 h-12 mb-4 animate-pulse opacity-20" />
                                    <span className="text-xs uppercase tracking-widest opacity-50">Buffering Source...</span>
                                </div>
                            </div>

                            {activeServer?.url && (
                                <iframe
                                    src={activeServer.url}
                                    className="w-full h-full relative z-10"
                                    frameBorder="0"
                                    scrolling="no"
                                    allow="autoplay; fullscreen; encrypted-media"
                                    allowFullScreen
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
