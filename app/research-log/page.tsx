import Link from "next/link";
import type { Metadata } from "next";
import { researchLog } from "@/lib/research-log";
import ResearchLogList from "@/components/ResearchLogList";

export const metadata: Metadata = {
  title: "Daily Research Log — EPM Planning",
  description:
    "Daily roundup of new Oracle EPM material — release notes, blog posts, and tutorials worth reading.",
};

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

      <ResearchLogList entries={entries} />

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
