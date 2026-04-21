"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  MarkerType,
  MiniMap,
  type Node,
  ReactFlow,
  type NodeMouseHandler,
  type EdgeMouseHandler,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HelpCircle, X } from "lucide-react";
import { ModuleNode, type ModuleNodeData } from "./ModuleNode";
import { WorkflowNode, type WorkflowNodeData } from "./WorkflowNode";
import { ModuleDetailPanel } from "./ModuleDetailPanel";
import { IntegrationDetailPanel } from "./IntegrationDetailPanel";
import { WorkflowDetailPanel } from "./WorkflowDetailPanel";
import {
  modules as moduleData,
  getModuleById,
  type EpmModule,
} from "@/lib/modules";
import {
  integrations as integrationData,
  getIntegrationById,
  type Integration,
} from "@/lib/integrations";
import { flows as flowData, getFlowById, type Flow } from "@/lib/flows";

interface NodePosition {
  x: number;
  y: number;
}

const positions: Record<string, NodePosition> = {
  "strategic-modeling": { x: 40, y: 80 },
  financials: { x: 520, y: 80 },
  workforce: { x: 140, y: 360 },
  capital: { x: 900, y: 360 },
  projects: { x: 520, y: 600 },
};

// Workflow node positions — clustered around related modules, offset to the
// edges so they frame the module graph without overlapping it.
const workflowPositions: Record<string, NodePosition> = {
  "data-movement": { x: 1320, y: 60 },
  "budget-revisions": { x: 1320, y: 180 },
  approvals: { x: 1320, y: 300 },
  "ipm-insights": { x: 1320, y: 420 },
  "capital-financials": { x: 1320, y: 540 },
  "security-priority": { x: -240, y: 60 },
  "bt-wizard": { x: -240, y: 340 },
  "getting-started": { x: -240, y: 620 },
};

// Which modules each workflow "touches" — drives the dashed affinity lines.
// Cross-cutting flows (security, getting-started) intentionally draw no edges.
const workflowModules: Record<string, string[]> = {
  "data-movement": ["financials"],
  "budget-revisions": ["financials"],
  approvals: ["financials"],
  "ipm-insights": ["financials"],
  "capital-financials": ["capital", "financials"],
  "bt-wizard": ["workforce"],
};

// Side-specific handle pairing so workflow→module edges enter cleanly.
const workflowEdgeRouting: Record<
  string,
  { sourceHandle: string; targetHandle: string }
> = {
  "data-movement-financials": { sourceHandle: "l-s", targetHandle: "r-t" },
  "budget-revisions-financials": { sourceHandle: "l-s", targetHandle: "r-t" },
  "approvals-financials": { sourceHandle: "l-s", targetHandle: "r-t" },
  "ipm-insights-financials": { sourceHandle: "l-s", targetHandle: "r-t" },
  "capital-financials-financials": {
    sourceHandle: "l-s",
    targetHandle: "r-t",
  },
  "capital-financials-capital": { sourceHandle: "l-s", targetHandle: "r-t" },
  "bt-wizard-workforce": { sourceHandle: "r-s", targetHandle: "l-t" },
};

// Explicit handle routing for nicer edge paths
const edgeRouting: Record<
  string,
  { sourceHandle: string; targetHandle: string }
> = {
  "sm-to-fs": { sourceHandle: "r-s", targetHandle: "l-t" },
  "wf-to-fs": { sourceHandle: "t-s", targetHandle: "b-t" },
  "cx-to-fs": { sourceHandle: "t-s", targetHandle: "b-t" },
  "pf-to-fs": { sourceHandle: "t-s", targetHandle: "b-t" },
  "pf-to-cx": { sourceHandle: "r-s", targetHandle: "b-t" },
  "cx-to-pf": { sourceHandle: "b-s", targetHandle: "r-t" },
  "wf-to-pf": { sourceHandle: "b-s", targetHandle: "l-t" },
};

const nodeTypes = { module: ModuleNode, workflow: WorkflowNode };

const HELP_STORAGE_KEY = "epm-map-help-dismissed";

