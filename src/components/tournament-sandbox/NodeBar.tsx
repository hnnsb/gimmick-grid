import {DragEvent} from "react";
import {useDnD} from "./DnDContext";
import {TournamenNodeType} from "./TournamentUtils";
import Button from "../common/Button";


export default function NodeBar() {
  const [_, setType] = useDnD();

  const onDragStart = (event: DragEvent<any>, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', nodeType);
  };

  return (
    <aside className="flex flex-row gap-2">
      <Button variant={"secondary"}
              onDragStart={(event) => onDragStart(event, TournamenNodeType.MATCH)}
              draggable>
        Einzelspiel
      </Button>
      <Button variant={"secondary"}
              onDragStart={(event) => onDragStart(event, TournamenNodeType.GROUP)}
              draggable>
        Gruppe
      </Button>
    </aside>
  )
}
