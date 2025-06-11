import {Match, Score, Team, TournamentStrategy} from "../../types/tournament";
import {v4 as uuidv4} from "uuid";

// TODO
// Wenn z.B. 6 Teams gibt, dann 2 Freilose in der ersten Runde, statt ein leeres Match.

export class SingleEliminationStrategy implements TournamentStrategy {
  name = "Single Elimination";

  // TODO - Refactor to reduce complexity
  createBracket(teams: Team[]): Match[] {
    if (teams.length < 2) return [];

    // Nächste Potenz von 2 erreichen
    const totalTeams = this.nextPowerOfTwo(teams.length);
    const rounds = Math.log2(totalTeams);

    // Alle Matches für alle Runden erstellen
    const matches: Match[] = [];

    // Erstelle zuerst die Matches nach Runden
    for (let round = 0; round < rounds; round++) {
      const matchesInRound = Math.pow(2, rounds - round - 1);

      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          id: uuidv4(),
          round,
          team1: undefined,
          team2: undefined,
          winner: undefined,
          nextMatchId: undefined
        });
      }
    }

    // Setze nextMatchId für alle Matches außer dem Finale
    for (let round = 0; round < rounds - 1; round++) {
      const matchesInThisRound = matches.filter(m => m.round === round);
      const matchesInNextRound = matches.filter(m => m.round === round + 1);

      for (let i = 0; i < matchesInThisRound.length; i++) {
        const nextMatchIndex = Math.floor(i / 2);
        matchesInThisRound[i].nextMatchId = matchesInNextRound[nextMatchIndex].id;
      }
    }

    // Teams der ersten Runde zuweisen
    const firstRoundMatches = matches.filter(m => m.round === 0);

    // Wenn nicht genügend Teams, erstelle eine ausgeglichene Verteilung
    const paddedTeams = [...teams];
    while (paddedTeams.length < totalTeams) {
      paddedTeams.push(undefined as unknown as Team);
    }

    // Teams den ersten Matches zuweisen
    for (let i = 0; i < firstRoundMatches.length; i++) {
      firstRoundMatches[i].team1 = paddedTeams[i * 2];
      firstRoundMatches[i].team2 = paddedTeams[i * 2 + 1];
    }

    for (const match of firstRoundMatches) {
      // Wenn nur ein Team vorhanden ist (Freilos)
      if ((match.team1 && !match.team2) || (!match.team1 && match.team2)) {
        // Setze den Sieger automatisch
        const winner = match.team1 || match.team2;
        match.winner = winner;

        // Füge den Sieger direkt zum nächsten Match hinzu
        if (match.nextMatchId) {
          const nextMatch = matches.find(m => m.id === match.nextMatchId);
          if (nextMatch) {
            if (!nextMatch.team1) {
              nextMatch.team1 = winner;
            } else if (!nextMatch.team2) {
              nextMatch.team2 = winner;
            }
          }
        }
      }
    }

    return matches;
  }

  updateMatchResult(matches: Match[], matchId: string, score: Score): Match[] {
    const updatedMatches = [...matches];
    const matchIndex = updatedMatches.findIndex(m => m.id === matchId);

    if (matchIndex === -1) return matches;

    const match = updatedMatches[matchIndex];
    const winner = score.team1Points > score.team2Points ? match.team1 : match.team2;

    updatedMatches[matchIndex] = {
      ...match,
      score,
      winner
    };

    // Sieger zum nächsten Match hinzufügen
    if (match.nextMatchId) {
      const nextMatchIndex = updatedMatches.findIndex(m => m.id === match.nextMatchId);
      if (nextMatchIndex !== -1) {
        const nextMatch = updatedMatches[nextMatchIndex];

        // Bestimme, ob der Gewinner in team1 oder team2 des nächsten Matches gehört
        if (!nextMatch.team1 || nextMatch.team1 === match.team1 || nextMatch.team1 === match.team2) {
          updatedMatches[nextMatchIndex].team1 = winner;
        } else if (!nextMatch.team2 || nextMatch.team2 === match.team1 || nextMatch.team2 === match.team2) {
          updatedMatches[nextMatchIndex].team2 = winner;
        }
      }
    }

    return updatedMatches;
  }

  private nextPowerOfTwo(n: number): number {
    return Math.pow(2, Math.ceil(Math.log2(n)));
  }
}

export const ROUND_NAMES = ["Finale", "Halbfinale", "Viertelfinale", "Achtelfinale", "Sechzehntelfinale"];
