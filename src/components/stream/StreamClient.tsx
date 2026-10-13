"use client";

import { useState, useEffect, useRef } from "react";
import { calculateLiveMinute, getMatchStatus, type Match } from "@/lib/api";
import { normalizeStreamSources, toStreamServers, preserveStreamConnection, type StreamServer } from "@/lib/stream-sources";
import { ADS_CONFIG } from "@/lib/ads";
import { motion } from "framer-motion";
import { Activity, Server, Globe2, ChevronLeft, MapPin, RefreshCw } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { AdBanner } from "@/components/ui/AdBanner";

interface StreamClientProps {
    match: Match;
    servers: StreamServer[];
}

export function StreamClient({ match, servers }: StreamClientProps) {
    const [mounted, setMounted] = useState(false);
    const [activeServersList, setActiveServersList] = useState(servers);
    const [activeServer, setActiveServer] = useState<StreamServer | undefined>(servers[0]);
    const [playerRevision, setPlayerRevision] = useState(0);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const [slowLoading, setSlowLoading] = useState(false);
    const [pollingError, setPollingError] = useState(false);
    const refreshRef = useRef<(() => Promise<void>) | null>(null);
    const [liveData, setLiveData] = useState({
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        liveMinute: match.liveMinute,
        status: match.status,
    });

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        let cancelled = false;
        let inFlight = false;
        let controller: AbortController | undefined;
        const refresh = async () => {
            const now = Date.now();
            setLiveData(current => ({
                ...current,
                status: getMatchStatus(match.timestamp, now),
                liveMinute: calculateLiveMinute(match.timestamp, now),
            }));
            if (inFlight || document.visibilityState === "hidden" || !navigator.onLine) return;
            inFlight = true;
            controller = new AbortController();
            const timeout = setTimeout(() => controller?.abort(), 10000);
            try {
                const response = await fetch(`https://api.sportsrc.org/?data=detail&id=${encodeURIComponent(match.id)}&category=football`, { signal: controller.signal });
                if (!response.ok) throw new Error("Source refresh failed");
                const data = await response.json();
                if (cancelled) return;
                if (!data?.data || data.success === false) throw new Error("No match details");
                const detail = data.data;
                const dateMs = Number(detail.date) || match.timestamp;
                const checkedAt = Date.now();
                setLiveData({
                    homeScore: detail.scores?.home,
                    awayScore: detail.scores?.away,
                    liveMinute: calculateLiveMinute(dateMs, checkedAt),
                    status: getMatchStatus(dateMs, checkedAt),
                });
                if (Array.isArray(detail.sources)) {
                    const nextServers = toStreamServers(normalizeStreamSources(detail.sources));
                    setActiveServersList(nextServers);
                    setActiveServer(current => preserveStreamConnection(current, nextServers));
                }
                setPollingError(false);
            } catch {
                if (!cancelled) setPollingError(true);
            } finally {
                clearTimeout(timeout);
                inFlight = false;
            }
        };
        refreshRef.current = refresh;
        void refresh();
        const interval = setInterval(() => void refresh(), 30000);
        const onVisible = () => { if (document.visibilityState === "visible") void refresh(); };
        const onOnline = () => void refresh();
        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("online", onOnline);
        return () => {
            cancelled = true;
            controller?.abort();
            clearInterval(interval);
            refreshRef.current = null;
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("online", onOnline);
        };
    }, [match.id, match.timestamp]);

    useEffect(() => {
        setSlowLoading(false);
        if (!activeServer || isIframeLoaded) return;
        const timer = setTimeout(() => setSlowLoading(true), 15000);
        return () => clearTimeout(timer);
    }, [activeServer, playerRevision, isIframeLoaded]);

    const chooseServer = (server: StreamServer) => {
        setActiveServer(server);
        setIsIframeLoaded(false);
        setPlayerRevision(current => current + 1);
    };

    const reloadPlayer = () => {
        if (!activeServer) return;
        const latest = activeServersList.find(server => server.id === activeServer.id);
        chooseServer(latest || activeServer);
    };

    if (!mounted) {
        return (
            <div className="w-screen h-screen bg-base flex items-center justify-center text-soft">
                <div className="flex flex-col items-center">
                    <Activity className="w-10 h-10 mb-3 animate-pulse opacity-20" />
                    <span className="text-[10px] uppercase tracking-widest opacity-50">Loading Stream...</span>
                </div>
            </div>
        );
    }

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
                        <Link
                            href="/"
                            aria-label="Back to matches"
                            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:-translate-x-1 transition-all backdrop-blur cursor-pointer"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
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
                <main className="relative flex-1 min-h-0 flex flex-col lg:flex-row items-center lg:justify-center px-4 pt-4 sm:pt-6 lg:pt-8 pb-6 z-10 w-full overflow-y-auto overflow-x-hidden">

                    {/* Left/Center: Video Player OR Huge text */}
                    <div className="flex-1 w-full flex flex-col items-center justify-center relative lg:pr-8 lg:self-start">
                        {liveData.status !== "upcoming" && activeServer ? (
                            <div className="w-full max-w-5xl flex flex-col space-y-4 lg:space-y-6">
                                {ADS_CONFIG.smartlinkUrl && <a
                                    href={ADS_CONFIG.smartlinkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-accent to-blue-600 hover:from-accent hover:to-blue-700 text-white font-display font-black uppercase tracking-widest text-xs sm:text-sm shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:shadow-[0_0_35px_rgba(0,212,255,0.4)] transition-all animate-pulse duration-1000 z-40 text-center cursor-pointer"
                                >
                                    <span>Support fls.tv — sponsored link</span>
                                </a>}

                                <div className="w-full aspect-video lg:max-h-[calc(100vh-280px)] bg-[#0a0a0a] rounded-xl overflow-hidden shadow-[0_0_100px_rgba(0,212,255,0.05)] border border-white/10 relative z-40">
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
                                            key={playerRevision}
                                            title={`${match.title} — ${activeServer.name}`}
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

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-xs text-soft" role="status">
                                        {slowLoading ? "Taking longer to load? Reload the player or choose another server." : "Stream stopped? Reload the player or choose another server."}
                                    </p>
                                    <button type="button" onClick={reloadPlayer} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-accent hover:text-accent">
                                        <RefreshCw className="h-4 w-4" aria-hidden="true" /> Reload player
                                    </button>
                                </div>
                                {/* Position A: Stream page under player ad */}
                                <AdBanner placement="streamBelow" />
                            </div>
                        ) : (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-center"
                            >
                                <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-black tracking-tight text-white/50 uppercase text-balance">
                                    {liveData.status === "upcoming" ? "Match Starts Soon" : liveData.status === "finished" ? "Match has ended" : "Waiting for streams"}
                                </h2>
                            </motion.div>
                        )}
                    </div>

                    {/* Right side: Servers */}
                    <div className="w-full lg:w-[28rem] xl:w-96 flex flex-col mt-8 lg:mt-0 lg:ml-8 xl:ml-12 pb-12 lg:pb-0 lg:h-full lg:overflow-hidden lg:justify-center">
                        <div className={clsx("flex items-center space-x-2 text-white/50 uppercase tracking-widest text-xs font-bold mb-3", activeServersList.length === 0 ? "hidden sm:flex" : "flex")}>
                            <Server className="w-4 h-4" />
                            <span>Available Streams</span>
                        </div>

                        {pollingError && <p role="status" className="mb-3 text-xs text-soft">{activeServer ? "Could not refresh the source list. Your current connection is unchanged." : "Could not refresh the source list. We will check again automatically."}</p>}
                        {!activeServer && <button type="button" onClick={() => void refreshRef.current?.()} className="mb-3 text-sm text-accent">Check for streams</button>}
                        <div className="flex-1 flex flex-col space-y-3 w-full lg:overflow-y-auto lg:pr-2 pr-0 custom-scrollbar pb-4">
                            {activeServersList.length > 0 ? activeServersList.map((server, idx) => (
                                <button
                                    key={server.id || idx}
                                    onClick={() => {
                                        chooseServer(server);
                                    }}
                                    className={clsx(
                                        "w-full text-left p-4 rounded-xl border backdrop-blur-md transition-all duration-300 group flex items-center justify-between",
                                        activeServer?.id === server.id
                                            ? "bg-accent/10 border-accent shadow-neon"
                                            : "bg-layer/40 border-white/10 hover:border-white/30 hover:bg-layer/60"
                                    )}
                                >
                                    <div className="flex flex-col min-w-0 pr-2">
                                        <span className={clsx(
                                            "font-bold font-display text-[16px] truncate",
                                            activeServer?.id === server.id ? "text-accent" : "text-white"
                                        )}>{server.name}</span>
                                        <span className="text-[11px] text-soft mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <span className="flex items-center"><Globe2 className="w-3 h-3 mr-1" /> {server.region}</span>
                                            {server.viewers ? (
                                                <span className="text-accent font-mono font-medium">
                                                    • {server.viewers >= 1000 ? `${(server.viewers / 1000).toFixed(1)}k` : server.viewers} watching
                                                </span>
                                            ) : null}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0">
                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-white">
                                            {server.quality}
                                        </span>
                                    </div>
                            </button>
                            )) : (
                                <div className="w-full p-6 rounded-xl border border-white/5 bg-layer/20 backdrop-blur-md text-center">
                                    <p className="text-soft text-sm uppercase tracking-widest font-bold">{activeServer ? "No other streams listed" : "No streams available yet"}</p>
                                    <p className="text-white/30 text-xs mt-2">{activeServer ? "Your current connection is unchanged. We will keep checking for alternatives." : "We will check again automatically. You can also check for streams above."}</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Ad (Vertical 160x300) */}
                        <div className="mt-2 flex justify-center shrink-0 pb-10 lg:pb-0">
                            <AdBanner placement="streamSidebar" />
                        </div>
                        <AdBanner placement="streamBottom" />
                    </div>
                </main>


            </div>

        </div>
    );
}