export function ModuleMap() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<
    string | null
  >(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    null,
  );
  const [helpOpen, setHelpOpen] = useState(false);

  const replaceParam = useCallback(
    (key: "m" | "i" | "f" | null, value?: string) => {
      const next = new URLSearchParams();
      if (key && value) next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `/atlas?${qs}` : "/atlas", { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(HELP_STORAGE_KEY) === "1";
    setHelpOpen(!dismissed);
  }, []);

  const dismissHelp = () => {
    setHelpOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(HELP_STORAGE_KEY, "1");
    }
  };
  const openHelp = () => {
    setHelpOpen(true);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(HELP_STORAGE_KEY);
    }
  };

  // Deep-link: /atlas?m=<id>, ?i=<id>, or ?f=<id>
  useEffect(() => {
    const m = searchParams.get("m");
    const i = searchParams.get("i");
    const f = searchParams.get("f");
    if (m && getModuleById(m)) {
      setSelectedIntegrationId(null);
      setSelectedWorkflowId(null);
      setSelectedModuleId(m);
    } else if (i && getIntegrationById(i)) {
      setSelectedModuleId(null);
      setSelectedWorkflowId(null);
      setSelectedIntegrationId(i);
    } else if (f && getFlowById(f)) {
      setSelectedModuleId(null);
      setSelectedIntegrationId(null);
      setSelectedWorkflowId(f);
    } else {
      setSelectedModuleId(null);
      setSelectedIntegrationId(null);
      setSelectedWorkflowId(null);
    }
  }, [searchParams]);

  const nodes = useMemo<Node[]>(() => {
    const moduleNodes: Node<ModuleNodeData>[] = moduleData.map((m) => ({
      id: m.id,
      type: "module",
      position: positions[m.id] ?? { x: 0, y: 0 },
      data: { module: m },
    }));
    const workflowNodes: Node<WorkflowNodeData>[] = flowData.map((f, idx) => {
      // Accent by the first related module's color, else neutral
      const related = workflowModules[f.id]?.[0];
      const relatedModule = related ? getModuleById(related) : undefined;
      return {
        id: `wf:${f.id}`,
        type: "workflow",
        position: workflowPositions[f.id] ?? { x: 0, y: 0 },
        data: {
          flow: f,
          num: idx + 1,
          accent: relatedModule?.color ?? "#8a8d98",
        },
      };
    });
    return [...moduleNodes, ...workflowNodes];
  }, []);

  const edges = useMemo<Edge[]>(() => {
    const integrationEdges: Edge[] = integrationData.map((i) => {
      const fromModule = getModuleById(i.from);
      const routing = edgeRouting[i.id] ?? {
        sourceHandle: "r-s",
        targetHandle: "l-t",
      };
      const isBi = i.bidirectional === true;
      return {
        id: i.id,
        source: i.from,
        target: i.to,
        sourceHandle: routing.sourceHandle,
        targetHandle: routing.targetHandle,
        label: i.label,
        type: "default",
        animated: false,
        style: {
          stroke: fromModule?.color ?? "#4589ff",
          strokeWidth: 1.75,
          strokeDasharray: isBi ? "6 4" : undefined,
        },
        labelStyle: {
          fill: "var(--text-muted)",
          fontSize: 11,
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: "var(--surface)",
          fillOpacity: 0.95,
        },
        labelBgPadding: [6, 4] as [number, number],
        labelBgBorderRadius: 4,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: fromModule?.color ?? "#4589ff",
          width: 16,
          height: 16,
        },
        markerStart: isBi
          ? {
              type: MarkerType.ArrowClosed,
              color: fromModule?.color ?? "#4589ff",
              width: 16,
              height: 16,
            }
          : undefined,
      };
    });

    // Dashed, unlabelled affinity lines from workflow → module.
    const workflowEdges: Edge[] = [];
    for (const f of flowData) {
      const relatedIds = workflowModules[f.id] ?? [];
      for (const moduleId of relatedIds) {
        const m = getModuleById(moduleId);
        const routing =
          workflowEdgeRouting[`${f.id}-${moduleId}`] ?? {
            sourceHandle: "l-s",
            targetHandle: "r-t",
          };
        workflowEdges.push({
          id: `wf-edge:${f.id}-${moduleId}`,
          source: `wf:${f.id}`,
          target: moduleId,
          sourceHandle: routing.sourceHandle,
          targetHandle: routing.targetHandle,
          type: "default",
          animated: false,
          style: {
            stroke: m?.color ?? "#8a8d98",
            strokeWidth: 1,
            strokeDasharray: "3 4",
            opacity: 0.5,
          },
        });
      }
    }

    return [...integrationEdges, ...workflowEdges];
  }, []);

  const selectedModule: EpmModule | null = selectedModuleId
    ? (getModuleById(selectedModuleId) ?? null)
    : null;
  const selectedIntegration: Integration | null = selectedIntegrationId
    ? (getIntegrationById(selectedIntegrationId) ?? null)
    : null;
  const selectedWorkflow: Flow | null = selectedWorkflowId
    ? (getFlowById(selectedWorkflowId) ?? null)
    : null;

  const relatedIntegrations: Integration[] = useMemo(
    () =>
      selectedModuleId
        ? integrationData.filter(
            (i) => i.from === selectedModuleId || i.to === selectedModuleId,
          )
        : [],
    [selectedModuleId],
  );

  const workflowRelatedModuleIds: string[] = selectedWorkflowId
    ? (workflowModules[selectedWorkflowId] ?? [])
    : [];
  const workflowAccent: string | undefined = selectedWorkflowId
    ? getModuleById(workflowRelatedModuleIds[0] ?? "")?.color
    : undefined;

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (node.type === "workflow") {
        const flowId = node.id.startsWith("wf:")
          ? node.id.slice(3)
          : node.id;
        setSelectedModuleId(null);
        setSelectedIntegrationId(null);
        setSelectedWorkflowId(flowId);
        replaceParam("f", flowId);
      } else {
        setSelectedIntegrationId(null);
        setSelectedWorkflowId(null);
        setSelectedModuleId(node.id);
        replaceParam("m", node.id);
      }
    },
    [replaceParam],
  );

  const onEdgeClick = useCallback<EdgeMouseHandler>(
    (_, edge) => {
      // Only integration edges open a panel. Workflow affinity edges are
      // non-interactive — their id is prefixed `wf-edge:`.
      if (edge.id.startsWith("wf-edge:")) return;
      setSelectedModuleId(null);
      setSelectedWorkflowId(null);
      setSelectedIntegrationId(edge.id);
      replaceParam("i", edge.id);
    },
    [replaceParam],
  );

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.3}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        panOnDrag
        zoomOnScroll
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="var(--border)"
        />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => {
            const m = (n.data as ModuleNodeData | undefined)?.module;
            return m?.color ?? "#4589ff";
          }}
          maskColor="rgba(11, 15, 26, 0.72)"
        />
        <Controls showInteractive={false} />
      </ReactFlow>

      {helpOpen ? (
        <div className="absolute top-4 left-4 z-10 rounded-lg border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md p-3 pr-8 max-w-[260px]">
          <button
            onClick={dismissHelp}
            aria-label="Dismiss how to use"
            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-2">
            How to use
          </div>
          <ul className="text-xs text-[var(--text-muted)] space-y-1 leading-relaxed">
            <li>
              <span className="text-[var(--text)]">Click a module</span> for
              features, dimensions, integrations.
            </li>
            <li>
              <span className="text-[var(--text)]">Click an arrow</span> for data
              shared and setup steps.
            </li>
            <li>
              <span className="text-[var(--text)]">Click a workflow</span> (dashed
              pill) to open its flowchart.
            </li>
            <li className="text-[var(--text-subtle)]">
              Drag nodes · scroll to zoom · pan to explore.
            </li>
          </ul>
        </div>
      ) : (
        <button
          onClick={openHelp}
          aria-label="Show how to use"
          className="absolute top-4 left-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      )}

      <ModuleDetailPanel
        module={selectedModule}
        related={relatedIntegrations}
        onClose={() => {
          setSelectedModuleId(null);
          replaceParam(null);
        }}
        onSelectIntegration={(id) => {
          setSelectedModuleId(null);
          setSelectedIntegrationId(id);
          replaceParam("i", id);
        }}
      />
      <IntegrationDetailPanel
        integration={selectedIntegration}
        onClose={() => {
          setSelectedIntegrationId(null);
          replaceParam(null);
        }}
        onSelectModule={(id) => {
          setSelectedIntegrationId(null);
          setSelectedModuleId(id);
          replaceParam("m", id);
        }}
      />
      <WorkflowDetailPanel
        flow={selectedWorkflow}
        relatedModuleIds={workflowRelatedModuleIds}
        accentColor={workflowAccent}
        onClose={() => {
          setSelectedWorkflowId(null);
          replaceParam(null);
        }}
        onSelectModule={(id) => {
          setSelectedWorkflowId(null);
          setSelectedModuleId(id);
          replaceParam("m", id);
        }}
      />
    </div>
  );
}
