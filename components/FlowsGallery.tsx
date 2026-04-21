"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Expand, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FlowChart } from "./FlowChart";
import { Card } from "./ui/card";
import { flows, type Flow } from "@/lib/flows";

export function FlowsGallery() {
  const [active, setActive] = useState<Flow | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // Permalink: /flows#<id> opens that card and scrolls to it
  useEffect(() => {
    if (typeof window === "undefined") return;
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const flow = flows.find((f) => f.id === hash);
      if (!flow) return;
      // Scroll to card first
      const el = document.getElementById(`flow-${flow.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {flows.map((flow) => (
          <Card
            key={flow.id}
            id={`flow-${flow.id}`}
            className="p-5 flex flex-col gap-3 hover:border-[var(--border-strong)] transition-colors scroll-mt-20"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-[var(--text)]">
                  {flow.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">
                  {flow.caption}
                </p>
              </div>
              <button
                onClick={() => setActive(flow)}
                aria-label={`Expand ${flow.title}`}
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <Expand className="h-3.5 w-3.5" />
              </button>
            </header>
            <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)]/40 p-4 min-h-[200px] flex items-center justify-center">
              <FlowChart chart={flow.mermaid} />
            </div>
            <div className="border-t border-[var(--border)] pt-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)]">
                Why this matters
              </div>
              <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                {flow.whyItMatters}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--bg)]/85 backdrop-blur-md p-4 sm:p-10 flex flex-col"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="flex items-start justify-between gap-4 p-6 border-b border-[var(--border)]">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">
                    {active.title}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {active.caption}
                  </p>
                </div>
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>
              <div className="flex-1 overflow-auto p-6">
                <FlowChart chart={active.mermaid} />
              </div>
              <footer className="border-t border-[var(--border)] p-4 text-xs text-[var(--text-muted)] bg-[var(--surface-2)]/40">
                <span className="font-mono uppercase tracking-wider text-[var(--text-subtle)] mr-2">
                  Why this matters —
                </span>
                {active.whyItMatters}
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
