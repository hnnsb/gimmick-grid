import {Handle, useNodeConnections} from "@xyflow/react";
import {HandleProps} from "@xyflow/system";
import {HTMLAttributes} from "react";

interface LimitHandleProps extends HandleProps {
  className?: string;
  limit: number;
}

export default function LimitHandle(props: LimitHandleProps & Omit<HTMLAttributes<HTMLDivElement>, "id">) {
  const connections = useNodeConnections({id: props.id, handleType: props.type});
  return (
    <Handle
      className={props.className}
      {...props}
      isConnectable={connections.length < props.limit}
    />
  );
}
