import React, {useEffect, useState} from 'react';
import {SingleMatch, Team} from '../../types/tournament';
import './TournamentSandbox.css';
import {ROUND_NAMES} from "./TournamentUtils";
import {TournamentState} from './TournamentState';

interface ScheduleViewProps {
  matches: SingleMatch[][];
  onBack: () => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({matches, onBack}) => {
  const teamCount = matches[0].length * 2;

  const [teams, setTeams] = useState<string[]>(Array(teamCount).fill(''));

  const [tournamentState, setTournamentState] = useState<TournamentState | null>(null);

  useEffect(() => {
    setTournamentState(null);
  }, [matches]);

  const assignTeams = () => {
    // Neuen TournamentState mit aktuellen Teams erstellen
    const state = new TournamentState(matches, teams);
    const success = state.assignTeams();

    if (!success) {
      alert("Nicht genügend Teams für die Zuweisung. Bitte fügen Sie mehr Teams hinzu.");
      return;
    }

    setTournamentState(state);
  };

  const updateMatchResult = (matchId: string, result: {
    team1Points: number;
    team2Points: number;
    winner: Team
  }) => {
    if (!tournamentState) return;

    // Neuen TournamentState basierend auf dem aktuellen erstellen
    const newState = new TournamentState(tournamentState.getMatches(), tournamentState.getTeams());
    newState.updateMatchResult(matchId, result);
    setTournamentState(newState);
  };

  // Aktuelle Matches abhängig vom TournamentState verwenden
  const matchesWithTeams = tournamentState ? tournamentState.getMatches() : matches;
  const matchesFlat = matchesWithTeams?.flat();

  return (
    <div className="tournament-schedule">
      <button onClick={onBack}>Zurück zum Editor</button>
      <div className="team-input">
        <h2>Teams hinzufügen</h2>
        <div className="teams-list">
          {teams.map((team, index) => (
            <div key={index}>
              <input
                value={team}
                onChange={(e) => {
                  const newTeams = [...teams];
                  newTeams[index] = e.target.value;
                  setTeams(newTeams);
                }}
                disabled={tournamentState !== null} // Deaktivieren nach Teamzuweisung
              />
              <button
                onClick={() => {
                  const newTeams = [...teams];
                  newTeams[index] = "";
                  setTeams(newTeams);
                }}
                disabled={tournamentState !== null} // Deaktivieren nach Teamzuweisung
              >
                X
              </button>
            </div>
          ))}
          <button onClick={assignTeams} disabled={tournamentState !== null}>
            Turnierplan erstellen
          </button>
          {tournamentState && (
            <button onClick={() => setTournamentState(null)}>
              Zurücksetzen
            </button>
          )}
        </div>
      </div>

      <h2>Spielplan</h2>
      {tournamentState === null ?
        <div className="text-red-500">Es sind noch keine Teams eingetragen</div> : <></>}
      {Array.from(new Set(matchesFlat.map(m => m.round))).sort((a, b) => a - b).map(round => (
        <div key={round} className="round-schedule">
          <h3>{ROUND_NAMES[new Set(matchesFlat.map(m => m.round)).size - (round + 1)]}</h3>
          <table>
            <thead>
            <tr>
              <th>Id</th>
              <th>Team 1</th>
              <th>Team 2</th>
              <th>Ergebnis</th>
              <th>Beschreibung</th>
            </tr>
            </thead>
            <tbody>
            {matchesFlat
              .filter(match => match.round === round)
              .map((match, index) => (
                <tr key={match.id}>
                  <td>{round + 1}-{index + 1}</td>
                  <td>{match.team1?.name ?? 'TBD'}</td>
                  <td>{match.team2?.name ?? 'TBD'}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="0:0"
                      disabled={!tournamentState || !match.team1 || !match.team2}
                      onChange={debounce(e => {
                        const result = e.target.value;
                        const [team1Score, team2Score] = result.split(':').map(Number);
                        if (isNaN(team1Score) || isNaN(team2Score)) {
                          return;
                        }
                        updateMatchResult(match.id, {
                          team1Points: team1Score,
                          team2Points: team2Score,
                          winner: team1Score > team2Score ? match.team1! : match.team2!
                        });
                      }, 400)}
                    />
                  </td>
                  <td>{match.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ScheduleView;

function debounce<Params extends any[]>(callback: (...args: Params) => any, wait: number): (...args: Params) => void {
  let timeoutId: number | undefined = undefined;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
}
