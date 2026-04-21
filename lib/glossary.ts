export interface GlossaryTerm {
  term: string;
  shortDef: string;
  longDef: string;
  category:
    | "module"
    | "dimension"
    | "rule"
    | "concept"
    | "integration"
    | "approval"
    | "wizard";
  relatedModules?: string[]; // module ids
  aliases?: string[];
}

export const glossary: GlossaryTerm[] = [
  {
    term: "B&T Wizard",
    aliases: ["Benefits & Taxes Wizard", "Benefits and Taxes Wizard"],
    shortDef: "Workforce module tool for defining earnings, benefits, and tax components.",
    longDef:
      "The Benefits & Taxes Wizard walks you through defining a component's details, rates, and review. It only works after prerequisite smart-list members are imported and Options/Tiers configured. Runs in sequence: Details → Rates → Review → Save → Synchronize Defaults.",
    category: "wizard",
    relatedModules: ["workforce"],
  },
  {
    term: "Synchronize Defaults",
    aliases: ["Synchronize"],
    shortDef: "Rule that pushes module defaults (rates, assumptions) to every intersection.",
    longDef:
      "A business rule that applies default values (e.g. benefit rates from the B&T Wizard, depreciation assumptions from Capital) across employees, jobs, assets, or projects. If you skip it after a config change, plans compute with stale values and Financials will show zeros.",
    category: "rule",
    relatedModules: ["workforce", "capital"],
  },
  {
    term: "Integration Summary",
    shortDef: "Reconciliation view that confirms one module's totals landed correctly in Financials.",
    longDef:
      "Financials exposes an Integration Summary for each source module (Workforce, Capital, Projects). It reconciles pushed totals against the source — your smoke test before trusting the P&L.",
    category: "integration",
    relatedModules: ["financials", "workforce", "capital", "projects"],
  },
  {
    term: "Bottom Up Approval",
    shortDef: "Approval template where planning units bubble up the hierarchy via Promote.",
    longDef:
      "A Bottom Up approval starts at the lowest planning unit and promotes up the hierarchy. Each owner reviews and promotes to the next parent. Approval action is Promote, not Submit.",
    category: "approval",
  },
  {
    term: "Distribute Approval",
    shortDef: "Approval template where the owner at the end of the path Submits the unit.",
    longDef:
      "Distribute approvals walk the hierarchy path, and the owner at the end of the path Submits. Contrast with Bottom Up (Promote at each level).",
    category: "approval",
  },
  {
    term: "Free Form Approval",
    shortDef: "Flat approval — no hierarchy path. Starts at First Pass.",
    longDef:
      "Free Form approvals don't walk a hierarchy. The unit starts in First Pass state and is submitted straight into review. Use when ownership is flat or ad-hoc.",
    category: "approval",
  },
  {
    term: "Freeze / Unfreeze",
    shortDef: "Side-state that gates edits on a planning unit — not a path transition.",
    longDef:
      "Freeze locks a planning unit from further edits without advancing the approval state. Unfreeze re-enables edits. These are toggles on top of the approval state, not steps in the path.",
    category: "approval",
  },
  {
    term: "Budgetary Control",
    aliases: ["BC"],
    shortDef: "Oracle Cloud service that enforces fund availability via Funds Check and Funds Reserve.",
    longDef:
      "Oracle Budgetary Control is the commitment/funds-check engine Financials integrates with via Budget Revisions. The 9-step revision workflow posts to BC at Funds Check and Funds Reserve.",
    category: "integration",
    relatedModules: ["financials"],
  },
  {
    term: "Funds Check",
    shortDef: "Step 7 of Budget Revisions — validates that a revision won't overrun available funds.",
    longDef:
      "Funds Check is the validation step against Budgetary Control. It's non-destructive — it confirms the revision is fundable but does not commit. Runs the Funds Check business rule.",
    category: "rule",
    relatedModules: ["financials"],
  },
  {
    term: "Funds Reserve",
    shortDef: "Step 9 of Budget Revisions — posts the approved revision to Budgetary Control.",
    longDef:
      "Funds Reserve is the terminal step that actually reserves the funds in Budgetary Control. Runs only after approval (if required). Business rule: Funds Reserve.",
    category: "rule",
    relatedModules: ["financials"],
  },
  {
    term: "B&T Component",
    shortDef: "A single earning, benefit, or tax defined via the Wizard.",
    longDef:
      "A Workforce compensation building block — one line item such as Base Salary, 401k Match, or FICA. Components have a type (Earning/Benefit/Tax), value type (flat/percent/tiered), and a rate.",
    category: "concept",
    relatedModules: ["workforce"],
  },
  {
    term: "CIP",
    aliases: ["Construction in Progress"],
    shortDef: "Capital asset not yet in service — tracked separately until in-service transfer.",
    longDef:
      "Construction in Progress. Capital tracks CIP balances until an asset goes in-service; then the balance transfers out of CIP and depreciation begins. Financials shows CIP on the balance sheet.",
    category: "concept",
    relatedModules: ["capital"],
  },
  {
    term: "NBV",
    aliases: ["Net Book Value"],
    shortDef: "Asset cost minus accumulated depreciation — what appears on the balance sheet.",
    longDef:
      "Net Book Value = Asset Cost − Accumulated Depreciation. Capital calculates it per asset and pushes it to Financials via Synchronize. NBV is the balance-sheet carrying amount.",
    category: "concept",
    relatedModules: ["capital", "financials"],
  },
  {
    term: "Flexible Account Mapping",
    shortDef: "Workforce → Financials mapping style — per-component control over target accounts.",
    longDef:
      "Flexible Account Mapping lets you map each Workforce component to a specific Financials account, versus the B&T Wizard's simpler summary push. Use when Financials account structure is granular.",
    category: "integration",
    relatedModules: ["workforce", "financials"],
  },
  {
    term: "Employee+Job Granularity",
    shortDef: "Workforce granularity option that plans at both employee AND job-code level.",
    longDef:
      "Workforce granularity choices are Employee, Job, or Employee+Job. Employee+Job is required for some use cases (utilization costing into Projects) but increases cube size significantly.",
    category: "concept",
    relatedModules: ["workforce"],
  },
  {
    term: "Capital Project",
    shortDef: "A Project of type 'Capital' — its costs generate a CIP asset in Capital.",
    longDef:
      "Project type in Projects. Capital projects push capitalized cost into Capital's CIP balance. In-service transfer then converts CIP to a depreciable asset. Requires Projects→Capital integration.",
    category: "concept",
    relatedModules: ["projects", "capital"],
  },
  {
    term: "Data Map",
    shortDef: "Reusable mapping between source and target POVs used to push data between cubes.",
    longDef:
      "Data Maps define how data moves between cubes (e.g. Strategic Modeling ↔ Financials). Dimensions are aligned and data is pushed bidirectionally. The SM↔FS integration relies on Data Maps.",
    category: "integration",
    relatedModules: ["strategic-modeling", "financials"],
  },
  {
    term: "Projects Financials Mapping",
    shortDef: "Config task mapping Projects accounts to Financials accounts for the integration push.",
    longDef:
      "Config task in Projects used to map project costs and revenues to Financials' chart of accounts. Must be run before the Projects→Financials integration functions.",
    category: "integration",
    relatedModules: ["projects", "financials"],
  },
  {
    term: "Valid Intersections",
    shortDef: "Rule definitions restricting which dimensional intersections can have data.",
    longDef:
      "Valid Intersections prevent data entry at nonsensical combinations (e.g. a balance-sheet account at a P&L-only entity). Configured per cube; critical before go-live.",
    category: "concept",
  },
  {
    term: "Entity",
    shortDef: "Required dimension — organizational / legal structure of the company.",
    longDef:
      "One of the two required dimensions (with Currency). Entity represents the org/legal hierarchy — subsidiaries, cost centers, branches. Every plan has an Entity context.",
    category: "dimension",
  },
  {
    term: "Currency",
    shortDef: "Required dimension — handles multi-currency planning and translation.",
    longDef:
      "One of the two required dimensions. Enables multi-currency plans; Financials auto-generates translation members. All modules share the Currency dimension.",
    category: "dimension",
  },
  {
    term: "Custom Dimension",
    shortDef: "Optional dimension added at app creation — e.g. Product, Channel, Region.",
    longDef:
      "Dimensions you add beyond required/module ones. Up to ~12 custom dimensions depending on module. The 'Project' custom dim is what enables Workforce→Projects and Capital→Projects integrations.",
    category: "dimension",
  },
  {
    term: "Cube",
    shortDef: "A multi-dim Essbase-style block used to store plan data for a module.",
    longDef:
      "Each module has its own cube (OEP_FS, OEP_WFP, OEP_CPX, OEP_PFP, OEP_REP, etc.). Cubes are Essbase BSO/ASO storage. Integrations move data between cubes via rules or data maps.",
    category: "concept",
  },
  {
    term: "Rolling Forecast",
    shortDef: "Financials feature — forecast horizon that rolls forward with time (e.g. next 12 months).",
    longDef:
      "Enable Rolling Forecast in Financials to get a continuously rolling planning horizon. Configure the number of periods and the roll-forward rule.",
    category: "concept",
    relatedModules: ["financials"],
  },
  {
    term: "Budget Revisions",
    shortDef: "Financials feature — controlled mid-cycle budget changes posted to Budgetary Control.",
    longDef:
      "Financials feature for mid-cycle budget changes. 9-step workflow: Build → Push to BC → Prepare → Populate → Enter → Share → Funds Check → Approval → Funds Reserve. Integrates with Oracle BC.",
    category: "concept",
    relatedModules: ["financials"],
  },
  {
    term: "Strategic Modeling",
    aliases: ["SM"],
    shortDef: "Long-range modeling module — scenario planning via data maps, not cube integration.",
    longDef:
      "The SM module is for long-range strategic and scenario modeling. Connects bidirectionally to Financials via Data Maps (not the standard integration rule pattern used by WF/CX/PF).",
    category: "module",
    relatedModules: ["strategic-modeling"],
  },
  {
    term: "OFS_",
    shortDef: "Financials prefix for member names and artifacts.",
    longDef: "Object prefix used by Oracle EPM for Financials module artifacts.",
    category: "module",
    relatedModules: ["financials"],
  },
  {
    term: "OWP_",
    shortDef: "Workforce prefix for member names and artifacts.",
    longDef: "Object prefix used by Oracle EPM for Workforce Planning module artifacts.",
    category: "module",
    relatedModules: ["workforce"],
  },
  {
    term: "OCX_",
    shortDef: "Capital prefix for member names and artifacts.",
    longDef: "Object prefix used by Oracle EPM for Capital module artifacts.",
    category: "module",
    relatedModules: ["capital"],
  },
  {
    term: "OPF_",
    shortDef: "Projects prefix for member names and artifacts.",
    longDef: "Object prefix used by Oracle EPM for Projects module artifacts.",
    category: "module",
    relatedModules: ["projects"],
  },
  {
    term: "Smart Push",
    shortDef: "Form-save trigger that pushes data through a Data Map into a target cube immediately.",
    longDef:
      "Smart Push fires automatically (or on demand) from a form save, executing an attached Data Map so planners see the impact in the target cube without running a separate job. Use for cross-cube forms where instant reflection matters.",
    category: "integration",
  },
  {
    term: "Data Integration",
    aliases: ["Data Management", "EPM Integration Agent"],
    shortDef: "ETL tool that loads external source data (files, ERPs) into EPM cubes.",
    longDef:
      "Data Integration (successor to Data Management) is the load pipeline for external sources — flat files, Oracle ERP Cloud, Fusion GL, etc. It maps source columns to target dimensions and supports scheduled loads. Contrast with Data Map (cube↔cube) and Smart Push (form-save trigger).",
    category: "integration",
  },
  {
    term: "Data Movement Decision",
    shortDef: "Smart Push vs Data Map vs Data Integration — picked by trigger and source.",
    longDef:
      "Decision rule: external source → Data Integration. Form-save trigger → Smart Push. Cube-to-cube batch → Data Map. Most-tested concept on the 1Z0-1080 exam. Smart Push is actually Data Map + automatic form-save trigger underneath.",
    category: "integration",
  },
  {
    term: "Security Priority",
    aliases: ["Deny Wins", "Access Priority"],
    shortDef: "Deny > None > Write > Read. Most restrictive access wins.",
    longDef:
      "When a user inherits access through multiple groups or layers, Oracle EPM resolves conflicts by Deny > None > Write > Read. Deny always wins. Applied across five layers: Role → Artifact → Dimension → Valid Intersection → Cell-level.",
    category: "concept",
  },
  {
    term: "Cell-Level Security",
    shortDef: "Deepest security layer — restricts access to individual cube cells via rules.",
    longDef:
      "Cell-level security is the narrowest layer below Valid Intersections. It evaluates a user's context and the cell's dimension members to grant or deny read/write per cell. Expensive — use sparingly for sensitive cross-sections (exec comp, confidential entities).",
    category: "concept",
  },
  {
    term: "IPM Insights",
    aliases: ["Intelligent Performance Management", "IPM"],
    shortDef: "AI-assisted layer that surfaces variance, prediction, and anomaly insights to planners.",
    longDef:
      "IPM Insights runs three engines on planning data: Variance & Bias (actual vs plan patterns), Prediction (auto ML forecasts), and Anomaly Detection (outlier cells). Configured via IPM Configurator; planners review insights and accept or dismiss them.",
    category: "concept",
  },
  {
    term: "Variance & Bias Insight",
    shortDef: "IPM engine that flags where actuals consistently drift from plan (persistent bias).",
    longDef:
      "A Variance & Bias insight highlights accounts or entities where the gap between actual and plan is non-random — i.e. a planner is consistently high or low. Surfaces behavioural bias, not just numerical variance.",
    category: "concept",
  },
  {
    term: "Prediction Insight",
    shortDef: "IPM engine that generates a statistical forecast from historical actuals.",
    longDef:
      "Prediction Insights run ML models on historical actuals to produce a baseline forecast. Planners compare their plan to the model and adjust. Works best with 24+ months of clean history.",
    category: "concept",
  },
  {
    term: "Anomaly Detection",
    shortDef: "IPM engine that flags individual cells whose values are statistical outliers.",
    longDef:
      "Anomaly Detection examines historical time-series per cell and flags values that deviate meaningfully. Useful for catching data-load errors or one-time events that shouldn't anchor a forecast.",
    category: "concept",
  },
  {
    term: "EPM Automate",
    aliases: ["EPM Automate CLI"],
    shortDef: "CLI for scripting EPM Cloud admin and data operations from outside the UI.",
    longDef:
      "EPM Automate is the official command-line client. Common commands: login, uploadFile, importData, runBusinessRule, exportSnapshot, runDataRule, restructureCube. Used for nightly batches, backups, and CI-style deployments of metadata.",
    category: "integration",
  },
  {
    term: "Delegate (Approval)",
    shortDef: "Bottom Up action — reviewer hands evaluation to a delegate without advancing the path.",
    longDef:
      "In Bottom Up approvals, the current reviewer can Delegate the unit to another user. The unit enters a Delegated state; the delegate reviews and Promotes back to the main path. Distinct from Take Ownership and Submit to Top.",
    category: "approval",
  },
  {
    term: "Take Ownership",
    shortDef: "A parent approver seizes control of a planning unit mid-path.",
    longDef:
      "Take Ownership lets a parent owner pull a planning unit out of the current reviewer's queue and become the active reviewer. The state stays Under Review but the responsible actor changes. Available in Bottom Up and Distribute.",
    category: "approval",
  },
  {
    term: "Submit to Top",
    shortDef: "Bottom Up action — skip remaining levels and route straight to the unit's top owner.",
    longDef:
      "Submit to Top is an escalation path in Bottom Up approvals. The reviewer bypasses intermediate levels and sends the unit to the planning unit's top owner, who then signs off.",
    category: "approval",
  },
  {
    term: "Reopen (Approval)",
    shortDef: "Admin action that pulls a signed-off unit back into review.",
    longDef:
      "Reopen moves a Signed Off planning unit back to Under Review. Used for corrections or post-freeze revisions. Typically admin-only and logged for audit.",
    category: "approval",
  },
  {
    term: "Years (Dimension)",
    aliases: ["Year Dimension"],
    shortDef: "Required dimension — must be named 'Years' (plural), not 'Year'.",
    longDef:
      "The time-year dimension in Planning must be named 'Years' — plural. A common exam trap: 'Year' (singular) is wrong. It holds members like FY23, FY24, etc.",
    category: "dimension",
  },
  {
    term: "Valid Intersection vs Cell Security",
    shortDef: "Valid Intersections block data entry; Cell-level security filters read/write.",
    longDef:
      "Valid Intersections are structural — they prevent nonsensical combinations from ever holding data. Cell-level security is access-based — it restricts who can see or edit existing cells. Both are layers in the security priority stack.",
    category: "concept",
  },
];

export function searchGlossary(query: string): GlossaryTerm[] {
  if (!query.trim()) return glossary;
  const q = query.toLowerCase();
  return glossary.filter((g) => {
    if (g.term.toLowerCase().includes(q)) return true;
    if (g.shortDef.toLowerCase().includes(q)) return true;
    if (g.longDef.toLowerCase().includes(q)) return true;
    if (g.aliases?.some((a) => a.toLowerCase().includes(q))) return true;
    return false;
  });
}
