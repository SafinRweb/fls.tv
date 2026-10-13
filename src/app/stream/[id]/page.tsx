import { getMatchDetail } from "@/lib/api";
import { detectLeague } from "@/lib/leagues";
import { notFound } from "next/navigation";
import { StreamClient } from "@/components/stream/StreamClient";
import { toStreamServers } from "@/lib/stream-sources";

export const dynamic = "force-dynamic";

export default async function StreamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const detail = await getMatchDetail(id);

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
    const servers = toStreamServers(detail.sources);

    return (
        <div className="w-screen h-screen bg-base">
            <StreamClient key={match.id} match={match} servers={servers} />
        </div>
    );
}
