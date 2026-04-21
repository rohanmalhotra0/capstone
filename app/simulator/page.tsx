import { ApprovalsSimulator } from "@/components/ApprovalsSimulator";
import { EPMSandbox } from "@/components/EPMSandbox";

export const metadata = {
  title: "Simulator · Oracle EPM Planning Modules",
  description:
    "Interactive EPM Planning sandbox and approval state machine simulator.",
};

export default function SimulatorPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] px-6 pt-16 pb-24">
      <div className="mx-auto max-w-6xl">
        {/* ─── Planning Sandbox ─── */}
        <header className="mb-12 max-w-3xl">
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            <span className="inline-block h-px w-8 bg-[var(--border-strong)]" />
            02 — Interactive
          </div>
          <h1 className="mt-5 text-[40px] sm:text-[56px] font-semibold tracking-[-0.02em] leading-[1] text-[var(--text)]">
            Planning
            <br />
            <span className="text-[var(--text-muted)] italic font-normal">
              sandbox.
            </span>
          </h1>
          <p className="mt-5 text-[15px] leading-[1.6] text-[var(--text-muted)]">
            Explore the Oracle EPM Planning form. Edit leaf cells,
            watch parent rows roll up, and see formula rows recompute in
            real time. Switch scenarios to load different datasets.
          </p>
        </header>
        <EPMSandbox />

        {/* ─── Approvals Simulator ─── */}
        <div className="mt-24">
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
      </div>
    </main>
  );
}
