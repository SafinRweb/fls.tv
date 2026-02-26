// League data for matching team names to leagues
// Logos are from Wikimedia Commons & API-Sports

export interface LeagueInfo {
    logo: string;
    teams: string[];
}

// 1. Strict UEFA Season Rosters (2025/2026 Season - February Knockouts)
const UEFA_TEAMS: Record<string, string[]> = {
    "Champions League": [
        "Real Madrid", "Man City", "Manchester City", "Bayern", "PSG", "Liverpool", "Inter", "Dortmund", "Leipzig", "Barcelona", "Leverkusen", "Atletico", "Atlético", "Atalanta", "Juventus", "Benfica", "Arsenal", "Club Brugge", "Shakhtar", "AC Milan", "Feyenoord", "Sporting CP", "PSV", "Salzburg", "Monaco", "Sparta Prague", "Girona", "Brest"
    ],
    "Europa League": [
        // R16 Auto-Qualifiers
        "Lyon", "Aston Villa", "Midtjylland", "Real Betis", "Porto", "Braga", "SC Freiburg", "Freiburg", "Roma",
        // Current Knockout Play-off Teams
        "Stuttgart", "Celtic", "Nottingham Forest", "Nott'm Forest", "Fenerbahce", "Fenerbahçe", "Viktoria Plzen", "Viktoria Plzeň", "Panathinaikos", "Crvena Zvezda", "Red Star Belgrade", "Lille", "Bologna", "Brann", "Celta Vigo", "PAOK", "Genk", "Dinamo Zagreb", "Ferencvaros", "Ferencváros", "Ludogorets"
    ],
    "Conference League": [
        // Current Knockout Play-off Teams
        "Fiorentina", "Jagiellonia", "Rijeka", "Omonoia", "Samsunspor", "Shkendija", "Shkëndija", "Celje", "Drita", "Crystal Palace", "Zrinjski", "AZ Alkmaar", "Noah", "Lausanne", "Sigma Olomouc", "Lech Poznan", "KuPS", "Heidenheim", "Copenhagen", "St. Gallen", "Vitoria", "Astana", "Legia", "Olimpija", "Hearts", "LASK", "Molde", "Rapid Wien", "APOEL", "Chelsea"
    ]
};

