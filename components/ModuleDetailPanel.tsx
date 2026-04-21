"use client";

import { DetailPanel } from "./DetailPanel";
import { Badge } from "./ui/badge";
import type { EpmModule } from "@/lib/modules";
import type { Integration } from "@/lib/integrations";

interface ModuleDetailPanelProps {
  module: EpmModule | null;
  related: Integration[];
  onClose: () => void;
  onSelectIntegration?: (id: string) => void;
}

export function ModuleDetailPanel({
  module,
  related,
  onClose,
  onSelectIntegration,
}: ModuleDetailPanelProps) {
  return (
    <DetailPanel
      open={!!module}
      onClose={onClose}
      accentColor={module?.color}
      subtitle={module?.prefix ?? ""}
      title={module?.name ?? ""}
    >
      {module && (
        <>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {module.shortDescription}
          </p>

          <div className="flex flex-wrap gap-1.5">
            <Badge variant="solid" color={module.color}>
              {module.prefix || "—"}
            </Badge>
            {module.cube && <Badge>{module.cube}</Badge>}
          </div>

          <section>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-2">
              Key Features
            </h3>
            <ul className="space-y-2">
              {module.keyFeatures.map((f) => (
                <li
                  key={f}
                  className="flex gap-2 text-sm text-[var(--text)]"
                >
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                    style={{ background: module.color }}
                  />
                  <span className="text-[var(--text-muted)]">{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-2">
              Dimensions
            </h3>
            <ul className="space-y-1.5">
              {module.dimensions.map((d) => (
                <li
                  key={d.name}
                  className="flex items-start justify-between gap-3 text-sm border-b border-[var(--border)]/50 pb-1.5 last:border-0"
                >
                  <span className="text-[var(--text)]">{d.name}</span>
                  <span className="text-right">
                    <span
                      className="font-mono text-[10px] uppercase tracking-wider"
                      style={{
                        color:
                          d.kind === "required"
                            ? "var(--accent)"
                            : d.kind === "custom"
                              ? "var(--warning)"
                              : "var(--text-subtle)",
                      }}
                    >
                      {d.kind}
                    </span>
                    {d.note && (
                      <div className="text-xs text-[var(--text-subtle)] mt-0.5">
                        {d.note}
                      </div>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {related.length > 0 && (
            <section>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-2">
                Integrations
              </h3>
              <ul className="space-y-1.5">
                {related.map((i) => (
                  <li key={i.id}>
                    <button
                      onClick={() => onSelectIntegration?.(i.id)}
                      className="w-full text-left px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)]/50 hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-colors text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
                    >
                      {i.label}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </DetailPanel>
  );
}
