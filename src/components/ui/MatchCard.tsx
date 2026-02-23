"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

interface MatchCardProps {
    id: string;
    league: string;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    liveMinute?: string;
    isLive?: boolean;
    time?: string;
    backgroundImage?: string;
}

export function MatchCard({
    id,
    league,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    liveMinute,
    isLive = false,
    time,
    backgroundImage = "https://upload.wikimedia.org/wikipedia/commons/4/43/Old_Trafford_inside_20060726_1.jpg",
}: MatchCardProps) {
    const [cardBg, setCardBg] = useState(backgroundImage);

    return (
        <Link href={`/stream/${id}`} className="block w-full">
            <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group w-full aspect-[4/3] sm:aspect-video md:h-56 max-h-64 rounded-[20px] overflow-hidden border border-white/10 bg-layer shadow-lg transition-all duration-300 hover:border-accent hover:shadow-neon"
            >
                {/* Background Image & Overlays */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${cardBg}')` }}
                >
                    <img
                        src={backgroundImage}
                        onError={() => setCardBg("https://images.unsplash.com/photo-1518605389456-02e07120fc6c?w=800&q=80")}
                        className="hidden"
                        aria-hidden="true"
                        alt=""
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-transparent" />
                <div className="absolute inset-0 bg-layer/40 group-hover:bg-layer/20 transition-colors pointer-events-none" />

                {/* Content */}
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between">

                    {/* Top Bar: League & Live Indicator */}
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-widest text-soft bg-white/5 backdrop-blur-md px-2 py-1 rounded border border-white/5">
                            {league}
                        </span>
                        {isLive ? (
                            <div className="flex items-center space-x-2 bg-live/10 backdrop-blur-md px-2 py-1 rounded border border-live/20">
                                <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest text-live">
                                    {liveMinute || "LIVE"}
                                </span>
                            </div>
                        ) : (
                            <span className="text-xs font-bold uppercase tracking-widest text-white/50 bg-white/5 backdrop-blur-md px-2 py-1 rounded">
                                {time}
                            </span>
                        )}
                    </div>

                    {/* Bottom Area: Teams & Score/Action */}
                    <div className="flex items-end justify-between w-full">
                        <div className="flex flex-col space-y-0.5 sm:space-y-1 w-2/3">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold leading-tight truncate">
                                {homeTeam}
                            </h3>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold leading-tight truncate text-soft group-hover:text-white transition-colors">
                                {awayTeam}
                            </h3>
                        </div>

                        {/* Score OR Watch Button */}
                        <div className="flex items-center justify-end w-1/3">
                            {isLive && homeScore !== undefined && awayScore !== undefined ? (
                                <div className="flex flex-col items-end">
                                    <span className="text-2xl sm:text-3xl font-score font-bold leading-none">{homeScore}</span>
                                    <span className="text-2xl sm:text-3xl font-score font-bold leading-none text-soft">{awayScore}</span>
                                </div>
                            ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:text-base group-hover:border-accent transition-all duration-300">
                                    <Play className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 fill-current" />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </motion.div>
        </Link>
    );
}
