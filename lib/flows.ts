export interface Flow {
  id: string;
  title: string;
  caption: string;
  whyItMatters: string;
  mermaid: string;
}

export const flows: Flow[] = [
  {
    id: "bt-wizard",
    title: "Benefits & Taxes Wizard — Prerequisite Chain",
    caption:
      "The B&T Wizard only works if you've built the prerequisite smart-list members and configured options and tiers first.",
    whyItMatters:
      "Skip any prerequisite and the Wizard silently no-ops. Components don't appear, rates don't calculate, and you won't know why until you run Synchronize Defaults and see zeros.",
    mermaid: `flowchart TD
    A["Import Component smart-list members<br/>(Earnings / Benefits / Taxes)"] --> B["Configure Options<br/>(Benefits &amp; Earnings)"]
    A --> C["Configure Tiers<br/>(Taxes)"]
    B --> D["Launch Benefits &amp; Taxes Wizard"]
    C --> D
    D --> E["Details screen<br/>(component metadata, value type)"]
    E --> F["Rates screen<br/>(flat / %, tiers, thresholds)"]
    F --> G["Review screen<br/>(validate mappings)"]
    G --> H["Save component"]
    H --> I["Run Synchronize Defaults"]
    I --> J["Rates apply to employees / jobs"]

    classDef startNode fill:#0f62fe,stroke:#4589ff,color:#ffffff;
    classDef endNode fill:#08bdba,stroke:#08bdba,color:#0b0f1a;
    class A startNode
    class J endNode`,
  },
  {
    id: "budget-revisions",
    title: "Budget Revisions — 9-Step Workflow",
    caption:
      "Integrated with Oracle Budgetary Control. Each step is backed by a named business rule.",
    whyItMatters:
      "Get the sequence wrong and Funds Check fails or reservations double-post. Revisions must follow this order: prepare → populate → revise → share → check → reserve.",
    mermaid: `flowchart TD
    S1["1. Build Original Budget<br/>(Financials plan)"] --> S2["2. Push to Budgetary Control<br/>(initial load)"]
    S2 --> S3["3. Prepare for Revisions<br/>rule: Prepare for Revisions"]
    S3 --> S4["4. Create and Populate Revision<br/>rule: Create and Populate Revision"]
    S4 --> S5["5. Enter Revisions<br/>(planner input)"]
    S5 --> S6["6. Share Revision (optional)<br/>rule: Share Revision"]
    S6 --> S7["7. Funds Check<br/>rule: Funds Check"]
    S5 --> S7
    S7 --> S8{"Approval required?"}
    S8 -- "Yes" --> S8a["8. Approval workflow<br/>(Promote → Approve)"]
    S8 -- "No" --> S9
    S8a --> S9["9. Funds Reserve<br/>rule: Funds Reserve"]
    S9 --> END["Revision posted<br/>to Budgetary Control"]

    classDef start fill:#0f62fe,stroke:#4589ff,color:#ffffff;
    classDef done fill:#08bdba,stroke:#08bdba,color:#0b0f1a;
    class S1 start
    class END done`,
  },
  {
    id: "approvals",
    title: "Approvals — State Machine (Bottom Up vs Distribute vs Free Form)",
    caption:
      "Approval template dictates which states a unit passes through and the promote/submit semantics.",
    whyItMatters:
      "Bottom Up uses Promote (bubbles up the hierarchy); Distribute uses Submit (end of the chain). Free Form stays flat. Freeze/Unfreeze are side-states, not transitions — they gate edits, not path.",
    mermaid: `stateDiagram-v2
    [*] --> NotStarted
    NotStarted --> FirstPass: Start (Free Form only)
    NotStarted --> UnderReview: Start\\n(Bottom Up / Distribute)
    FirstPass --> UnderReview: Submit
    UnderReview --> Approved: Approve
    UnderReview --> Rejected: Reject
    Rejected --> UnderReview: Resubmit
    Approved --> UnderReview: Promote (Bottom Up)\\nor Submit (Distribute)
    Approved --> SignedOff: Sign Off (last in path)
    SignedOff --> [*]

    state Frozen <<choice>>
    UnderReview --> Frozen: Freeze
    Frozen --> UnderReview: Unfreeze

    note right of UnderReview
      Bottom Up: promoted up the hierarchy
      Distribute: owner at end of path submits
      Free Form: starts at First Pass
    end note`,
  },
  {
    id: "capital-financials",
    title: "Capital → Financials Integration",
    caption:
      "How depreciation, asset values and CIP flow from Capital into the Financials statements.",
    whyItMatters:
      "Forget to run Synchronize after mapping and Financials shows zeros. The Integration Summary is your smoke test — it must reconcile to Capital before you trust the P&L.",
    mermaid: `flowchart TD
    A["Add asset class<br/>(Tangible / Intangible / Lease)"] --> B["Set depreciation assumptions<br/>(method, life, salvage)"]
    B --> C["Run Calculate Depreciation rule<br/>(asset-level schedules)"]
    C --> D["Map Capital Accounts to Financial Statement<br/>(Tangible / Intangible / Lease tabs)"]
    D --> E["Run Synchronize rule<br/>(Capital → Financials data push)"]
    E --> F["Review Financials Integration Summary<br/>(reconcile totals)"]
    F --> G["Depreciation appears on<br/>Financials P&amp;L"]
    F --> H["Net Book Value appears on<br/>Financials Balance Sheet"]
    F --> I["CIP balance tracked until<br/>in-service transfer"]

    classDef start fill:#be95ff,stroke:#be95ff,color:#0b0f1a;
    classDef dest fill:#0f62fe,stroke:#4589ff,color:#ffffff;
    class A start
    class G dest
    class H dest
    class I dest`,
  },
  {
    id: "getting-started",
    title: "Getting Started — 14-Step Implementation Checklist",
    caption:
      "Canonical Oracle EPM Planning Modules setup sequence from application creation through first consolidated plan.",
    whyItMatters:
      "Configuring a module out of order forces rework. Capital must precede Projects' capital type. Workforce granularity must be set before the B&T Wizard is useful.",
    mermaid: `flowchart TD
    S1["1. Create EPM Enterprise application"] --> S2["2. Enable Planning modules<br/>(Financials / Workforce / Capital / Projects / SM)"]
    S2 --> S3["3. Configure dimensions<br/>(Entity, Currency, custom dims)"]
    S3 --> S4["4. Enable features per module<br/>(Rolling Forecast, Budget Revisions, etc.)"]
    S4 --> S5["5. Set up Workforce granularity<br/>(Employee / Job / Employee+Job)"]
    S5 --> S6["6. Import smart-list members<br/>(Employees, Jobs, Components, Asset Classes, Projects)"]
    S6 --> S7["7. Configure B&amp;T Wizard components<br/>(Earnings / Benefits / Taxes)"]
    S7 --> S8["8. Set up Capital asset classes<br/>+ depreciation methods"]
    S8 --> S9["9. Enable Projects types<br/>(Contract / Indirect / Capital)"]
    S9 --> S10["10. Map module integrations<br/>(WF→FS, CX→FS, PF→FS, PF↔CX, WF→PF)"]
    S10 --> S11["11. Run Synchronize Defaults<br/>across all modules"]
    S11 --> S12["12. Load actuals &amp; opening balances<br/>(Data Management / DI)"]
    S12 --> S13["13. Configure approvals &amp; valid intersections"]
    S13 --> S14["14. Publish first consolidated plan<br/>(Financials + WF + CX + PF + SM)"]

    classDef start fill:#0f62fe,stroke:#4589ff,color:#ffffff;
    classDef done fill:#42be65,stroke:#42be65,color:#0b0f1a;
    class S1 start
    class S14 done`,
  },
];

export const getFlowById = (id: string): Flow | undefined =>
  flows.find((f) => f.id === id);
