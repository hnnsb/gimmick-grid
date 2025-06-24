export interface Team {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  team1?: Team;
  team2?: Team;
  score?: Score;
  winner?: Team;
  nextMatchId?: string;
  round: number;
  bracket?: string;
}

export interface Score {
  team1Points: number;
  team2Points: number;
}

export interface TournamentStrategy {
  name: string;

  createBracket(teams: Team[]): Match[];

  updateMatchResult(matches: Match[], matchId: string, score: Score): Match[]
}

// Neue Typen für die Tournament Sandbox
export interface MatchResult {
  team1Points?: number;
  team2Points?: number;
  winner?: Team;
}

export interface SingleMatch {
  id: string;
  team1?: Team;
  team2?: Team;
  result?: MatchResult;
  nextMatchForWinner?: string;
  nextMatchForLoser?: string;
  round: number;
  description?: string;
}

export interface GroupMatch {
  id: string;
  team1?: string;
  team2?: string;
  result?: MatchResult;
  group: string;
  round: number;
}

export interface Group {
  id: string;
  name: string;
  teams: string[];
  round: number;
}
