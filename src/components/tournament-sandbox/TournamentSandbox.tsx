import React, {useCallback, useRef, useState} from "react";
import {
  addEdge,
  Background,
  Connection,
  Controls,
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
import MatchNode from "./MatchNode";
import GroupNode from "./GroupNode";
import CustomEdge from "./CustomEdge";


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
  const reactFlowWrapper = useRef(null)
  const {screenToFlowPosition} = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const handleTeamsChange = useCallback((nodeId: string, newTeams: string[]) => {
    setNodes(nds =>
      nds.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              teams: newTeams,
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes(nodes => nodes.filter(node => node.id !== nodeId));

    setEdges(edges => edges.filter(edge =>
      edge.source !== nodeId && edge.target !== nodeId
    ));
  }, [setNodes, setEdges]);

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
      if (connectionState.isValid) {
        return
      }

      if (connectionState.fromHandle.id.startsWith("team")) {
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
          onTeamsChange: handleTeamsChange,
          onDelete: handleNodeDelete,
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
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }, [screenToFlowPosition, handleTeamsChange, handleNodeDelete, setNodes, setEdges]
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
        onTeamsChange: handleTeamsChange,
        onDelete: handleNodeDelete,
      }
    };

    setNodes(nodes => [...nodes, newNode]);
  };

  const removeAllEdges = useCallback(() => {
    setEdges([]);
  }, [setEdges]);

  const isValidConnection = useCallback(
    (connection: Connection) => {
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
