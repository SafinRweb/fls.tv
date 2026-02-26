import Link from "next/link";

const MAJOR_LEAGUES = [
    { name: "Premier League", href: "/matches?league=premier-league" },
    { name: "La Liga", href: "/matches?league=la-liga" },
    { name: "Serie A", href: "/matches?league=serie-a" },
    { name: "Bundesliga", href: "/matches?league=bundesliga" },
    { name: "Ligue 1", href: "/matches?league=ligue-1" },
    { name: "Champions League", href: "/matches?league=champions-league" },
];

export function Footer() {
    return (
        <footer className="w-full border-t border-white/5 bg-base mt-24 relative overflow-hidden">
            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16 flex flex-col md:flex-row justify-between items-center md:items-start gap-12">

                {/* Left: Leagues */}
                <div className="flex flex-col space-y-4 text-center md:text-left">
                    <h4 className="text-white font-display uppercase tracking-widest font-bold text-sm bg-white/5 py-1 px-3 rounded inline-block w-max mx-auto md:mx-0">
                        Top Competitions
                    </h4>
                    <ul className="flex flex-wrap md:flex-col gap-4 md:gap-2 justify-center">
                        {MAJOR_LEAGUES.map((league) => (
                            <li key={league.name}>
                                <Link href={league.href} className="text-soft hover:text-accent transition-colors text-sm font-medium">
                                    {league.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right: Big Logo */}
                <div className="flex flex-col items-center md:items-end">
                    <Link href="/" className="group inline-block">
                        <h2 className="text-6xl md:text-8xl font-display font-black leading-none drop-shadow-neon-strong">
                            <span className="text-white transition-colors duration-500 group-hover:text-accent">fls</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-accent to-blue-600">.tv</span>
                        </h2>
                    </Link>
                    <p className="text-soft text-xs tracking-widest uppercase mt-4 max-w-[200px] text-center md:text-right">
                        Premium Football Broadcast UI
                    </p>
                </div>

            </div>

            <div className="border-t border-white/5 py-6">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-soft text-xs">&copy; {new Date().getFullYear()} fls.tv. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-soft hover:text-white text-xs">Terms</Link>
                        <Link href="#" className="text-soft hover:text-white text-xs">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
