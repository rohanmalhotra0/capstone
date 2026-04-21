# Build Report — Oracle EPM Planning Modules Interactive Guide

**Date:** 2026-04-20
**Author:** Rohan Malhotra
**Target:** Capstone prototype for IBM Oracle EPM Cloud consulting internship (starts 2026-05-26)
**Version:** v0.2 — verified + portfolio features

---

## TL;DR

- **v0.1 baseline**: landing + module map + flowchart gallery. Shipped but only 3/7 edges and 4/5 flowcharts actually rendered in the browser. Missed in v0.1 because I relied on build/lint output instead of a real browser check.
- **v0.2 adds**:
  1. **Fixed** the two latent bugs found via headless Playwright (see "What was broken and got fixed").
  2. **Command palette (⌘K)** — cross-page jumper across modules, integrations, flows, glossary (30 terms).
  3. **Approvals Simulator** (`/simulator`) — interactive state machine with Bottom Up / Distribute / Free Form templates, illegal-action guards, step-back, freeze/unfreeze, and history.
  4. **Glossary** (`/glossary`) — 30 Oracle EPM terms, searchable and category-filterable, linked from the ⌘K palette.
  5. **Accessibility pass** — focus trap + return-focus on all detail panels, skip-to-content link, ARIA roles and labels on palette, simulator, and glossary controls.
  6. **Permalinks** — `/modules?m=financials`, `/modules?i=cx-to-fs`, `/flows#approvals`, `/glossary?q=synchronize`.
  7. **Real screenshots** (Playwright) — included below.

---

## What was broken and got fixed

Two things that built clean but did not render correctly in a real browser — caught by the Playwright verification script, not by `next build`.

### Bug 1 · Only 3 of 7 edges rendered on `/modules`

**Why:** the custom `ModuleNode` exposed one handle per position (either `source` or `target`). React Flow silently drops edges whose `sourceHandle` or `targetHandle` reference a handle that doesn't exist on the node. So 4 of the 7 integrations — `cx-to-fs`, `pf-to-fs`, `pf-to-cx`, `cx-to-pf` — had no visible line.

**Fix:** `ModuleNode` now renders **both** a source and a target handle at each of its four sides, with deterministic IDs: `t-s`/`t-t`, `r-s`/`r-t`, `b-s`/`b-t`, `l-s`/`l-t`. `ModuleMap.edgeRouting` was updated to use the new IDs.

### Bug 2 · Only 4 of 5 Mermaid flowcharts rendered on `/flows`

**Why:** the B&T Wizard flowchart used `classDef end fill:…`. `end` is a reserved word in Mermaid — same token that closes a subgraph. It produced `Parse error on line 14: Expecting 'AMP', 'COLON', 'DOWN', … got 'end'` and the whole diagram failed.

**Fix:** renamed `classDef end` → `classDef endNode` and `class J end` → `class J endNode` in `lib/flows.ts`.

After both fixes, the headless verification is 0 pageerrors / 0 console errors / 0 request failures across home, modules, flows, simulator, glossary, command palette, theme persistence, and mobile viewport.

---

## What shipped in v0.2

### New pages

| Route        | Purpose                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| `/simulator` | Interactive Approvals state machine. Bottom Up / Distribute / Free Form templates with illegal-action guarding.   |
| `/glossary`  | 30 Oracle EPM terms (wizards, rules, approvals, integrations, dimensions) with full-text search and category filters. |

### New components

- `CommandPalette` — global `⌘K` / `Ctrl+K` / `/` palette with keyboard nav (↑↓↵ esc), live-filter, deep-links. Indexes pages, modules, integrations, flows, and glossary.
- `ApprovalsSimulator` — 6-state machine with 9 actions filtered per template. Template switch resets to `NotStarted`. `Step back` walks history. `Freeze`/`Unfreeze` is a side-state, not a path transition (matches Oracle semantics). `aria-live="polite"` on the state rail.
- `GlossaryClient` — sticky search + category chips; filtering is client-side for instant response.

### New data layer

- `lib/glossary.ts` — 30 terms with `term`, `aliases`, `shortDef`, `longDef`, `category`, `relatedModules`.

### Updated components

