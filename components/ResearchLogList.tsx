"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { LogEntry } from "@/lib/research-log";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ResearchLogList({ entries }: { entries: LogEntry[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const allTags = useMemo(() => {
    const seen = new Map<string, number>();
    for (const e of entries) {
      for (const t of e.tags ?? []) {
        seen.set(t, (seen.get(t) ?? 0) + 1);
      }
    }
    return [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [entries]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (activeTag && !e.tags?.includes(activeTag)) return false;
      if (!q) return true;
      const haystack = [
        e.title,
        e.summary,
        ...(e.bullets ?? []),
        ...(e.tags ?? []),
        ...(e.sources ?? []).map((src) => src.label),
        ...(e.videos ?? []).map((v) => v.label),
      ]
        .join(" \n ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, activeTag, query]);

  return (
    <>
      <div className="mt-10">
        <label className="relative block">
          <span className="sr-only">Search the research log</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-subtle)]"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entries — e.g. Groovy, ARCS, AI Agent…"
            className="w-full rounded-md border border-[var(--border)] bg-transparent py-2 pl-9 pr-3 text-[14px] text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
        </label>
        {query && (
          <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--text-subtle)]">
            {visible.length} match{visible.length === 1 ? "" : "es"} for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            Filter
          </span>
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-[0.12em] transition-colors ${
              activeTag === null
                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
            aria-pressed={activeTag === null}
          >
            All
          </button>
          {allTags.map((t) => {
            const active = activeTag === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTag(active ? null : t)}
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-mono transition-colors ${
                  active
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
                aria-pressed={active}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-12 space-y-14">
        {visible.length === 0 && (
          <p className="text-[14px] text-[var(--text-muted)]">
            No entries match
            {query ? (
              <>
                {" "}&ldquo;<span className="font-mono">{query}</span>&rdquo;
              </>
            ) : null}
            {activeTag ? (
              <>
                {" "}tagged <span className="font-mono">{activeTag}</span>
              </>
            ) : null}
            .
          </p>
        )}
        {visible.map((entry, idx) => (
          <article
            key={entry.id ?? entry.date}
            id={entry.id ?? entry.date}
            className="border-t border-[var(--border)] pt-10 scroll-mt-24"
          >
            <header className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                <a
                  href={`#${entry.id ?? entry.date}`}
                  className="hover:text-[var(--text)] transition-colors"
                  aria-label={`Permalink to ${formatDate(entry.date)} entry`}
                >
                  <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                </a>
              </div>
              {idx === 0 && activeTag === null && (
                <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--primary)]">
                  Latest
                </span>
              )}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setActiveTag(t === activeTag ? null : t)}
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-mono transition-colors ${
                        t === activeTag
                          ? "border-[var(--primary)] text-[var(--primary)]"
                          : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </header>

            <h2 className="mt-3 text-[26px] sm:text-[30px] font-semibold tracking-tight text-[var(--text)] leading-tight">
              {entry.title}
            </h2>

            <p className="mt-3 text-[15px] leading-[1.7] text-[var(--text-muted)]">
              {entry.summary}
            </p>

            <ul className="mt-6 space-y-2.5 text-[14.5px] leading-[1.65] text-[var(--text)]">
              {entry.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="mt-[10px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--text-subtle)]"
                    aria-hidden
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                  Sources
                </div>
                <ul className="mt-3 space-y-1.5">
                  {entry.sources.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-start gap-1.5 text-[13.5px] text-[var(--text)] hover:text-[var(--primary)] transition-colors"
                      >
                        <span className="underline decoration-[var(--border-strong)] underline-offset-[3px] group-hover:decoration-[var(--primary)]">
                          {s.label}
                        </span>
                        <ArrowUpRight
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-subtle)] group-hover:text-[var(--primary)]"
                          aria-hidden
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {entry.videos && entry.videos.length > 0 && (
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                    Videos
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {entry.videos.map((v) => (
                      <li key={v.href}>
                        <a
                          href={v.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-start gap-1.5 text-[13.5px] text-[var(--text)] hover:text-[var(--primary)] transition-colors"
                        >
                          <span className="underline decoration-[var(--border-strong)] underline-offset-[3px] group-hover:decoration-[var(--primary)]">
                            {v.label}
                          </span>
                          <ArrowUpRight
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-subtle)] group-hover:text-[var(--primary)]"
                            aria-hidden
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
