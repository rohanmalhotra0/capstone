import { Suspense } from "react";
import { GlossaryClient } from "@/components/GlossaryClient";

export const metadata = {
  title: "Glossary · Oracle EPM Planning Modules",
  description:
    "Searchable glossary of Oracle EPM Planning Modules terms — wizards, rules, approvals, integrations, dimensions.",
};

export default function GlossaryPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-subtle)]">
            Reference
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
            Glossary
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)]">
            Key terms from the Oracle EPM Planning Modules study guide. Search
            by term, alias, or definition text. Filter by category.
          </p>
        </header>
        <Suspense fallback={null}>
          <GlossaryClient />
        </Suspense>
      </div>
    </main>
  );
}
