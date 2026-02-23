"use client";

import { useState, useEffect } from "react";
import { calculateLiveMinute, type Match } from "@/lib/api";
import { motion } from "framer-motion";
import { Activity, Server, Globe2, ChevronLeft, MapPin, AlertTriangle } from "lucide-react";
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
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const [liveData, setLiveData] = useState({
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        liveMinute: match.liveMinute,
        status: match.status
    });

    // Poll for live score updates every 30 seconds if the match is live
    useEffect(() => {
        if (liveData.status !== "live") return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`https://api.sportsrc.org/?data=detail&id=${encodeURIComponent(match.id)}&category=football`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.data) {
                        const d = data.data;
                        const dateMs = typeof d.date === "number" ? d.date : parseInt(d.date) || 0;
                        const now = Date.now();
                        let status: "live" | "upcoming" | "finished";
                        if (dateMs <= now && now - dateMs < 3 * 60 * 60 * 1000) status = "live";
                        else if (dateMs > now) status = "upcoming";
                        else status = "finished";

                        const liveMinute = calculateLiveMinute(dateMs, now);

                        setLiveData({
                            homeScore: d.scores?.home,
                            awayScore: d.scores?.away,
                            liveMinute,
                            status
                        });
                    }
                }
            } catch {
                // Ignore fetch errors during polling
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [match.id, liveData.status]);

    // Use the match poster from the API, or a fallback
    const bgImage = match.poster || `https://images.unsplash.com/photo-1518605389456-02e07120fc6c?w=1920&q=80&auto=format&fit=crop&sig=${match.id}`;

    return (
        <div className="relative w-full h-screen bg-base text-white selection:bg-accent selection:text-base overflow-hidden">
            <div className="relative w-full h-full flex flex-col">

                {/* Background layer */}
                <div
                    className="absolute inset-0 bg-contain md:bg-cover bg-no-repeat bg-center transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
                <div className="absolute inset-0 bg-base/80 backdrop-blur-md" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-base to-transparent" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-base to-transparent" />

                {/* Top Bar: Nav Back, League, Team Names, Live Indicator */}
                <header className="relative w-full shrink-0 p-4 sm:p-6 lg:p-10 flex flex-wrap items-center justify-between gap-4 z-20">
                    <div className="flex items-center gap-4 sm:space-x-6">
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

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        {match.stadium && (
                            <div className="hidden sm:flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur">
                                <MapPin className="w-3.5 h-3.5 text-accent/70" />
                                <span className="text-sm text-soft uppercase tracking-wider font-medium">
                                    {match.stadium}
                                </span>
                            </div>
                        )}

                        {liveData.status === "live" && (
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
                <main className="relative flex-1 flex flex-col lg:flex-row items-center lg:justify-center px-4 pt-4 sm:pt-8 lg:pt-12 pb-32 z-10 w-full overflow-y-auto overflow-x-hidden">

                    {/* Left/Center: Video Player OR Huge text */}
                    <div className="flex-1 w-full flex flex-col items-center justify-center relative lg:pr-8">
                        {liveData.status === "live" ? (
                            <div className="w-full max-w-5xl flex flex-col space-y-4 lg:space-y-6">
                                <div className="w-full aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden shadow-[0_0_100px_rgba(0,212,255,0.05)] border border-white/10 relative z-40">
                                    {!isIframeLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                                            <div className="flex flex-col items-center text-soft">
                                                <Activity className="w-10 h-10 mb-3 animate-pulse opacity-20" />
                                                <span className="text-[10px] uppercase tracking-widest opacity-50">Loading Stream...</span>
                                            </div>
                                        </div>
                                    )}

                                    {activeServer?.url && (
                                        <iframe
                                            src={activeServer.url}
                                            onLoad={() => setIsIframeLoaded(true)}
                                            className={clsx("w-full h-full relative z-10 transition-opacity duration-1000", isIframeLoaded ? "opacity-100" : "opacity-0")}
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="no"
                                            allow="autoplay; fullscreen; encrypted-media"
                                            allowFullScreen
                                        ></iframe>
                                    )}
                                </div>

                                {/* Caution Message */}
                                <div className="flex items-start lg:items-center space-x-3 p-3 sm:p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200/80 text-xs sm:text-sm">
                                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-orange-400 mt-0.5 lg:mt-0" />
                                    <p className="leading-relaxed">
                                        <strong className="text-orange-400 font-semibold uppercase tracking-wider text-xs mr-2">Caution:</strong>
                                        <span className="text-white/70">External stream servers may contain ads. Please close any random pop-up tabs that open and avoid downloading or installing anything.</span>
                                    </p>
                                </div>
                            </div>
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
                    <div className="w-full lg:w-[28rem] xl:w-96 flex flex-col space-y-3 mt-8 lg:mt-0 lg:ml-8 xl:ml-12 pb-12 lg:pb-0">
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
                    <div className="hidden sm:flex flex-row items-center space-x-4 lg:space-x-6 opacity-60 font-mono text-xs text-accent" suppressHydrationWarning>
                        <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 animate-pulse" />
                            <span className="hidden lg:inline">Receiving data stream...</span>
                        </div>
                        <div className="flex items-center space-x-4 lg:space-x-6">
                            <span>SERVER_REGION: {activeServer?.region?.toUpperCase() || "Asia"}</span>
                            <span>LATENCY: 24ms</span>
                            <span>PACKETS: OPTIMAL</span>
                        </div>
                    </div>



                    {/* Bottom Right: Live Minute OR Date */}
                    <div className="text-right ml-auto">
                        {liveData.status === "live" ? (
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-4xl lg:text-5xl font-display font-bold text-accent drop-shadow-neon text-right">
                                    {liveData.liveMinute || "LIVE"}
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
            </div>

        </div>
    );
}
