import React from 'react';
import './TournamentSandbox.css';
import {ROUND_NAMES} from "./TournamentUtils";
import {TournamentState} from './TournamentState';
import {Result} from "../../types/tournament";

interface ScheduleViewProps {
  tournamentState: TournamentState;
  updateMatchResult: (matchId: string, result: Result) => void
}

const ScheduleView: React.FC<ScheduleViewProps> = ({
                                                     tournamentState,
                                                     updateMatchResult
                                                   }) => {


  const matchesWithTeams = tournamentState.getMatches();
  const matchesFlat = matchesWithTeams.flat();

  return (
    <div className="tournament-schedule">
      <h2>Spielplan</h2>
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
                      defaultValue={match.result ? `${match.result.team1Points}:${match.result.team2Points}` : ""}
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
