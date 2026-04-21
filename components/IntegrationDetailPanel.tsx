"use client";

import { ArrowRight } from "lucide-react";
import { DetailPanel } from "./DetailPanel";
import { Badge } from "./ui/badge";
import type { Integration } from "@/lib/integrations";
import { getModuleById } from "@/lib/modules";

interface IntegrationDetailPanelProps {
  integration: Integration | null;
  onClose: () => void;
  onSelectModule?: (id: string) => void;
}

export function IntegrationDetailPanel({
  integration,
  onClose,
  onSelectModule,
}: IntegrationDetailPanelProps) {
  const from = integration ? getModuleById(integration.from) : undefined;
  const to = integration ? getModuleById(integration.to) : undefined;
  return (
    <DetailPanel
      open={!!integration}
      onClose={onClose}
      accentColor="#0f62fe"
      subtitle="Integration"
      title={integration?.label ?? ""}
    >
      {integration && from && to && (
        <>
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => onSelectModule?.(from.id)}
              className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)]/50 hover:bg-[var(--surface-2)] transition-colors text-left"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)]">
                From
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: from.color }}
                />
                <span className="text-[var(--text)] font-medium">
                  {from.name}
                </span>
              </div>
            </button>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-subtle)]" />
            <button
              onClick={() => onSelectModule?.(to.id)}
              className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)]/50 hover:bg-[var(--surface-2)] transition-colors text-left"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)]">
                To
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: to.color }}
                />
                <span className="text-[var(--text)] font-medium">
                  {to.name}
                </span>
              </div>
            </button>
          </div>

          {integration.bidirectional && (
            <Badge variant="outline" color="#08bdba">
              bidirectional
            </Badge>
          )}

          <section>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-2">
              Data Shared
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {integration.dataShared}
            </p>
          </section>

          <section>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-2">
              Setup Required
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {integration.setupRequired}
            </p>
          </section>

          <section>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-2">
              Example
            </h3>
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)]/60 p-3 font-mono text-xs leading-relaxed text-[var(--text-muted)]">
              {integration.example}
            </div>
          </section>
        </>
      )}
    </DetailPanel>
  );
}
