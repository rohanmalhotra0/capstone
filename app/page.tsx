import Link from "next/link";
import { ArrowRight, BookOpen, GitBranch, Network, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { modules } from "@/lib/modules";
import { integrations } from "@/lib/integrations";
import { flows } from "@/lib/flows";
import { glossary } from "@/lib/glossary";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-16 pb-24">
      <section className="text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-1 text-xs font-mono text-[var(--text-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          Capstone prototype · v0.2
        </div>
        <h1 className="mt-6 text-balance text-5xl sm:text-6xl font-semibold tracking-tight text-[var(--text)] leading-[1.05]">
          Oracle EPM Planning Modules
          <span className="block text-[var(--text-muted)] font-normal mt-2 text-3xl sm:text-4xl">
            Interactive Guide
          </span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--text-muted)] leading-relaxed">
          A visual architecture reference for Oracle 1Z0-1080 certification and
          EPM consulting onboarding — built from the official study guide.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-mono text-[var(--text-subtle)]">
          <span>{modules.length} modules</span>
          <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
          <span>{integrations.length} integrations</span>
          <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
          <span>{flows.length} flowcharts</span>
          <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
          <span>{glossary.length} glossary terms</span>
          <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
          <span className="text-[var(--text-muted)]">Press ⌘K to jump</span>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/modules" className="group">
          <Card className="h-full p-8 transition-all hover:border-[var(--primary)]/50 hover:bg-[var(--surface)]/95 hover:-translate-y-0.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                background: "rgba(15,98,254,0.15)",
                border: "1px solid rgba(15,98,254,0.35)",
                color: "#4589ff",
              }}
            >
              <Network className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--text)]">
              Explore the Module Map
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
              A live React Flow canvas of the five Planning Modules and the
              seven integrations between them. Click any module or arrow to
              open a details panel with features, dimensions, data flows, and
              setup steps.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--primary-hover)] group-hover:gap-3 transition-all">
              Open module map
              <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        </Link>

        <Link href="/flows" className="group">
          <Card className="h-full p-8 transition-all hover:border-[var(--accent)]/60 hover:bg-[var(--surface)]/95 hover:-translate-y-0.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                background: "rgba(8,189,186,0.15)",
                border: "1px solid rgba(8,189,186,0.4)",
                color: "#08bdba",
              }}
            >
              <GitBranch className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--text)]">
              Browse Flowcharts
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
              Five rendered Mermaid diagrams — B&amp;T Wizard chain, Budget
              Revisions workflow, Approvals state machine, Capital→Financials
              integration, and the 14-step Getting Started checklist.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--accent)] group-hover:gap-3 transition-all">
              Open flowchart library
              <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        </Link>

        <Link href="/simulator" className="group">
          <Card className="h-full p-8 transition-all hover:border-[#be95ff]/60 hover:bg-[var(--surface)]/95 hover:-translate-y-0.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                background: "rgba(190,149,255,0.15)",
                border: "1px solid rgba(190,149,255,0.4)",
                color: "#be95ff",
              }}
            >
              <Play className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--text)]">
              Approvals Simulator
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
              Step a planning unit through the approval state machine. Pick
              Bottom Up, Distribute, or Free Form — watch Promote vs Submit
              semantics in action.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#be95ff] group-hover:gap-3 transition-all">
              Try it
              <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        </Link>

        <Link href="/glossary" className="group">
          <Card className="h-full p-8 transition-all hover:border-[#ff7eb6]/60 hover:bg-[var(--surface)]/95 hover:-translate-y-0.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                background: "rgba(255,126,182,0.15)",
                border: "1px solid rgba(255,126,182,0.4)",
                color: "#ff7eb6",
              }}
            >
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--text)]">
              Glossary
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
              {glossary.length} searchable terms from the study guide — wizards,
              rules, approval templates, dimensions, and module prefixes. Filter
              by category.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#ff7eb6] group-hover:gap-3 transition-all">
              Browse terms
              <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        </Link>
      </section>

      <section className="mt-16">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-3">
          Planning Modules covered
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {modules.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/60 p-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: m.color }}
                />
                <span className="text-sm font-semibold text-[var(--text)]">
                  {m.name}
                </span>
              </div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
                {m.prefix}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-24 pt-8 border-t border-[var(--border)] text-center">
        <p className="text-xs font-mono text-[var(--text-subtle)]">
          Built by Rohan for IBM Oracle EPM Consulting internship capstone,
          2026.
        </p>
      </footer>
    </div>
  );
}