- `ModuleNode` — source + target handles per side (see bug fix above).
- `ModuleMap` — handle IDs updated; new `useSearchParams` hook opens the panel for `?m=<id>` or `?i=<id>`.
- `FlowsGallery` — cards now have `id="flow-<id>"` and respond to `hashchange` for `/flows#bt-wizard`-style permalinks.
- `DetailPanel` — focus trap (Tab / Shift+Tab cycle), return-focus on close, `role="dialog"` + `aria-modal="true"`.
- `Nav` — added `Simulator` and `Glossary` links; ⌘K button in the toolbar.
- `app/layout.tsx` — `<a href="#main-content">` skip link, `CommandPalette` mounted globally.
- `app/page.tsx` — 4-card hero grid (Module Map, Flowcharts, Simulator, Glossary) instead of 2.

---

## Engineering verification

### Build

```
> next build --turbopack
✓ Compiled successfully in 3.6s
✓ Linting and checking validity of types ...
✓ Generating static pages (9/9)

Route (app)            Size  First Load JS
┌ ○ /                  0 B       189 kB
├ ○ /flows         2.48 kB       192 kB
├ ○ /glossary      1.52 kB       191 kB
├ ○ /modules       63.5 kB       253 kB
└ ○ /simulator     2.77 kB       192 kB
+ First Load JS shared   200 kB
```

All 6 routes prerender as static content. No TypeScript errors, no `any`.

### Lint

```
> eslint
(no output — clean)
```

### Playwright verification (headless Chromium, aarch64)

Full JSON output from `/tmp/verify-v2.mjs`:

```json
{
  "home":      { "entryCards": ["Explore the Module Map", "Browse Flowcharts", "Approvals Simulator", "Glossary"], "errors": [] },
  "modules":   { "nodes": 5, "edges": 7, "panelTitle": true, "intPanel": true, "errors": [] },
  "flows":     { "svgCount": 5, "modalOpen": true, "errors": [] },
  "simulator": { "templates": 3, "underReviewVisible": true, "promoteVisible": true, "firstPassShown": true, "errors": [] },
  "glossary":  { "initialCount": 30, "filteredCount": 6, "rulesCount": 3, "errors": [] },
  "palette":   { "paletteOpen": true, "firstResultPreview": "GlossarySynchronize Defaults…", "landedOn": "/glossary?q=Synchronize%20Defaults", "errors": [] },
  "theme":     { "initialDark": true, "nowLight": true, "stillLight": true },
  "mobile":    { "nodesAt390": 5 }
}
```

Every section reports `errors: []` — no pageerror, no console error, no request failure.

---

## Screenshots

Captured via Playwright at 1440×900 (desktop) and 390×844 (iPhone viewport). Files live in `./screenshots/` in the project root.

| File                          | Shows                                                         |
| ----------------------------- | ------------------------------------------------------------- |
| `screenshots/home.png`        | Landing (dark) — four entry cards + module strip.             |
| `screenshots/home-light.png`  | Same page after theme toggle — persisted across reload.       |
| `screenshots/modules.png`     | Module Map — 5 nodes, 7 arrows, minimap, controls, legend.    |
| `screenshots/modules-panel.png` | Deep-link `/modules?m=financials` — Financials panel open.  |
| `screenshots/flows.png`       | Flowchart gallery — all 5 Mermaid SVGs rendering.             |
| `screenshots/flows-modal.png` | Expand-to-fullscreen modal on the B&T Wizard diagram.         |
| `screenshots/simulator.png`   | Bottom Up after Start → Approve; Promote and Sign Off available. |
| `screenshots/simulator-freeform.png` | Free Form at First Pass state.                         |
| `screenshots/glossary.png`    | Glossary page with search + category chips.                   |
| `screenshots/command-palette.png` | ⌘K palette with result preview.                           |
| `screenshots/mobile-modules.png` | iPhone 15-ish viewport — map still usable via pan/zoom.    |

---

## Self-audit (honest)