// 2. Main League Render Data
export const LEAGUE_DATA: Record<string, LeagueInfo> = {
    // --- UEFA Competitions ---
    "Champions League": { logo: "https://media.api-sports.io/football/leagues/2.png", teams: [] },
    "Europa League": { logo: "https://media.api-sports.io/football/leagues/3.png", teams: [] },
    "Conference League": { logo: "https://media.api-sports.io/football/leagues/848.png", teams: [] },

    // --- Top 6 ---
    "Premier League": {
        logo: "https://media.api-sports.io/football/leagues/39.png",
        teams: ["Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton", "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich", "Leicester", "Liverpool", "Man City", "Man United", "Manchester United", "Manchester City", "Newcastle", "Nott'm Forest", "Nottingham Forest", "Southampton", "Tottenham", "West Ham", "Wolves", "Wolverhampton"],
    },
    "La Liga": {
        logo: "https://media.api-sports.io/football/leagues/140.png",
        teams: ["Real Madrid", "Barcelona", "Atletico", "Atlético", "Sevilla", "Valencia", "Villarreal", "Real Sociedad", "Athletic Club", "Betis", "Real Betis", "Girona", "Celta Vigo", "Mallorca", "Osasuna", "Alaves", "Alavés", "Deportivo Alavés", "Las Palmas", "Getafe", "Rayo Vallecano", "Espanyol", "Levante", "Real Oviedo", "Elche", "Cadiz"],
    },
    "Serie A": {
        logo: "https://media.api-sports.io/football/leagues/135.png",
        teams: ["Juventus", "Inter Milan", "Inter", "AC Milan", "Napoli", "Roma", "AS Roma", "Lazio", "Atalanta", "Fiorentina", "Bologna", "Torino", "Genoa", "Como", "Parma", "Venezia", "Cremonese", "Udinese", "Sassuolo", "Lecce", "Hellas Verona", "Pisa", "Cagliari"],
    },
    "Bundesliga": {
        logo: "https://media.api-sports.io/football/leagues/78.png",
        teams: ["Bayern", "Bayern Munich", "Dortmund", "Borussia Dortmund", "Leverkusen", "Bayer Leverkusen", "RB Leipzig", "Stuttgart", "VfB Stuttgart", "Eintracht Frankfurt", "Eintracht", "Wolfsburg", "VfL Wolfsburg", "Mönchengladbach", "M'gladbach", "Borussia Mönchengladbach", "Freiburg", "SC Freiburg", "Mainz", "Augsburg", "FC Augsburg", "Cologne", "FC Cologne", "Hoffenheim", "TSG Hoffenheim", "St. Pauli", "Heidenheim", "1. FC Heidenheim", "Werder Bremen", "Hamburg", "Hamburg SV", "1. FC Union Berlin"],
    },
    "Ligue 1": {
        logo: "https://media.api-sports.io/football/leagues/61.png",
        teams: ["PSG", "Paris Saint-Germain", "Marseille", "Lyon", "Monaco", "AS Monaco", "Lille", "Lens", "Rennes", "Stade Rennais", "Nice", "Strasbourg", "Brest", "Nantes", "Toulouse", "Angers", "Auxerre", "AJ Auxerre", "Lorient", "Le Havre", "Metz", "Paris FC", "Guingamp", "Le Mans"],
    },

    // --- Global Leagues ---
    "MLS": {
        logo: "https://media.api-sports.io/football/leagues/253.png",
        teams: ["LA Galaxy", "New York", "Seattle", "Colorado", "Inter Miami", "LAFC", "Columbus", "FC Cincinnati"],
    },
    "Liga Profesional (ARG)": {
        logo: "https://media.api-sports.io/football/leagues/128.png",
        teams: ["Velez Sarsfield", "River Plate", "San Lorenzo", "Estudiantes", "Union", "Aldosivi", "Boca Juniors", "Racing Club", "Independiente"],
    },
    "Liga MX (MEX)": {
        logo: "https://media.api-sports.io/football/leagues/262.png",
        teams: ["Pumas", "Monterrey", "America", "Cruz Azul", "Chivas", "FC Juarez", "Queretaro", "Toluca", "Pachuca", "Tigres"],
    },
    "Brasileirão (BRA)": {
        logo: "https://media.api-sports.io/football/leagues/71.png",
        teams: ["Corinthians", "Flamengo", "Palmeiras", "Sao Paulo", "Botafogo", "Gremio", "Cruzeiro", "Fluminense"],
    },
    "Liga Portugal": {
        logo: "https://media.api-sports.io/football/leagues/94.png",
        teams: ["FC Porto", "Benfica", "Sporting CP", "Braga", "Famalicao", "Casa Pia", "Rio Ave", "Vitoria", "Paços de Ferreira"],
    },
    "Saudi Pro League": {
        logo: "https://media.api-sports.io/football/leagues/307.png",
        teams: ["Al Nassr", "Al Hilal", "Al Ittihad", "Al Ahli", "Al-Ahli", "Al Shabab", "Al-Shabab", "Al Ettifaq", "Al-Ettifaq", "Al Qadsiah", "Al-Qadisiyah", "Damac", "Al Fateh", "Al-Fateh", "Al Riyadh", "Al-Riyadh", "Al Okhdood", "Al-Okhdood"],
    },
    "Super Lig (TUR)": {
        logo: "https://media.api-sports.io/football/leagues/203.png",
        teams: ["Fenerbahce", "Fenerbahçe", "Galatasaray", "Besiktas", "Beşiktaş", "Trabzonspor", "Kasimpasa", "Kasımpaşa"],
    },
    "Eredivisie (NED)": {
        logo: "https://media.api-sports.io/football/leagues/88.png",
        teams: ["Ajax", "PSV", "Feyenoord", "AZ Alkmaar", "Twente"],
    },
};

