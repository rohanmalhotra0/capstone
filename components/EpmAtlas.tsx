"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Network,
  Workflow,
} from "lucide-react";
import { ModuleMap } from "./ModuleMap";
import { FlowChart } from "./FlowChart";
import { modules } from "@/lib/modules";
import { flows, getFlowById } from "@/lib/flows";
import { cn } from "@/lib/utils";

type View = "map" | "flow";

export function EpmAtlas() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);

  const view: View = searchParams.get("view") === "flow" ? "flow" : "map";
  const flowId = searchParams.get("f");
  const moduleId = searchParams.get("m");
  const integrationId = searchParams.get("i");
  const activeFlow = flowId ? (getFlowById(flowId) ?? null) : null;

  // If view=flow but invalid id, fall back to map view
  useEffect(() => {
    if (view === "flow" && flowId && !activeFlow) {
      router.replace("/atlas", { scroll: false });
    }
  }, [view, flowId, activeFlow, router]);

  const pushParams = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      router.replace(qs ? `/atlas?${qs}` : "/atlas", { scroll: false });
    },
    [router],
  );

  const selectModule = useCallback(
    (id: string) => {
      const next = new URLSearchParams();
      next.set("m", id);
      pushParams(next);
    },
    [pushParams],
  );

  const selectFlow = useCallback(
    (id: string) => {
      const next = new URLSearchParams();
      next.set("view", "flow");
      next.set("f", id);
      pushParams(next);
    },
    [pushParams],
  );

  const showFullMap = useCallback(() => {
    pushParams(new URLSearchParams());
  }, [pushParams]);

  const activeKey = useMemo(() => {
    if (view === "flow" && flowId) return `flow:${flowId}`;
    if (moduleId) return `module:${moduleId}`;
    if (integrationId) return `integration:${integrationId}`;
    return "overview";
  }, [view, flowId, moduleId, integrationId]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      <aside
        className={cn(
          "relative flex flex-col border-r border-[var(--border)] bg-[var(--surface)]/40 backdrop-blur-sm transition-[width] duration-200 ease-out",
          collapsed ? "w-12" : "w-72",
        )}
      >
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand table of contents" : "Collapse table of contents"}
          className="absolute -right-3 top-4 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] shadow-sm hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {collapsed ? (
          <div className="flex flex-col items-center gap-3 pt-14">
            <button
              onClick={showFullMap}
              aria-label="Module map"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                view === "map" && !moduleId && !integrationId
                  ? "bg-[var(--surface-2)] text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/60",
              )}
            >
              <Network className="h-4 w-4" />
            </button>
            <button
              onClick={() => selectFlow(flows[0].id)}
              aria-label="Workflows"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                view === "flow"
                  ? "bg-[var(--surface-2)] text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/60",
              )}
            >
              <GitBranch className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-3 py-5">
            <div className="px-2 pb-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)]">
                EPM Atlas
              </div>
              <p className="mt-1 text-[11px] leading-snug text-[var(--text-muted)]">
                Modules and workflows in one place. Jump anywhere.
              </p>
            </div>

            <button
              onClick={showFullMap}
              className={cn(
                "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors",
                activeKey === "overview"
                  ? "bg-[var(--surface-2)] text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/60",
              )}
            >
              <Workflow className="h-3.5 w-3.5 shrink-0" />
              <span>Full Module Map</span>
            </button>

            <Section
              icon={<Network className="h-3 w-3" />}
              label="Modules"
              count={modules.length}
            >
              {modules.map((m) => {
                const active = view === "map" && moduleId === m.id;
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => selectModule(m.id)}
                      className={cn(
                        "group w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm text-left transition-colors",
                        active
                          ? "bg-[var(--surface-2)] text-[var(--text)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/60",
                      )}
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: m.color }}
                      />
                      <span className="truncate">{m.name}</span>
                      <span className="ml-auto font-mono text-[10px] text-[var(--text-subtle)]">
                        {m.prefix !== "—" ? m.prefix.replace(/_$/, "") : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </Section>

            <Section
              icon={<GitBranch className="h-3 w-3" />}
              label="Workflows"
              count={flows.length}
            >
              {flows.map((f, i) => {
                const active = view === "flow" && flowId === f.id;
                return (
                  <li key={f.id}>
                    <button
                      onClick={() => selectFlow(f.id)}
                      className={cn(
                        "group w-full flex items-start gap-2.5 px-2.5 py-1.5 rounded-md text-sm text-left transition-colors",
                        active
                          ? "bg-[var(--surface-2)] text-[var(--text)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/60",
                      )}
                    >
                      <span className="mt-0.5 font-mono text-[10px] w-4 shrink-0 text-[var(--text-subtle)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-snug">{f.title.split(" — ")[0]}</span>
                    </button>
                  </li>
                );
              })}
            </Section>

            <div className="mt-6 px-2 text-[10px] leading-relaxed text-[var(--text-subtle)]">
              Selections update the URL — share links with <code>?m=</code> for a module or <code>?view=flow&f=</code> for a workflow.
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 relative min-w-0">
        {view === "flow" && activeFlow ? (
          <FlowView
            key={activeFlow.id}
            title={activeFlow.title}
            caption={activeFlow.caption}
            whyItMatters={activeFlow.whyItMatters}
            mermaid={activeFlow.mermaid}
          />
        ) : (
          <ModuleMap />
        )}
      </main>
    </div>
  );
}

function Section({
  icon,
  label,
  count,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between px-2 pb-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)]">
          {icon}
          <span>{label}</span>
        </div>
        <span className="font-mono text-[10px] text-[var(--text-subtle)]">
          {count}
        </span>
      </div>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function FlowView({
  title,
  caption,
  whyItMatters,
  mermaid,
}: {
  title: string;
  caption: string;
  whyItMatters: string;
  mermaid: string;
}) {
  return (
    <div className="flex flex-col h-full">
      <header className="border-b border-[var(--border)] px-6 py-5 bg-[var(--surface)]/40">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-1">
          Workflow
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
          {caption}
        </p>
      </header>
      <div className="flex-1 overflow-auto p-6">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/30 p-6 flex items-center justify-center min-h-full">
          <FlowChart chart={mermaid} />
        </div>
      </div>
      <footer className="border-t border-[var(--border)] px-6 py-3.5 bg-[var(--surface-2)]/40">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)] mr-2">
          Why it matters —
        </span>
        <span className="text-xs text-[var(--text-muted)] leading-relaxed">
          {whyItMatters}
        </span>
      </footer>
    </div>
  );
}
