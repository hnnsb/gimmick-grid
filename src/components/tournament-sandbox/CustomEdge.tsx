import React from 'react';
import {EdgeProps, getBezierPath} from 'reactflow';
import './TournamentSandbox.css';

const CustomEdge = ({
                      id,
                      sourceX,
                      sourceY,
                      targetX,
                      targetY,
                      sourcePosition,
                      targetPosition,
                      style = {},
                      data,
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

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data?.onRemove) {
      data.onRemove(id);
    }
  };

  return (
    <>
      <path
        id={id}
        style={{...style, strokeWidth: 3}}
        className="react-flow__edge-path"
        d={edgePath}
      />
      {selected && (
        <foreignObject
          width={20}
          height={20}
          x={labelX - 10}
          y={labelY - 10}
          className="edge-button-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="edge-button-container">
            <button className="edge-button" onClick={handleRemove}>
              ×
            </button>
          </div>
        </foreignObject>
      )}
    </>
  );
};

export default CustomEdge;
