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
import { ModuleNode, type ModuleNodeData } from "./ModuleNode";
import { WorkflowNode, type WorkflowNodeData } from "./WorkflowNode";
import { ModuleDetailPanel } from "./ModuleDetailPanel";
import { IntegrationDetailPanel } from "./IntegrationDetailPanel";
import { WorkflowDetailPanel } from "./WorkflowDetailPanel";
import { AtlasTutorial } from "./AtlasTutorial";
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

// Module positions — tight cluster in the center of the canvas
const positions: Record<string, NodePosition> = {
  "strategic-modeling": { x: 0,   y: 400 },
  financials:          { x: 320, y: 400 },
  workforce:           { x: 80,  y: 620 },
  capital:             { x: 560, y: 620 },
  projects:            { x: 320, y: 820 },
};

// Workflow positions — flowcharts arranged around the module cluster.
// Row 1 (top):        y = 0,   three across
// Row 2 (flanking):   y = 520, two on each side of modules
// Row 3 (bottom):     y = 1060, three across
const workflowPositions: Record<string, NodePosition> = {
  "getting-started":    { x: -200, y:    0 },
  "security-priority":  { x:  320, y:    0 },
  "data-movement":      { x:  840, y:    0 },
  "bt-wizard":          { x: -200, y:  520 },
  "ipm-insights":       { x:  840, y:  520 },
  "budget-revisions":   { x: -200, y: 1060 },
  approvals:            { x:  320, y: 1060 },
  "capital-financials": { x:  840, y: 1060 },
};

// Which modules each workflow "touches" — used by the detail panel's
// "Related Modules" list. No longer drives canvas edges (charts are
// self-explanatory now that they render inline).
const workflowModules: Record<string, string[]> = {
  "data-movement": ["financials"],
  "budget-revisions": ["financials"],
  approvals: ["financials"],
  "ipm-insights": ["financials"],
  "capital-financials": ["capital", "financials"],
  "bt-wizard": ["workforce"],
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
  const replaceParam = useCallback(
    (key: "m" | "i" | "f" | null, value?: string) => {
      const next = new URLSearchParams();
      if (key && value) next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `/atlas?${qs}` : "/atlas", { scroll: false });
    },
    [router],
  );

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

    return integrationEdges;
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
        <AtlasTutorial />
      </ReactFlow>

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
