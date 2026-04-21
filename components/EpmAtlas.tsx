"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Network,
  Workflow,
} from "lucide-react";
import { ModuleMap } from "./ModuleMap";
import { modules } from "@/lib/modules";
import { flows } from "@/lib/flows";
import { cn } from "@/lib/utils";

export function EpmAtlas() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);

  const moduleId = searchParams.get("m");
  const integrationId = searchParams.get("i");
  const flowIdParam = searchParams.get("f");

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
      next.set("f", id);
      pushParams(next);
    },
    [pushParams],
  );

  const showOverview = useCallback(() => {
    pushParams(new URLSearchParams());
  }, [pushParams]);

  const highlightFlowId = flowIdParam;
  const isOverviewActive = !moduleId && !integrationId && !highlightFlowId;

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
              onClick={showOverview}
              aria-label="Atlas overview"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                isOverviewActive
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
                highlightFlowId
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
                Modules and workflows on one canvas. Click anywhere on the map.
              </p>
            </div>

            <button
              onClick={showOverview}
              className={cn(
                "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors",
                isOverviewActive
                  ? "bg-[var(--surface-2)] text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/60",
              )}
            >
              <Workflow className="h-3.5 w-3.5 shrink-0" />
              <span>Atlas</span>
              <span className="ml-auto font-mono text-[10px] text-[var(--text-subtle)]">
                top
              </span>
            </button>

            <Section
              icon={<Network className="h-3 w-3" />}
              label="Module Maps"
              count={modules.length}
            >
              {modules.map((m) => {
                const active = !highlightFlowId && moduleId === m.id;
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
                const active = highlightFlowId === f.id;
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
              Share links with <code>?m=</code> for a module or <code>?f=</code> for a workflow.
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 relative min-w-0">
        <ModuleMap />
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

