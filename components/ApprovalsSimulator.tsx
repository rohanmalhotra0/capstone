"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

type Template = "bottom-up" | "distribute" | "free-form";
type State =
  | "NotStarted"
  | "FirstPass"
  | "UnderReview"
  | "Approved"
  | "Rejected"
  | "SignedOff";

interface Action {
  id: string;
  label: string;
  from: State;
  to: State;
  note?: string;
  templates: Template[];
}

const actions: Action[] = [
  // Start actions
  {
    id: "start-ff",
    label: "Start",
    from: "NotStarted",
    to: "FirstPass",
    note: "Free Form begins at First Pass — unit owner enters plan data.",
    templates: ["free-form"],
  },
  {
    id: "start-bu-dist",
    label: "Start",
    from: "NotStarted",
    to: "UnderReview",
    note: "Bottom Up / Distribute begin with the unit Under Review by the first approver in the path.",
    templates: ["bottom-up", "distribute"],
  },
  // Submit from first pass
  {
    id: "submit-ff",
    label: "Submit",
    from: "FirstPass",
    to: "UnderReview",
    note: "First Pass owner finalises and hands off for review.",
    templates: ["free-form"],
  },
  // Approve / Reject
  {
    id: "approve",
    label: "Approve",
    from: "UnderReview",
    to: "Approved",
    note: "Reviewer accepts the unit. Next action depends on template.",
    templates: ["bottom-up", "distribute", "free-form"],
  },
  {
    id: "reject",
    label: "Reject",
    from: "UnderReview",
    to: "Rejected",
    note: "Reviewer rejects — unit returns to owner for rework.",
    templates: ["bottom-up", "distribute", "free-form"],
  },
  // Resubmit
  {
    id: "resubmit",
    label: "Resubmit",
    from: "Rejected",
    to: "UnderReview",
    note: "Owner addresses feedback and re-submits for review.",
    templates: ["bottom-up", "distribute", "free-form"],
  },
  // Promote vs Submit (template-specific)
  {
    id: "promote",
    label: "Promote",
    from: "Approved",
    to: "UnderReview",
    note: "Bottom Up: approval bubbles UP to the parent in the hierarchy for another review.",
    templates: ["bottom-up"],
  },
  {
    id: "submit-dist",
    label: "Submit",
    from: "Approved",
    to: "UnderReview",
    note: "Distribute: owner at end of path submits the approved unit to the next reviewer.",
    templates: ["distribute"],
  },
  // Sign off
  {
    id: "signoff",
    label: "Sign Off",
    from: "Approved",
    to: "SignedOff",
    note: "Final approver in the path signs off — unit is locked as the final plan.",
    templates: ["bottom-up", "distribute", "free-form"],
  },
];

const templateInfo: Record<Template, { name: string; tagline: string; color: string }> = {
  "bottom-up": {
    name: "Bottom Up",
    tagline: "Promote bubbles up the hierarchy",
    color: "#0f62fe",
  },
  distribute: {
    name: "Distribute",
    tagline: "Owner at end of path submits",
    color: "#08bdba",
  },
  "free-form": {
    name: "Free Form",
    tagline: "Flat — starts at First Pass",
    color: "#be95ff",
  },
};

const stateInfo: Record<
  State,
  { label: string; description: string; color: string }
> = {
  NotStarted: {
    label: "Not Started",
    description: "The planning unit exists but no approval activity yet.",
    color: "#6f6f6f",
  },
  FirstPass: {
    label: "First Pass",
    description: "Free Form owner drafting the plan. Can Submit when done.",
    color: "#be95ff",
  },
  UnderReview: {
    label: "Under Review",
    description: "Current approver is evaluating. Can Approve or Reject.",
    color: "#4589ff",
  },
  Approved: {
    label: "Approved",
    description:
      "Reviewer approved. Next: Promote (Bottom Up), Submit (Distribute), or Sign Off if last in path.",
    color: "#42be65",
  },
  Rejected: {
    label: "Rejected",
    description: "Reviewer rejected. Owner must Resubmit.",
    color: "#fa4d56",
  },
  SignedOff: {
    label: "Signed Off",
    description: "Final. Plan is locked.",
    color: "#08bdba",
  },
};

const stateOrder: State[] = [
  "NotStarted",
  "FirstPass",
  "UnderReview",
  "Approved",
  "Rejected",
  "SignedOff",
];

interface HistoryEntry {
  state: State;
  action: string | null;
  actor?: "Owner" | "Reviewer" | "System";
}

