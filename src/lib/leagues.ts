// League data for matching team names to leagues
// Logos are from Wikimedia Commons

export interface LeagueInfo {
    logo: string;
    teams: string[];
}

export const LEAGUE_DATA: Record<string, LeagueInfo> = {
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
    "Champions League": {
        logo: "https://media.api-sports.io/football/leagues/2.png",
        teams: [],
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
 * Given home and away team names, determine the league.
 * Returns { leagueName, leagueLogo } or defaults to "Other".
 */
export function detectLeague(
    homeTeam: string,
    awayTeam: string,
    title?: string
): { leagueName: string; leagueLogo: string | undefined } {
    const matchString = `${homeTeam} ${awayTeam} ${title || ""}`.toLowerCase();

    // Check Champions League keyword first
    if (matchString.includes("champions league") || matchString.includes("ucl")) {
        return {
            leagueName: "Champions League",
            leagueLogo: LEAGUE_DATA["Champions League"].logo,
        };
    }

    // Match by team name
    for (const [league, data] of Object.entries(LEAGUE_DATA)) {
        if (league === "Champions League") continue;
        if (data.teams.some((team) => matchString.includes(team.toLowerCase()))) {
            return { leagueName: league, leagueLogo: data.logo };
        }
    }

    return { leagueName: "Other", leagueLogo: undefined };
}

/** Get all known leagues with logos (for sidebar filters, etc.) */
export function getAllKnownLeagues() {
    return Object.entries(LEAGUE_DATA)
        .filter(([name]) => name !== "Other")
        .map(([name, data], i) => ({
            id: `league-${i}`,
            name,
            logo: data.logo,
        }));
}
