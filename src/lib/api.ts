/* eslint-disable @typescript-eslint/no-explicit-any */
import { detectLeague, getAllKnownLeagues } from "./leagues";
export interface Team {
    id: string | number;
    name: string;
    shortName?: string;
    logo?: string;
}

export interface Match {
    id: string;
    title: string;
    status: "live" | "upcoming" | "finished";
    time?: string;
    liveMinute?: string;
    leagueId: string;
    leagueName: string;
    leagueLogo?: string;
    homeTeam: Team;
    awayTeam: Team;
    homeScore?: number;
    awayScore?: number;
    stadium?: string;
    poster?: string;
    popular?: boolean;
    timestamp: number;
}

export interface League {
    id: string;
    name: string;
    logo?: string;
    country?: string;
}

// ——— API Configuration ———
const BASE_URL = "https://api.sportsrc.org";

// ——— Priority Leagues for sorting ———
export const PRIORITY_LEAGUES = [
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "MLS",
    "Saudi Pro League",
    "Champions League",
];

// ——— Generic fetch wrapper ———
const fetchApi = async <T>(params: string): Promise<T | null> => {
    try {
        const response = await fetch(`${BASE_URL}/?${params}`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            // 400 is expected for upcoming/future matches on the detail endpoint — don't log
            if (response.status !== 400) {
                console.error(`API Error: ${response.status} ${response.statusText}`);
            }
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Fetch Error (${params}):`, error);
        return null;
    }
};

// ——— Helpers ———

/** Determine if a match is currently live (started within last ~3 hours) */
const isMatchLive = (dateMs: number): boolean => {
    const now = Date.now();
    // A football match lasts about 2 hours. Consider a match "live" if it started
    // within the last 3 hours and the start time is in the past.
    return dateMs <= now && now - dateMs < 3 * 60 * 60 * 1000;
};

/** Calculate approximate live football minute including halftime offset */
export const calculateLiveMinute = (dateMs: number, now: number): string | undefined => {
    if (!isMatchLive(dateMs)) return undefined;

    const elapsed = Math.floor((now - dateMs) / 60000);

    if (elapsed <= 45) {
        return "Just Started";
    } else if (elapsed > 45 && elapsed <= 60) {
        return "Halftime";
    } else if (elapsed > 60 && elapsed <= 105) {
        return "Second Half";
    } else {
        return "90+";
    }
};

/** Convert raw API match object to our Match interface */
const mapRawMatch = (raw: any): Match => {
    const dateMs = typeof raw.date === "number" ? raw.date : parseInt(raw.date) || 0;
    const now = Date.now();

    let status: "live" | "upcoming" | "finished";
    if (isMatchLive(dateMs)) {
        status = "live";
    } else if (dateMs > now) {
        status = "upcoming";
    } else {
        status = "finished";
    }

    // Approximate live minute based on elapsed time with halftime adjustments
    const liveMinute = calculateLiveMinute(dateMs, now);

    const homeName = raw.teams?.home?.name || "TBD";
    const awayName = raw.teams?.away?.name || "TBD";
    const { leagueName, leagueLogo } = detectLeague(homeName, awayName, raw.title);

    return {
        id: String(raw.id || ""),
        title: raw.title || "",
        status,
        liveMinute,
        leagueId: leagueName.toLowerCase().replace(/\s+/g, "-"),
        leagueName,
        leagueLogo,
        homeTeam: {
            id: raw.teams?.home?.name || "home",
            name: raw.teams?.home?.name || "TBD",
            logo: raw.teams?.home?.badge || undefined,
        },
        awayTeam: {
            id: raw.teams?.away?.name || "away",
            name: raw.teams?.away?.name || "TBD",
            logo: raw.teams?.away?.badge || undefined,
        },
        homeScore: status === "live" ? (raw.scores?.home ?? undefined) : undefined,
        awayScore: status === "live" ? (raw.scores?.away ?? undefined) : undefined,
        stadium: raw.venue || raw.stadium || undefined,
        poster: raw.poster || undefined,
        popular: raw.popular || false,
        timestamp: dateMs,
    };
};

/** Get sorting priority index for a league (lower is better, -1 means not priority) */
const getLeaguePriority = (leagueName: string, title: string = ""): number => {
    return PRIORITY_LEAGUES.findIndex(
        (l) => leagueName.toLowerCase().includes(l.toLowerCase()) || title.toLowerCase().includes(l.toLowerCase())
    );
};

/** Sort matches: priority leagues first, then by time */
const sortMatchesByPriority = (matches: Match[]) => {
    return [...matches].sort((a, b) => {
        const indexA = getLeaguePriority(a.leagueName, a.title);
        const indexB = getLeaguePriority(b.leagueName, b.title);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // Popular matches first
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;

        return a.timestamp - b.timestamp;
    });
};

/** Sort matches strictly chronologically (soonest first). Still respects popular flag if timestamps are identical. */
const sortMatchesChronologically = (matches: Match[]): Match[] => {
    return [...matches].sort((a, b) => {
        // Primary sort: Timestamp (soonest first)
        if (a.timestamp !== b.timestamp) {
            return a.timestamp - b.timestamp;
        }

        // Secondary sort: Popularity (if timestamps are exactly the same)
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;

        // Tertiary sort: Priority Leagues
        const aIndex = getLeaguePriority(a.leagueName, a.title);
        const bIndex = getLeaguePriority(b.leagueName, b.title);
        if (aIndex !== bIndex) return aIndex - bIndex;

        return 0;
    });
};

// ——— Public API functions ———

export const getAllMatches = async (): Promise<Match[]> => {
    const data = await fetchApi<any>("data=matches&category=football");

    if (!data) return [];

    // The API returns either { success: true, data: [...] } or just an array
    const rawList = data.data || (Array.isArray(data) ? data : []);

    if (!Array.isArray(rawList)) return [];

    return rawList.map(mapRawMatch);
};

export const getLiveMatches = async (): Promise<Match[]> => {
    const allMatches = await getAllMatches();
    const live = allMatches.filter((m) => m.status === "live");
    return sortMatchesByPriority(live);
};

export const getUpcomingMatches = async (): Promise<Match[]> => {
    const allMatches = await getAllMatches();
    const upcoming = allMatches.filter((m) => m.status === "upcoming");
    return sortMatchesChronologically(upcoming);
};

export const getAllLeagues = async (): Promise<League[]> => {
    return getAllKnownLeagues();
};

// ——— Match Detail & Stream ———

export interface MatchDetail {
    id: string;
    title: string;
    poster?: string;
    sources: { id: string; name: string; url: string }[];
    homeTeam: Team;
    awayTeam: Team;
    status: "live" | "upcoming" | "finished";
    homeScore?: number;
    awayScore?: number;
    liveMinute?: string;
    timestamp: number;
    stadium?: string;
    league?: string;
}

export const getMatchDetail = async (matchId: string): Promise<MatchDetail | null> => {
    // First try the detail endpoint
    const data = await fetchApi<any>(`data=detail&id=${encodeURIComponent(matchId)}&category=football`);

    if (data && data.data) {
        const d = data.data;
        const sources = Array.isArray(d.sources)
            ? d.sources.map((s: any, idx: number) => ({
                id: s.id ? `${s.id}-${idx}` : `src-${idx}`,
                name: s.name || `Source ${idx + 1}`,
                url: s.url || s.embedUrl || s.src || "",
            }))
            : [];

        const dateMs = typeof d.date === "number" ? d.date : parseInt(d.date) || 0;
        const now = Date.now();
        let status: "live" | "upcoming" | "finished";
        if (isMatchLive(dateMs)) status = "live";
        else if (dateMs > now) status = "upcoming";
        else status = "finished";

        const liveMinute = calculateLiveMinute(dateMs, now);

        return {
            id: matchId,
            title: d.title || "",
            poster: d.poster || undefined,
            sources,
            homeTeam: {
                id: d.teams?.home?.name || "home",
                name: d.teams?.home?.name || "TBD",
                logo: d.teams?.home?.badge || undefined,
            },
            awayTeam: {
                id: d.teams?.away?.name || "away",
                name: d.teams?.away?.name || "TBD",
                logo: d.teams?.away?.badge || undefined,
            },
            status,
            homeScore: d.scores?.home ?? undefined,
            awayScore: d.scores?.away ?? undefined,
            liveMinute,
            timestamp: dateMs,
            stadium: d.venue || d.stadium || undefined,
            league: d.league || d.competition || "",
        };
    }

    // If detail fails, try to find the match in the schedule list for basic info
    const allMatches = await getAllMatches();
    const found = allMatches.find((m) => m.id === matchId);

    if (found) {
        return {
            id: found.id,
            title: found.title,
            poster: found.poster,
            sources: [], // No stream sources available from schedule
            homeTeam: found.homeTeam,
            awayTeam: found.awayTeam,
            status: found.status,
            homeScore: found.homeScore,
            awayScore: found.awayScore,
            liveMinute: found.liveMinute,
            timestamp: found.timestamp,
            stadium: found.stadium,
            league: found.leagueName,
        };
    }

    return null;
};
