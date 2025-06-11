import React, {useState} from 'react';
import {Match, Score, Team} from '../types/tournament';
import {v4 as uuidv4} from 'uuid';
import {
  ROUND_NAMES,
  SingleEliminationStrategy
} from "../components/tournament-planner/SingleEliminationStrategy";
import MatchCard from "../components/tournament-planner/Match";

// TODO
// - Persist Tournament state in localStorage
export default function TournamentPlanner() {
  const [teams, setTeams] = useState<Team[]>(["A", "B", "C", "D"].map(name => ({
    id: uuidv4(),
    name
  })));
  const [teamName, setTeamName] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournamentCreated, setTournamentCreated] = useState<boolean>(false);
  const strategy = new SingleEliminationStrategy();


  const addTeam = () => {
    if (teamName.trim() && !tournamentCreated) {
      if (teams.some(team => team.name.toLowerCase() === teamName.trim().toLowerCase())) {
        alert('Dieser Teamname existiert bereits. Bitte einen anderen Namen wählen.');
        return;
      }
      const newTeam: Team = {id: uuidv4(), name: teamName.trim()};
      setTeams([...teams, newTeam]);
      setTeamName('');
    }
  };

  const removeTeam = (id: string) => {
    if (!tournamentCreated) {
      setTeams(teams.filter(team => team.id !== id));
    }
  };

  const createTournament = () => {
    if (teams.length >= 2) {
      const tournamentMatches = strategy.createBracket(teams);
      setMatches(tournamentMatches);
      setTournamentCreated(true);
    }
  };

  const handleScore = (matchId: string, score: Score) => {
    const updatedMatches = strategy.updateMatchResult(
      matches,
      matchId,
      score
    );
    setMatches(updatedMatches);
  };

  const resetTournament = () => {
    setMatches([]);
    setTournamentCreated(false);
  };

  return (
    <div className="container tournament-planner">
      <h1>Turnierplaner</h1>

      {!tournamentCreated ? (
        <div className="team-input">
          <h2>Teams hinzufügen</h2>
          <div className="input-group">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Teamname eingeben"
              onKeyDown={(e) => e.key === 'Enter' && addTeam()}
            />
            <button onClick={addTeam}>Hinzufügen</button>
          </div>

          <div className="teams-list">
            <h3>Teams ({teams.length})</h3>
            {teams.length === 0 ? (
              <p>Noch keine Teams hinzugefügt</p>
            ) : (
              <ul>
                {teams.map(team => (
                  <li key={team.id}>
                    {team.name}
                    <button onClick={() => removeTeam(team.id)}>Entfernen</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={createTournament}
            disabled={teams.length < 2}
            className="create-tournament"
          >
            Turnier erstellen (Single Elimination)
          </button>
        </div>
      ) : (
        <div className="tournament-bracket">
          <h2>Turnier-Bracket</h2>
          <button onClick={resetTournament} className="reset-button">
            Zurücksetzen
          </button>

          <div className="bracket-visualization">
            {Array.from(new Set(matches.map(m => m.round))).sort((a, b) => a - b).map(round => (
              <div key={round} className="round">
                <h3>{ROUND_NAMES[new Set(matches.map(m => m.round)).size - (round + 1)]}</h3>
                {matches
                  .filter(match => match.round === round)
                  .map(match => (
                    <MatchCard match={match} key={match.id}/>
                  ))
                }
              </div>
            ))}
          </div>

          {matches.find(m => m.round === Math.max(...matches.map(match => match.round)))?.winner && (
            <div className="tournament-winner">
              <h2>Turniersieger</h2>
              <div className="winner-display">
                {matches.find(m => m.round === Math.max(...matches.map(match => match.round)))?.winner?.name}
              </div>
            </div>
          )}
          <div>
            <h2>Spielplan</h2>
            {Array.from(new Set(matches.map(m => m.round))).sort((a, b) => a - b).map(round => (
              <div key={round} className="round">
                <h3>{ROUND_NAMES[new Set(matches.map(m => m.round)).size - (round + 1)]}</h3>
                <table>
                  <thead>
                  <tr>
                    <th>Team 1</th>
                    <th>Team 2</th>
                    <th>Ergebnis</th>
                  </tr>
                  </thead>
                  {matches
                    .filter(match => match.round === round)
                    .map(match => (
                      <tr key={match.id}>
                        <td>
                          {match.team1?.name ?? (match.round === 0 ? "-" : 'TBD')}
                        </td>
                        <td>
                          {match.team2?.name ?? (match.round === 0 ? "-" : 'TBD')}
                        </td>
                        <td>
                          <input
                            className="w-20"
                            type="text"
                            placeholder="0:0"
                            onChange={debounce((e: any) => {
                              const result = e.target.value;
                              const [team1Score, team2Score] = result.split(':').map(Number);
                              if (isNaN(team1Score) || isNaN(team2Score)) {
                                return;
                              }
                              if (team1Score < 0 || team2Score < 0) {
                                alert('Punkte müssen positiv sein.');
                                return;
                              }
                              if (team1Score === team2Score) {
                                alert('Unentschieden ist nicht erlaubt.');
                                return;
                              }
                              handleScore(match.id, {
                                team1Points: team1Score,
                                team2Points: team2Score
                              });
                            }, 500)}
                          />
                        </td>
                      </tr>
                    ))
                  }
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const debounce = (callback: (e: any) => void, wait: number) => {
  let timeoutId: number | undefined = undefined;
  return (...args: any) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      // @ts-ignore
      callback(...args);
    }, wait);
  };
}
