import React, {useCallback, useRef, useState} from "react";
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  FinalConnectionState,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "@xyflow/react";
import {componentPalette, extractMatches, TournamenNodeType} from "./TournamentUtils";
import ScheduleView from "./ScheduleView";
import Button from "../common/Button";
import MatchNode from "./flow/MatchNode";
import GroupNode from "./flow/GroupNode";
import CustomEdge from "./flow/CustomEdge";
import NodeBar from "./NodeBar";
import {useDnD} from "./DnDContext";


const nodeTypes: NodeTypes = {
  match: MatchNode,
  group: GroupNode,
};

const edgeTypes = {
  custom: CustomEdge,
}

let id = 1;
const getId = () => `${id++}`;

export default function TournamentSandbox() {
  //
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  //
  const reactFlowWrapper = useRef(null)

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const {screenToFlowPosition} = useReactFlow();
  const [type, setType] = useDnD();
  //

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'custom',
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (event: (MouseEvent | TouchEvent), connectionState: FinalConnectionState) => {
      if (connectionState?.isValid) {
        return
      }

      if (!connectionState.fromNode || !connectionState.fromHandle) {
        return;
      }

      if (connectionState.fromHandle?.id?.startsWith("team")) {
        return
      }

      const component = componentPalette.get(TournamenNodeType.MATCH)
      if (!component) return;

      const id = getId()
      const {clientX, clientY} = 'changedTouches' in event ? event.changedTouches[0] : event;
      const newNode = {
        id,
        type: TournamenNodeType.MATCH,
        position: screenToFlowPosition({x: clientX, y: clientY}),
        data: {
          ...component.data,
        }
      };
      setNodes((nds) => nds.concat(newNode));

      const newEdge = {
        id,
        source: connectionState.fromNode.id,
        target: id,
        sourceHandle: connectionState.fromHandle.id,
        targetHandle: "team1",
        type: 'custom',
      } as Edge;
      setEdges((eds) => addEdge(newEdge, eds));
    }, [screenToFlowPosition, setNodes, setEdges]
  )

  const addComponentToCanvas = (componentType: TournamenNodeType) => {
    const component = componentPalette.get(componentType)
    if (!component) return;

    const newNode: Node = {
      id: getId(),
      type: componentType,
      position: {x: 250, y: 100 + (id * 10)},
      data: {
        ...component.data,
      }
    };

    setNodes(nodes => [...nodes, newNode]);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('text/plain');
      const component = componentPalette.get(type);
      if (!component) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: {
          ...component.data,
        }
      };

      setNodes(nodes => [...nodes, newNode]);
    },
    [screenToFlowPosition, setNodes, type],
  );

  const removeAllEdges = useCallback(() => {
    setEdges([]);
  }, [setEdges]);

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      const targetNodeId = connection.target;
      const targetHandleId = connection.targetHandle;

      const hasConnectionAlready = edges.some(
        (edge) => edge.target === targetNodeId && edge.targetHandle === targetHandleId
      );

      return !hasConnectionAlready;
    },
    [edges]
  );


  const matches = extractMatches(nodes, edges);

  return (
    <div className="container">
      <div className="beta-badge"></div>
      <h1>Tournament Sandbox</h1>

      {showSchedule ? (
        <ScheduleView
          matches={matches}
          onBack={() => setShowSchedule(false)}
        />
      ) : (
        <div className="flex gap-1 flex-col">
          <div>
            <div>Turnier Komponenten</div>
            <div className="component-palette">
              <Button variant="secondary"
                      onClick={() => addComponentToCanvas(TournamenNodeType.MATCH)}>Einzelspiel</Button>
            </div>
            <NodeBar/>
          </div>
          <div className=""
               style={{height: 800, border: '1px solid #ddd'}}
               ref={reactFlowWrapper}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onConnectEnd={onConnectEnd}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              isValidConnection={isValidConnection}
              fitView
              snapToGrid
              edgesFocusable={true}
              elementsSelectable={true}
            >
              <Controls/>
              <MiniMap/>
              <Background color="#aaa" gap={16}/>
            </ReactFlow>
          </div>

          <div className="edge-controls">
            <button onClick={removeAllEdges}>Alle Verbindungen entfernen</button>
            <button onClick={() => {
              setShowSchedule(true)
            }}>Spielplan anzeigen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