export function ApprovalsSimulator() {
  const [template, setTemplate] = useState<Template>("bottom-up");
  const [state, setState] = useState<State>("NotStarted");
  const [history, setHistory] = useState<HistoryEntry[]>([
    { state: "NotStarted", action: null, actor: "System" },
  ]);
  const [frozen, setFrozen] = useState(false);
  const [lastNote, setLastNote] = useState<string>(
    "Pick a template and press Start.",
  );

  const available = useMemo(
    () => actions.filter((a) => a.from === state && a.templates.includes(template)),
    [state, template],
  );

  const reset = (nextTemplate?: Template) => {
    setTemplate(nextTemplate ?? template);
    setState("NotStarted");
    setHistory([{ state: "NotStarted", action: null, actor: "System" }]);
    setFrozen(false);
    setLastNote(
      `Pick a template and press Start. Currently: ${templateInfo[nextTemplate ?? template].name}.`,
    );
  };

  const act = (a: Action) => {
    if (frozen) return;
    const actor: HistoryEntry["actor"] =
      a.id === "resubmit" || a.id === "submit-ff" ? "Owner" : "Reviewer";
    setState(a.to);
    setHistory((h) => [...h, { state: a.to, action: a.label, actor }]);
    setLastNote(a.note ?? "");
  };

  const toggleFreeze = () => {
    if (state === "NotStarted" || state === "SignedOff") return;
    setFrozen((f) => {
      const next = !f;
      setLastNote(
        next
          ? "Freeze locks the unit from edits. It's a side-state — not a path transition."
          : "Unfrozen. Edits allowed again.",
      );
      return next;
    });
  };

  const back = () => {
    if (history.length <= 1) return;
    const h = history.slice(0, -1);
    const last = h[h.length - 1];
    setHistory(h);
    setState(last.state);
    setLastNote("Stepped back one transition.");
  };

  const curInfo = stateInfo[state];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* MAIN */}
      <div>
        {/* Template picker */}
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Approval template"
        >
          {(Object.keys(templateInfo) as Template[]).map((t) => {
            const info = templateInfo[t];
            const active = t === template;
            return (
              <button
                key={t}
                role="radio"
                aria-checked={active}
                onClick={() => reset(t)}
                className="rounded-xl border px-4 py-2.5 text-left transition"
                style={{
                  background: active ? `${info.color}1a` : "var(--surface)",
                  borderColor: active ? info.color : "var(--border)",
                }}
              >
                <div
                  className="text-sm font-semibold"
                  style={{ color: active ? info.color : "var(--text)" }}
                >
                  {info.name}
                </div>
                <div className="text-[11.5px] text-[var(--text-muted)]">
                  {info.tagline}
                </div>
              </button>
            );
          })}
        </div>

        {/* State rail */}
        <div
          className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)]">
              Current state
            </div>
            {frozen ? (
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-[#fa4d56]/50 text-[#fa4d56] bg-[#fa4d56]/10">
                Frozen
              </span>
            ) : null}
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={state}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-semibold"
                style={{ color: curInfo.color }}
              >
                {curInfo.label}
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
            {curInfo.description}
          </p>

          {/* Step visualization */}
          <ol className="mt-4 flex flex-wrap gap-1.5" aria-label="State rail">
            {stateOrder.map((s) => {
              const info = stateInfo[s];
              const isCurrent = s === state;
              const visited = history.some((h) => h.state === s);
              return (
                <li
                  key={s}
                  className="rounded-md px-2.5 py-1 text-[11px] font-mono transition"
                  style={{
                    background: isCurrent
                      ? `${info.color}26`
                      : visited
                        ? "var(--surface-2)"
                        : "transparent",
                    color: isCurrent
                      ? info.color
                      : visited
                        ? "var(--text-muted)"
                        : "var(--text-subtle)",
                    border: `1px solid ${isCurrent ? info.color : "var(--border)"}`,
                  }}
                >
                  {info.label}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-2">
            Available actions
          </div>
          <div className="flex flex-wrap gap-2">
            {available.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                No transitions from this state under{" "}
                <strong>{templateInfo[template].name}</strong>. Reset to try a
                new path.
              </p>
            ) : (
              available.map((a) => (
                <button
                  key={a.id}
                  onClick={() => act(a)}
                  disabled={frozen}
                  className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: templateInfo[template].color,
                  }}
                >
                  {a.label}
                </button>
              ))
            )}
            <button
              onClick={toggleFreeze}
              disabled={state === "NotStarted" || state === "SignedOff"}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[#fa4d56]/60 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {frozen ? "Unfreeze" : "Freeze"}
            </button>
            <button
              onClick={back}
              disabled={history.length <= 1}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Step back
            </button>
            <button
              onClick={() => reset()}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              Reset
            </button>
          </div>
          <p className="mt-3 text-[13px] text-[var(--text-muted)] min-h-[1.5em]">
            {lastNote}
          </p>
        </div>
      </div>

      {/* HISTORY */}
      <aside className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-subtle)]">
          History
        </div>
        <ol className="mt-3 space-y-2 text-sm" aria-label="Transition history">
          {history.map((h, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2"
            >
              <span className="font-mono text-[11px] text-[var(--text-subtle)] w-5 shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[13px] font-medium"
                  style={{ color: stateInfo[h.state].color }}
                >
                  {stateInfo[h.state].label}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {h.action ? `via ${h.action}` : "initial"}
                  {h.actor ? ` · ${h.actor}` : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
