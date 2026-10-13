import { Hero } from "@/components/home/Hero";
import { LiveMatches } from "@/components/home/LiveMatches";
import { UpcomingMatches } from "@/components/home/UpcomingMatches";
import { getLiveMatches, getUpcomingMatches, getAllLeagues } from "@/lib/api";
import { AdBanner } from "@/components/ui/AdBanner";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [liveMatches, upcomingMatches, leagues] = await Promise.all([
    getLiveMatches(),
    getUpcomingMatches(),
    getAllLeagues(),
  ]);

  return (
    <>
      <Hero />

      {/* Mid Banner (under Hero / above Live Matches) */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner placement="homeHero" />
      </div>

      <LiveMatches matches={liveMatches} />
      
      {/* Position C: Homepage list divider horizontal Ad */}
      <AdBanner placement="homeDivider" />
      
      <UpcomingMatches matches={upcomingMatches} leagues={leagues} />

      {/* Bottom Native Ad Banner */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <AdBanner placement="homeBottom" />
      </div>
    </>
  );
}
