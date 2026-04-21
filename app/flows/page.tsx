import { FlowsGallery } from "@/components/FlowsGallery";

export const metadata = {
  title: "Flowcharts — Oracle EPM Planning Modules",
  description:
    "Eight Mermaid flowcharts covering Data Movement, Security Priority, B&T Wizard, Budget Revisions, Approvals, IPM Insights, Capital→Financials, and Getting Started.",
};

export default function FlowsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-16 pb-24">
      <header className="mb-12 max-w-3xl">
        <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
          <span className="inline-block h-px w-8 bg-[var(--border-strong)]" />
          02 — Flowcharts
        </div>
        <h1 className="mt-5 text-[40px] sm:text-[56px] font-semibold tracking-[-0.02em] leading-[1] text-[var(--text)]">
          Eight workflows,
          <br />
          <span className="text-[var(--text-muted)] italic font-normal">
            rendered live.
          </span>
        </h1>
        <p className="mt-5 text-[15px] leading-[1.6] text-[var(--text-muted)]">
          Each flowchart is defined as structured Mermaid source in{" "}
          <code className="font-mono text-[13px] text-[var(--text)] bg-[var(--surface-2)] px-1.5 py-0.5 rounded border border-[var(--border)]">
            lib/flows.ts
          </code>{" "}
          and rendered client‑side. Click any card to expand full‑screen.
        </p>
      </header>
      <FlowsGallery />
    </div>
  );
}
