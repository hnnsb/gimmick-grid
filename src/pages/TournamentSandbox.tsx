import React, {useCallback, useState} from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  MiniMap,
  Node,
  NodeTypes,
  useEdgesState,
  useNodesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../components/tournament-sandbox/TournamentSandbox.css';

// Importieren der ausgelagerten Komponenten
import MatchNode from '../components/tournament-sandbox/MatchNode';
import GroupNode from '../components/tournament-sandbox/GroupNode';
import CustomEdge from '../components/tournament-sandbox/CustomEdge';
import ScheduleView from '../components/tournament-sandbox/ScheduleView';
import {componentPalette, extractMatches} from '../components/tournament-sandbox/TournamentUtils';

// Importieren der Typen

// Registrieren der benutzerdefinierten Knotentypen
const nodeTypes: NodeTypes = {
  match: MatchNode,
  group: GroupNode,
};

const edgeTypes = {
  custom: CustomEdge,
}

export default function TournamentSandbox() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nextId, setNextId] = useState(1);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Modifiziere deinen onConnect-Handler, um die Kanten mit zusätzlichen Daten zu versehen
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'custom',
        data: {
          onRemove: (edgeId: string) => {
            setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
          }
        }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Funktion zum Löschen einer Node
  const handleNodeDelete = useCallback((nodeId: string) => {
    // Lösche die Node
    setNodes(nodes => nodes.filter(node => node.id !== nodeId));

    // Lösche alle verbundenen Kanten
    setEdges(edges => edges.filter(edge =>
      edge.source !== nodeId && edge.target !== nodeId
    ));
  }, [setNodes, setEdges]);

  // Neue Komponente zum Spielfeld hinzufügen
  const addComponentToCanvas = (componentType: string) => {
    const component = componentPalette.find(comp => comp.type === componentType);
    if (!component) return;

    const id = `node_${nextId}`;
    const newNode: Node = {
      id,
      type: component.type,
      position: {x: 250, y: 100 + (nextId * 10)},
      data: {
        ...component.data,
        onTeamsChange: handleTeamsChange,
        onDelete: handleNodeDelete,
      }
    };

    setNodes(nodes => [...nodes, newNode]);
    setNextId(nextId + 1);
  };

  // Alle Kanten entfernen
  const removeAllEdges = useCallback(() => {
    setEdges([]);
  }, [setEdges]);

  // Prüfen, ob eine Verbindung hergestellt werden kann
  const isValidConnection = useCallback(
    (connection: Connection) => {
      // Überprüfe, ob der Ziel-Handle bereits eine Verbindung hat
      const targetNodeId = connection.target;
      const targetHandleId = connection.targetHandle;

      // Für Target-Handles wollen wir nur eine Verbindung erlauben
      const hasConnectionAlready = edges.some(
        (edge) => edge.target === targetNodeId && edge.targetHandle === targetHandleId
      );

      // Verhindere die Verbindung, wenn der Handle bereits verbunden ist
      return !hasConnectionAlready;
    },
    [edges]
  );

  // Funktion zur Aktualisierung der Teams in einem Gruppenknoten
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


  const matches = extractMatches(nodes, edges);

  return (
    <div className="container tournament-sandbox">
      <div className="beta-badge">BETA</div>
      <h1>Tournament Sandbox</h1>

      {showSchedule ? (
        <ScheduleView
          matches={matches}
          onBack={() => setShowSchedule(false)}
        />
      ) : (
        <div className="tournament-builder-container">
          <div className="component-palette">
            <h3>Turnier Komponenten</h3>
            <button onClick={() => addComponentToCanvas('match')}>Einzelspiel</button>
            <button onClick={() => addComponentToCanvas('group')}>Gruppenphase</button>
          </div>

          <div className="flow-container"
               style={{height: 800, width: 1200, border: '1px solid #ddd'}}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
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
