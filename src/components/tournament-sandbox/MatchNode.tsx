import React, {useState} from 'react';
import {Handle, Position} from 'reactflow';
import './TournamentSandbox.css';

interface MatchNodeProps {
  data: {
    label: string;
    description: string;
    onDelete?: (id: string) => void;
  };
  id: string;
  selected?: boolean;
}

const MatchNode: React.FC<MatchNodeProps> = ({data, id, selected}) => {
  const [description, setDescription] = useState(data.description);

  // Löschen-Funktion aus den Node-Daten verwenden
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div className="match-node">
      <div className="match-title">
        <div>{data.label}</div>
        <br/>
        {selected ? (<>
              <button className="delete-button" onClick={handleDelete}>
                🗑️
              </button>
              <input type="text"
                     value={description}
                     onChange={(e) => {
                       setDescription(e.target.value);
                       data.description = e.target.value
                     }}
              />
            </>
          ) :
          <div>{data.description}</div>
        }
      </div>

      <Handle type="source" position={Position.Right} style={{top: 10}} id="winner"></Handle>
      <Handle type="source" position={Position.Right} style={{top: 40}} id="loser"></Handle>

      <Handle type="target" position={Position.Left} style={{top: 10}} id="team1"></Handle>
      <Handle type="target" position={Position.Left} style={{top: 40}} id="team2"></Handle>
    </div>
  );
};

export default MatchNode;
