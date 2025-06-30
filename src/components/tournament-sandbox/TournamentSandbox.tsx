import React, {useCallback, useEffect, useRef, useState} from "react";
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
import MatchNode from "./flow/MatchNode";
import GroupNode from "./flow/GroupNode";
import CustomEdge from "./flow/CustomEdge";
import NodeBar from "./NodeBar";
import Tabs from "../common/tabs/Tabs";
import Tab from "../common/tabs/Tab";


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
  // State
  const [teams, setTeams] = useState<string[]>([]);

  // React Flow
  const reactFlowWrapper = useRef(null)

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const {screenToFlowPosition} = useReactFlow();
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
    [screenToFlowPosition, setNodes],
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
  let teamCount = 0
  if (matches.length > 0) {
    teamCount = matches[0].length * 2;
  }
  useEffect(() => {
    setTeams(Array(teamCount).fill(""))
  }, [teamCount]);

  return (
    <div>
      <div className="beta-badge"></div>
      <div className="container overflow-scroll p-2">
        <h1>Tournament Sandbox</h1>

        <Tabs>
          <Tab label={"Editor"}>
            <div className="flex gap-1 flex-col">
              <div className="shadow-card">
                <div className="p-2">
                  <div>Turnier Komponenten</div>
                  <NodeBar handleMatchCreate={addComponentToCanvas}/>
                </div>
              </div>
              <div className="shadow-card overflow-hidden"
                   style={{height: 800}}
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
                <button onClick={() => undefined}>
                  Spielplan anzeigen
                </button>
              </div>
            </div>
          </Tab>
          <Tab label={"Teams"}>
            <div className="team-input">
              <h2>Teams hinzufügen</h2>
              <div className="teams-list">
                {teams.length === 0 ? (
                  <div>Du musst erst Spiele hinzufügen</div>) : (<></>
                )}
                {teams.map((team, index) => (
                  <div key={team + index}>
                    <input
                      value={team}
                      onChange={(e) => {
                        const newTeams = [...teams];
                        newTeams[index] = e.target.value;
                        setTeams(newTeams);
                      }}
                    />
                    <button
                      onClick={() => {
                        const newTeams = [...teams];
                        newTeams[index] = "";
                        setTeams(newTeams);
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Tab>
          <Tab label={"Spielplan"} disabled={nodes.length === 0}>
            <ScheduleView
              matches={matches}
              teams={teams}
              onBack={() => undefined}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}
