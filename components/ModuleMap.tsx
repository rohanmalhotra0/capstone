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
import { useSearchParams } from "next/navigation";
import { ModuleNode, type ModuleNodeData } from "./ModuleNode";
import { ModuleDetailPanel } from "./ModuleDetailPanel";
import { IntegrationDetailPanel } from "./IntegrationDetailPanel";
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

const nodeTypes = { module: ModuleNode };

export function ModuleMap() {
  const searchParams = useSearchParams();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<
    string | null
  >(null);

  // Deep-link: /modules?m=<id> or /modules?i=<id>
  useEffect(() => {
    const m = searchParams.get("m");
    const i = searchParams.get("i");
    if (m && getModuleById(m)) {
      setSelectedIntegrationId(null);
      setSelectedModuleId(m);
    } else if (i && getIntegrationById(i)) {
      setSelectedModuleId(null);
      setSelectedIntegrationId(i);
    }
  }, [searchParams]);

  const nodes = useMemo<Node<ModuleNodeData>[]>(
    () =>
      moduleData.map((m) => ({
        id: m.id,
        type: "module",
        position: positions[m.id] ?? { x: 0, y: 0 },
        data: { module: m },
      })),
    [],
  );

  const edges = useMemo<Edge[]>(
    () =>
      integrationData.map((i) => {
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
      }),
    [],
  );

  const selectedModule: EpmModule | null = selectedModuleId
    ? (getModuleById(selectedModuleId) ?? null)
    : null;
  const selectedIntegration: Integration | null = selectedIntegrationId
    ? (getIntegrationById(selectedIntegrationId) ?? null)
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

  const onNodeClick = useCallback<NodeMouseHandler>((_, node) => {
    setSelectedIntegrationId(null);
    setSelectedModuleId(node.id);
  }, []);

  const onEdgeClick = useCallback<EdgeMouseHandler>((_, edge) => {
    setSelectedModuleId(null);
    setSelectedIntegrationId(edge.id);
  }, []);

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

      {/* Legend overlay */}
      <div className="absolute top-4 left-4 z-10 rounded-lg border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md p-3 max-w-[260px]">
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
          <li className="text-[var(--text-subtle)]">
            Drag nodes · scroll to zoom · pan to explore.
          </li>
        </ul>
      </div>

      <ModuleDetailPanel
        module={selectedModule}
        related={relatedIntegrations}
        onClose={() => setSelectedModuleId(null)}
        onSelectIntegration={(id) => {
          setSelectedModuleId(null);
          setSelectedIntegrationId(id);
        }}
      />
      <IntegrationDetailPanel
        integration={selectedIntegration}
        onClose={() => setSelectedIntegrationId(null)}
        onSelectModule={(id) => {
          setSelectedIntegrationId(null);
          setSelectedModuleId(id);
        }}
      />
    </div>
  );
}
