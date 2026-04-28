import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { researchLog } from "@/lib/research-log";

export const metadata: Metadata = {
  title: "Daily Research Log — EPM Planning",
  description:
    "Daily roundup of new Oracle EPM material — release notes, blog posts, and tutorials worth reading.",
};

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ResearchLogPage() {
  const entries = researchLog;

  return (
    <div className="mx-auto max-w-4xl px-6 pt-16 pb-24">
      <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
        <span className="inline-block h-px w-8 bg-[var(--border-strong)]" />
        Daily Research Log
      </div>

      <h1 className="mt-5 text-balance text-[40px] sm:text-[52px] font-semibold tracking-[-0.02em] leading-[1.05] text-[var(--text)]">
        What&rsquo;s new in Oracle EPM,
        <br />
        <span className="text-[var(--text-muted)] italic font-normal">
          one day at a time.
        </span>
      </h1>

      <p className="mt-5 max-w-2xl text-[15px] leading-[1.65] text-[var(--text-muted)]">
        An automated agent reviews Oracle EPM release notes, blogs, and demo
        videos every morning and posts a short digest here. Every claim links
        to a source — treat the bullets as a starting point, not gospel.
      </p>

      <div className="mt-12 space-y-14">
        {entries.map((entry) => (
          <article
            key={entry.date}
            className="border-t border-[var(--border)] pt-10"
          >
            <header className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
              </div>
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)]"
                    >
                      {t}
                    </span>
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

      <div className="mt-16 border-t border-[var(--border)] pt-8">
        <Link
          href="/"
          className="text-[13px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)] hover:text-[var(--text)] transition-colors"
        >
          ← Back to index
        </Link>
      </div>
    </div>
  );
}
