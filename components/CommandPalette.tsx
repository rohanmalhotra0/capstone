"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { modules } from "@/lib/modules";
import { integrations } from "@/lib/integrations";
import { flows } from "@/lib/flows";
import { glossary } from "@/lib/glossary";

type Kind = "page" | "module" | "integration" | "flow" | "glossary";
interface Item {
  id: string;
  kind: Kind;
  label: string;
  sub: string;
  keywords: string;
  href: string;
  color?: string;
}

const kindLabel: Record<Kind, string> = {
  page: "Page",
  module: "Module",
  integration: "Integration",
  flow: "Flowchart",
  glossary: "Glossary",
};

const pages: Item[] = [
  { id: "p-home", kind: "page", label: "Home", sub: "Landing", keywords: "home landing intro", href: "/" },
  { id: "p-atlas", kind: "page", label: "EPM Atlas", sub: "/atlas", keywords: "atlas modules flows flowcharts workflows map graph learn", href: "/atlas" },
  { id: "p-simulator", kind: "page", label: "Approvals Simulator", sub: "/simulator", keywords: "approvals simulator state machine", href: "/simulator" },
  { id: "p-glossary", kind: "page", label: "Glossary", sub: "/glossary", keywords: "glossary terms definitions", href: "/glossary" },
  { id: "p-research-log", kind: "page", label: "Daily Research Log", sub: "/research-log", keywords: "research log news daily updates release notes whats new", href: "/research-log" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items: Item[] = useMemo(() => {
    const m: Item[] = modules.map((x) => ({
      id: `m-${x.id}`,
      kind: "module",
      label: x.name,
      sub: `${x.prefix} · ${x.tagline}`,
      keywords: `${x.name} ${x.prefix} ${x.tagline} ${x.keyFeatures.join(" ")}`,
      href: `/atlas?m=${x.id}`,
      color: x.color,
    }));
    const i: Item[] = integrations.map((x) => ({
      id: `i-${x.id}`,
      kind: "integration",
      label: x.label,
      sub: x.dataShared,
      keywords: `${x.label} ${x.dataShared} ${x.from} ${x.to}`,
      href: `/atlas?i=${x.id}`,
    }));
    const f: Item[] = flows.map((x) => ({
      id: `f-${x.id}`,
      kind: "flow",
      label: x.title,
      sub: x.caption,
      keywords: `${x.title} ${x.caption}`,
      href: `/atlas?f=${x.id}`,
    }));
    const g: Item[] = glossary.map((x) => ({
      id: `g-${x.term}`,
      kind: "glossary",
      label: x.term,
      sub: x.shortDef,
      keywords: `${x.term} ${x.aliases?.join(" ") ?? ""} ${x.shortDef}`,
      href: `/glossary?q=${encodeURIComponent(x.term)}`,
    }));
    return [...pages, ...m, ...i, ...f, ...g];
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items.slice(0, 40);
    return items
      .filter((x) => {
        const hay = `${x.label} ${x.sub} ${x.keywords}`.toLowerCase();
        return needle
          .split(/\s+/)
          .every((t) => hay.includes(t));
      })
      .slice(0, 40);
  }, [items, q]);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setIdx(0);
  }, []);

  const activate = useCallback(
    (item?: Item) => {
      const target = item ?? filtered[idx];
      if (!target) return;
      close();
      router.push(target.href);
    },
    [close, filtered, idx, router],
  );

  // Global Cmd/Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !open) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      setIdx(0);
    }
  }, [open]);

  // Keep active item in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${idx}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [idx, filtered.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((n) => Math.min(n + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((n) => Math.max(n - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      activate();
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="cmdk-root"
          className="fixed inset-0 z-[80] flex items-start justify-center pt-[14vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <button
            type="button"
            aria-label="Close command palette"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ y: -12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-[640px] rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-4">
              <span
                className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-subtle)]"
                aria-hidden
              >
                ⌘K
              </span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setIdx(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Jump to a module, integration, flow, term…"
                className="flex-1 bg-transparent py-3.5 text-[15px] text-[var(--text)] placeholder:text-[var(--text-subtle)] outline-none"
                aria-label="Command palette search"
                aria-controls="cmdk-list"
                aria-activedescendant={filtered[idx] ? `cmdk-item-${filtered[idx].id}` : undefined}
              />
            </div>
            <ul
              ref={listRef}
              id="cmdk-list"
              role="listbox"
              className="max-h-[50vh] overflow-y-auto py-1"
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                  No matches for <span className="font-mono">&quot;{q}&quot;</span>.
                </li>
              ) : null}
              {filtered.map((item, i) => {
                const active = i === idx;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      data-idx={i}
                      id={`cmdk-item-${item.id}`}
                      role="option"
                      aria-selected={active}
                      onMouseEnter={() => setIdx(i)}
                      onClick={() => activate(item)}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                        active
                          ? "bg-[var(--primary)]/15"
                          : "hover:bg-[var(--surface-2)]"
                      }`}
                    >
                      <span
                        className="font-mono text-[10px] uppercase tracking-wider w-[80px] shrink-0"
                        style={{
                          color: item.color ?? "var(--text-subtle)",
                        }}
                      >
                        {kindLabel[item.kind]}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14px] font-medium text-[var(--text)] truncate">
                          {item.label}
                        </span>
                        <span className="block text-[12px] text-[var(--text-muted)] truncate">
                          {item.sub}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-[var(--border)] px-4 py-2 flex items-center justify-between text-[11px] text-[var(--text-subtle)] font-mono">
              <span>↑↓ navigate · ↵ open · esc close</span>
              <span>{filtered.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
