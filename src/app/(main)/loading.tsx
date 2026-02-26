import { Activity } from "lucide-react";

export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]">
            <div className="flex flex-col items-center space-y-6">

                {/* Logo Pulse */}
                <div className="flex flex-row items-baseline animate-pulse group mix-blend-screen opacity-50">
                    <span className="text-3xl font-display font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">fls</span>
                    <span className="text-3xl font-display font-black text-accent drop-shadow-neon-strong">.tv</span>
                </div>

                {/* Loading Indicator */}
                <div className="flex items-center space-x-3 text-soft">
                    <Activity className="w-5 h-5 animate-spin-slow opacity-60 text-accent" />
                    <span className="text-sm font-mono uppercase tracking-widest font-bold">Establishing Connection...</span>
                </div>

                {/* Subtle Progress Bar Outline */}
                <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-accent/60 w-1/3 rounded-full animate-[progress_2s_ease-in-out_infinite]" />
                </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.05)_0%,transparent_60%)] pointer-events-none" />
        </div>
    );
}
