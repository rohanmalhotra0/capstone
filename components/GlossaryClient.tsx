"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { glossary, type GlossaryTerm } from "@/lib/glossary";
import { getModuleById } from "@/lib/modules";

const categories: { id: GlossaryTerm["category"] | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "module", label: "Modules" },
  { id: "dimension", label: "Dimensions" },
  { id: "rule", label: "Rules" },
  { id: "wizard", label: "Wizards" },
  { id: "integration", label: "Integration" },
  { id: "approval", label: "Approval" },
  { id: "concept", label: "Concept" },
];

export function GlossaryClient() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<GlossaryTerm["category"] | "all">("all");

  useEffect(() => {
    const initial = searchParams.get("q");
    if (initial) setQ(initial);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return glossary
      .filter((g) => (cat === "all" ? true : g.category === cat))
      .filter((g) => {
        if (!needle) return true;
        if (g.term.toLowerCase().includes(needle)) return true;
        if (g.shortDef.toLowerCase().includes(needle)) return true;
        if (g.longDef.toLowerCase().includes(needle)) return true;
        if (g.aliases?.some((a) => a.toLowerCase().includes(needle))) return true;
        return false;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [q, cat]);

  return (
    <div>
      <div className="sticky top-[3.5rem] z-10 bg-[var(--bg)]/70 backdrop-blur-md pb-4">
        <label htmlFor="glossary-search" className="sr-only">
          Search glossary
        </label>
        <input
          id="glossary-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search terms, aliases, definitions…"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[15px] text-[var(--text)] placeholder:text-[var(--text-subtle)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition"
          autoFocus
        />
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Category filters">
          {categories.map((c) => {
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                aria-pressed={active}
                className={`rounded-full px-3 py-1 text-xs font-medium transition border ${
                  active
                    ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/50"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-[var(--text-subtle)]">
          {filtered.length} of {glossary.length} terms
        </p>
      </div>

      <ul className="mt-4 grid gap-3">
        {filtered.map((g) => (
          <li
            key={g.term}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--primary)]/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  {g.term}
                </h2>
                {g.aliases && g.aliases.length > 0 ? (
                  <p className="mt-0.5 text-xs font-mono text-[var(--text-subtle)]">
                    aka {g.aliases.join(", ")}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)] border border-[var(--border)] px-2 py-0.5 rounded">
                {g.category}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text)]">
              {g.shortDef}
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
              {g.longDef}
            </p>
            {g.relatedModules && g.relatedModules.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.relatedModules.map((id) => {
                  const m = getModuleById(id);
                  if (!m) return null;
                  return (
                    <span
                      key={id}
                      className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        background: `${m.color}22`,
                        color: m.color,
                        border: `1px solid ${m.color}44`,
                      }}
                    >
                      {m.name}
                    </span>
                  );
                })}
              </div>
            ) : null}
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--text-muted)]">
            No terms match <span className="font-mono">&quot;{q}&quot;</span>
            {cat !== "all" ? ` in ${cat}` : null}.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
