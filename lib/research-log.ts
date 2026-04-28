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
