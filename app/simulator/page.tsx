import { ApprovalsSimulator } from "@/components/ApprovalsSimulator";

export const metadata = {
  title: "Approvals Simulator · Oracle EPM Planning Modules",
  description:
    "Interactive state machine for Bottom Up, Distribute, and Free Form approval templates.",
};

export default function SimulatorPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] px-6 pt-16 pb-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-3xl">
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            <span className="inline-block h-px w-8 bg-[var(--border-strong)]" />
            03 — Interactive
          </div>
          <h1 className="mt-5 text-[40px] sm:text-[56px] font-semibold tracking-[-0.02em] leading-[1] text-[var(--text)]">
            Approvals
            <br />
            <span className="text-[var(--text-muted)] italic font-normal">
              simulator.
            </span>
          </h1>
          <p className="mt-5 text-[15px] leading-[1.6] text-[var(--text-muted)]">
            Step a planning unit through the approval state machine. Pick a
            template, pick an action, watch the state transition. Illegal
            actions are disabled — exactly how the Approvals engine behaves in
            Oracle EPM.
          </p>
        </header>
        <ApprovalsSimulator />
      </div>
    </main>
  );
}
