import React from 'react';
import '../TournamentSandbox.css';
import {BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow} from "@xyflow/react";

const CustomEdge = ({
                      id,
                      sourceX,
                      sourceY,
                      targetX,
                      targetY,
                      sourcePosition,
                      targetPosition,
                      style = {},
                      selected
                    }: EdgeProps) => {

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const {setEdges} = useReactFlow();

  const handleRemove = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  }

  return (
    <>
      <BaseEdge path={edgePath} style={style}/>
      {selected &&
        <EdgeLabelRenderer>
          <div
            className="button-edge__label nodrag nopan"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            <button className="button-edge__button" onClick={handleRemove}>
              ×
            </button>
          </div>
        </EdgeLabelRenderer>
      }
    </>
  );
};

export default CustomEdge;