/**
 * Intelligent Match Classifier
 * Separates domestic overlaps from distinct UEFA Competitions.
 */
export function detectLeague(
    homeTeam: string,
    awayTeam: string,
    title?: string
): { leagueName: string; leagueLogo: string | undefined } {
    const titleString = (title || "").toLowerCase();
    const home = (homeTeam || "").toLowerCase();
    const away = (awayTeam || "").toLowerCase();

    // 1. Title Keyword Override
    if (titleString.includes("champions league") || titleString.includes("ucl")) return { leagueName: "Champions League", leagueLogo: LEAGUE_DATA["Champions League"].logo };
    if (titleString.includes("europa league") || titleString.includes("uel")) return { leagueName: "Europa League", leagueLogo: LEAGUE_DATA["Europa League"].logo };
    if (titleString.includes("conference league") || titleString.includes("uecl")) return { leagueName: "Conference League", leagueLogo: LEAGUE_DATA["Conference League"].logo };

    // 2. Identify Domestic Leagues (Includes Saudi Pro League fix)
    let homeDomestic = "Other";
    let awayDomestic = "Other";

    for (const [league, data] of Object.entries(LEAGUE_DATA)) {
        // Strictly skip ONLY the UEFA buckets during the domestic check
        if (["Champions League", "Europa League", "Conference League"].includes(league)) continue;

        if (data.teams.some((team) => home.includes(team.toLowerCase()))) homeDomestic = league;
        if (data.teams.some((team) => away.includes(team.toLowerCase()))) awayDomestic = league;
    }

    // 3. Domestic Match Check (Both teams must be in the same domestic league)
    if (homeDomestic !== "Other" && homeDomestic === awayDomestic) {
        return { leagueName: homeDomestic, leagueLogo: LEAGUE_DATA[homeDomestic].logo };
    }

    // 4. European Cup Check (The "Two-Team Verification" Fix)
    // Check if both teams actually exist in our UEFA rosters
    const isHomeUEFA = Object.values(UEFA_TEAMS).some(teams => teams.some(t => home.includes(t.toLowerCase())));
    const isAwayUEFA = Object.values(UEFA_TEAMS).some(teams => teams.some(t => away.includes(t.toLowerCase())));

    // It is a UEFA match ONLY IF both teams are in Europe, OR they are from different known domestic countries
    if ((isHomeUEFA && isAwayUEFA) || (homeDomestic !== "Other" && awayDomestic !== "Other" && homeDomestic !== awayDomestic)) {
        for (const [tournament, teams] of Object.entries(UEFA_TEAMS)) {
            if (teams.some((team) => home.includes(team.toLowerCase()) || away.includes(team.toLowerCase()))) {
                return { leagueName: tournament, leagueLogo: LEAGUE_DATA[tournament].logo };
            }
        }
    }

    // 5. Domestic Cup & 'B-Team' Fallback
    // If Sporting CP (UCL) plays Leixoes (Unknown), it skips UEFA and safely falls back to Liga Portugal here.
    if (homeDomestic !== "Other") return { leagueName: homeDomestic, leagueLogo: LEAGUE_DATA[homeDomestic].logo };
    if (awayDomestic !== "Other") return { leagueName: awayDomestic, leagueLogo: LEAGUE_DATA[awayDomestic].logo };

    return { leagueName: "Other", leagueLogo: undefined };
}

/** Get all known leagues with logos */
export function getAllKnownLeagues() {
    return Object.entries(LEAGUE_DATA)
        .filter(([name]) => name !== "Other")
        .map(([name, data], i) => ({
            id: `league-${i}`,
            name,
            logo: data.logo,
        }));
}