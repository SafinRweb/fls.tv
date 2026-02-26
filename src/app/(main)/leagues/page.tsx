import { getAllLeagues } from "@/lib/api";
import { Trophy } from "lucide-react";

export const revalidate = 60;

export default async function LeaguesPage() {
    const leagues = await getAllLeagues();

    return (
        <div className="flex-grow max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-16">
            <div className="flex items-center space-x-4 mb-12">
                <Trophy className="w-8 h-8 text-accent" />
                <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight uppercase">
                    <span className="text-white">Global</span>{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600 drop-shadow-neon">
                        Leagues
                    </span>
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {leagues.map((league) => (
                    <div
                        key={league.id}
                        className="group relative h-48 rounded-2xl bg-layer border border-white/10 flex flex-col items-center justify-center p-6 text-center overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-neon hover:-translate-y-2 cursor-default"
                    >
                        {/* Background elements */}
                        <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent opacity-80" />
                        <div className="absolute inset-0 bg-white/5 scale-0 group-hover:scale-150 rounded-full transition-transform duration-700 ease-out" />

                        <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden">
                            {league.logo ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={league.logo} alt={league.name} className="w-full h-full object-contain mix-blend-multiply p-2" />
                            ) : (
                                <Trophy className="w-8 h-8 text-base/50" />
                            )}
                        </div>

                        <h3 className="relative z-10 font-display font-bold tracking-wider text-sm group-hover:text-accent transition-colors">
                            {league.name}
                        </h3>
                        {league.country && (
                            <p className="relative z-10 text-xs text-soft uppercase tracking-widest mt-1">
                                {league.country}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
