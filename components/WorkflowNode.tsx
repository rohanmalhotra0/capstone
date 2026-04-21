"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { Flow } from "@/lib/flows";
import { FlowChart } from "./FlowChart";

export interface WorkflowNodeData {
  flow: Flow;
  num: number;
  accent?: string;
  [key: string]: unknown;
}

const sides: { pos: Position; side: "t" | "r" | "b" | "l" }[] = [
  { pos: Position.Top, side: "t" },
  { pos: Position.Right, side: "r" },
  { pos: Position.Bottom, side: "b" },
  { pos: Position.Left, side: "l" },
];

export function WorkflowNode({ data }: NodeProps) {
  const d = data as WorkflowNodeData;
  const f = d.flow;
  const accent = d.accent ?? "#8a8d98";

  return (
    <div className="relative">
      {sides.map(({ pos, side }) => (
        <span key={side}>
          <Handle
            type="source"
            position={pos}
            id={`${side}-s`}
            style={{ background: accent, width: 6, height: 6, opacity: 0, pointerEvents: "none" }}
          />
          <Handle
            type="target"
            position={pos}
            id={`${side}-t`}
            style={{ background: accent, width: 6, height: 6, opacity: 0, pointerEvents: "none" }}
          />
        </span>
      ))}

      <div className="nodrag nowheel">
        <FlowChart chart={f.mermaid} />
      </div>
    </div>
  );
}
