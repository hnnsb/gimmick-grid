// TournamentTree.tsx
import React from 'react';
import './TournamentTree.css'; // Diese CSS-Datei musst du noch erstellen
import {TournamentState} from './TournamentState';

interface TournamentTreeProps {
  tournamentState: TournamentState | null;
}

const TournamentTree: React.FC<TournamentTreeProps> = ({tournamentState}) => {
  if (!tournamentState) {
    return <div className="tournament-tree-placeholder">Teams müssen erst zugewiesen werden</div>;
  }

  const matches = tournamentState.getMatches();
  const roundCount = matches.length;

  return (
    <div className="tournament-tree-container">
      {matches.map((round, roundIndex) => (
        <div
          key={roundIndex}
          className="tournament-round"
          style={{
            gridColumn: roundIndex + 1,
            height: `${Math.pow(2, roundCount - roundIndex) * 60}px`
          }}
        >
          {round.map((match, matchIndex) => (
            <div
              key={match.id}
              className="tournament-match"
              style={{
                top: `${calculateMatchPosition(roundIndex, matchIndex, roundCount)}px`
              }}
            >
              <div className="match-bracket">
                <div className="team team1">
                  <span>{match.team1?.name ?? 'TBD'}</span>
                  {match.result && <span className="score">{match.result.team1Points}</span>}
                </div>
                <div className="team team2">
                  <span>{match.team2?.name ?? 'TBD'}</span>
                  {match.result && <span className="score">{match.result.team2Points}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Berechnet die vertikale Position eines Matches im Turnierbaum
function calculateMatchPosition(roundIndex: number, matchIndex: number, totalRounds: number): number {
  const spacing = Math.pow(2, totalRounds - roundIndex) * 60;
  return matchIndex * spacing + spacing / 2 - 30; // 30px ist die halbe Höhe eines Match-Blocks
}

export default TournamentTree;
