import { MatchCard } from "@/components/ui/MatchCard";
import type { Match } from "@/lib/api";

export function LiveMatches({ matches }: { matches: Match[] }) {
    const hasLive = matches && matches.length > 0;

    return (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            <div className="flex items-center mb-8 relative z-10">
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 backdrop-blur-md">
                    <span className="w-3 h-3 rounded-full bg-live animate-pulse shadow-[0_0_10px_rgba(255,43,43,0.8)]" />
                    <h2 className="text-xl font-display font-black tracking-widest uppercase">
                        On Air Now
                    </h2>
                </div>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent ml-6" />
            </div>

            {hasLive ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {matches.map((match) => (
                        <MatchCard
                            key={match.id}
                            id={match.id}
                            league={match.leagueName || match.title}
                            homeTeam={match.homeTeam.name}
                            awayTeam={match.awayTeam.name}
                            homeScore={match.homeScore}
                            awayScore={match.awayScore}
                            liveMinute={match.liveMinute}
                            isLive={match.status === "live"}
                            backgroundImage={match.poster || "https://upload.wikimedia.org/wikipedia/commons/4/43/Old_Trafford_inside_20060726_1.jpg"}
                        />
                    ))}
                </div>
            ) : (
                <div className="relative w-full h-56 md:h-64 rounded-[20px] overflow-hidden border border-white/5">
                    {/* Blurry stadium background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
                        style={{ backgroundImage: "url('https://backend.liverpoolfc.com/sites/default/files/styles/xl/public/2023-12/anfield-general-view-fans-man-utd-18122023.jpg?itok=BcfDjezE')" }}
                    />
                    <div className="absolute inset-0 bg-base/80 backdrop-blur-md" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)]" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                            <span className="w-3 h-3 rounded-full bg-white/20" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 uppercase tracking-wider">
                            No Matches Currently Live
                        </h3>
                        <p className="text-soft text-sm max-w-md">
                            Check back later or browse upcoming matches below.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}
