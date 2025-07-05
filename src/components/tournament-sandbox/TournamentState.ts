// TournamentState.ts
import {SingleMatch, Team} from '../../types/tournament';
import {v4 as uuidv4} from 'uuid';

export class TournamentState {
  private readonly teams: string[];
  private matches: SingleMatch[][];

  constructor(matches: SingleMatch[][], teams: string[]) {
    this.matches = JSON.parse(JSON.stringify(matches)); // Deep copy
    this.teams = [...teams]; // Kopie der Teams erstellen
  }

  // Getter-Methoden
  getTeams(): string[] {
    return [...this.teams];
  }

  getMatches(): SingleMatch[][] {
    return JSON.parse(JSON.stringify(this.matches));
  }

  // Match-Management
  assignTeams(mode: string = 'random'): boolean {
    const teams = this.teams
      .filter(team => team.trim() !== '')
      .map(name => ({
        id: uuidv4(),
        name
      }));

    const teamSlots = this.matches[0].length * 2

    if (mode === 'random') {
      this.shuffle(teams);
    }

    let teamIndex = 0;
    let teamIndex2 = teamSlots - 1;
    const updatedMatches = JSON.parse(JSON.stringify(this.matches));

    updatedMatches[0].forEach((match: SingleMatch) => {
      match.team1 = teams[teamIndex];
      teamIndex++;
      if (teamIndex2 < teams.length) {
        match.team2 = teams[teamIndex2];
      } else {
        match.result = {winner: match.team1};
        const nextMatch = this.findMatchById(updatedMatches, match.nextMatchForWinner);
        if (nextMatch) {
          nextMatch.team1 = match.team1;
        }
      }
      teamIndex2--;
    });

    this.matches = updatedMatches;
    return true;
  }

  updateMatchResult(matchId: string, result: {
    team1Points: number;
    team2Points: number;
    winner: Team
  }): void {
    const matchesFlat = this.matches.flat();
    const match = this.findMatchById(this.matches, matchId);

    if (!match) return;

    // Sieger ins nächste Match setzen
    const nextMatchForWinner = matchesFlat.find(nextMatch =>
      nextMatch.id === match.nextMatchForWinner);

    if (nextMatchForWinner) {
      if (!nextMatchForWinner.team1 ||
        nextMatchForWinner.team1.id === match.team1?.id ||
        nextMatchForWinner.team1.id === match.team2?.id) {
        nextMatchForWinner.team1 = result.winner;
      } else {
        nextMatchForWinner.team2 = result.winner;
      }
    }

    // Verlierer ins nächste Match setzen (wenn vorhanden)
    const nextMatchForLoser = matchesFlat.find(nextMatch =>
      nextMatch.id === match.nextMatchForLoser);

    if (nextMatchForLoser) {
      const loser = result.winner.id === match.team1?.id ? match.team2 : match.team1;
      if (!nextMatchForLoser.team1 ||
        nextMatchForLoser.team1.id === match.team1?.id ||
        nextMatchForLoser.team1.id === match.team2?.id) {
        nextMatchForLoser.team1 = loser;
      } else {
        nextMatchForLoser.team2 = loser;
      }
    }
    // Ergebnis aktualisieren
    match.result = result;
  }

  // Hilfsmethoden
  private shuffle(array: any[]): void {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]
      ];
    }
  }

  private findMatchById(matches: SingleMatch[][], id: string | undefined): SingleMatch | undefined {
    if (!id) return undefined;
    return matches.flat().find(match => match.id === id);
  }
}
