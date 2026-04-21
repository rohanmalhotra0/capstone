"use client";

import { useCallback, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type RowKind = "leaf" | "parent" | "formula";

interface AccountRow {
  id: string;
  label: string;
  kind: RowKind;
  depth: number;
  /** IDs of direct children (parent rows only) */
  children?: string[];
  /** For formula rows: [addIds, subtractIds] */
  formula?: { add: string[]; sub: string[] };
}

type Quarter = "q1" | "q2" | "q3" | "q4";
type GridValues = Record<string, Record<Quarter, number>>;

/* ------------------------------------------------------------------ */
/*  Account hierarchy                                                  */
/* ------------------------------------------------------------------ */

const ACCOUNTS: AccountRow[] = [
  // ── Revenue ──────────────────────────────────────────────
  { id: "revenue",        label: "Revenue",                kind: "parent",  depth: 0, children: ["prod_rev", "svc_rev"] },
  { id: "prod_rev",       label: "Product Revenue",        kind: "leaf",    depth: 1 },
  { id: "svc_rev",        label: "Service Revenue",        kind: "leaf",    depth: 1 },

  // ── COGS ─────────────────────────────────────────────────
  { id: "cogs",           label: "Cost of Goods Sold",     kind: "parent",  depth: 0, children: ["mat_cost", "labor_cost", "mfg_oh"] },
  { id: "mat_cost",       label: "Material Cost",          kind: "leaf",    depth: 1 },
  { id: "labor_cost",     label: "Direct Labor",           kind: "leaf",    depth: 1 },
  { id: "mfg_oh",         label: "Manufacturing Overhead", kind: "leaf",    depth: 1 },

  // ── Gross Margin (formula: Revenue − COGS) ───────────────
  { id: "gross_margin",   label: "Gross Margin",           kind: "formula", depth: 0, formula: { add: ["revenue"], sub: ["cogs"] } },

  // ── OpEx ─────────────────────────────────────────────────
  { id: "opex",           label: "Operating Expenses",     kind: "parent",  depth: 0, children: ["salaries", "marketing", "rent", "depr"] },
  { id: "salaries",       label: "Salaries & Benefits",    kind: "leaf",    depth: 1 },
  { id: "marketing",      label: "Marketing",              kind: "leaf",    depth: 1 },
  { id: "rent",           label: "Rent & Facilities",      kind: "leaf",    depth: 1 },
  { id: "depr",           label: "Depreciation",           kind: "leaf",    depth: 1 },

  // ── Operating Income (formula: Gross Margin − OpEx) ──────
  { id: "op_income",      label: "Operating Income",       kind: "formula", depth: 0, formula: { add: ["gross_margin"], sub: ["opex"] } },

  // ── Other Income/Expense ─────────────────────────────────
  { id: "other",          label: "Other Income / Expense",  kind: "parent",  depth: 0, children: ["interest_inc", "interest_exp"] },
  { id: "interest_inc",   label: "Interest Income",         kind: "leaf",    depth: 1 },
  { id: "interest_exp",   label: "Interest Expense",        kind: "leaf",    depth: 1 },

  // ── Net Income (formula: Op Income + Other) ──────────────
  { id: "net_income",     label: "Net Income Before Tax",   kind: "formula", depth: 0, formula: { add: ["op_income", "other"], sub: [] } },
];

const QUARTERS: Quarter[] = ["q1", "q2", "q3", "q4"];

/* ------------------------------------------------------------------ */
/*  Scenario seed data                                                 */
/* ------------------------------------------------------------------ */

function makeLeafValues(seed: Record<string, [number, number, number, number]>): GridValues {
  const g: GridValues = {};
  for (const [id, vals] of Object.entries(seed)) {
    g[id] = { q1: vals[0], q2: vals[1], q3: vals[2], q4: vals[3] };
  }
  return g;
}

const ENTITY_FACTOR: Record<string, number> = {
  "US Operations": 1.0,
  EMEA: 0.72,
  APAC: 0.55,
  Global: 2.45,
};

const VERSION_FACTOR: Record<string, number> = {
  Working: 1.0,
  Final: 1.035,
};

function scaleLeafValues(base: GridValues, factor: number): GridValues {
  if (factor === 1) return structuredClone(base);
  const out: GridValues = {};
  for (const [id, row] of Object.entries(base)) {
    out[id] = {
      q1: Math.round(row.q1 * factor),
      q2: Math.round(row.q2 * factor),
      q3: Math.round(row.q3 * factor),
      q4: Math.round(row.q4 * factor),
    };
  }
  return out;
}

function seedLeafValues(
  scenario: string,
  entity: string,
  version: string,
): GridValues {
  const base = SCENARIO_DATA[scenario] ?? SCENARIO_DATA.Budget;
  const factor =
    (ENTITY_FACTOR[entity] ?? 1) * (VERSION_FACTOR[version] ?? 1);
  return scaleLeafValues(base, factor);
}

const SCENARIO_DATA: Record<string, GridValues> = {
  Budget: makeLeafValues({
    prod_rev: [4200, 4400, 4600, 4800],
    svc_rev: [1800, 1900, 2000, 2100],
    mat_cost: [1200, 1250, 1300, 1350],
    labor_cost: [800, 820, 840, 860],
    mfg_oh: [400, 410, 420, 430],
    salaries: [1500, 1520, 1540, 1560],
    marketing: [600, 620, 640, 660],
    rent: [300, 300, 300, 300],
    depr: [150, 150, 150, 150],
    interest_inc: [50, 55, 60, 65],
    interest_exp: [120, 115, 110, 105],
  }),
  Forecast: makeLeafValues({
    prod_rev: [4100, 4350, 4500, 4700],
    svc_rev: [1750, 1850, 1950, 2050],
    mat_cost: [1180, 1230, 1280, 1330],
    labor_cost: [790, 810, 830, 850],
    mfg_oh: [390, 400, 415, 425],
    salaries: [1480, 1500, 1520, 1540],
    marketing: [580, 600, 620, 640],
    rent: [300, 300, 300, 300],
    depr: [150, 150, 150, 150],
    interest_inc: [45, 50, 55, 60],
    interest_exp: [125, 120, 115, 110],
  }),
  Actual: makeLeafValues({
    prod_rev: [4150, 4380, 0, 0],
    svc_rev: [1770, 1870, 0, 0],
    mat_cost: [1190, 1240, 0, 0],
    labor_cost: [795, 815, 0, 0],
    mfg_oh: [395, 405, 0, 0],
    salaries: [1490, 1510, 0, 0],
    marketing: [590, 610, 0, 0],
    rent: [300, 300, 0, 0],
    depr: [150, 150, 0, 0],
    interest_inc: [48, 52, 0, 0],
    interest_exp: [122, 118, 0, 0],
  }),
};

/* ------------------------------------------------------------------ */
/*  Computation helpers                                                */
/* ------------------------------------------------------------------ */

function computeAll(leafValues: GridValues): GridValues {
  const out: GridValues = { ...leafValues };

  // 1. Parent rows: sum children
  for (const acct of ACCOUNTS) {
    if (acct.kind === "parent" && acct.children) {
      const row: Record<Quarter, number> = { q1: 0, q2: 0, q3: 0, q4: 0 };
      for (const cid of acct.children) {
        for (const q of QUARTERS) {
          row[q] += (out[cid]?.[q] ?? 0);
        }
      }
      out[acct.id] = row;
    }
  }

  // 2. Formula rows (depend on parent/leaf totals computed above)
  for (const acct of ACCOUNTS) {
    if (acct.kind === "formula" && acct.formula) {
      const row: Record<Quarter, number> = { q1: 0, q2: 0, q3: 0, q4: 0 };
      for (const aid of acct.formula.add) {
        for (const q of QUARTERS) row[q] += (out[aid]?.[q] ?? 0);
      }
      for (const sid of acct.formula.sub) {
        for (const q of QUARTERS) row[q] -= (out[sid]?.[q] ?? 0);
      }
      out[acct.id] = row;
    }
  }

  return out;
}

function fyTotal(row: Record<Quarter, number>) {
  return row.q1 + row.q2 + row.q3 + row.q4;
}

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

/* ------------------------------------------------------------------ */
/*  Dropdown                                                           */
/* ------------------------------------------------------------------ */

function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-subtle)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[var(--sandbox-input-bg)] border border-[var(--sandbox-input-border)] rounded px-2.5 py-1 text-[13px] font-mono text-[var(--sandbox-heading)] focus:outline-none focus:border-[var(--sandbox-formula-accent)] transition-colors cursor-pointer appearance-none pr-6"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='currentColor' opacity='0.55'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 8px center",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function EPMSandbox() {
  const [scenario, setScenario] = useState("Budget");
  const [version, setVersion] = useState("Working");
  const [entity, setEntity] = useState("US Operations");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [leafValues, setLeafValues] = useState<GridValues>(
    () => seedLeafValues("Budget", "US Operations", "Working"),
  );

  const handleScenarioChange = useCallback(
    (s: string) => {
      setScenario(s);
      setLeafValues(seedLeafValues(s, entity, version));
    },
    [entity, version],
  );

  const handleEntityChange = useCallback(
    (e: string) => {
      setEntity(e);
      setLeafValues(seedLeafValues(scenario, e, version));
    },
    [scenario, version],
  );

  const handleVersionChange = useCallback(
    (v: string) => {
      setVersion(v);
      setLeafValues(seedLeafValues(scenario, entity, v));
    },
    [scenario, entity],
  );

  const handleCellChange = useCallback(
    (id: string, q: Quarter, raw: string) => {
      const num = raw === "" ? 0 : parseInt(raw.replace(/,/g, ""), 10);
      if (isNaN(num)) return;
      setLeafValues((prev) => ({
        ...prev,
        [id]: { ...prev[id], [q]: num },
      }));
    },
    [],
  );

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const computed = useMemo(() => computeAll(leafValues), [leafValues]);

  // Determine which rows are visible based on collapse state
  const visibleAccounts = useMemo(() => {
    const hidden = new Set<string>();
    for (const acct of ACCOUNTS) {
      if (acct.kind === "parent" && acct.children && collapsed[acct.id]) {
        for (const cid of acct.children) hidden.add(cid);
      }
    }
    return ACCOUNTS.filter((a) => !hidden.has(a.id));
  }, [collapsed]);

  const activeDim = "Account";
  const dims = ["Account", "Period", "Scenario", "Version", "Entity", "Currency"];
  const cubes = [
    { name: "Plan", active: true },
    { name: "OEP_FS", active: false },
    { name: "OEP_REP", active: false },
  ];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--sandbox-card-bg)] overflow-hidden shadow-2xl">
      {/* ─── Header Bar ─── */}
      <div className="border-b border-[var(--border)] px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="bg-[#c74634] text-white text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded font-mono">
              ORACLE
            </span>
            <span className="text-[var(--text-subtle)]">›</span>
            <span className="text-[var(--text-muted)]">EPM Cloud</span>
            <span className="text-[var(--text-subtle)]">›</span>
            <span className="text-[var(--text-muted)]">Planning</span>
            <span className="text-[var(--text-subtle)]">›</span>
            <span className="text-[var(--sandbox-heading)] font-medium">Financials — Income Statement</span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-[var(--sandbox-chip-border)] bg-[var(--sandbox-chip-bg)] text-[var(--sandbox-success)]">
            Sandbox · Read-Write
          </span>
        </div>

        {/* Dropdowns row */}
        <div className="flex items-center gap-5 mt-3">
          <Dropdown
            label="Scenario"
            value={scenario}
            options={["Budget", "Forecast", "Actual"]}
            onChange={handleScenarioChange}
          />
          <Dropdown
            label="Version"
            value={version}
            options={["Working", "Final"]}
            onChange={handleVersionChange}
          />
          <Dropdown
            label="Entity"
            value={entity}
            options={["US Operations", "EMEA", "APAC", "Global"]}
            onChange={handleEntityChange}
          />
        </div>
      </div>

      {/* ─── Body: sidebar + grid ─── */}
      <div className="flex" style={{ minHeight: 520 }}>
        {/* ─── Left Sidebar ─── */}
        <aside className="w-48 shrink-0 border-r border-[var(--border)] bg-[var(--sandbox-sidebar-bg)] py-4 px-3 space-y-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-subtle)] mb-2 px-1">
              Dimensions
            </div>
            <ul className="space-y-0.5">
              {dims.map((d) => {
                const isActive = d === activeDim;
                return (
                  <li
                    key={d}
                    className={`text-[13px] px-2.5 py-1.5 rounded cursor-default transition-colors ${
                      isActive
                        ? "bg-[var(--primary)]/15 text-[var(--sandbox-formula-text)] border-l-2 border-[var(--sandbox-formula-accent)] -ml-px"
                        : "text-[var(--text-muted)] hover:text-[var(--sandbox-heading)] hover:bg-[var(--sandbox-dim-hover-bg)]"
                    }`}
                  >
                    {d}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-subtle)] mb-2 px-1">
              Cubes
            </div>
            <ul className="space-y-0.5">
              {cubes.map((c) => (
                <li
                  key={c.name}
                  className={`text-[13px] px-2.5 py-1.5 rounded cursor-default flex items-center gap-1.5 ${
                    c.active
                      ? "text-[var(--sandbox-heading)] bg-[var(--sandbox-dim-hover-bg)]"
                      : "text-[var(--text-subtle)]"
                  }`}
                >
                  <span className="text-[11px]">📦</span>
                  <span className="font-mono text-[12px]">{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ─── Main Grid ─── */}
        <div className="flex-1 min-w-0 overflow-x-auto">
          {/* Grid subtitle */}
          <div className="px-4 py-2.5 border-b border-[var(--border)] text-[11px] font-mono text-[var(--text-subtle)] tracking-wide">
            {scenario} · {version} · {entity} · All values USD thousands
          </div>

          <table className="w-full text-[13px] font-mono border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
                <th className="text-left py-2.5 px-4 font-medium w-[260px] border-b border-[var(--sandbox-divider)]">
                  Account
                </th>
                {QUARTERS.map((q) => (
                  <th
                    key={q}
                    className="text-right py-2.5 px-3 font-medium border-b border-[var(--sandbox-divider)] w-[110px]"
                  >
                    {q.toUpperCase()}
                  </th>
                ))}
                <th className="text-right py-2.5 px-4 font-medium border-b border-[var(--sandbox-divider)] w-[120px] text-[var(--sandbox-total)]">
                  FY Total
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleAccounts.map((acct) => {
                const row = computed[acct.id];
                const isParent = acct.kind === "parent";
                const isFormula = acct.kind === "formula";
                const isLeaf = acct.kind === "leaf";
                const isCollapsed = collapsed[acct.id];

                return (
                  <tr
                    key={acct.id}
                    className={`group border-b transition-colors ${
                      isFormula
                        ? "border-[var(--sandbox-divider)] bg-[var(--sandbox-formula-row)]"
                        : isParent
                          ? "border-[var(--sandbox-divider)] bg-[var(--sandbox-parent-row)]"
                          : "border-[var(--sandbox-divider-soft)] hover:bg-[var(--sandbox-row-hover)]"
                    }`}
                  >
                    {/* Account name */}
                    <td
                      className="py-2 px-4"
                      style={{ paddingLeft: `${acct.depth * 20 + 16}px` }}
                    >
                      <div className="flex items-center gap-1.5">
                        {isParent && (
                          <button
                            onClick={() => toggleCollapse(acct.id)}
                            className="text-[var(--text-subtle)] hover:text-[var(--sandbox-heading)] w-4 text-center text-[11px] transition-colors flex-shrink-0"
                            aria-label={isCollapsed ? "Expand" : "Collapse"}
                          >
                            {isCollapsed ? "▶" : "▼"}
                          </button>
                        )}
                        <span
                          className={`${
                            isParent
                              ? "font-semibold text-[var(--sandbox-heading)]"
                              : isFormula
                                ? "text-[var(--sandbox-formula-text)]"
                                : "text-[var(--text-muted)]"
                          }`}
                        >
                          {acct.label}
                        </span>
                        {isFormula && (
                          <span className="text-[9px] font-mono uppercase tracking-wider bg-[var(--sandbox-formula-badge-bg)] text-[var(--sandbox-formula-badge-text)] px-1.5 py-0.5 rounded ml-1">
                            Formula
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quarter cells */}
                    {QUARTERS.map((q) => {
                      const val = row?.[q] ?? 0;
                      if (isLeaf) {
                        return (
                          <td key={q} className="py-1.5 px-2 text-right">
                            <input
                              type="text"
                              value={fmt(val)}
                              onChange={(e) =>
                                handleCellChange(acct.id, q, e.target.value)
                              }
                              className="w-full bg-[var(--sandbox-input-bg)] border border-[var(--sandbox-input-border)] rounded px-2 py-1 text-right text-[13px] font-mono text-[var(--sandbox-input-text)] focus:outline-none focus:border-[var(--sandbox-formula-accent)] focus:bg-[var(--sandbox-input-bg-focus)] transition-colors tabular-nums"
                            />
                          </td>
                        );
                      }
                      return (
                        <td
                          key={q}
                          className={`py-2 px-3 text-right tabular-nums ${
                            isFormula
                              ? "text-[var(--sandbox-formula-text)] font-medium"
                              : "text-[var(--sandbox-heading)] font-semibold"
                          }`}
                        >
                          {fmt(val)}
                        </td>
                      );
                    })}

                    {/* FY Total */}
                    <td
                      className={`py-2 px-4 text-right tabular-nums font-semibold ${
                        isFormula
                          ? "text-[var(--sandbox-total)]"
                          : isParent
                            ? "text-[var(--sandbox-total)]"
                            : "text-[var(--sandbox-total-dim)]"
                      }`}
                    >
                      {row ? fmt(fyTotal(row)) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div className="border-t border-[var(--border)] px-5 py-2 flex items-center justify-between text-[10px] font-mono text-[var(--text-subtle)]">
        <span>
          {ACCOUNTS.filter((a) => a.kind === "leaf").length} leaf accounts ·{" "}
          {ACCOUNTS.filter((a) => a.kind === "formula").length} computed
        </span>
        <span>Sandbox — data resets on scenario, entity, or version change</span>
      </div>
    </div>
  );
}
