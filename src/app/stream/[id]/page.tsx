import { getMatchDetail } from "@/lib/api";
import { detectLeague } from "@/lib/leagues";
import { notFound } from "next/navigation";
import nextDynamic from "next/dynamic";

// Skip SSR for StreamClient to avoid hydration mismatches
// (framer-motion animations + dynamic match data cause server/client HTML diffs)
const StreamClient = nextDynamic(
    () => import("@/components/stream/StreamClient").then((mod) => mod.StreamClient),
    { ssr: false }
);

export const dynamic = "force-dynamic";

export default async function StreamPage({ params }: { params: { id: string } }) {
    const detail = await getMatchDetail(params.id);

    if (!detail) {
        notFound();
    }

    // Detect league from team names
    const { leagueName, leagueLogo } = detectLeague(
        detail.homeTeam.name,
        detail.awayTeam.name,
        detail.title
    );

    // Convert MatchDetail to the shape StreamClient expects
    const match = {
        id: detail.id,
        title: detail.title,
        status: detail.status,
        liveMinute: detail.liveMinute,
        leagueId: leagueName.toLowerCase().replace(/\s+/g, "-"),
        leagueName,
        leagueLogo,
        homeTeam: detail.homeTeam,
        awayTeam: detail.awayTeam,
        homeScore: detail.homeScore,
        awayScore: detail.awayScore,
        stadium: detail.stadium,
        poster: detail.poster,
        timestamp: detail.timestamp,
    };

    // Convert sources to the server shape StreamClient expects
    const servers = detail.sources.map((s, idx) => ({
        id: s.id || `src-${idx}`,
        name: s.name || `Source ${idx + 1}`,
        url: s.url,
        quality: idx === 0 ? "1080p" : "720p",
        latency: idx === 0 ? "low" : "normal",
        region: idx === 0 ? "Primary" : `Backup ${idx}`,
    }));

    return (
        <div className="w-screen h-screen bg-base">
            <StreamClient match={match} servers={servers} />
        </div>
    );
}
