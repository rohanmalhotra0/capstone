import { Suspense } from "react";
import { GlossaryClient } from "@/components/GlossaryClient";

export const metadata = {
  title: "Glossary · Oracle EPM Planning Modules",
  description:
    "Searchable glossary of Oracle EPM Planning Modules terms — wizards, rules, approvals, integrations, dimensions.",
};

export default function GlossaryPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] px-6 pt-16 pb-24">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 max-w-3xl">
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            <span className="inline-block h-px w-8 bg-[var(--border-strong)]" />
            04 — Reference
          </div>
          <h1 className="mt-5 text-[40px] sm:text-[56px] font-semibold tracking-[-0.02em] leading-[1] text-[var(--text)]">
            Glossary.
          </h1>
          <p className="mt-5 text-[15px] leading-[1.6] text-[var(--text-muted)]">
            Key terms from the Oracle EPM Planning Modules study guide. Search
            by term, alias, or definition — filter by category.
          </p>
        </header>
        <Suspense fallback={null}>
          <GlossaryClient />
        </Suspense>
      </div>
    </main>
  );
}
