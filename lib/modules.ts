export interface ModuleDimension {
  name: string;
  kind: "required" | "module" | "custom";
  note?: string;
}

export interface EpmModule {
  id: string;
  name: string;
  prefix: string;
  color: string;
  tagline: string;
  shortDescription: string;
  keyFeatures: string[];
  dimensions: ModuleDimension[];
  cube?: string;
}

export const modules: EpmModule[] = [
  {
    id: "financials",
    name: "Financials",
    prefix: "OFS_",
    color: "#0f62fe",
    tagline: "Enterprise-wide driver-based P&L, Balance Sheet and Cash Flow",
    shortDescription:
      "Driver-based income statement, balance sheet, direct and indirect cash flow, rolling forecast, weekly planning, and budget revisions integrated with Oracle Budgetary Control.",
    keyFeatures: [
      "Revenue and Gross Margin planning with driver-based modeling",
      "Expense planning (OpEx, driver-based and trend-based)",
      "Income Statement, Balance Sheet, and Cash Flow (Direct & Indirect)",
      "Rolling Forecast and Weekly Planning cadence options",
      "Budget Revisions integrated with Oracle Budgetary Control",
      "Up to 5 custom dimensions (Product, Customer, Segment, etc.)",
    ],
    dimensions: [
      { name: "Account", kind: "required" },
      { name: "Period", kind: "required" },
      { name: "Year", kind: "required" },
      { name: "Scenario", kind: "required" },
      { name: "Version", kind: "required" },
      { name: "Entity", kind: "required" },
      { name: "Currency", kind: "required", note: "If multi-currency enabled" },
      { name: "Custom 1–5", kind: "custom", note: "Up to 5 user-defined" },
    ],
    cube: "OEP_FS (BSO)",
  },
  {
    id: "workforce",
    name: "Workforce",
    prefix: "OWP_",
    color: "#08bdba",
    tagline: "Headcount, compensation, merit, benefits and taxes",
    shortDescription:
      "Plans headcount, salary, merit, bonus, benefits and taxes at three granularity levels. Drives compensation expense into Financials via the Benefits & Taxes Wizard or Flexible Account Mapping.",
    keyFeatures: [
      "Three granularity levels: Employee, Job, or Employee + Job",
      "Compensation and Non-Compensation expense planning",
      "Benefits & Taxes Wizard for component-driven calculations",
      "Merit-Based Planning with performance ratings",
      "Max 30 combined Additional Earnings + Benefits + Taxes components",
      "Salary Basis options (Annual, Monthly, Hourly, Daily) per employee",
    ],
    dimensions: [
      { name: "Employee", kind: "module", note: "If Employee-level granularity" },
      { name: "Job", kind: "module", note: "If Job-level granularity" },
      { name: "Component", kind: "module", note: "Earnings / Benefits / Taxes" },
      { name: "Union Code", kind: "module" },
      { name: "Property", kind: "module" },
    ],
    cube: "OEP_WFP (BSO)",
  },
  {
    id: "capital",
    name: "Capital",
    prefix: "OCX_",
    color: "#be95ff",
    tagline: "Tangible, Intangible and Leased assets with depreciation",
    shortDescription:
      "Manages the complete asset lifecycle — new purchases, transfers, retirements, impairments, and IFRS 16 lease accounting — with depreciation methods flowing into Financials P&L and Balance Sheet.",
    keyFeatures: [
      "Tangible, Intangible and Leased Assets (IFRS 16) planning",
      "Depreciation methods: SL, DB Year, DB Period, SoYD, Custom",
      "Construction-in-Progress (CIP) and asset transfers",
      "Integrates into Financials (P&L + BS) and Projects (capital projects)",
      "Asset impairment, retirement and improvement planning",
      "Multi-currency support with FX translation",
    ],
    dimensions: [
      { name: "Asset Class", kind: "module" },
      { name: "Asset Detail", kind: "module" },
      { name: "Property", kind: "module" },
    ],
    cube: "OEP_CPX (BSO)",
  },
  {
    id: "projects",
    name: "Projects",
    prefix: "OPF_",
    color: "#ff7eb6",
    tagline: "Contract, Indirect and Capital projects",
    shortDescription:
      "Plans project revenue, expense and resources across three project types and three resource classes. Integrates with Oracle Project Management Cloud (25.10+) and with Capital for capital projects.",
    keyFeatures: [
      "Three project types: Contract, Indirect, Capital",
      "Three resource classes: Labor, Material, Equipment",
      "Project Management Cloud Integration (release 25.10+)",
      "Capital projects create assets in Capital module",
      "Revenue recognition methods (As Incurred, % Complete, Milestone)",
      "Workforce utilization roll-up by project",
    ],
    dimensions: [
      { name: "Project", kind: "module" },
      { name: "Project Element", kind: "module" },
      { name: "Resource Class", kind: "module" },
      { name: "Program", kind: "module" },
    ],
    cube: "OEP_PFP (BSO)",
  },
  {
    id: "strategic-modeling",
    name: "Strategic Modeling",
    prefix: "—",
    color: "#ffb84d",
    tagline: "Long-range scenario, M&A and debt/treasury modeling",
    shortDescription:
      "Separate Strategic Model engine — not a Planning cube. Purpose-built for long-range planning, M&A scenarios, treasury and debt scheduling. Integrates with Financials via data maps.",
    keyFeatures: [
      "Dedicated Strategic Model engine (non-cube)",
      "Long-range scenario planning (10+ years)",
      "M&A scenario analysis with consolidation",
      "Treasury / Debt scheduling and funding options",
      "Integrates with Financials via data maps",
      "Scenario Rollup for consolidated enterprise view",
    ],
    dimensions: [
      { name: "Accounts (flat)", kind: "module", note: "Model-defined, not cube" },
      { name: "Time", kind: "module", note: "Year / Period (flexible)" },
      { name: "Scenario", kind: "module" },
    ],
    cube: "Strategic Model (not a cube)",
  },
];

export const getModuleById = (id: string): EpmModule | undefined =>
  modules.find((m) => m.id === id);
