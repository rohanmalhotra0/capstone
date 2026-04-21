"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import type { Flow } from "@/lib/flows";

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

export function WorkflowNode({ data, selected }: NodeProps) {
  const d = data as WorkflowNodeData;
  const f = d.flow;
  const accent = d.accent ?? "#8a8d98";
  // Short headline without the em-dash subtitle
  const short = f.title.split(" — ")[0];

  return (
    <div
      className="group relative w-[180px] rounded-lg border bg-[var(--surface)] transition-all cursor-pointer"
      style={{
        borderColor: selected ? accent : "var(--border)",
        borderStyle: "dashed",
        boxShadow: selected
          ? `0 0 0 1px ${accent}, 0 10px 20px -12px ${accent}66`
          : "0 6px 14px -10px rgba(0,0,0,0.45)",
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
              width: 5,
              height: 5,
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
              width: 5,
              height: 5,
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        </span>
      ))}

      <div className="flex items-start gap-2 p-2.5">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[10px]"
          style={{
            background: `${accent}1f`,
            color: accent,
            border: `1px solid ${accent}40`,
          }}
        >
          <GitBranch className="h-3 w-3" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-[9px] tabular-nums text-[var(--text-subtle)]">
              {String(d.num).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)]">
              workflow
            </span>
          </div>
          <div className="mt-0.5 text-[12px] font-medium leading-snug tracking-tight text-[var(--text)]">
            {short}
          </div>
        </div>
      </div>
    </div>
  );
}
