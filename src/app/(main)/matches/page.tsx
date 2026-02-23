import { MatchCard } from "@/components/ui/MatchCard";
import { getLiveMatches, getUpcomingMatches, getAllLeagues } from "@/lib/api";
import Link from "next/link";
import { format } from "date-fns";
import { Filter } from "lucide-react";

export const revalidate = 60; // 60 seconds

export default async function MatchesPage({
    searchParams,
}: {
    searchParams: { league?: string };
}) {
    const [liveMatches, upcomingMatches, leagues] = await Promise.all([
        getLiveMatches(),
        getUpcomingMatches(),
        getAllLeagues(),
    ]);

    const selectedLeague = searchParams.league || "all";

    const filteredLive =
        selectedLeague === "all"
            ? liveMatches
            : liveMatches.filter((m) => m.leagueId === selectedLeague || m.leagueName.toLowerCase().replace(/\\s+/g, '-') === selectedLeague);

    const filteredUpcoming =
        selectedLeague === "all"
            ? upcomingMatches
            : upcomingMatches.filter((m) => m.leagueId === selectedLeague || m.leagueName.toLowerCase().replace(/\\s+/g, '-') === selectedLeague);

    return (
        <div className="flex-grow max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

            {/* Sidebar: Leagues Filter */}
            <aside className="w-full md:w-[260px] flex-shrink-0">
                <div className="sticky top-24 bg-layer/50 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center space-x-2 text-accent mb-6 border-b border-white/5 pb-4">
                        <Filter className="w-5 h-5" />
                        <span className="font-display font-bold uppercase tracking-widest text-sm">
                            Filter by League
                        </span>
                    </div>

                    <nav className="flex md:flex-col overflow-x-auto md:overflow-y-auto max-h-[60vh] md:pr-2 gap-2 pb-2 md:pb-0 hide-scrollbar md:custom-scrollbar whitespace-nowrap md:whitespace-normal">
                        <Link
                            href="/matches"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${selectedLeague === "all"
                                ? "bg-white text-base font-bold shadow-neon"
                                : "text-soft hover:bg-white/5 hover:text-white border border-transparent md:border-none border-white/10"
                                }`}
                        >
                            All Matches
                        </Link>
                        {leagues.map((league) => {
                            const slug = league.name.toLowerCase().replace(/\s+/g, "-");
                            return (
                                <Link
                                    key={league.id}
                                    href={`/matches?league=${slug}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors truncate flex-shrink-0 ${selectedLeague === slug || selectedLeague === league.id
                                        ? "bg-white text-base font-bold shadow-neon"
                                        : "text-soft hover:bg-white/5 hover:text-white border border-transparent md:border-none border-white/10"
                                        }`}
                                >
                                    {league.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content: Matches Grid */}
            <main className="flex-grow flex flex-col min-w-0">

                {/* Live Matches Section */}
                <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="w-2.5 h-2.5 rounded-full bg-live animate-pulse shadow-[0_0_8px_rgba(255,43,43,0.8)]" />
                        <h2 className="text-2xl font-display font-black tracking-widest uppercase">
                            Live Now
                        </h2>
                        <div className="px-2 py-0.5 rounded bg-white/5 text-soft text-xs font-bold border border-white/10">
                            {filteredLive.length}
                        </div>
                    </div>

                    {filteredLive.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                            {filteredLive.map((match) => (
                                <MatchCard
                                    key={match.id}
                                    id={match.id}
                                    league={match.leagueName}
                                    homeTeam={match.homeTeam.name}
                                    awayTeam={match.awayTeam.name}
                                    homeScore={match.homeScore}
                                    awayScore={match.awayScore}
                                    liveMinute={match.liveMinute}
                                    isLive={true}
                                    backgroundImage={match.poster || `https://images.unsplash.com/photo-1518605389456-02e07120fc6c?w=800&q=80&auto=format&fit=crop&sig=${match.id}`}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full bg-layer border border-white/5 rounded-2xl p-8 text-center text-soft">
                            No live matches found for this filter.
                        </div>
                    )}
                </div>

                {/* Upcoming Matches Section */}
                <div>
                    <div className="flex items-center space-x-3 mb-6">
                        <h2 className="text-2xl font-display font-black tracking-widest text-soft uppercase">
                            Upcoming
                        </h2>
                        <div className="px-2 py-0.5 rounded bg-white/5 text-soft/50 text-xs border border-white/5">
                            {filteredUpcoming.length}
                        </div>
                    </div>

                    {filteredUpcoming.length > 0 ? (
                        <div className="bg-layer border border-white/10 rounded-2xl overflow-hidden shadow-lg divide-y divide-white/5">
                            {filteredUpcoming.map((match) => (
                                <Link
                                    key={match.id}
                                    href={`/stream/${match.id}`}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-white/5 transition-colors gap-4 group"
                                >
                                    <div className="flex items-center gap-6 sm:w-1/3">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-display font-bold text-accent">
                                                {format(new Date(match.timestamp), "HH:mm")}
                                            </span>
                                            <span className="text-xs font-bold text-soft uppercase">
                                                {format(new Date(match.timestamp), "dd MMM")}
                                            </span>
                                        </div>
                                        <div className="h-8 border-l border-white/10" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-soft group-hover:text-white transition-colors truncate">
                                            {match.leagueName}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-2/3">
                                        <span className="text-lg font-medium font-display truncate text-right">
                                            {match.homeTeam.name}
                                        </span>
                                        <span className="text-white/30 font-bold text-sm px-1">vs</span>
                                        <span className="text-lg font-medium font-display truncate text-left">
                                            {match.awayTeam.name}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full bg-layer/50 border border-white/5 rounded-2xl p-8 text-center text-soft">
                            No upcoming matches found for this filter.
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
