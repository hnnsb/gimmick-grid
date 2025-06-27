import React, {useState} from 'react';
import '../TournamentSandbox.css';
import {Handle, Position} from "@xyflow/react";

interface GroupNodeProps {
  data: {
    label: string;
    teams?: string[];
    onDelete?: (id: string) => void;
    onTeamsChange?: (id: string, teams: string[]) => void;
  };
  id: string;
  selected?: boolean;
}

const GroupNode: React.FC<GroupNodeProps> = ({data, id, selected}) => {
  const [teams, setTeams] = useState(data.teams ?? ['Team 1', 'Team 2', 'Team 3', 'Team 4']);

  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  const addTeam = () => {
    setTeams([...teams, `Team ${teams.length + 1}`]);
    // Update der Daten im übergeordneten Komponentenbaum
    if (data.onTeamsChange) {
      data.onTeamsChange(id, [...teams, `Team ${teams.length + 1}`]);
    }
  };

  const removeTeam = () => {
    if (teams.length <= 2) return; // Mindestens 2 Teams erlauben
    const newTeams = teams.slice(0, -1);
    setTeams(newTeams);
    // Update der Daten im übergeordneten Komponentenbaum
    if (data.onTeamsChange) {
      data.onTeamsChange(id, newTeams);
    }
  };

  return (
    <div className="match-node">
      <div>
        <div className="match-title">
          {data.label}
          {selected && (
            <button className="delete-button" onClick={handleDelete}>
              🗑️
            </button>
          )}
        </div>
        <div className="group-controls">
          <button className="small-button" onClick={removeTeam}>-</button>
          <button className="small-button" onClick={addTeam}>+</button>
        </div>
      </div>

      <div className="">
        {teams.map((team: string, index: number) => (
          <div key={team + index} className="group-team">
            <span>{team}</span>
            {/* Target Handle für jedes Team */}
            <Handle
              type="target"
              position={Position.Left}
              style={{top: 20 + index * 25}}
              id={`team${index + 1}`}
            />

            <Handle
              type="source"
              position={Position.Right}
              style={{top: 20 + index * 25}}
              id={`position${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupNode;
