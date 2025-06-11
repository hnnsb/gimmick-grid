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
