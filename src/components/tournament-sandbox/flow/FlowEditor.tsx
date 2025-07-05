import React, {DragEventHandler, useCallback, useRef} from "react";
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
  useReactFlow
} from "@xyflow/react";
import {componentPalette, TournamenNodeType} from "../TournamentUtils";
import MatchNode from "./MatchNode";
import GroupNode from "./GroupNode";
import CustomEdge from "./CustomEdge";
import NodeBar from "../NodeBar";

const nodeTypes: NodeTypes = {
  match: MatchNode,
  group: GroupNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

let id = 1;
const getId = () => `${id++}`;

interface FlowEditorProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export function FlowEditor({
                             nodes,
                             edges,
                             onNodesChange,
                             onEdgesChange,
                             setNodes,
                             setEdges
                           }: FlowEditorProps) {
  const reactFlowWrapper = useRef(null);
  const {screenToFlowPosition} = useReactFlow();

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
        return;
      }

      if (!connectionState.fromNode || !connectionState.fromHandle) {
        return;
      }

      if (connectionState.fromHandle?.id?.startsWith("team")) {
        return;
      }

      const component = componentPalette.get(TournamenNodeType.MATCH);
      if (!component) return;

      const id = getId();
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
  );

  const addComponentToCanvas = (componentType: TournamenNodeType) => {
    const component = componentPalette.get(componentType);
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

  const onDragOver: DragEventHandler = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop: DragEventHandler = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('text/plain') as TournamenNodeType;
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

  return (
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
      </div>
    </div>
  );
}
