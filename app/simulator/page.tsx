import { ApprovalsSimulator } from "@/components/ApprovalsSimulator";

export const metadata = {
  title: "Approvals Simulator · Oracle EPM Planning Modules",
  description:
    "Interactive state machine for Bottom Up, Distribute, and Free Form approval templates.",
};

export default function SimulatorPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-subtle)]">
            Interactive
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
            Approvals Simulator
          </h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--text-muted)]">
            Step a planning unit through the approval state machine. Pick a
            template, pick an action, watch the state transition. Illegal
            actions are disabled — this is exactly how the Approvals engine
            behaves in Oracle EPM.
          </p>
        </header>
        <ApprovalsSimulator />
      </div>
    </main>
  );
}
