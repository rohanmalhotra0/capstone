import Link from "next/link";
import { ArrowUpRight, BookOpen, Compass, Sparkles } from "lucide-react";
import { modules } from "@/lib/modules";

const chapters = [
  {
    num: "I",
    href: "/atlas",
    title: "EPM Atlas",
    kicker: "Read first · Canvas + Diagrams",
    body: "The big picture. Walk the module map and the eight Mermaid workflows — B&T Wizard, Budget Revisions, Approvals, Capital→Financials — in one interactive canvas. Start here to build the mental model before drilling into any single module.",
    time: "~25 min read",
  },
  {
    num: "II",
    href: "/simulator",
    title: "Approvals Simulator",
    kicker: "Hands-on · Interactive",
    body: "Learn the approval state machine by running one. Step a planning unit through Bottom Up, Distribute, or Free Form — illegal actions are disabled exactly the way the real engine enforces them, so the rules stick.",
    time: "~10 min exercise",
  },
  {
    num: "III",
    href: "/glossary",
    title: "Glossary",
    kicker: "Reference · Lookup",
    body: "The vocabulary layer. Searchable, category-filterable terms pulled from the official study guide — wizards, rules, approval templates, dimensions, prefixes. Keep this open in a tab while you read.",
    time: "Skim or search",
  },
];

const howToUse = [
  {
    icon: Compass,
    title: "Read in order",
    body: "Part I → II → III is the intended path. The Atlas gives you the map, the Simulator turns concepts into muscle memory, and the Glossary is the dictionary you reach for along the way.",
  },
  {
    icon: BookOpen,
    title: "Use it as a reference",
    body: "Every module page, workflow, and glossary term is linkable. Drop a link into your notes or share it with a teammate who's stuck on the same concept.",
  },
  {
    icon: Sparkles,
    title: "Ask the assistant",
    body: "The chat bubble in the corner is grounded in this guide. Ask it to explain a diagram, compare two modules, or walk you through an approval scenario.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-20 pb-24">
      {/* eyebrow */}
      <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
        <span className="inline-block h-px w-8 bg-[var(--border-strong)]" />
        A documentation &amp; learning guide
      </div>

      {/* hero */}
      <section className="mt-6 grid gap-10 md:grid-cols-12 md:gap-8 md:items-end">
        <h1 className="md:col-span-8 text-balance text-[44px] sm:text-[58px] md:text-[72px] font-semibold tracking-[-0.02em] text-[var(--text)] leading-[0.98]">
          Learn Oracle EPM
          <br />
          Planning,
          <br />
          <span className="text-[var(--text-muted)] italic font-normal">
            module by module.
          </span>
        </h1>
        <p className="md:col-span-4 text-[15px] leading-[1.6] text-[var(--text-muted)]">
          An interactive textbook for the{" "}
          <span className="text-[var(--text)]">Oracle 1Z0‑1080</span>{" "}
          certification and EPM consulting onboarding. Five Planning Modules,
          seven integrations, eight workflows — taught visually, with the
          details that actually trip people up in the field.
        </p>
      </section>

      {/* start here — primary CTA */}
      <section className="mt-14">
        <Link
          href="/atlas"
          className="group block border border-[var(--border)] hover:border-[var(--border-strong)] rounded-md p-6 sm:p-8 bg-[var(--surface)]/30 hover:bg-[var(--surface)]/60 transition-colors"
        >
          <div className="grid gap-6 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8">
              <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                Start here
              </div>
              <h2 className="mt-3 text-[26px] sm:text-[32px] font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--primary-hover)] transition-colors">
                Begin with the EPM Atlas.
              </h2>
              <p className="mt-2 text-[14px] leading-[1.6] text-[var(--text-muted)] max-w-2xl">
                One interactive canvas showing how the five modules and seven
                integrations fit together. Click any node to open its
                documentation, or jump straight into a workflow.
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <span className="inline-flex items-center gap-2 text-[13px] font-mono text-[var(--text)] border-b border-[var(--text-subtle)] group-hover:border-[var(--text)] pb-0.5">
                Open the Atlas
                <ArrowUpRight className="h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* learning path — the three chapters */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Learning path
          </h2>
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)] hidden sm:inline">
            Three parts
          </span>
        </div>

        <ul className="mt-6 border-t border-[var(--border)]">
          {chapters.map((c) => (
            <li key={c.href} className="border-b border-[var(--border)]">
              <Link
                href={c.href}
                className="group grid grid-cols-12 gap-4 py-7 items-baseline hover:bg-[var(--surface)]/40 transition-colors px-1 -mx-1"
              >
                <span className="col-span-2 sm:col-span-1 font-mono text-[13px] text-[var(--text-subtle)] pt-1">
                  Part {c.num}
                </span>
                <div className="col-span-10 sm:col-span-4">
                  <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                    {c.kicker}
                  </div>
                  <div className="mt-1 text-2xl font-medium tracking-tight text-[var(--text)] group-hover:text-[var(--primary-hover)] transition-colors">
                    {c.title}
                  </div>
                  <div className="mt-1.5 text-[11px] font-mono text-[var(--text-subtle)]">
                    {c.time}
                  </div>
                </div>
                <p className="col-span-10 col-start-3 sm:col-span-6 sm:col-start-auto text-[14px] leading-[1.6] text-[var(--text-muted)]">
                  {c.body}
                </p>
                <div className="hidden sm:flex col-span-1 justify-end pt-1">
                  <ArrowUpRight className="h-4 w-4 text-[var(--text-subtle)] group-hover:text-[var(--text)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* how to use this guide */}
      <section className="mt-20">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
          How to use this guide
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3 md:gap-8">
          {howToUse.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.title} className="pt-5 border-t border-[var(--border)]">
                <Icon className="h-4 w-4 text-[var(--text-subtle)]" />
                <h3 className="mt-3 text-[15px] font-medium text-[var(--text)]">
                  {h.title}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.6] text-[var(--text-muted)]">
                  {h.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* reference — five modules as TOC */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Reference · The five Planning Modules
          </h2>
          <Link
            href="/atlas"
            className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)] hover:text-[var(--text)]"
          >
            Open atlas ↗
          </Link>
        </div>

        <ul className="mt-6 border-t border-[var(--border)]">
          {modules.map((m, i) => (
            <li key={m.id} className="border-b border-[var(--border)]">
              <Link
                href="/atlas"
                className="group grid grid-cols-12 gap-4 items-baseline py-5 px-1 -mx-1 hover:bg-[var(--surface)]/40 transition-colors"
              >
                <div className="col-span-2 sm:col-span-1 font-mono text-[12px] text-[var(--text-subtle)] tabular-nums pt-1">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-10 sm:col-span-4 flex items-baseline gap-2.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full translate-y-[-2px] shrink-0"
                    style={{ background: m.color }}
                  />
                  <div>
                    <div className="text-[17px] font-medium text-[var(--text)] group-hover:text-[var(--primary-hover)] transition-colors">
                      {m.name}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-[var(--text-subtle)]">
                      {m.prefix} · {m.cube ?? "—"}
                    </div>
                  </div>
                </div>
                <p className="col-span-10 col-start-3 sm:col-span-6 sm:col-start-auto text-[14px] leading-[1.55] text-[var(--text-muted)]">
                  {m.tagline}.
                </p>
                <div className="hidden sm:flex col-span-1 justify-end pt-1">
                  <ArrowUpRight className="h-4 w-4 text-[var(--text-subtle)] group-hover:text-[var(--text)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
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
          to search the guide.
        </p>
      </footer>
    </div>
  );
}
