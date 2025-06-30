import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
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
import {TournamentState} from "./TournamentState";
import {Team} from '../../types/tournament';

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
  // React Flow
  const reactFlowWrapper = useRef(null)

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const {screenToFlowPosition} = useReactFlow();

  // State
  const [teams, setTeams] = useState<string[]>([]);
  const [tournamentState, setTournamentState] = useState<TournamentState>(undefined);
  const matches = useMemo(() => extractMatches(nodes, edges), [nodes, edges]);

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

  useEffect(() => {
    let teamCount = 0;
    if (matches.length > 0) {
      teamCount = matches[0].length * 2;
    }
    setTeams(current => {
      // Nur aktualisieren, wenn sich die Anzahl geändert hat
      if (current.length !== teamCount) {
        return Array(teamCount).fill("");
      }
      return current;
    });
  }, [matches]);

  useEffect(() => {
    if (!matches || matches.length === 0 || !teams || teams.length === 0) {
      setTournamentState(undefined);
      return;
    }

    const newState = new TournamentState(matches, teams);
    newState.assignTeams();
    setTournamentState(newState);
  }, [matches, teams]);

  const updateMatchResult = (matchId: string, result: {
    team1Points: number;
    team2Points: number;
    winner: Team
  }) => {
    const newState = new TournamentState(tournamentState.getMatches(), tournamentState.getTeams());
    newState.updateMatchResult(matchId, result);
    setTournamentState(newState);
  };

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
          <Tab label={"Teams"} disabled={matches.length === 0}>
            <div className="team-input">
              <h2>Teams hinzufügen</h2>
              <div className="teams-list">
                {teams.length === 0 ? (
                  <div>Du musst erst Spiele hinzufügen</div>) : (<></>
                )}
                {/* TODO resolve input focus problems*/}
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
          <Tab label={"Spielplan"} disabled={matches.length === 0}>
            <ScheduleView
              tournamentState={tournamentState}
              updateMatchResult={updateMatchResult}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

const areMatchesStructurallyEqual = (matches1, matches2) => {
  if (!matches1 || !matches2) return matches1 === matches2;
  if (matches1.length !== matches2.length) return false;

  for (let i = 0; i < matches1.length; i++) {
    const round1 = matches1[i];
    const round2 = matches2[i];
    if (round1.length !== round2.length) return false;

    // Vergleiche nur die relevanten Eigenschaften (ID, Verbindungen), nicht die Position
    for (let j = 0; j < round1.length; j++) {
      if (round1[j].id !== round2[j].id ||
        round1[j].nextMatchIds?.join(',') !== round2[j].nextMatchIds?.join(',') ||
        round1[j].previousMatchIds?.join(',') !== round2[j].previousMatchIds?.join(',')) {
        return false;
      }
    }
  }
  return true;
};
