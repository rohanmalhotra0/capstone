"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import type { Flow } from "@/lib/flows";
import { FlowChart } from "./FlowChart";

export interface WorkflowNodeData {
  flow: Flow;
  num: number;
  accent?: string;
  [key: string]: unknown;
}

// Four-sided handles so affinity edges can connect from any direction.
const sides: { pos: Position; side: "t" | "r" | "b" | "l" }[] = [
  { pos: Position.Top, side: "t" },
  { pos: Position.Right, side: "r" },
  { pos: Position.Bottom, side: "b" },
  { pos: Position.Left, side: "l" },
];

export function WorkflowNode({ data, selected }: NodeProps) {
  const d = data as WorkflowNodeData;
  const f = d.flow;
  const accent = d.accent ?? "#8a8d98";
  const short = f.title.split(" — ")[0];

  return (
    <div
      className="relative w-[460px] rounded-xl border transition-all overflow-hidden"
      style={{
        background: "var(--surface)",
        borderColor: selected ? accent : "var(--border)",
        boxShadow: selected
          ? `0 0 0 1px ${accent}, 0 20px 40px -16px ${accent}66`
          : "0 12px 28px -12px rgba(0,0,0,0.5)",
      }}
    >
      {sides.map(({ pos, side }) => (
        <span key={side}>
          <Handle
            type="source"
            position={pos}
            id={`${side}-s`}
            style={{
              background: accent,
              width: 6,
              height: 6,
              opacity: 0,
              pointerEvents: "none",
            }}
          />
          <Handle
            type="target"
            position={pos}
            id={`${side}-t`}
            style={{
              background: accent,
              width: 6,
              height: 6,
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        </span>
      ))}

      {/* Header — acts as the drag handle for the node */}
      <div
        className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-grab active:cursor-grabbing border-b border-[var(--border)]"
        style={{ borderBottomColor: `${accent}55` }}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
          style={{
            background: `${accent}1f`,
            border: `1px solid ${accent}40`,
            color: accent,
          }}
        >
          <GitBranch className="h-3.5 w-3.5" />
        </span>
        <span className="flex-1 text-[13px] font-semibold tracking-tight text-[var(--text)] truncate">
          {short}
        </span>
        <span
          className="font-mono text-[9px] px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider"
          style={{
            background: `${accent}1a`,
            color: accent,
            border: `1px solid ${accent}33`,
          }}
        >
          Flow
        </span>
      </div>

      {/*
        Chart body.
        - nodrag  → clicking here doesn't start a node-drag (drag from header)
        - nowheel → scroll inside the chart without zooming the canvas
      */}
      <div className="nodrag nowheel p-3 overflow-auto max-h-[520px]">
        <FlowChart chart={f.mermaid} />
      </div>
    </div>
  );
}
