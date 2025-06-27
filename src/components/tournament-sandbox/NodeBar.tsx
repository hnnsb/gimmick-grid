import {DragEvent} from "react";
import {TournamenNodeType} from "./TournamentUtils";
import Button from "../common/Button";


export default function NodeBar({handleMatchCreate}) {

  const onDragStart = (event: DragEvent<any>, nodeType: string) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', nodeType);
  };

  return (
    <aside className="flex flex-row gap-2">
      <Button variant={"secondary"}
              onDragStart={(event) => onDragStart(event, TournamenNodeType.MATCH)}
              onClick={() => handleMatchCreate(TournamenNodeType.MATCH)}
              draggable>
        Einzelspiel
      </Button>
      {false &&
        <Button variant={"secondary"}
                onDragStart={(event) => onDragStart(event, TournamenNodeType.GROUP)}
                onClick={() => handleMatchCreate(TournamenNodeType.GROUP)}

                draggable>
          Gruppe
        </Button>
      }
    </aside>
  )
}
