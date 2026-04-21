"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { glossary, type GlossaryTerm } from "@/lib/glossary";
import { getModuleById } from "@/lib/modules";

type CategoryId = GlossaryTerm["category"] | "all";

const CATEGORIES: { id: CategoryId; label: string; color: string }[] = [
  { id: "all", label: "All", color: "var(--text-muted)" },
  { id: "module", label: "Modules", color: "#78a9ff" },
  { id: "dimension", label: "Dimensions", color: "#42be65" },
  { id: "rule", label: "Rules", color: "#f1c21b" },
  { id: "wizard", label: "Wizards", color: "#d4bbff" },
  { id: "integration", label: "Integration", color: "#ff7eb6" },
  { id: "approval", label: "Approval", color: "#fa4d56" },
  { id: "concept", label: "Concept", color: "#08bdba" },
];

const CATEGORY_COLOR: Record<GlossaryTerm["category"], string> = {
  module: "#78a9ff",
  dimension: "#42be65",
  rule: "#f1c21b",
  wizard: "#d4bbff",
  integration: "#ff7eb6",
  approval: "#fa4d56",
  concept: "#08bdba",
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, needle }: { text: string; needle: string }) {
  if (!needle) return <>{text}</>;
  const re = new RegExp(`(${escapeRegex(needle)})`, "ig");
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="bg-[var(--primary)]/25 text-[var(--text)] rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function isCategory(v: string | null): v is CategoryId {
  return !!v && CATEGORIES.some((c) => c.id === v);
}

export function GlossaryClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryId>("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Initialize from URL (run once on mount)
  useEffect(() => {
    const initialQ = searchParams.get("q") ?? "";
    const initialCat = searchParams.get("cat");
    if (initialQ) setQ(initialQ);
    if (isCategory(initialCat)) setCat(initialCat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced URL sync — makes state shareable
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (cat !== "all") params.set("cat", cat);
      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    }, 200);
    return () => clearTimeout(t);
  }, [q, cat, pathname, router]);

  // Keyboard shortcuts: `/` focus, Esc clear/blur
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const editing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (e.key === "/" && !editing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (
        e.key === "Escape" &&
        document.activeElement === inputRef.current
      ) {
        if (q) setQ("");
        else inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [q]);

  const needle = q.trim().toLowerCase();

  const filtered = useMemo(() => {
    return glossary
      .filter((g) => (cat === "all" ? true : g.category === cat))
      .filter((g) => {
        if (!needle) return true;
        if (g.term.toLowerCase().includes(needle)) return true;
        if (g.shortDef.toLowerCase().includes(needle)) return true;
        if (g.longDef.toLowerCase().includes(needle)) return true;
        if (g.aliases?.some((a) => a.toLowerCase().includes(needle)))
          return true;
        return false;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [cat, needle]);

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const g of filtered) {
      const first = g.term.trim().charAt(0).toUpperCase();
      const key = /[A-Z]/.test(first) ? first : "#";
      const arr = map.get(key) ?? [];
      arr.push(g);
      map.set(key, arr);
    }
    return map;
  }, [filtered]);

  const activeLetters = useMemo(() => new Set(groups.keys()), [groups]);

  const copyLink = useCallback((slug: string, term: string) => {
    const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(term)}#${slug}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 1400);
    });
  }, []);

  return (
    <div>
      <div className="sticky top-12 z-20 -mx-6 px-6 bg-[var(--bg)]/85 backdrop-blur-md pb-4 pt-3 border-b border-[var(--border)]">
        <div className="relative">
          <label htmlFor="glossary-search" className="sr-only">
            Search glossary
          </label>
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]"
            aria-hidden
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            ref={inputRef}
            id="glossary-search"
            type="text"
            inputMode="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms, aliases, definitions…"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-11 pr-12 py-3 text-[15px] text-[var(--text)] placeholder:text-[var(--text-subtle)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-describedby="glossary-count"
          />
          {q ? (
            <button
              type="button"
              onClick={() => {
                setQ("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md w-6 h-6 grid place-items-center text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition"
            >
              ×
            </button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 border border-[var(--border)] rounded px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-subtle)] pointer-events-none">
              /
            </kbd>
          )}
        </div>

        <div
          className="mt-3 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Category filters"
        >
          {CATEGORIES.map((c) => {
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition border ${
                  active
                    ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--primary)]/50"
                }`}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{
                    background: active ? "rgba(255,255,255,0.9)" : c.color,
                  }}
                  aria-hidden
                />
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <p
            id="glossary-count"
            className="text-xs text-[var(--text-subtle)]"
            aria-live="polite"
          >
            {filtered.length} of {glossary.length} terms
            {needle ? (
              <>
                {" "}· matching{" "}
                <span className="font-mono text-[var(--text-muted)]">
                  &quot;{q.trim()}&quot;
                </span>
              </>
            ) : null}
          </p>
          <div className="hidden md:flex items-center gap-0.5 text-[10px] font-mono select-none">
            {LETTERS.map((L) => {
              const present = activeLetters.has(L);
              return present ? (
                <a
                  key={L}
                  href={`#letter-${L}`}
                  className="px-1 py-0.5 rounded text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-2)] transition"
                >
                  {L}
                </a>
              ) : (
                <span
                  key={L}
                  aria-disabled="true"
                  className="px-1 py-0.5 rounded text-[var(--text-subtle)]/40 cursor-default"
                >
                  {L}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--text-muted)]">
          <p>
            No terms match{" "}
            <span className="font-mono text-[var(--text)]">
              &quot;{q}&quot;
            </span>
            {cat !== "all" ? (
              <>
                {" "}in{" "}
                <span className="font-mono text-[var(--text)]">{cat}</span>
              </>
            ) : null}
            .
          </p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCat("all");
              inputRef.current?.focus();
            }}
            className="mt-3 text-xs font-mono text-[var(--primary)] hover:underline"
          >
            ↺ Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {Array.from(groups.entries()).map(([letter, terms]) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              className="scroll-mt-[13rem]"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-[13px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                  {letter}
                </h2>
                <span className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[11px] font-mono text-[var(--text-subtle)]">
                  {terms.length}
                </span>
              </div>
              <ul className="grid gap-3">
                {terms.map((g) => {
                  const slug = slugify(g.term);
                  const color = CATEGORY_COLOR[g.category];
                  return (
                    <li
                      key={g.term}
                      id={slug}
                      className="group relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--primary)]/50 scroll-mt-[13rem]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-[var(--text)]">
                              <Highlight text={g.term} needle={needle} />
                            </h3>
                            <button
                              type="button"
                              onClick={() => copyLink(slug, g.term)}
                              aria-label={`Copy link to ${g.term}`}
                              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition text-[var(--text-subtle)] hover:text-[var(--primary)] font-mono text-xs px-1"
                            >
                              {copiedSlug === slug ? "copied" : "#"}
                            </button>
                          </div>
                          {g.aliases && g.aliases.length > 0 ? (
                            <p className="mt-0.5 text-xs font-mono text-[var(--text-subtle)]">
                              aka{" "}
                              {g.aliases.map((a, i) => (
                                <span key={a}>
                                  {i > 0 ? ", " : ""}
                                  <Highlight text={a} needle={needle} />
                                </span>
                              ))}
                            </p>
                          ) : null}
                        </div>
                        <span
                          className="shrink-0 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border"
                          style={{
                            color,
                            borderColor: `${color}66`,
                            background: `${color}1a`,
                          }}
                        >
                          {g.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text)]">
                        <Highlight text={g.shortDef} needle={needle} />
                      </p>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
                        <Highlight text={g.longDef} needle={needle} />
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
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
