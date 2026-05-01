// Daily Oracle EPM research log.
// New entries are PREPENDED (newest first). Each entry = one autonomous research run.
// Sources should always be linkable.

export type LogSource = {
  label: string;
  href: string;
};

export type LogEntry = {
  // Stable id for React keys — falls back to `date` when omitted.
  id?: string;
  date: string; // ISO YYYY-MM-DD
  title: string;
  summary: string;
  bullets: string[];
  sources: LogSource[];
  videos?: LogSource[];
  tags?: string[];
};

export const researchLog: LogEntry[] = [
  {
    id: "2026-05-01",
    date: "2026-05-01",
    title: "Looking at 26.05: mandatory Groovy cutover + ARCS Enterprise Journals tightening",
    summary:
      "First day of May. 26.05 hits test pods next Friday and the Groovy 'stricter validation' update — the one that's been delayed three times — is finally locked in for this cycle. Today's pass also pulls together the ARCS journal story since several customers asked about it on Customer Connect.",
    bullets: [
      "Mandatory Groovy engine update is now scheduled for 26.05 — originally promised for 25.11, slipped to 25.12, then 26.01, now landing in May. Service Admins should already have a banner in their environments; admins who haven't validated rules will see breakage.",
      "The cumulative carry-over still applies: 25.12 → 26.04 features for ARCS, EDM and Narrative Reporting that were quiet during the pause are folded into 26.05 environments.",
      "ARCS Transaction Matching can now export both sides of an adjustment as a dual-sided journal entry, ready to import into the ERP — combined with Enterprise Journals integration, that closes the manual posting gap most teams complained about.",
      "Reconciliation Compliance ↔ Enterprise Journals mapping means preparers stop hand-keying journal headers; Admin defines the mapping once, system fills it from the rec.",
      "Random EPM Notes flagged that anything still using the old SOAP / classic auth on EPM Automate should move now — 26.04 modernized the stack and 26.05 will continue trimming legacy paths.",
      "26.05 Readiness drop is expected this week per Oracle's standard cadence (test = first Friday, prod = third Friday).",
      "No public 26.05 'What's New' yet — bookmarked the readiness landing page and will diff it on next run.",
    ],
    sources: [
      {
        label: "Oracle Readiness — EPM landing page (where 26.05 will appear)",
        href: "https://docs.oracle.com/en/cloud/saas/readiness/epm.html",
      },
      {
        label: "Oracle Readiness — Mandatory Groovy Update (originally 26.01, now 26.05)",
        href: "https://docs.oracle.com/en/cloud/saas/readiness/epm/2025/epm-nov25/25nov-epm-wn-f41970.htm",
      },
      {
        label: "Oracle Docs — Monthly Release Schedule FAQ",
        href: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/epmfq/",
      },
      {
        label: "Oracle Docs — Using EPM Enterprise Journals With Account Reconciliation",
        href: "https://docs.oracle.com/en/cloud/saas/account-reconcile-cloud/adarc/admin_enterprise_journals_with_arcs.html",
      },
      {
        label: "Oracle Docs — ARCS Transaction Matching Workflow",
        href: "https://docs.oracle.com/en/cloud/saas/account-reconcile-cloud/raarc/admin_trans_match_workflow.html",
      },
      {
        label: "Oracle Blog — Faster Transaction Matching through Automation",
        href: "https://blogs.oracle.com/futurestate/transaction-matching-in-minutes",
      },
      {
        label: "Random EPM Notes — EPM Updates Delayed Until April 2026 (context)",
        href: "https://randomepmnotes.com/2026/01/24/epm-updates-delayed-until-april-2026/",
      },
    ],
    videos: [
      {
        label: "Oracle EPM Tutorials — official YouTube channel",
        href: "https://www.youtube.com/channel/UCT0Y4dU-u-ZedfVqVDeVBpw",
      },
      {
        label: "Oracle Cloud EPM — official channel (release deep dives)",
        href: "https://www.youtube.com/channel/UCOdd5RpKwqzri0Y2be-MjSQ",
      },
    ],
    tags: ["26.05", "Groovy", "ARCS", "Enterprise Journals", "Customer Connect"],
  },
  {
    id: "2026-04-30-am",
    date: "2026-04-30",
    title: "26.04 hardening: SFTP key auth, audit reports, Essbase block analysis",
    summary:
      "Two days into the 26.04 cycle the bigger-than-it-looks updates are showing up in EPM Automate / REST. Today's pass focuses on the platform plumbing that automation teams actually live in.",
    bullets: [
      "copyFromSFTP / copyToSFTP — both the EPM Automate command and the REST API now support key-based auth (public key / cert) so SFTP servers that disabled passwords aren't a blocker anymore.",
      "groupAssignmentAuditReport now accepts a date range, so you can pull a clean delta of group-membership changes for SOX evidence instead of dumping the full history.",
      "essbaseBlockAnalysisReport adds a 'percentage of cells close to zero' figure — easier to spot sparsity that's eating your cube without contributing data.",
      "Retry logic and integration workflows in EPM Automate were tightened to fit DevOps pipeline patterns (CI runners, scheduled jobs).",
      "Reminder from yesterday's deeper read: 26.04 is primarily an Essbase 21c fix release for Planning, FCCS, FreeForm, PCM, and Tax — re-validate cubes after the test pod refresh.",
      "AI Agent Studio + EPM Assistants remain the headline 'new surface' across the release — REST changes above are what makes those agents reliable in production.",
    ],
    sources: [
      {
        label: "Oracle Readiness — SFTP Key-based Authentication (26.04)",
        href: "https://docs.oracle.com/en/cloud/saas/readiness/epm/2026/epm-apr26/26apr-epm-wn-f44368.htm",
      },
      {
        label: "NZOUG — 26.04 Feature Highlights: EPM Automate & REST APIs Strengthened",
        href: "https://www.nzoug.org/post/oracle-epm-cloud-26-04-feature-highlights-april-2026-epm-automate-rest-apis-strengthened",
      },
      {
        label: "Oracle Docs — EPM Cloud Monthly Release Schedule FAQ",
        href: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/epmfq/",
      },
      {
        label: "Cloud Customer Connect — Monthly updates resume from 26.04",
        href: "https://community.oracle.com/customerconnect/discussion/937812/epm-cloud-monthly-updates-will-resume-from-april-2026-26-04",
      },
      {
        label: "Random EPM Notes — April 2026 Updates",
        href: "https://randomepmnotes.com/2026/03/25/epm-april-2026-updates/",
      },
    ],
    videos: [
      {
        label: "Oracle EPM Tutorials — official YouTube channel",
        href: "https://www.youtube.com/@OracleEpmBiTutorials",
      },
      {
        label: "Demo Month: EPM Cloud Framework",
        href: "https://www.youtube.com/watch?v=L_OLl_WlVw8",
      },
    ],
    tags: ["26.04", "EPM Automate", "REST API", "SFTP", "Essbase 21c"],
  },

  {
    id: "2026-04-29-am",
    date: "2026-04-29",
    title: "EPM Assistants + AI Agent Studio: a closer look",
    summary:
      "Day-after follow-up on 26.04. Today's focus: Oracle's EPM Assistants — preconfigured JSON agent definitions you import into AI Agent Studio — plus the GA of Predictive Cash Forecasting's ERP integration.",
    bullets: [
      "EPM Assistants ship as JSON blueprints. You import them into AI Agent Studio, point them at your Cloud EPM REST endpoints, and you get GenAI agents that can read Planning, FCCS, ARCS, and Narrative Reporting data without building tool plumbing yourself.",
      "AI Agent Studio is bundled at no extra charge with Fusion Cloud Apps — same developer surface used for ERP/HCM/SCM agents, so EPM teams aren't on a side track.",
      "The Planning Agent in particular handles natural-language variance questions ('why did travel jump in Q1?'), what-if scenarios, and event-driven predictions on Fusion financial + operational data.",
      "Predictive Cash Forecasting → Oracle Cloud ERP integration is now GA (was Early Adopter in 25.07). Pre-seeded Data Integration pipelines pull AR / AP / Cash Management actuals automatically.",
      "Drill-through goes from EPM all the way to ERP analytical views and individual transactions — handy for explaining why a forecast moved.",
      "Pre-req: EPM Enterprise subscription, plus ~18 months of historical AR transactions for the ML model to train cleanly.",
      "Heads-up from community posts: 26.04 ships Essbase 21c fixes for Planning / FCCS / FreeForm / PCM / Tax — worth re-running cube validations after the test-pod refresh.",
    ],
    sources: [
      {
        label: "Oracle Readiness — Using EPM Assistants with AI Agent Studio (26.04)",
        href: "https://docs.oracle.com/en/cloud/saas/readiness/epm/2026/epm-apr26/26apr-epm-wn-f44390.htm",
      },
      {
        label: "Oracle Readiness — Predictive Cash Forecasting: ERP integration (GA)",
        href: "https://docs.oracle.com/en/cloud/saas/readiness/epm/2026/epm-apr26/26apr-epm-wn-f44233.htm",
      },
      {
        label: "Oracle Fusion Cloud EPM — Features with AI",
        href: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/epmai/",
      },
      {
        label: "James & Monroe — AI in Oracle EPM and ERP: What's Real in 2026",
        href: "https://jamesandmonroe.com/blog/oracle-is-delivering-ai-as-part-of-the-oracle-fusion-cloud-applications-suite-quarterly-updates-and-that-means-exciting-changes-are-in-store-for-oracle-cloud-epm-and-erp/",
      },
      {
        label: "Oracle Fusion Insider — How AI agents work in your ERP and EPM",
        href: "https://blogs.oracle.com/fusioninsider/see-how-ai-agents-will-work-in-your-erp-and-epm",
      },
    ],
    videos: [
      {
        label: "Planning AI Agent in Oracle Cloud EPM — Demo",
        href: "https://www.youtube.com/watch?v=59TXV7iNxwU",
      },
      {
        label: "Predictive Insights in Oracle Fusion Cloud EPM — Demo",
        href: "https://www.youtube.com/watch?v=HSxSeiArTH0",
      },
      {
        label: "Narrative Reporting in Oracle Fusion Cloud EPM — Demo",
        href: "https://www.youtube.com/watch?v=GQGuCZtv1Bc",
      },
    ],
    tags: ["AI Agent Studio", "EPM Assistants", "Predictive Cash Forecasting", "26.04"],
  },

  {
    id: "2026-04-28-pm",
    date: "2026-04-28",
    title: "26.04 deep dive — AI Reconciliation Agent + Analytics Images",
    summary:
      "Supplemental afternoon pass on the 26.04 release. Focus today: the ARCS AI agent (Reconciliation Assignment + Transaction Matching Assistance), Analytics Images in Narrative Reporting, and the Smart View Strategic Modelling refresh.",
    bullets: [
      "ARCS now has an EPM AI Reconciliation Agent — two flagship capabilities: Reconciliation Assignment Assistance and Transaction Matching Assistance.",
      "Reconciliation Assignment Assistance uses ML trained on your historical reconciliation data to predict attribute values automatically — admins stop hand-tagging every reconciliation.",
      "Transaction Matching Assistance predicts likely matches with a confidence score. Reviewers confirm or discard — only the exceptions need manual matching.",
      "Narrative Reporting Enterprise can now embed Oracle Analytics Cloud (OAC) dashboard canvases as static, refreshable Analytics Images — live dashboards inside report packages.",
      "Smart View Strategic Modelling extension got a UX refresh — modelling flexibility improvements directly in Excel.",
      "EPM Assistants slot into AI Agent Studio — first-class agentic surface across Planning, FCCS, ARCS, Narrative Reporting.",
      "Pattern across the release: Oracle is leaning hard on 'predict, don't ask' — AI fills in attributes, matches, and suggested entries instead of dumping more forms on the user.",
    ],
    sources: [
      {
        label: "Oracle blog — EPM AI Reconciliation Agent (Assignment + Matching Assistance)",
        href: "https://blogs.oracle.com/proactivesupportepm/epm-account-reconciliation-update-epm-ai-reconciliation-agent-reconciliation-assignment-assistance-and-transaction-matching-assistance",
      },
      {
        label: "Oracle Readiness — Using EPM Assistants with AI Agent Studio (26.04)",
        href: "https://docs.oracle.com/en/cloud/saas/readiness/epm/2026/epm-apr26/26apr-epm-wn-f44390.htm",
      },
      {
        label: "Oracle Readiness — Analytics Images in Reports (26.04)",
        href: "https://docs.oracle.com/en/cloud/saas/readiness/epm/2026/epm-apr26/26apr-epm-wn-f42497.htm",
      },
      {
        label: "Oracle Fusion Cloud EPM — AI feature index",
        href: "https://docs.oracle.com/en/cloud/saas/enterprise-performance-management-common/epmai/",
      },
      {
        label: "James & Monroe — AI in Oracle EPM and ERP: What's Real in 2026",
        href: "https://jamesandmonroe.com/blog/oracle-is-delivering-ai-as-part-of-the-oracle-fusion-cloud-applications-suite-quarterly-updates-and-that-means-exciting-changes-are-in-store-for-oracle-cloud-epm-and-erp/",
      },
    ],
    videos: [
      {
        label: "Oracle EPM — official 'EPM Tutorials' YouTube channel",
        href: "https://www.youtube.com/OracleEpmBiTutorials",
      },
      {
        label: "Oracle Cloud EPM Account Reconciliation overview",
        href: "https://www.oracle.com/performance-management/account-reconciliation/",
      },
    ],
    tags: ["26.04", "AI Agent", "ARCS", "Narrative Reporting", "Smart View"],
  },
  {
    id: "2026-04-28-am",
    date: "2026-04-28",
    title: "Oracle EPM Cloud 26.04 — monthly cadence resumes",
    summary:
      "After the 25.12–26.03 pause, Oracle resumed monthly EPM Cloud updates with 26.04. The release is heavy on AI agents, EPM Automate hardening, and reconciliation polish.",
    bullets: [
      "Fusion AI Agents now plug into Cloud EPM business processes — generative AI that can read and act on Planning, FCCS, ARCS, Narrative Reporting data.",
      "New REST API surface for agentic AI interactions (consistent with the broader Oracle AI strategy).",
      "EPM Automate gains better retry logic, modern auth, and integration workflow improvements — friendlier for CI/CD.",
      "Predictive Cash Forecasting now reads directly from Oracle Cloud ERP for tighter, real-time forecasts.",
      "Transaction Matching adds custom adjustment/support attribute filters and richer journal column filtering.",
      "Narrative Reporting picks up inline PDF viewing, analytics images in reports, and improved text-summary tooling.",
      "New 'Break Glass' emergency-access service plus a subscription-wide environment list view.",
      "Data Integration UI functions are now governed by role-level security.",
      "Audit Details Report gives deeper 'who changed what, when' visibility across the suite.",
    ],
    sources: [
      {
        label: "Oracle Readiness — EPM April 2026 What's New",
        href: "https://docs.oracle.com/en/cloud/saas/readiness/epm/2026/epm-apr26/26apr-epm-wn-f44078.htm",
      },
      {
        label: "Oracle Readiness — EDM April 2026 What's New",
        href: "https://docs.oracle.com/en/cloud/saas/readiness/epm/2026/edm-apr26/index.html",
      },
      {
        label: "EPM Cloud Monthly Updates resume from 26.04 (Cloud Customer Connect)",
        href: "https://community.oracle.com/customerconnect/discussion/937812/epm-cloud-monthly-updates-will-resume-from-april-2026-26-04",
      },
      {
        label: "NZOUG — 26.04 Feature Highlights",
        href: "https://www.nzoug.org/post/oracle-epm-cloud-26-04-feature-highlights-april-2026-epm-automate-rest-apis-strengthened",
      },
      {
        label: "Random EPM Notes — April 2026 Updates",
        href: "https://randomepmnotes.com/2026/03/25/epm-april-2026-updates/",
      },
    ],
    videos: [
      {
        label: "Oracle EPM Tutorials — official YouTube channel",
        href: "https://www.youtube.com/OracleEpmBiTutorials",
      },
      {
        label: "Oracle EPM Cloud Planning — EPBCS playlist",
        href: "https://www.youtube.com/playlist?list=PLbrNJoSXtLMugT0ZdtxTBc4mNwh6Le7-j",
      },
    ],
    tags: ["26.04", "AI Agents", "EPM Automate", "ARCS", "Narrative Reporting"],
  },
];
