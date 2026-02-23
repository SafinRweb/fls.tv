"use client";

import { useState, useMemo } from "react";
import type { Match, League } from "@/lib/api";
import { format } from "date-fns";
import { Calendar, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

const MAX_VISIBLE = 10;

export function UpcomingMatches({
    matches,
    leagues,
}: {
    matches: Match[];
    leagues: League[];
}) {
    const [selectedLeague, setSelectedLeague] = useState<string>("all");

    const filteredMatches = useMemo(() => {
        if (selectedLeague === "all") return matches;
        return matches.filter((m) => m.leagueId === selectedLeague || m.leagueName === selectedLeague);
    }, [matches, selectedLeague]);

    const visibleMatches = filteredMatches.slice(0, MAX_VISIBLE);
    const hasMore = filteredMatches.length > MAX_VISIBLE;

    if (!matches || matches.length === 0) return null;

    return (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-layer/50 border border-white/10 rounded-[24px] overflow-hidden backdrop-blur-md shadow-lg">

                {/* Header */}
                <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-accent">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-white">
                            Upcoming
                        </h2>
                    </div>

                    <select
                        value={selectedLeague}
                        onChange={(e) => setSelectedLeague(e.target.value)}
                        className="bg-base border border-white/10 text-white text-sm rounded-full px-4 py-2 outline-none focus:border-accent w-full sm:w-auto min-w-[200px] font-medium transition-colors"
                    >
                        <option value="all">All Leagues</option>
                        {leagues.map((league) => (
                            <option key={league.id} value={league.name}>
                                {league.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* List */}
                <div className="divide-y divide-white/5">
                    {visibleMatches.length > 0 ? (
                        visibleMatches.map((match) => (
                            <Link
                                key={match.id}
                                href={`/stream/${match.id}`}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 hover:bg-white/5 transition-colors gap-3"
                            >
                                {/* Left: Date/Time + Stadium */}
                                <div className="flex items-center gap-5 sm:w-2/5">
                                    <div className="flex flex-col min-w-[60px]">
                                        <span className="text-xl font-display font-bold text-accent">
                                            {format(new Date(match.timestamp), "HH:mm")}
                                        </span>
                                        <span className="text-xs font-bold text-soft uppercase tracking-wider">
                                            {format(new Date(match.timestamp), "dd MMM")}
                                        </span>
                                    </div>
                                    <div className="h-10 border-l border-white/10" />
                                    {match.stadium ? (
                                        <div className="flex items-center gap-2 text-soft group-hover:text-white/70 transition-colors truncate">
                                            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-accent/60" />
                                            <span className="text-sm font-medium truncate">
                                                {match.stadium}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm font-bold uppercase tracking-widest text-soft group-hover:text-white transition-colors truncate">
                                            {match.leagueName || "Football"}
                                        </span>
                                    )}
                                </div>

                                {/* Right: Team names */}
                                <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-2 sm:w-3/5 mt-4 sm:mt-0 text-center sm:text-right">
                                    <span className="text-2xl sm:text-lg md:text-xl font-bold font-display leading-tight sm:leading-none text-wrap max-w-full">
                                        {match.homeTeam.name}
                                    </span>
                                    <span className="text-soft font-bold text-sm sm:text-lg px-2 py-1">vs</span>
                                    <span className="text-2xl sm:text-lg md:text-xl font-bold font-display leading-tight sm:leading-none text-wrap sm:text-left max-w-full">
                                        {match.awayTeam.name}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-12 text-center text-soft">
                            <p>No upcoming matches found for the selected league.</p>
                        </div>
                    )}
                </div>

                {/* Show More */}
                {hasMore && (
                    <Link
                        href="/matches"
                        className="flex items-center justify-center gap-3 p-5 border-t border-white/5 text-accent hover:bg-white/5 transition-colors group"
                    >
                        <span className="text-sm font-bold uppercase tracking-widest">
                            View All Matches
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                )}

            </div>
        </section>
    );
}
