// Daily Oracle EPM research log.
// New entries are PREPENDED (newest first). Each entry = one autonomous research run.
// Sources should always be linkable.

export type LogSource = {
  label: string;
  href: string;
};

export type LogEntry = {
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
