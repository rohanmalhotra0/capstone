"use client";

import { DetailPanel } from "./DetailPanel";
import type { Flow } from "@/lib/flows";
import { getModuleById } from "@/lib/modules";

interface WorkflowDetailPanelProps {
  flow: Flow | null;
  relatedModuleIds: string[];
  accentColor?: string;
  onClose: () => void;
  onSelectModule?: (id: string) => void;
}

export function WorkflowDetailPanel({
  flow,
  relatedModuleIds,
  accentColor,
  onClose,
  onSelectModule,
}: WorkflowDetailPanelProps) {
  return (
    <DetailPanel
      open={!!flow}
      onClose={onClose}
      accentColor={accentColor ?? "#8a8d98"}
      subtitle="Workflow"
      title={flow?.title ?? ""}
      className="sm:w-[420px]"
    >
      {flow && (
        <>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {flow.caption}
          </p>

          <section className="rounded-md border border-[var(--border)] bg-[var(--surface-2)]/40 p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-1">
              Why it matters
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {flow.whyItMatters}
            </p>
          </section>

          {relatedModuleIds.length > 0 && (
            <section>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-2">
                Related Modules
              </h3>
              <ul className="space-y-1.5">
                {relatedModuleIds.map((id) => {
                  const m = getModuleById(id);
                  if (!m) return null;
                  return (
                    <li key={id}>
                      <button
                        onClick={() => onSelectModule?.(id)}
                        className="w-full text-left px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)]/50 hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-colors flex items-center gap-2.5"
                      >
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ background: m.color }}
                        />
                        <span className="text-sm text-[var(--text)]">
                          {m.name}
                        </span>
                        <span className="ml-auto font-mono text-[10px] text-[var(--text-subtle)]">
                          {m.prefix}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      )}
    </DetailPanel>
  );
}
