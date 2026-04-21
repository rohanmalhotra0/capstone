"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

type Template = "bottom-up" | "distribute" | "free-form";

type State =
  | "NotStarted"
  | "FirstPass"
  | "UnderReview"
  | "Delegated"
  | "TopOwner"
  | "Approved"
  | "Rejected"
  | "SignedOff";

type Actor = "Owner" | "Reviewer" | "Delegate" | "Top Owner" | "System";

interface Action {
  id: string;
  label: string;
  from: State;
  to: State;
  note: string;
  actor: Actor;
  templates: Template[];
  kind: "primary" | "path" | "lateral" | "reopen" | "terminal";
}

const actions: Action[] = [
  {
    id: "start-ff",
    label: "Start",
    from: "NotStarted",
    to: "FirstPass",
    note: "Free Form begins at First Pass — the unit owner drafts plan data before anything is under review.",
    actor: "System",
    templates: ["free-form"],
    kind: "primary",
  },
  {
    id: "start-bu-dist",
    label: "Start",
    from: "NotStarted",
    to: "UnderReview",
    note: "Bottom Up and Distribute both start the unit Under Review by the first approver in the path.",
    actor: "System",
    templates: ["bottom-up", "distribute"],
    kind: "primary",
  },
  {
    id: "submit-ff",
    label: "Submit",
    from: "FirstPass",
    to: "UnderReview",
    note: "First Pass owner finalises the draft and hands off for review.",
    actor: "Owner",
    templates: ["free-form"],
    kind: "path",
  },
  {
    id: "approve",
    label: "Approve",
    from: "UnderReview",
    to: "Approved",
    note: "Reviewer accepts the unit. The next transition depends on template — Promote, Submit, or Sign Off.",
    actor: "Reviewer",
    templates: ["bottom-up", "distribute", "free-form"],
    kind: "primary",
  },
  {
    id: "reject",
    label: "Reject",
    from: "UnderReview",
    to: "Rejected",
    note: "Reviewer rejects — the unit drops back to the owner for rework.",
    actor: "Reviewer",
    templates: ["bottom-up", "distribute", "free-form"],
    kind: "primary",
  },
  {
    id: "delegate",
    label: "Delegate",
    from: "UnderReview",
    to: "Delegated",
    note: "Bottom Up only. Current approver hands the review to a delegate without advancing the path.",
    actor: "Reviewer",
    templates: ["bottom-up"],
    kind: "lateral",
  },
  {
    id: "take-ownership",
    label: "Take Ownership",
    from: "UnderReview",
    to: "UnderReview",
    note: "A parent owner seizes the unit mid-path — review continues but actor changes. (Stays Under Review.)",
    actor: "Reviewer",
    templates: ["bottom-up", "distribute"],
    kind: "lateral",
  },
  {
    id: "submit-to-top",
    label: "Submit to Top",
    from: "UnderReview",
    to: "TopOwner",
    note: "Bottom Up only. Skips remaining levels and routes directly to the planning unit's top owner.",
    actor: "Reviewer",
    templates: ["bottom-up"],
    kind: "path",
  },
  {
    id: "promote-from-delegate",
    label: "Promote",
    from: "Delegated",
    to: "UnderReview",
    note: "Delegate hands the review back to the main path.",
    actor: "Delegate",
    templates: ["bottom-up"],
    kind: "path",
  },
  {
    id: "resubmit",
    label: "Resubmit",
    from: "Rejected",
    to: "UnderReview",
    note: "Owner addresses feedback and resubmits for review.",
    actor: "Owner",
    templates: ["bottom-up", "distribute", "free-form"],
    kind: "path",
  },
  {
    id: "promote",
    label: "Promote",
    from: "Approved",
    to: "UnderReview",
    note: "Bottom Up: approval bubbles UP — the parent in the hierarchy now reviews the approved unit.",
    actor: "Owner",
    templates: ["bottom-up"],
    kind: "path",
  },
  {
    id: "submit-dist",
    label: "Submit",
    from: "Approved",
    to: "UnderReview",
    note: "Distribute: owner at the end of the path submits the approved unit to the next reviewer.",
    actor: "Owner",
    templates: ["distribute"],
    kind: "path",
  },
  {
    id: "signoff-approved",
    label: "Sign Off",
    from: "Approved",
    to: "SignedOff",
    note: "Final approver signs off. The unit locks as the approved plan of record.",
    actor: "Reviewer",
    templates: ["bottom-up", "distribute", "free-form"],
    kind: "terminal",
  },
  {
    id: "signoff-top",
    label: "Sign Off",
    from: "TopOwner",
    to: "SignedOff",
    note: "Top owner signs off after a Submit to Top — path complete.",
    actor: "Top Owner",
    templates: ["bottom-up"],
    kind: "terminal",
  },
  {
    id: "reopen",
    label: "Reopen",
    from: "SignedOff",
    to: "UnderReview",
    note: "Admin reopens a signed-off unit — rare, usually tied to a correction or revision.",
    actor: "System",
    templates: ["bottom-up", "distribute", "free-form"],
    kind: "reopen",
  },
];

