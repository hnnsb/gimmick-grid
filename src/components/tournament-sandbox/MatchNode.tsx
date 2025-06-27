import React, {useState} from 'react';
import './TournamentSandbox.css';
import Button from "../common/Button";
import {Position} from "@xyflow/react";
import LimitHandle from "./LimitHandle";

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
      <div className="">
        <div className="match-title gap-2">
          {data.label}
          {selected && (
            <Button variant="danger" className="" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
        {selected ? (
          <label className="text-xs font-light">
            Beschreibung
            <br/>
            <input
              id="group-description"
              className="w-40"
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                data.description = e.target.value
              }}
            />
          </label>
        ) : (<>
            {description?.length > 0 ? (
              <label className="text-xs font-light">
                Beschreibung
                <br/>
                <div className="text-sm font-medium text-wrap">{data.description}</div>
              </label>
            ) : <></>
            }
          </>
        )}
      </div>

      <LimitHandle className="winner-handle"
                   type="source"
                   position={Position.Right}
                   style={{top: 10}}
                   id="winner"
                   limit={1}
      />
      <LimitHandle className="loser-handle" type="source" position={Position.Right}
                   style={{top: 40}}
                   id="loser"
                   limit={1}
      />

      <LimitHandle type="target" position={Position.Left} style={{top: 10}}
                   id="team1"
                   limit={1}
      />
      <LimitHandle type="target" position={Position.Left} style={{top: 40}}
                   id="team2"
                   limit={1}
      />
    </div>
  );
};

export default MatchNode;
