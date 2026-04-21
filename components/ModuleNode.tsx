"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { EpmModule } from "@/lib/modules";

export interface ModuleNodeData {
  module: EpmModule;
  selected?: boolean;
  [key: string]: unknown;
}

// Each side exposes BOTH a source and a target handle so edges can connect
// in any direction. IDs: `${side}-s` for source, `${side}-t` for target.
const sides: { pos: Position; side: "t" | "r" | "b" | "l" }[] = [
  { pos: Position.Top, side: "t" },
  { pos: Position.Right, side: "r" },
  { pos: Position.Bottom, side: "b" },
  { pos: Position.Left, side: "l" },
];

export function ModuleNode({ data, selected }: NodeProps) {
  const d = data as ModuleNodeData;
  const m = d.module;
  return (
    <div
      className="group relative w-[220px] rounded-xl border transition-all cursor-pointer"
      style={{
        background:
          "linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)",
        borderColor: selected ? m.color : "var(--border)",
        boxShadow: selected
          ? `0 0 0 1px ${m.color}, 0 18px 36px -18px ${m.color}66`
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
              background: m.color,
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
              background: m.color,
              width: 6,
              height: 6,
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        </span>
      ))}

      {/* Top accent bar */}
      <div
        className="h-1 w-full rounded-t-xl"
        style={{ background: m.color }}
      />

      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
            {m.name}
          </span>
          <span
            className="font-mono text-[10px] px-1.5 py-0.5 rounded"
            style={{
              background: `${m.color}22`,
              color: m.color,
              border: `1px solid ${m.color}44`,
            }}
          >
            {m.prefix}
          </span>
        </div>
        <p className="mt-1.5 text-[11.5px] leading-snug text-[var(--text-muted)]">
          {m.tagline}
        </p>
      </div>
    </div>
  );
}
