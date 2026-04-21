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

// Each side exposes BOTH a source and a target handle so edges can connect
// in any direction — mirrors ModuleNode.
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
      className="group relative w-[220px] rounded-xl border transition-all cursor-grab active:cursor-grabbing"
      style={{
        background:
          "linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)",
        borderColor: selected ? accent : "var(--border)",
        boxShadow: selected
          ? `0 0 0 1px ${accent}, 0 18px 36px -18px ${accent}66`
          : "0 12px 24px -12px rgba(0,0,0,0.5)",
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

      {/* Top accent bar — dashed to subtly distinguish workflows from modules */}
      <div
        className="h-1 w-full rounded-t-xl"
        style={{
          background: `repeating-linear-gradient(90deg, ${accent} 0 8px, transparent 8px 12px)`,
        }}
      />

      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
            {short}
          </span>
          <span
            className="flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0"
            style={{
              background: `${accent}22`,
              color: accent,
              border: `1px solid ${accent}44`,
            }}
          >
            <GitBranch className="h-2.5 w-2.5" />
            FLOW
          </span>
        </div>
        <p className="mt-1.5 text-[11.5px] leading-snug text-[var(--text-muted)] line-clamp-2">
          {f.caption}
        </p>
      </div>
    </div>
  );
}
