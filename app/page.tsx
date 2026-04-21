import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { modules } from "@/lib/modules";
import { integrations } from "@/lib/integrations";
import { flows } from "@/lib/flows";
import { glossary } from "@/lib/glossary";

const sections = [
  {
    num: "01",
    href: "/modules",
    title: "Module Map",
    kicker: "Canvas",
    body: "A React Flow canvas of the five Planning Modules and seven integrations. Click anything to inspect features, dimensions, and setup.",
  },
  {
    num: "02",
    href: "/flows",
    title: "Flowcharts",
    kicker: "Diagrams",
    body: "Eight Mermaid workflows — Data Movement logic, Security Priority, B&T Wizard, Budget Revisions, Approvals, IPM Insights, Capital→Financials, and onboarding.",
  },
  {
    num: "03",
    href: "/simulator",
    title: "Approvals Simulator",
    kicker: "Interactive",
    body: "Step a planning unit through the state machine. Toggle Bottom Up, Distribute, or Free Form — illegal actions are disabled, just like the real engine.",
  },
  {
    num: "04",
    href: "/glossary",
    title: "Glossary",
    kicker: "Reference",
    body: "Searchable terms from the study guide — wizards, rules, approval templates, dimensions, prefixes. Filterable by category.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-20 pb-24">
      {/* eyebrow */}
      <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
        <span className="inline-block h-px w-8 bg-[var(--border-strong)]" />
        An Oracle 1Z0‑1080 study companion
      </div>

      {/* hero */}
      <section className="mt-6 grid gap-10 md:grid-cols-12 md:gap-8 md:items-end">
        <h1 className="md:col-span-8 text-balance text-[44px] sm:text-[58px] md:text-[72px] font-semibold tracking-[-0.02em] text-[var(--text)] leading-[0.98]">
          The Oracle EPM
          <br />
          Planning Modules,
          <br />
          <span className="text-[var(--text-muted)] italic font-normal">
            explained visually.
          </span>
        </h1>
        <p className="md:col-span-4 text-[15px] leading-[1.6] text-[var(--text-muted)]">
          A visual architecture reference for the{" "}
          <span className="text-[var(--text)]">1Z0‑1080</span> certification and
          EPM consulting onboarding — built from the official study guide, then
          hand-annotated with the details that actually trip people up in
          implementation.
        </p>
      </section>

      {/* stats — dense spec row */}
      <dl className="mt-14 grid grid-cols-2 sm:grid-cols-4 border-y border-[var(--border)] divide-x divide-[var(--border)]">
        {[
          { k: "Modules", v: modules.length },
          { k: "Integrations", v: integrations.length },
          { k: "Flowcharts", v: flows.length },
          { k: "Glossary", v: glossary.length },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`px-4 py-5 ${i < 2 ? "border-b sm:border-b-0 border-[var(--border)]" : ""}`}
          >
            <dt className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              {s.k}
            </dt>
            <dd className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums text-[var(--text)]">
              {s.v}
            </dd>
          </div>
        ))}
      </dl>

      {/* contents index */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Contents
          </h2>
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)] hidden sm:inline">
            I – IV
          </span>
        </div>

        <ul className="mt-6 border-t border-[var(--border)]">
          {sections.map((s) => (
            <li key={s.href} className="border-b border-[var(--border)]">
              <Link
                href={s.href}
                className="group grid grid-cols-12 gap-4 py-6 items-baseline hover:bg-[var(--surface)]/40 transition-colors px-1 -mx-1"
              >
                <span className="col-span-2 sm:col-span-1 font-mono text-[12px] text-[var(--text-subtle)] pt-1">
                  {s.num}
                </span>
                <div className="col-span-10 sm:col-span-4">
                  <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                    {s.kicker}
                  </div>
                  <div className="mt-1 text-2xl font-medium tracking-tight text-[var(--text)] group-hover:text-[var(--primary-hover)] transition-colors">
                    {s.title}
                  </div>
                </div>
                <p className="col-span-10 col-start-3 sm:col-span-6 sm:col-start-auto text-[14px] leading-[1.55] text-[var(--text-muted)]">
                  {s.body}
                </p>
                <div className="hidden sm:flex col-span-1 justify-end pt-1">
                  <ArrowUpRight className="h-4 w-4 text-[var(--text-subtle)] group-hover:text-[var(--text)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* modules table */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            The five modules
          </h2>
          <Link
            href="/modules"
            className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)] hover:text-[var(--text)]"
          >
            Open map ↗
          </Link>
        </div>

        <div className="mt-6 border border-[var(--border)] rounded-md overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-2.5 bg-[var(--surface)]/50 text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)] border-b border-[var(--border)]">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Module</div>
            <div className="col-span-2">Prefix</div>
            <div className="col-span-6">Tagline</div>
          </div>
          {modules.map((m, i) => (
            <div
              key={m.id}
              className={`grid grid-cols-12 items-center px-4 py-4 text-sm ${
                i < modules.length - 1 ? "border-b border-[var(--border)]" : ""
              }`}
            >
              <div className="col-span-1 font-mono text-[12px] text-[var(--text-subtle)] tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-3 flex items-center gap-2.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: m.color }}
                />
                <span className="font-medium text-[var(--text)]">
                  {m.name}
                </span>
              </div>
              <div className="col-span-2 font-mono text-[12px] text-[var(--text-muted)]">
                {m.prefix}
              </div>
              <div className="col-span-6 text-[var(--text-muted)] leading-snug">
                {m.tagline}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="mt-24 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row gap-2 sm:items-baseline sm:justify-between">
        <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)]">
          Rohan Malhotra · IBM Oracle EPM Capstone · 2026
        </p>
        <p className="text-[11px] font-mono text-[var(--text-subtle)]">
          Press{" "}
          <kbd className="border border-[var(--border)] rounded px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">
            ⌘K
          </kbd>{" "}
          to search.
        </p>
      </footer>
    </div>
  );
}