interface TemplateMeta {
  num: string;
  name: string;
  tagline: string;
  note: string;
}

const templateInfo: Record<Template, TemplateMeta> = {
  "bottom-up": {
    num: "01",
    name: "Bottom Up",
    tagline: "Promote bubbles up the hierarchy.",
    note: "Each level approves and promotes. Final level signs off. Supports Delegate and Submit to Top.",
  },
  distribute: {
    num: "02",
    name: "Distribute",
    tagline: "Owner at the end of the path submits.",
    note: "Unit walks the hierarchy path first; the final owner then submits for review and sign off.",
  },
  "free-form": {
    num: "03",
    name: "Free Form",
    tagline: "Flat — starts at First Pass.",
    note: "No hierarchy. Owner drafts in First Pass, submits, and a reviewer approves or rejects.",
  },
};

const stateInfo: Record<
  State,
  { label: string; description: string; tone: "neutral" | "warn" | "ok" | "bad" | "accent" }
> = {
  NotStarted: {
    label: "Not Started",
    description: "The planning unit exists but no approval activity has begun.",
    tone: "neutral",
  },
  FirstPass: {
    label: "First Pass",
    description: "Free Form owner is drafting the plan. Submit when the draft is ready for review.",
    tone: "accent",
  },
  UnderReview: {
    label: "Under Review",
    description: "An approver is evaluating the unit. They can Approve, Reject, Delegate, or Submit to Top.",
    tone: "warn",
  },
  Delegated: {
    label: "Delegated",
    description: "The current reviewer has handed the evaluation to a delegate. Main path is paused.",
    tone: "accent",
  },
  TopOwner: {
    label: "With Top Owner",
    description: "A reviewer bypassed remaining levels. The planning unit's top owner must sign off.",
    tone: "accent",
  },
  Approved: {
    label: "Approved",
    description:
      "Reviewer approved. Next: Promote (Bottom Up), Submit (Distribute), or Sign Off if last in path.",
    tone: "ok",
  },
  Rejected: {
    label: "Rejected",
    description: "Reviewer rejected. Owner must Resubmit after addressing feedback.",
    tone: "bad",
  },
  SignedOff: {
    label: "Signed Off",
    description: "Final state — unit is locked as the plan of record. Admin may Reopen.",
    tone: "ok",
  },
};

const toneColor: Record<"neutral" | "warn" | "ok" | "bad" | "accent", string> = {
  neutral: "var(--text-muted)",
  warn: "#f1c21b",
  ok: "#6fdc8c",
  bad: "#fa8072",
  accent: "#be95ff",
};

const stateOrder: State[] = [
  "NotStarted",
  "FirstPass",
  "UnderReview",
  "Delegated",
  "TopOwner",
  "Approved",
  "Rejected",
  "SignedOff",
];

interface HistoryEntry {
  state: State;
  action: string | null;
  actor: Actor;
  note?: string;
}

const actionKindStyle: Record<Action["kind"], string> = {
  primary:
    "bg-[var(--text)] text-[var(--bg)] border-transparent hover:opacity-90",
  path:
    "bg-transparent text-[var(--text)] border-[var(--border-strong)] hover:bg-[var(--surface-2)]",
  lateral:
    "bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]",
  reopen:
    "bg-transparent text-[var(--text-muted)] border-dashed border-[var(--border-strong)] hover:text-[var(--text)]",
  terminal:
    "bg-[#6fdc8c]/10 text-[#6fdc8c] border-[#6fdc8c]/40 hover:bg-[#6fdc8c]/15",
};

