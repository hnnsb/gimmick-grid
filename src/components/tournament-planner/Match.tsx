import React from "react";
import {Match, Team} from '../../types/tournament';
import './tournament-planner.css'; // Assuming you have a CSS file for styling

export default function MatchCard({match}: Readonly<{
  match: Match;
}>) {
  console.log("Rendering MatchCard for match:", match.id);
  return (
    <div key={match.id} className="match">
      <div
        className={`team ${isWinner(match, match.team1) ? 'winner' : ''} ${isLoser(match, match.team1) ? 'loser' : ''}`}>
        {match.team1?.name ?? (match.round === 0 ? "-" : 'TBD')} {match.score?.team1Points}
      </div>
      <div
        className={`team ${isWinner(match, match.team2) ? 'winner' : ''} ${isLoser(match, match.team2) ? 'loser' : ''}`}>
        {match.team2?.name ?? (match.round === 0 ? "-" : 'TBD')} {match.score?.team2Points}
      </div>
    </div>
  );
}

const isWinner = (match: Match, team: Team | undefined): boolean => {
  return match.winner !== undefined && match.winner?.id === team?.id;
}

const isLoser = (match: Match, team: Team | undefined): boolean => {
  return match.winner !== undefined && !isWinner(match, team);
}
