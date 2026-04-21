"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, GraduationCap, X } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

interface TutorialStep {
  title: string;
  body: string;
  /** Node ID to zoom to, or null for overview */
  focusNode?: string;
  /** If set, highlights a specific area */
  hint?: string;
}

const STEPS: TutorialStep[] = [
  {
    title: "Welcome to the EPM Atlas",
    body: "This interactive canvas maps every Oracle EPM Planning module and the workflows that connect them. Let's walk through it step by step.",
    hint: "Use the Next button to advance, or press the arrow keys.",
  },
  {
    title: "Module Cards",
    body: "The colored cards at the top are EPM Planning modules — Financials, Workforce, Capital, Projects, and Strategic Modeling. Each one represents a distinct planning area with its own cube, dimensions, and business rules.",
  },
  {
    title: "Financials",
    body: "The hub of EPM Planning. Driver-based P&L, Balance Sheet, and Cash Flow all live here. Every other module feeds data into Financials — that's why all the arrows point toward it.",
    focusNode: "financials",
  },
  {
    title: "Workforce",
    body: "Handles headcount planning, compensation, and benefits. Salary and tax data flows up to the Financials P&L as compensation expense via the Benefits & Taxes Wizard mapping.",
    focusNode: "workforce",
  },
  {
    title: "Capital",
    body: "Manages fixed assets — tangible, intangible, and leases (IFRS 16). Depreciation expense and net book values sync to the Financials Balance Sheet and P&L automatically.",
    focusNode: "capital",
  },
  {
    title: "Projects",
    body: "Project-level cost planning. Capital project costs roll into Capital as CIP, while OpEx projects push directly to Financials operating expenses.",
    focusNode: "projects",
  },
  {
    title: "Strategic Modeling",
    body: "Long-range planning and what-if scenario modeling. Works at a consolidated entity level and feeds high-level targets back into Financials for top-down planning.",
    focusNode: "strategic-modeling",
  },
  {
    title: "Integration Arrows",
    body: "The arrows between modules show data integrations. Click any arrow to see exactly what data moves, what setup is required, and a concrete example. Dashed arrows mean bidirectional data flow.",
    focusNode: "financials",
    hint: "Try clicking an arrow after the tutorial.",
  },
  {
    title: "Data Movement",
    body: "The most tested exam topic. This decision tree helps you pick between Smart Push (form-save trigger), Data Map (scheduled admin job), and Data Integration (external source like ERP or HCM).",
    focusNode: "wf:data-movement",
  },
  {
    title: "Security — 5-Layer Evaluation",
    body: "A write succeeds only if every layer passes: Role → Artifact → Dimension/Member → Valid Intersection → Cell-level. The key trick: 'None' overrides 'Write' — if any group grants None on a member, the user has no access regardless.",
    focusNode: "wf:security-priority",
  },
  {
    title: "Benefits & Taxes Wizard",
    body: "Maps Workforce compensation components to Financials accounts. Employer-side taxes (FICA, FUTA, SUTA) and benefits are configured here and flow automatically to the P&L.",
    focusNode: "wf:bt-wizard",
  },
  {
    title: "Budget Revisions",
    body: "Adjusts an approved budget mid-cycle without restarting the full planning process. Integrates with Oracle Budgetary Control for commitment tracking.",
    focusNode: "wf:budget-revisions",
  },
  {
    title: "Approvals",
    body: "Planning units move through an approval state machine: Not Started → First Pass → Approved (or Rejected). Three template types: Bottom Up, Distribute, and Free Form — each with different promotion rules.",
    focusNode: "wf:approvals",
  },
  {
    title: "IPM Insights",
    body: "Intelligent Performance Management uses ML to detect anomalies, predict trends, and surface variance explanations. It sits on top of Financials data and helps planners focus on what matters.",
    focusNode: "wf:ipm-insights",
  },
  {
    title: "Capital–Financials Integration",
    body: "The detailed handoff between Capital and Financials. Depreciation, gain/loss on disposal, and lease amortization all post to specific Financials line items via account mapping.",
    focusNode: "wf:capital-financials",
  },
  {
    title: "Getting Started",
    body: "The onboarding checklist for a new EPM instance. Covers enabling features, dimension setup, form creation, security assignment, and the first calculation run.",
    focusNode: "wf:getting-started",
  },
  {
    title: "You're ready!",
    body: "That's the full Atlas. Click any module for its features and dimensions, click an arrow for integration details, or click a workflow flowchart for context. Use the sidebar to jump to any section.",
    hint: "You can replay this tutorial anytime with the graduation cap button.",
  },
];