| Claim                                                                     | Truth                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "v0.1 worked end-to-end"                                                  | **False, and I missed it.** Build/lint passed but the module map was missing 4 of 7 edges and one of the Mermaid diagrams silently failed. Playwright caught both in ~20 seconds. Lesson: `next build` only validates types, not DOM. |
| "Real shadcn components via the CLI"                                      | **Still hand-rolled.** Tailwind v4 + shadcn CLI is still a rough edge. The primitives use the same contract (`cva` + `clsx` + `tailwind-merge`) but are not CLI-generated. Kept from v0.1 — no regressions.                           |
| "Approvals Simulator is faithful to Oracle semantics"                     | **Mostly true.** The state diagram is the one in the study guide: NotStarted / FirstPass / UnderReview / Approved / Rejected / SignedOff; Promote for Bottom Up vs Submit for Distribute vs flat First Pass for Free Form; Freeze is a side-state, not a path transition. I don't simulate multi-owner hand-offs across hierarchy levels — a single user walks the state machine. Good enough for teaching, not a replacement for the real Approvals tab. |
| "Full a11y pass"                                                          | **Partial.** Focus trap + skip link + ARIA on palette/simulator/glossary are in. React Flow's own node/edge keyboard nav is left at library default — it works but isn't ideal. No formal axe audit run.                              |
| "Glossary is comprehensive"                                               | 30 terms covering the main study-guide surface area. Not every exam-blueprint term, but the important ones across modules/wizards/rules/approvals/integrations/dimensions.                                                            |
| "Command palette deep-links work"                                         | **True.** `/modules?m=financials` and `/modules?i=cx-to-fs` open the right panel; `/flows#approvals` scrolls to the right card; `/glossary?q=...` seeds the search box.                                                                |

---

## What was NOT added (and why)

- **Export diagrams to PNG/SVG.** Useful, but would have pulled in another runtime dep and the cert audience is rarely going to export the React Flow canvas. Deferred.
- **Exam Blueprint Map.** Would need me to source 1Z0-1080 blueprint items and map each to a module/integration/flow; that's a content job, not a code job.
- **Dimension Explorer.** Covered indirectly — module detail panels show dimensions, glossary explains Entity/Currency/Custom dimensions. A dedicated explorer would be redundant for now.
- **Axe a11y audit.** I did manual work; a full audit is a 30-minute addition and is still on the "nice-to-have" list.

---

## Known issues

1. **Sandbox `.git` still lives in the sandbox canonical copy** (`/sessions/brave-magical-archimedes/epm-build`) rather than in the mounted `~/Documents/epm-capstone`. Source files are identical between the two. To activate git in the Mac copy: `cd ~/Documents/epm-capstone && rm -rf .git && git init && git add . && git commit -m "feat: capstone v0.2"`.
2. **Target folder was `~/projects/epm-capstone`.** The mount API couldn't create `~/projects` from inside the sandbox, so the project lives at `~/Documents/epm-capstone` (same as v0.1). Safe to `mv` after creating the parent.
3. **React Flow edge labels** on very narrow viewports still shift a few pixels; desktop-first is fine.

---

## Git history (sandbox canonical copy)

```
<new>   feat: capstone v0.2 — verify, fix, command palette, simulator, glossary, a11y
9c7069e feat(flows): Mermaid flowchart gallery with fullscreen modal
f780fe5 feat(modules): interactive React Flow module map with slide-in detail panels
7087489 feat(data): module, integration, and flow data models from study guide
f7c435d feat(ui): IBM Carbon-inspired dark theme, nav, landing page, base primitives
3e54c0f chore: scaffold Next.js 15 app (App Router + TS + Tailwind v4)
```

---

## How to run

```bash
cd ~/Documents/epm-capstone
npm install     # first time
npm run dev     # → http://localhost:3000
npm run build   # production build
npm run lint    # ESLint

# Try:
#   /                    Landing
#   /modules             Module map (click nodes + arrows)
#   /modules?m=capital   Deep-link into the Capital panel
#   /flows               Mermaid gallery
#   /flows#approvals     Scroll to the Approvals state diagram
#   /simulator           Walk the approval state machine
#   /glossary            Browse terms
#   /glossary?q=freeze   Pre-filtered glossary
#   ⌘K or Ctrl+K         Command palette from anywhere
```

Tested on Node 22.22.0, npm 10.9.4, headless Chromium (aarch64).

---

## Next iteration priorities

1. **Wire the Cmd+K palette into a `cmdk`/Radix-based component** for slightly richer fuzzy matching — current filter is subword-prefix, not full fuzzy.
2. **Integration Setup Checklist** — walk through `setupRequired` steps for a selected integration with tick-through state.
3. **Exam blueprint mapping** — sourced from 1Z0-1080 domain listing, each domain linked to module(s) / flow(s) / terms.
4. **Export** — PNG/SVG export on both the module map and flowcharts.
5. **axe a11y audit** — formal sweep + fix.
6. **Content depth** — integration `example` becomes an array of worked scenarios, not a single paragraph.
