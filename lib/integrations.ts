export interface Integration {
  id: string;
  from: string;
  to: string;
  bidirectional?: boolean;
  label: string;
  dataShared: string;
  setupRequired: string;
  example: string;
}

export const integrations: Integration[] = [
  {
    id: "wf-to-fs",
    from: "workforce",
    to: "financials",
    label: "Compensation → P&L",
    dataShared:
      "Salary, merit, bonus, additional earnings, benefits, and taxes roll up from Workforce to Financials as compensation expense on the income statement.",
    setupRequired:
      "Either (a) Benefits & Taxes Wizard component-to-account mapping on the Earnings/Benefits/Taxes tabs, or (b) Flexible Account Mapping for Salary, Merit and Bonus via Configure → Map Compensation Accounts. Run Synchronize Defaults after changes.",
    example:
      "A $95,000 base salary for employee E-1042 posts to OWP_Salaries, which maps to OFS_Salary_Expense. Employer FICA 7.65% via B&T Wizard routes to OFS_Payroll_Taxes.",
  },
  {
    id: "cx-to-fs",
    from: "capital",
    to: "financials",
    label: "Depreciation, asset values, CIP → Financials",
    dataShared:
      "Monthly depreciation expense, net book value, CIP balances, gain/loss on disposal, and lease interest/principal (IFRS 16) flow to the Financials P&L and Balance Sheet.",
    setupRequired:
      "Map Capital Accounts to Financial Statement on the Tangible, Intangible, and Lease tabs (Configure → Map Capital Accounts to Financial Statement). Run the Synchronize rule to push data into Financials.",
    example:
      "A $240,000 Machinery asset on SL depreciation over 5 years posts $4,000/month to OFS_Depreciation_Expense and reduces OFS_Net_PPE on the balance sheet.",
  },
  {
    id: "pf-to-fs",
    from: "projects",
    to: "financials",
    label: "Project revenue & expense → Financials",
    dataShared:
      "Project labor, material, and equipment expense; contract revenue by recognition method; indirect project expense allocations.",
    setupRequired:
      "Projects Financials Mapping configuration task. Map Project resource classes and expense accounts to Financials accounts. Run the data-push rule after changes.",
    example:
      "Contract project CON-228 recognizes $180,000 revenue under % Complete and $112,000 labor expense — both post to OFS_Contract_Revenue and OFS_Project_Labor in Financials.",
  },
  {
    id: "pf-to-cx",
    from: "projects",
    to: "capital",
    label: "Capital projects → Assets in Capital",
    dataShared:
      "Capital project spend is capitalized and creates asset records in Capital (Construction-in-Progress until in-service).",
    setupRequired:
      "Enable the Capital project type in Projects. Capital module must be enabled first. Map project elements to Capital asset classes on the Projects → Capital integration task.",
    example:
      "Capital project CAP-077 (new warehouse) accumulates $1.4M CIP; on go-live date it transfers to Asset Class: Buildings at $1.4M and begins SL depreciation over 30 years.",
  },
  {
    id: "cx-to-pf",
    from: "capital",
    to: "projects",
    label: "Equipment rates → Project expense",
    dataShared:
      "Internal equipment billing rates from Capital are consumed as project equipment expense in Projects.",
    setupRequired:
      "Add custom dimension 'Project' in Capital. Enable Projects Equipment and the 'Integration from Capital' option in Projects. Map equipment assets to project equipment resources.",
    example:
      "Excavator EQ-12 billed at $85/hr from Capital drives 320 hours on project CAP-077 → $27,200 equipment expense in Projects.",
  },
  {
    id: "wf-to-pf",
    from: "workforce",
    to: "projects",
    label: "Employee utilization → Projects",
    dataShared:
      "Employee labor hours and loaded labor rates are allocated across projects as project labor expense.",
    setupRequired:
      "Workforce granularity must be Employee or Employee + Job. Enable 'Workforce Integration to Projects' and add custom dimension 'Project' in Workforce.",
    example:
      "Engineer E-1042 (loaded rate $112/hr) charges 160 hrs/mo to project CON-228 → $17,920 labor expense per month.",
  },
  {
    id: "sm-to-fs",
    from: "strategic-modeling",
    to: "financials",
    bidirectional: true,
    label: "Scenario rollup ↔ Financials (data maps)",
    dataShared:
      "Financials actuals and plan data feed Strategic Modeling for long-range scenarios; SM scenario outputs (M&A, debt, long-range) push back to Financials for consolidated views.",
    setupRequired:
      "Strategic Modeling integration via Data Maps (Navigator → Data Maps). Define account and time mappings between the SM model and the Financials cube. Optional: Scenario Rollup for multi-model consolidation.",
    example:
      "A 10-year SM scenario modeling an acquisition of ACME Co. pushes adjusted revenue, EBITDA, and debt schedule back to Financials as Scenario: 'Plan_w_ACME' for the next 3 years of planning.",
  },
];

export const getIntegrationById = (id: string): Integration | undefined =>
  integrations.find((i) => i.id === id);