const TUTORIAL_STORAGE_KEY = "epm-atlas-tutorial-completed";

export function AtlasTutorial() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const { fitView, setCenter, getNode } = useReactFlow();

  // Auto-show on first visit
  useEffect(() => {
    if (typeof window === "undefined") return;
    const completed = window.localStorage.getItem(TUTORIAL_STORAGE_KEY) === "1";
    if (!completed) {
      setActive(true);
    }
  }, []);

  const focusOnNode = useCallback(
    (nodeId: string) => {
      const node = getNode(nodeId);
      if (!node) return;
      const w = node.measured?.width ?? 220;
      const h = node.measured?.height ?? 100;
      const x = node.position.x + w / 2;
      const y = node.position.y + h / 2;
      // Workflow charts are large — zoom out so the full chart is visible
      const isWorkflow = nodeId.startsWith("wf:");
      const zoom = isWorkflow ? 0.45 : 0.9;
      setCenter(x, y, { zoom, duration: 600 });
    },
    [getNode, setCenter],
  );

  const focusModuleCluster = useCallback(() => {
    // Center on the module cluster (roughly x:0..740, y:0..460)
    setCenter(370, 230, { zoom: 0.85, duration: 600 });
  }, [setCenter]);

  const goTo = useCallback(
    (idx: number) => {
      setStep(idx);
      const s = STEPS[idx];
      if (s.focusNode) {
        focusOnNode(s.focusNode);
      } else if (idx === 0 || idx === STEPS.length - 1) {
        fitView({ padding: 0.15, duration: 600 });
      } else {
        // Steps without a focusNode (like "Module Cards") show the module cluster
        focusModuleCluster();
      }
    },
    [focusOnNode, focusModuleCluster, fitView],
  );

  const next = useCallback(() => {
    if (step < STEPS.length - 1) goTo(step + 1);
  }, [step, goTo]);

  const prev = useCallback(() => {
    if (step > 0) goTo(step - 1);
  }, [step, goTo]);

  const close = useCallback(() => {
    setActive(false);
    setStep(0);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TUTORIAL_STORAGE_KEY, "1");
    }
    fitView({ padding: 0.15, duration: 400 });
  }, [fitView]);

  const start = useCallback(() => {
    setActive(true);
    setStep(0);
    fitView({ padding: 0.15, duration: 600 });
  }, [fitView]);

  // Keyboard navigation
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, next, prev, close]);

  if (!active) {
    return (
      <button
        onClick={start}
        aria-label="Start tutorial"
        className="absolute top-4 left-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
      >
        <GraduationCap className="h-4 w-4" />
      </button>
    );
  }

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[480px] max-w-[calc(100vw-2rem)]">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-0.5 bg-[var(--border)]">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-0.5">
                Step {step + 1} of {STEPS.length}
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)] tracking-tight">
                {current.title}
              </h3>
            </div>
            <button
              onClick={close}
              aria-label="Close tutorial"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Body */}
          <p className="text-[13px] leading-relaxed text-[var(--text-muted)] mb-1">
            {current.body}
          </p>

          {current.hint && (
            <p className="text-[11px] text-[var(--text-subtle)] italic">
              {current.hint}
            </p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
            <button
              onClick={prev}
              disabled={step === 0}
              className="flex items-center gap-1 text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </button>

            {/* Step dots */}
            <div className="flex items-center gap-1">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step
                      ? "w-4 bg-[var(--primary)]"
                      : i < step
                        ? "w-1.5 bg-[var(--text-subtle)]"
                        : "w-1.5 bg-[var(--border-strong)]"
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                className="flex items-center gap-1 text-[12px] font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={close}
                className="text-[12px] font-medium text-[var(--success)] hover:opacity-80 transition-colors"
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
