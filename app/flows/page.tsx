import { FlowsGallery } from "@/components/FlowsGallery";

export const metadata = {
  title: "Flowcharts — Oracle EPM Planning Modules",
  description:
    "Five Mermaid flowcharts covering B&T Wizard, Budget Revisions, Approvals, Capital→Financials, and Getting Started.",
};

export default function FlowsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-10 pb-24">
      <header className="mb-10 max-w-3xl">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-2">
          Flowchart Library
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)]">
          Five core EPM workflows, rendered live.
        </h1>
        <p className="mt-3 text-[var(--text-muted)] leading-relaxed">
          Each flowchart is defined as structured Mermaid source in{" "}
          <code className="font-mono text-sm text-[var(--text)] bg-[var(--surface-2)] px-1.5 py-0.5 rounded">
            /lib/flows.ts
          </code>{" "}
          and rendered client-side. Click any card to expand it to full-screen.
        </p>
      </header>
      <FlowsGallery />
    </div>
  );
}