export function ApprovalsSimulator() {
  const [template, setTemplate] = useState<Template>("bottom-up");
  const [state, setState] = useState<State>("NotStarted");
  const [history, setHistory] = useState<HistoryEntry[]>([
    { state: "NotStarted", action: null, actor: "System" },
  ]);
  const [frozen, setFrozen] = useState(false);
  const [lastNote, setLastNote] = useState<string>(
    "Pick a template and press Start. Freeze is a side-state — it never advances the path.",
  );

  const available = useMemo(
    () =>
      actions.filter(
        (a) => a.from === state && a.templates.includes(template),
      ),
    [state, template],
  );

  const blocked = useMemo(() => {
    return actions
      .filter((a) => a.from === state && !a.templates.includes(template))
      .map((a) => ({
        ...a,
        reason: `Not available in ${templateInfo[template].name} template.`,
      }));
  }, [state, template]);

  const reset = (nextTemplate?: Template) => {
    const t = nextTemplate ?? template;
    setTemplate(t);
    setState("NotStarted");
    setHistory([{ state: "NotStarted", action: null, actor: "System" }]);
    setFrozen(false);
    setLastNote(
      `${templateInfo[t].name} selected. ${templateInfo[t].note} Press Start to begin.`,
    );
  };

  const act = (a: Action) => {
    if (frozen) return;
    setState(a.to);
    setHistory((h) => [
      ...h,
      { state: a.to, action: a.label, actor: a.actor, note: a.note },
    ]);
    setLastNote(a.note);
  };

  const toggleFreeze = () => {
    if (state === "NotStarted" || state === "SignedOff") return;
    setFrozen((f) => {
      const next = !f;
      setLastNote(
        next
          ? "Frozen — all path actions are blocked until Unfreeze. Freeze is a side-state, not a transition."
          : "Unfrozen. Path actions are enabled again.",
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

  const cur = stateInfo[state];
  const curTone = toneColor[cur.tone];
  const tmpl = templateInfo[template];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        {/* TEMPLATE PICKER */}
        <div>
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            <span className="inline-block h-px w-6 bg-[var(--border-strong)]" />
            Template
          </div>
          <div
            className="mt-3 border-t border-[var(--border)]"
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
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-6 border-b border-[var(--border)] py-4 text-left transition hover:bg-[var(--surface-2)]/40"
                >
                  <span
                    className="font-mono text-[11px] text-[var(--text-subtle)] tabular-nums"
                    aria-hidden
                  >
                    {info.num}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span
                      className={
                        "text-[17px] font-medium tracking-[-0.01em] " +
                        (active
                          ? "text-[var(--text)]"
                          : "text-[var(--text-muted)] group-hover:text-[var(--text)]")
                      }
                    >
                      {info.name}
                      {active ? (
                        <span className="ml-3 align-middle text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                          · selected
                        </span>
                      ) : null}
                    </span>
                    <span className="text-[13px] text-[var(--text-subtle)] italic font-light">
                      {info.tagline}
                    </span>
                  </span>
                  <span
                    className={
                      "text-[11px] font-mono transition " +
                      (active
                        ? "text-[var(--text)]"
                        : "text-[var(--text-subtle)] group-hover:text-[var(--text-muted)]")
                    }
                  >
                    {active ? "●" : "○"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STATE */}
        <div className="relative mt-10">
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            <span className="inline-block h-px w-6 bg-[var(--border-strong)]" />
            Current state
            <span className="ml-auto font-mono text-[10px] text-[var(--text-subtle)]">
              {tmpl.name}
            </span>
          </div>

          <div
            className={
              "relative mt-3 border-t border-[var(--border)] pt-5 " +
              (frozen ? "pointer-events-none" : "")
            }
            aria-live="polite"
          >
            <div className="flex items-baseline gap-4">
              <AnimatePresence mode="wait">
                <motion.h3
                  key={state}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="text-[32px] leading-none font-semibold tracking-[-0.02em]"
                  style={{ color: curTone }}
                >
                  {cur.label}
                </motion.h3>
              </AnimatePresence>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                state · {stateOrder.indexOf(state) + 1}/{stateOrder.length}
              </span>
            </div>
            <p className="mt-2 max-w-[58ch] text-[13.5px] leading-relaxed text-[var(--text-muted)]">
              {cur.description}
            </p>

            {/* State rail */}
            <ol
              className="mt-5 flex flex-wrap gap-x-5 gap-y-2"
              aria-label="State rail"
            >
              {stateOrder.map((s, i) => {
                const info = stateInfo[s];
                const isCurrent = s === state;
                const visited = history.some((h) => h.state === s);
                return (
                  <li
                    key={s}
                    className="flex items-center gap-2 text-[11px] font-mono"
                    style={{
                      color: isCurrent
                        ? toneColor[info.tone]
                        : visited
                          ? "var(--text-muted)"
                          : "var(--text-subtle)",
                    }}
                  >
                    <span className="tabular-nums opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={isCurrent ? "" : visited ? "" : "opacity-70"}>
                      {info.label}
                    </span>
                    {isCurrent ? (
                      <span
                        className="inline-block h-1 w-1 rounded-full"
                        style={{ background: toneColor[info.tone] }}
                        aria-hidden
                      />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>

          {frozen ? (
            <div
              className="pointer-events-auto absolute inset-0 top-3 flex flex-col items-start justify-center overflow-hidden rounded-sm border border-dashed border-[#fa8072]/50 bg-[var(--bg)]/80 px-5 py-4 backdrop-blur-[1px]"
              aria-live="assertive"
            >
              <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.22em] text-[#fa8072]">
                <span className="inline-block h-px w-6 bg-[#fa8072]/60" />
                Frozen
              </div>
              <p className="mt-2 max-w-[48ch] text-[13px] text-[var(--text-muted)]">
                Edits on this planning unit are locked. State ·{" "}
                <span className="text-[var(--text)]">{cur.label}</span> is
                preserved. Unfreeze below to continue.
              </p>
            </div>
          ) : null}
        </div>

        {/* ACTIONS */}
        <div className="mt-10">
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            <span className="inline-block h-px w-6 bg-[var(--border-strong)]" />
            Available actions
            <span className="ml-auto tabular-nums">
              {available.length.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="mt-3 border-t border-[var(--border)] pt-4">
            {available.length === 0 ? (
              <p className="text-[13.5px] text-[var(--text-muted)]">
                No transitions from <strong>{cur.label}</strong> under{" "}
                <strong>{tmpl.name}</strong>. Step back or reset to explore a
                different path.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {available.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => act(a)}
                    disabled={frozen}
                    title={a.note}
                    className={
                      "rounded-sm border px-3.5 py-2 text-[13px] font-medium transition disabled:opacity-40 disabled:cursor-not-allowed " +
                      actionKindStyle[a.kind]
                    }
                  >
                    <span>{a.label}</span>
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
                      {a.actor}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {blocked.length > 0 ? (
              <div className="mt-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                  Blocked in this template
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {blocked.map((a) => (
                    <span
                      key={a.id}
                      title={a.reason}
                      className="inline-flex items-center gap-2 rounded-sm border border-dashed border-[var(--border)] px-3 py-1.5 text-[12px] text-[var(--text-subtle)] line-through decoration-[var(--text-subtle)]/50"
                    >
                      {a.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--border)] pt-4 text-[12px] font-mono text-[var(--text-subtle)]">
              <button
                onClick={toggleFreeze}
                disabled={state === "NotStarted" || state === "SignedOff"}
                className="inline-flex items-center gap-2 uppercase tracking-[0.16em] transition hover:text-[#fa8072] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: frozen ? "#fa8072" : "var(--border-strong)",
                  }}
                  aria-hidden
                />
                {frozen ? "Unfreeze" : "Freeze"}
              </button>
              <button
                onClick={back}
                disabled={history.length <= 1}
                className="uppercase tracking-[0.16em] transition hover:text-[var(--text)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Step back
              </button>
              <button
                onClick={() => reset()}
                className="uppercase tracking-[0.16em] transition hover:text-[var(--text)]"
              >
                Reset
              </button>
              <span className="ml-auto uppercase tracking-[0.16em]">
                step · {(history.length - 1).toString().padStart(2, "0")}
              </span>
            </div>

            <p className="mt-4 max-w-[64ch] text-[13px] italic text-[var(--text-muted)] min-h-[1.5em]">
              {lastNote}
            </p>
          </div>
        </div>
      </div>

      {/* HISTORY */}
      <aside className="min-w-0">
        <div className="sticky top-20">
          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            <span className="inline-block h-px w-6 bg-[var(--border-strong)]" />
            Transition log
            <span className="ml-auto tabular-nums">
              {(history.length - 1).toString().padStart(2, "0")}
            </span>
          </div>

          <ol
            className="mt-3 border-t border-[var(--border)]"
            aria-label="Transition history"
          >
            {history.map((h, i) => {
              const info = stateInfo[h.state];
              return (
                <li
                  key={i}
                  className="grid grid-cols-[auto_1fr] gap-4 border-b border-[var(--border)] py-3"
                >
                  <span className="font-mono text-[11px] text-[var(--text-subtle)] tabular-nums pt-0.5">
                    {i.toString().padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div
                      className="text-[13px] font-medium tracking-[-0.005em]"
                      style={{ color: toneColor[info.tone] }}
                    >
                      {info.label}
                    </div>
                    <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--text-subtle)]">
                      {h.action ? h.action : "initial"} · {h.actor}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Template · {tmpl.name}
          </p>
        </div>
      </aside>
    </div>
  );
}
