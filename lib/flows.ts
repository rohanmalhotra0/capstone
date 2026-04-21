export interface Flow {
  id: string;
  title: string;
  caption: string;
  whyItMatters: string;
  mermaid: string;
}

/*
 * Mermaid styling notes — keep the palette tight.
 *   --edge     #9a9ba3  muted grey for neutral nodes
 *   --start    #78a9ff  soft blue entry points
 *   --done     #6fdc8c  soft green terminal states
 *   --warn     #f1c21b  yellow for decision / gotcha nodes
 *   --danger   #fa8072  salmon for blocked / deny states
 *   --accent   #be95ff  lavender for side-states
 */

export const flows: Flow[] = [
  {
    id: "data-movement",
    title: "Data Movement — Decision Tree",
    caption:
      "Smart Push vs Data Map vs Data Integration. The single most tested exam topic.",
    whyItMatters:
      "Listen for the trigger word in the scenario: 'on save' → Smart Push; 'nightly / scheduled' → Data Map; 'from CSV / ERP / HCM' → Data Integration. Smart Push is literally a Data Map with a form-save trigger.",
    mermaid: `flowchart TD
    Q["Planner needs data to move.<br/>What triggers the move?"] --> D1{"External<br/>source?"}
    D1 -- "Yes — file / ERP / HCM" --> DI["Data Integration<br/><i>runIntegration</i>"]
    D1 -- "No — cube-to-cube" --> D2{"Triggered by<br/>form save?"}
    D2 -- "Yes" --> SP["Smart Push<br/><i>attached to form</i>"]
    D2 -- "No — admin / scheduled" --> DM["Data Map<br/><i>runPlanTypeMap / job</i>"]

    DI --> A1["Modes: Append / Replace /<br/>Map &amp; Validate / Direct"]
    SP --> A2["Runs on Save automatically.<br/>Underneath: a Data Map."]
    DM --> A3["BSO → ASO reporting.<br/>Scheduled after close."]

    classDef start fill:#78a9ff,stroke:#78a9ff,color:#0a0a0b;
    classDef decide fill:#f1c21b,stroke:#f1c21b,color:#0a0a0b;
    classDef answer fill:#6fdc8c,stroke:#6fdc8c,color:#0a0a0b;
    class Q start
    class D1 decide
    class D2 decide
    class DI answer
    class SP answer
    class DM answer`,
  },
  {
    id: "security-priority",
    title: "Security — 5-Layer Evaluation & Priority",
    caption:
      "A write succeeds only if every layer passes. 'None overrides Write' is the single most-tested trick.",
    whyItMatters:
      "Deny beats None beats Write beats Read. If a user is in any group with None on a member, the effective access is None — regardless of how many groups grant Write. Closest member wins over inheritance.",
    mermaid: `flowchart TD
    U["User attempts to save a cell"] --> L1{"Layer 1:<br/>Role<br/>(Admin / Power / User / Viewer)"}
    L1 -- "pass" --> L2{"Layer 2:<br/>Artifact permission<br/>(form / rule / dashboard)"}
    L2 -- "pass" --> L3{"Layer 3:<br/>Dimension / member access<br/>(per dim)"}
    L3 -- "pass" --> L4{"Layer 4:<br/>Valid intersection"}
    L4 -- "pass" --> L5{"Layer 5:<br/>Cell-level security"}
    L5 -- "pass" --> OK["Save succeeds"]

    L1 -- "fail" --> X["Blocked"]
    L2 -- "fail" --> X
    L3 -- "fail" --> X
    L4 -- "fail" --> X
    L5 -- "fail" --> X

    P["Permission priority<br/>for Layer 3:<br/><b>Deny &gt; None &gt; Write &gt; Read</b><br/>Closest member wins<br/>over inheritance."] -.-> L3

    classDef entry fill:#78a9ff,stroke:#78a9ff,color:#0a0a0b;
    classDef ok fill:#6fdc8c,stroke:#6fdc8c,color:#0a0a0b;
    classDef bad fill:#fa8072,stroke:#fa8072,color:#0a0a0b;
    classDef note fill:#be95ff,stroke:#be95ff,color:#0a0a0b;
    class U entry
    class OK ok
    class X bad
    class P note`,
  },
  {
    id: "bt-wizard",
    title: "Benefits & Taxes Wizard — Prerequisite Chain",
    caption:
      "The B&T Wizard only works if you've built Component smart-list members and configured options and tiers first.",
    whyItMatters:
      "Skip any prerequisite and the Wizard silently no-ops. Components don't appear, rates don't calculate, and you won't know why until you run Synchronize Defaults and see zeros.",
    mermaid: `flowchart TD
    A["Import members into<br/>Component dimension<br/>(Earnings / Benefits / Taxes)"] --> B["Configure Options<br/>(Benefits &amp; Earnings)"]
    A --> C["Configure Tiers<br/>(Taxes)"]
    B --> D["Launch Benefits &amp; Taxes Wizard"]
    C --> D
    D --> E["Details<br/>(component metadata, value type)"]
    E --> F["Rates<br/>(flat / %, tiers, thresholds)"]
    F --> G["Review &amp; save"]
    G --> H{"Component<br/>existed before?"}
    H -- "No (new default)" --> I["Run Synchronize Defaults 2.0<br/>(push to employee × job)"]
    H -- "Yes (rate / freq changed)" --> J["Run Synchronize Definition 2.0"]
    I --> K["Rates apply on<br/>Compensation forms"]
    J --> K

    classDef start fill:#78a9ff,stroke:#78a9ff,color:#0a0a0b;
    classDef decide fill:#f1c21b,stroke:#f1c21b,color:#0a0a0b;
    classDef done fill:#6fdc8c,stroke:#6fdc8c,color:#0a0a0b;
    class A start
    class H decide
    class K done`,
  },
  {
    id: "budget-revisions",
    title: "Budget Revisions — 9-Step Workflow",
    caption:
      "Integrated with Oracle Budgetary Control. Each step is backed by a named business rule.",
    whyItMatters:
      "Requires Hybrid Essbase + own COA + single currency + Control Budget Source = 'EPM Financials module' (NOT 'Hyperion Planning'). Max 30 active revisions.",
    mermaid: `%%{init: {'flowchart': {'nodeSpacing': 55, 'rankSpacing': 75, 'curve': 'basis'}, 'themeVariables': {'fontSize': '15px'}}}%%
flowchart TD
    S1["1. Build Original Budget<br/>(Financials plan)"] --> S2["2. Push to Budgetary Control<br/>(initial load)"]
    S2 --> S3["3. Prepare for Revisions<br/><i>once per year · copies to Adopted Budget</i>"]
    S3 --> S4["4. Create and Populate Revision<br/><i>optionally seed with % of approved</i>"]
    S4 --> S5["5. Enter Revisions<br/>(planner input)"]
    S5 --> S6["6. Share Revision<br/><i>optional collaboration</i>"]
    S5 -. "skip collab" .-> S7
    S6 --> S7["7. Funds Check<br/><i>async for large cells → Get Funds Results</i>"]
    S7 --> S8{"Approval<br/>required?"}
    S8 -- "No" --> S9["9. Funds Reserve<br/><i>pushes delta + clears revision</i>"]
    S8 -- "Yes" --> S8a["8. Approval workflow<br/>(Promote → Approve)"]
    S8a --> S9
    S9 --> END["Revision posted to<br/>Budgetary Control"]

    classDef start fill:#78a9ff,stroke:#78a9ff,color:#0a0a0b;
    classDef decide fill:#f1c21b,stroke:#f1c21b,color:#0a0a0b;
    classDef done fill:#6fdc8c,stroke:#6fdc8c,color:#0a0a0b;
    class S1 start
    class S8 decide
    class END done`,
  },
  {
    id: "approvals",
    title: "Approvals — State Machine",
    caption:
      "Template dictates which states a planning unit passes through and the Promote vs Submit semantics.",
    whyItMatters:
      "Bottom Up uses Promote (bubbles up). Distribute uses Submit (end-of-path back up). Free Form starts at First Pass and is flexible. Freeze / Unfreeze are side-states — they gate edits, not path.",
    mermaid: `stateDiagram-v2
    [*] --> NotStarted
    NotStarted --> FirstPass: Start — Free Form
    NotStarted --> UnderReview: Start — Bottom Up / Distribute
    FirstPass --> UnderReview: Submit
    UnderReview --> Approved: Approve
    UnderReview --> Rejected: Reject
    Rejected --> UnderReview: Resubmit
    Approved --> UnderReview: Promote (BU) / Submit (Dist)
    Approved --> SignedOff: Sign Off (last in path)
    UnderReview --> SignedOff: Sign Off (admin)
    SignedOff --> UnderReview: Reopen
    SignedOff --> [*]

    UnderReview --> Delegated: Delegate (BU)
    Delegated --> UnderReview: Promote back
    UnderReview --> TopOwner: Submit to Top (BU)
    TopOwner --> SignedOff: Sign Off

    note right of UnderReview
      Freeze / Unfreeze toggle a
      side-state on any unit —
      locks data, ownership unchanged.
    end note`,
  },
  {
    id: "ipm-insights",
    title: "IPM Insights — Three Detection Types",
    caption:
      "Automated pattern detection on historical and forecast data. Requires Hybrid Essbase + EPM Enterprise (Auto-Predict also available in Standard).",
    whyItMatters:
      "Pick the right insight type to the question: systematic planner over/under-forecast → Variance & Bias; forecast vs ML-prediction gap → Prediction; outlier spikes in historicals → Anomaly.",
    mermaid: `flowchart TD
    CFG["Admin runs IPM Configurator<br/>(Types → Slices → Analysis → Settings)"] --> ENG{"Pick prediction engine"}
    ENG --> AP["Auto Predict<br/>(time series)"]
    ENG --> ADV["Advanced Predictions<br/>(ML)"]
    ENG --> N["None"]

    CFG --> T["Choose insight types"]
    T --> I1["Forecast Variance &amp; Bias<br/><i>Historical Forecast vs Actual</i>"]
    T --> I2["Prediction Insights<br/><i>Planner forecast vs ML prediction</i>"]
    T --> I3["Anomaly Insights<br/><i>historical outliers / missing</i>"]

    I1 --> S["System surfaces insights<br/>with risk %"]
    I2 --> S
    I3 --> S

    S --> ACT{"Planner action"}
    ACT --> A1["Dismiss"]
    ACT --> A2["Open as adhoc grid"]
    ACT --> A3["Override forecast"]

    classDef start fill:#78a9ff,stroke:#78a9ff,color:#0a0a0b;
    classDef decide fill:#f1c21b,stroke:#f1c21b,color:#0a0a0b;
    classDef done fill:#6fdc8c,stroke:#6fdc8c,color:#0a0a0b;
    class CFG start
    class ENG decide
    class ACT decide
    class S done`,
  },
  {
    id: "capital-financials",
    title: "Capital → Financials Integration",
    caption:
      "How depreciation, asset values and CIP flow from Capital into the Financials statements.",
    whyItMatters:
      "Forget to run Synchronize after mapping and Financials shows zeros. Run Synchronize also when (a) adding an asset, (b) changing mapping, (c) extending planningyearRange, (d) after transfer.",
    mermaid: `flowchart TD
    A["Add asset class<br/>(Tangible / Intangible / Lease)"] --> B["Set depreciation assumptions<br/>(method, life, salvage ≥ 1% basic)"]
    B --> C["Run Calculate Depreciation<br/>(asset-level schedules)"]
    C --> D["Map Capital Accounts to<br/>Financial Statement<br/>(Tangible · Intangible · Lease tabs)"]
    D --> E["Run <b>Synchronize</b> rule<br/>(Capital → Financials data push)"]
    E --> F["Financials Integration Summary<br/>(reconcile totals)"]
    F --> G["Depreciation on P&amp;L"]
    F --> H["Net Book Value on BS"]
    F --> I["CIP balance until in-service"]

    classDef start fill:#be95ff,stroke:#be95ff,color:#0a0a0b;
    classDef sync fill:#f1c21b,stroke:#f1c21b,color:#0a0a0b;
    classDef dest fill:#78a9ff,stroke:#78a9ff,color:#0a0a0b;
    class A start
    class E sync
    class G dest
    class H dest
    class I dest`,
  },
  {
    id: "getting-started",
    title: "Getting Started — 14-Step Implementation",
    caption:
      "Canonical Oracle EPM Planning Modules setup sequence. Order matters.",
    whyItMatters:
      "Configuring modules out of order forces rework. Capital must precede Projects' Capital type. Workforce granularity must be set before the B&T Wizard is useful. Refresh Database runs BEFORE User Variables.",
    mermaid: `flowchart TD
    S1["1. Create Modules application<br/>(cube names + calendar locked here)"] --> S2["2. Add currency members<br/>(if multi-currency)"]
    S2 --> S3["3. Review integration scenarios"]
    S3 --> S4["4. Enable features<br/>(app enters maintenance mode)"]
    S4 --> S5["5. Configure per-module<br/>+ run required rules"]
    S5 --> S6["6. <b>Refresh Database</b>"]
    S6 --> S7["7. Set user variables<br/>(Entity · Scenario · Version · Years)"]
    S7 --> S8["8. Import data"]
    S8 --> S9["9. Create users &amp; groups,<br/>provision permissions"]
    S9 --> S10["10. Set security on rules &amp;<br/>Groovy templates"]
    S10 --> S11["11. Design reports"]
    S11 --> S12["12. Make app available<br/>(Settings → Enable Use → All Users)"]
    S12 --> S13["13. Define approval units<br/>&amp; promotional paths"]
    S13 --> S14["14. Data mapping for<br/>cross-module integration"]

    classDef start fill:#78a9ff,stroke:#78a9ff,color:#0a0a0b;
    classDef pivot fill:#f1c21b,stroke:#f1c21b,color:#0a0a0b;
    classDef done fill:#6fdc8c,stroke:#6fdc8c,color:#0a0a0b;
    class S1 start
    class S6 pivot
    class S14 done`,
  },
];

export const getFlowById = (id: string): Flow | undefined =>
  flows.find((f) => f.id === id);
