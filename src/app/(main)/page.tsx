import { Hero } from "@/components/home/Hero";
import { LiveMatches } from "@/components/home/LiveMatches";
import { UpcomingMatches } from "@/components/home/UpcomingMatches";
import { getLiveMatches, getUpcomingMatches, getAllLeagues } from "@/lib/api";

export const revalidate = 60; // 60 seconds

export default async function Home() {
  const [liveMatches, upcomingMatches, leagues] = await Promise.all([
    getLiveMatches(),
    getUpcomingMatches(),
    getAllLeagues(),
  ]);

  return (
    <>
      <Hero />
      <LiveMatches matches={liveMatches} />
      <UpcomingMatches matches={upcomingMatches} leagues={leagues} />
    </>
  );
}
