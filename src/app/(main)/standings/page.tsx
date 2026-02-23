import { Clock } from "lucide-react";

export default function StandingsPage() {
    return (
        <div className="flex-grow flex items-center justify-center w-full min-h-[70vh] relative overflow-hidden">

            {/* Background radial specifically for standings to feel vast */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.05)_0%,transparent_60%)] pointer-events-none" />

            <div className="relative z-10 text-center flex flex-col items-center p-8 max-w-xl bg-layer/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">

                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative">
                    <Clock className="w-10 h-10 text-accent animate-pulse-slow" />
                    <div className="absolute inset-0 rounded-full border border-accent/30 animate-ping" />
                </div>

                <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-4">
                    <span className="text-white drop-shadow-neon">Standings</span>
                    <br />
                    <span className="text-soft font-medium text-3xl">Coming Soon</span>
                </h1>

                <p className="text-soft text-lg text-balance mb-8">
                    Detailed league tables, statistics, and historical team tracking algorithms are currently provisioning from the data nodes.
                </p>

                <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-5 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">
                        Awaiting API Data
                    </span>
                </div>

            </div>
        </div>
    );
}
