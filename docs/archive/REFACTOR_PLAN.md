# RatioLab — Full Codebase Refactoring Plan

> **Generated:** 2026-03-23
> **Current state:** Single-file monolith (`App.jsx` — 608 lines, `App.css` — 169 lines)
> **Origin:** Claude artifact prototype, converted to Vite + React 19

---

## Table of Contents

1. [Current Architecture Summary](#1-current-architecture-summary)
2. [Proposed File Tree](#2-proposed-file-tree)
3. [Module 1 — Constants & Config](#3-module-1--constants--config)
4. [Module 2 — Icons & Watermarks](#4-module-2--icons--watermarks)
5. [Module 3 — Computation Engine](#5-module-3--computation-engine)
6. [Module 4 — LaTeX / KaTeX Builders](#6-module-4--latex--katex-builders)
7. [Module 5 — Formula Line Builder (Table View)](#7-module-5--formula-line-builder-table-view)
8. [Module 6 — PDF Export](#8-module-6--pdf-export)
9. [Module 7 — Shared UI Primitives](#9-module-7--shared-ui-primitives)
10. [Module 8 — Card Component](#10-module-8--card-component)
11. [Module 9 — Chain Canvas](#11-module-9--chain-canvas)
12. [Module 10 — Dashboard Panel](#12-module-10--dashboard-panel)
13. [Module 11 — Calculation Path Panel](#13-module-11--calculation-path-panel)
14. [Module 12 — App Shell & State](#14-module-12--app-shell--state)
15. [CSS Decomposition](#15-css-decomposition)
16. [Variable & Class Name Expansion](#16-variable--class-name-expansion)
17. [Execution Order & Dependency Graph](#17-execution-order--dependency-graph)
18. [Risks & Notes](#18-risks--notes)

---

## 1. Current Architecture Summary

Everything lives in two files:

### `App.jsx` (608 lines) — Line-by-line map

| Lines | Section | Responsibility |
|-------|---------|----------------|
| 1–6 | Imports | React hooks, katex, html2canvas, jspdf, App.css |
| 8–35 | `T`, `CT`, `CTD`, `DEFS`, `OD`, `uid()`, `defChain()` | Type enum, light/dark theme color maps per component type, component definition defaults, output device enum, ID generator, default chain factory |
| 37–51 | `IC`, `WM` | Inline SVG icon functions (small, per-type), watermark SVG strings (large background, per-type) |
| 53–59 | `sr()`, `se()`, `n()`, `lastRP()`, `anyRP()`, `badge()` | Pure helper functions — stage ratio, stage efficiency, numeric parse, chain queries, badge text |
| 61–80 | `compute()` | Core calculation engine — gear ratio, encoder resolution, travel, torque, speed, inertia |
| 82–152 | `VC`, `vp()`, `buildLatexSections()`, `buildLatex()` | KaTeX variable color config, colored-pill LaTeX helper, section-by-section LaTeX builder, flattened LaTeX builder for PDF |
| 154–191 | `vt()`, `buildLines()` | HTML variable-tag helper, plain-text formula row builder (for Table tab) |
| 193–203 | `KatexBlock` | React component — renders a LaTeX string into a DOM node via `katex.render()` |
| 205–393 | `triggerDownload()`, `buildPDFReport()` | Blob download helper, full PDF export pipeline (builds hidden DOM, renders KaTeX, html2canvas capture, jsPDF multi-page output) |
| 395–401 | `Conn` | React component — animated SVG connector arrow between chain cards |
| 403–409 | `NI` | React component — themed number input with focus-managed local state |
| 411–473 | `Card` | React component — main component card (renders different field sets per `T` type, load coupling, load inertia) |
| 475–494 | `ChainCanvas` | React component — auto-scaling container, hidden measurement div, visible drag-drop chain |
| 496–607 | `App` (default export) | Root component — all state (`chain`, `mode`, `lin`, drag indices, `dark`, `collapsed`, `calcTab`, `exporting`), chain CRUD, drag-drop handlers, memoized computations, full JSX (header, palette, mode bar, chain canvas, dashboard, calc path) |

### `App.css` (169 lines) — Section map

| Lines | Section | Scope |
|-------|---------|-------|
| 1 | Font import | Google Fonts (DM Sans, JetBrains Mono) |
| 3–27 | CSS custom properties | `:root` / `[data-theme="light"]` and `[data-theme="dark"]` variables |
| 29–39 | App shell | `.app`, `.hdr`, `.hdr-l`, `.hdr-r`, `.export-btn` |
| 41–47 | Theme toggle | `.tt`, `.tt-l`, `.tt-s` |
| 49–53 | Palette bar | `.pal`, `.pal-b`, `.pal-h` |
| 55–60 | Mode bar | `.mb`, `.mb-b`, `.rpf-w`, `.rpf` |
| 62–69 | Chain canvas | `.co`, `.ci`, `.cw`, `.cn` |
| 71–82 | Cards | `.cd`, `.cd-wm`, `.cd-h`, `.cd-ic`, `.cd-nm`, `.cd-acts`, `.cd-ab` |
| 84–97 | Card body | `.cd-b`, `.si`, `.fr`, `.fl`, `.fi`, `.fu`, `.bdg`, `.ct`, `.cs`, `.lc`, `.bp` |
| 99–118 | Dashboard | `.dash`, `.dash-title`, `.dash-group`, `.dash-group-label`, `.rg`, `.ri`, `.rl`, `.rv`, `.ru`, `.inertia-health` |
| 120–159 | Calc path | `.fc`, `.fc-tabs`, `.fc-tab`, `.fln`, `.tbl-group`, `.eq-sections`, `.eq-block`, `.fla`, `.flf`, `.flv`, `.vp`, `.katex-wrap` |
| 161–168 | Responsive | `@media (max-width: 700px)` |

---

## 2. Proposed File Tree

```
src/
├── main.jsx                          # Entry point (unchanged)
├── App.jsx                           # Slim shell — imports layout sections, provides state
├── App.css                           # DELETED — replaced by per-module CSS files
│
├── config/
│   ├── types.js                      # T enum, OD enum
│   ├── theme.js                      # CT (light), CTD (dark) color maps
│   ├── defaults.js                   # DEFS, defChain(), uid()
│   └── index.js                      # Barrel re-export
│
├── icons/
│   ├── ComponentIcons.jsx            # IC map (small inline SVG icons)
│   ├── Watermarks.jsx                # WM map (large background SVG strings)
│   └── index.js                      # Barrel re-export
│
├── engine/
│   ├── helpers.js                    # n(), sr(), se(), lastRP(), anyRP(), badge()
│   ├── compute.js                    # compute()
│   └── index.js                      # Barrel re-export
│
├── formatters/
│   ├── latexBuilder.js               # VC, vp(), buildLatexSections(), buildLatex()
│   ├── tableBuilder.js               # vt(), buildLines()
│   ├── numberFormat.js               # fmt() helper (currently inline in App)
│   └── index.js                      # Barrel re-export
│
├── export/
│   ├── triggerDownload.js            # triggerDownload()
│   ├── buildPdfReport.js            # buildPDFReport() — imports katex, html2canvas, jspdf
│   ├── pdfStyles.js                  # The inline <style> string for the PDF hidden container
│   └── index.js                      # Barrel re-export
│
├── components/
│   ├── ui/
│   │   ├── NumberInput.jsx           # NI → NumberInput
│   │   ├── NumberInput.css           # .fi styles
│   │   ├── Connector.jsx             # Conn → Connector
│   │   ├── Connector.css             # .cn styles + SVG gradient
│   │   ├── KatexBlock.jsx            # KatexBlock (unchanged name)
│   │   └── ThemeToggle.jsx           # Extracted from App JSX
│   │
│   ├── card/
│   │   ├── Card.jsx                  # Card component
│   │   ├── Card.css                  # .cd, .cd-h, .cd-b, .cd-wm, etc.
│   │   ├── fields/
│   │   │   ├── ServoFields.jsx       # Servo-specific form rows
│   │   │   ├── GearboxFields.jsx     # Gearbox-specific form rows
│   │   │   ├── GearMeshFields.jsx    # Gear Mesh-specific form rows
│   │   │   ├── BeltPulleyFields.jsx  # Belt/Pulley form rows (teeth vs diameter toggle)
│   │   │   ├── RackPinionFields.jsx  # Rack & Pinion form rows
│   │   │   └── LoadCoupling.jsx      # Load coupling section (sprocket vs direct)
│   │   └── index.js                  # Barrel
│   │
│   ├── chain/
│   │   ├── ChainCanvas.jsx           # ChainCanvas component
│   │   ├── ChainCanvas.css           # .co, .ci, .cw styles
│   │   ├── Palette.jsx               # Palette bar (currently inline in App)
│   │   ├── Palette.css               # .pal, .pal-b styles
│   │   ├── ModeBar.jsx               # Rotary/Linear mode toggle (currently inline in App)
│   │   ├── ModeBar.css               # .mb, .mb-b styles
│   │   └── index.js                  # Barrel
│   │
│   ├── dashboard/
│   │   ├── Dashboard.jsx             # Results dashboard
│   │   ├── Dashboard.css             # .dash, .rg, .ri, .rl, .rv styles
│   │   ├── ResultItem.jsx            # Single result tile (extracted from repetitive JSX)
│   │   └── index.js                  # Barrel
│   │
│   ├── calcpath/
│   │   ├── CalcPath.jsx              # Calculation Path panel (Table + Equation tabs)
│   │   ├── CalcPath.css              # .fc, .fc-tabs, .fln, .tbl-group, .eq-block styles
│   │   ├── TableView.jsx             # Table tab content
│   │   ├── EquationView.jsx          # Equation tab content (KaTeX sections)
│   │   └── index.js                  # Barrel
│   │
│   └── header/
│       ├── Header.jsx                # App header (title, export button, theme toggle)
│       ├── Header.css                # .hdr, .export-btn styles
│       └── index.js                  # Barrel
│
├── hooks/
│   ├── useChain.js                   # Chain state + CRUD (add, update, delete, duplicate)
│   ├── useDragDrop.js                # Drag-drop state + handlers (onDS, onDE, onDO, onDr, palDS)
│   └── useTheme.js                   # Dark mode state + toggle
│
└── styles/
    ├── variables.css                 # CSS custom properties (light + dark theme)
    ├── reset.css                     # Box-sizing, body reset
    └── global.css                    # Shared utility classes (.vp, .vp-ratio, etc.)
```

---

## 3. Module 1 — Constants & Config

**Source lines:** `App.jsx:8–35`
**Target files:** `src/config/types.js`, `src/config/theme.js`, `src/config/defaults.js`, `src/config/index.js`

### `config/types.js`
Extract the `T` enum and `OD` enum. These are referenced everywhere as the canonical type identifiers.

```
export const ComponentType = {
  SERVO: "servo",
  GEARBOX: "gearbox",
  GEAR_MESH: "gear_mesh",
  BELT_PULLEY: "belt_pulley",
  RACK_PINION: "rack_pinion",
};

export const OutputDevice = {
  SPROCKET: "sprocket",
  DIRECT: "direct",
};
```

**Name changes:** `T` -> `ComponentType`, `OD` -> `OutputDevice`. These abbreviations were fine in a single file but are ambiguous across modules.

### `config/theme.js`
Extract `CT` (light card themes) and `CTD` (dark card themes). Each is a map of `ComponentType` -> color object.

```
export const CARD_THEMES_LIGHT = { ... };   // was CT
export const CARD_THEMES_DARK = { ... };    // was CTD
```

**Name changes:** `CT` -> `CARD_THEMES_LIGHT`, `CTD` -> `CARD_THEMES_DARK`

Each value object has these keys (document them):
- `accent` — primary accent color
- `bg`, `bg2` — gradient start/end for card background
- `text` — primary text color on card
- `sub` — secondary/label text color on card
- `inBg`, `inBrd`, `inTxt` — input field background, border, text
- `badge` — badge pill background
- `icon` — icon stroke color
- `border` — card border color

### `config/defaults.js`
Extract `DEFS`, `uid()`, and `defChain()`.

```
export const COMPONENT_DEFS = { ... };   // was DEFS
export function generateId() { ... }     // was uid()
export function createDefaultChain() { ... }  // was defChain()
```

**Name changes:** `DEFS` -> `COMPONENT_DEFS`, `uid()` -> `generateId()`, `defChain()` -> `createDefaultChain()`

**Note:** `uid()` uses a module-scoped `let _id = 0` counter + `Date.now().toString(36)`. This is fine as a module-level variable in its own file.

### `config/index.js`
Barrel re-export:
```
export * from './types';
export * from './theme';
export * from './defaults';
```

**Consumed by:** Nearly every other module — engine, components, formatters, export.

---

## 4. Module 2 — Icons & Watermarks

**Source lines:** `App.jsx:37–51`
**Target files:** `src/icons/ComponentIcons.jsx`, `src/icons/Watermarks.jsx`, `src/icons/index.js`

### `icons/ComponentIcons.jsx`
Extract the `IC` map. Each entry is a function `(color: string) => <svg .../>`.

```
export const COMPONENT_ICONS = { ... };   // was IC
```

**Name change:** `IC` -> `COMPONENT_ICONS`

These are JSX-returning functions, so this file needs a `.jsx` extension. They take a single color string and return an 18x18 SVG element.

### `icons/Watermarks.jsx`
Extract the `WM` map. Each entry is a raw SVG markup string (used via `dangerouslySetInnerHTML`).

```
export const WATERMARKS = { ... };   // was WM
```

**Name change:** `WM` -> `WATERMARKS`

Despite being strings (not JSX), keep `.jsx` extension since it lives alongside JSX files and may be converted to components later.

**Consumed by:** `Card` component (icons in header, watermark in background).

---

## 5. Module 3 — Computation Engine

**Source lines:** `App.jsx:53–80`
**Target files:** `src/engine/helpers.js`, `src/engine/compute.js`, `src/engine/index.js`

### `engine/helpers.js`
Pure functions with zero UI or React dependencies.

| Current | Proposed | Signature | Purpose |
|---------|----------|-----------|---------|
| `n(v, fb)` | `num(value, fallback)` | `(any, number) => number` | Parse to float, return fallback if NaN or zero |
| `sr(stage)` | `stageRatio(stage)` | `(object) => number` | Compute ratio for a single stage based on type |
| `se(stage)` | `stageEfficiency(stage)` | `(object) => number` | Compute efficiency fraction for a single stage |
| `lastRP(chain)` | `isLastRackPinion(chain)` | `(array) => boolean` | True if last non-servo component is Rack & Pinion |
| `anyRP(chain)` | `hasRackPinion(chain)` | `(array) => boolean` | True if any component is Rack & Pinion |
| `badge(stage)` | `getBadgeText(stage)` | `(object) => string` | Human-readable badge string per component |

**Dependencies:** `ComponentType` from config, `OutputDevice` from config.

### `engine/compute.js`
The main `compute()` function.

```
export function compute(chain, outputMode, linearConfig, loadInertia) { ... }
```

**Current name is fine** — it's descriptive enough since it lives in `engine/compute.js`.

**Return shape** (document this — it's critical and currently undocumented):

```
{
  mrl: number,          // Motor revs per load rev (= total gear ratio)
  cpm: number,          // Counts per motor rev (PPR × 4)
  cpl: number,          // Counts per load rev
  dpl: number,          // Distance/degrees per load rev
  upm: number,          // Units per motor rev
  upc: number,          // Units per count
  u: string,            // Unit label ("deg" | "in" | "mm")
  tr: number,           // Total gear ratio (product of all stage ratios)
  te: number,           // Total efficiency (product of all stage efficiencies)
  tq: number,           // Output torque (Nm)
  ppr: number,          // Encoder PPR
  rpl: boolean,         // Is last stage Rack & Pinion?
  rpm: number,          // Motor rated RPM
  oRPM: number,         // Output shaft RPM
  oSpd: number,         // Output linear speed (units/min)
  jMotor: number,       // Motor rotor inertia
  jLoad: number,        // Load inertia
  jReflected: number,   // Reflected load inertia
  inertiaRatio: number, // J_reflected / J_motor
}
```

**Dependencies:** `helpers.js`, `ComponentType`, `OutputDevice`.

---

## 6. Module 4 — LaTeX / KaTeX Builders

**Source lines:** `App.jsx:82–152`
**Target files:** `src/formatters/latexBuilder.js`

### `formatters/latexBuilder.js`

| Current | Proposed | Purpose |
|---------|----------|---------|
| `VC` | `VARIABLE_COLORS` | Color map `{ fg, bg }` for LaTeX `\colorbox` pills |
| `vp(vc, content)` | `colorPill(varColor, content)` | Wraps value in KaTeX `\colorbox` |
| `buildLatexSections(...)` | `buildLatexSections(...)` | Returns `Array<{ title: string, tex: string }>` — one per math section |
| `buildLatex(...)` | `buildLatexFlat(...)` | Joins all sections into one LaTeX string (used only by PDF export) |

**Dependencies:** `ComponentType`, `OutputDevice`, `stageRatio()` (for fraction display, not recomputation).

**Notes:**
- `buildLatexSections` is the primary function — used by both the UI (Equation tab) and PDF export.
- `buildLatexFlat` is only used by PDF and could be inlined there, but keeping it here is cleaner.

---

## 7. Module 5 — Formula Line Builder (Table View)

**Source lines:** `App.jsx:154–191`
**Target files:** `src/formatters/tableBuilder.js`

### `formatters/tableBuilder.js`

| Current | Proposed | Purpose |
|---------|----------|---------|
| `vt(cls, val)` | `variableTag(className, value)` | Returns an HTML `<span class="vp vp-{cls}">` string |
| `buildLines(...)` | `buildFormulaLines(...)` | Returns `Array<{ section?: string, l?: string, m?: string, v?: string, raw?: boolean }>` |

**Return shape** for each line:
- `{ section: string }` — section header row (no formula)
- `{ l: string, m: string, v: string, raw: boolean }` — label, formula middle, value, whether to use `dangerouslySetInnerHTML`

**Dependencies:** `ComponentType`, `OutputDevice`, `num()` from helpers.

---

## 8. Module 6 — PDF Export

**Source lines:** `App.jsx:205–393`
**Target files:** `src/export/triggerDownload.js`, `src/export/pdfStyles.js`, `src/export/buildPdfReport.js`, `src/export/index.js`

### `export/triggerDownload.js`
Extract `triggerDownload(blob, filename)` — a pure utility with two fallback strategies (createObjectURL -> FileReader).

### `export/pdfStyles.js`
Extract the massive inline `<style>` string (lines 271–312) into its own file as:
```
export const PDF_REPORT_STYLES = `...`;
```

This string is ~40 lines of CSS scoped to `#pr`. Keeping it separate makes it maintainable.

### `export/buildPdfReport.js`
The main `buildPDFReport()` async function. This is the single largest function (~160 lines).

**Imports needed:** `katex`, `html2canvas`, `jsPDF`, `ComponentType`, `getBadgeText()`, `triggerDownload`, `PDF_REPORT_STYLES`.

**Opportunities for further decomposition within this file:**
1. `buildChainCardsHtml(chain)` — generates the chain visualization HTML string
2. `buildResultsHtml(r, fmt)` — generates the results grid HTML
3. `buildReportHtml(...)` — combines everything into the full `#pr` container
4. `renderToPdf(container)` — html2canvas + jsPDF pipeline

However, this level of decomposition is optional in the first pass. The key win is just isolating this 160-line function from App.jsx.

---

## 9. Module 7 — Shared UI Primitives

**Source lines:** `App.jsx:193–203, 395–409`
**Target files:** `src/components/ui/NumberInput.jsx`, `src/components/ui/Connector.jsx`, `src/components/ui/KatexBlock.jsx`, `src/components/ui/ThemeToggle.jsx`

### `components/ui/NumberInput.jsx`
Currently `NI`. Rename to `NumberInput`.

**Props:**
- `value: number | ""` — controlled value
- `onChange: (number | "") => void` — value change callback
- `width?: number` — input width (default 80)
- `step?: number` — step increment
- `min?: number` — minimum value
- `max?: number` — maximum value
- `theme: object` — theme color object (from `CT`/`CTD` for the card type)

**Internal state:** `loc` (local string during focus), `foc` (is focused). This pattern prevents the cursor from jumping during typing.

**Co-located CSS:** Extract `.fi` styles from App.css into `NumberInput.css`.

### `components/ui/Connector.jsx`
Currently `Conn`. Rename to `Connector`.

**Props:** `dark: boolean`

Renders the animated dashed-line SVG arrow between chain cards. Uses an SVG `<linearGradient>` and `<animate>`.

**Co-located CSS:** Extract `.cn` styles.

### `components/ui/KatexBlock.jsx`
Already well-named. No changes needed to the component itself.

**Props:** `tex: string`

Uses `useRef` + `useEffect` to call `katex.render()` imperatively.

### `components/ui/ThemeToggle.jsx`
Currently inline JSX in `App`. Extract to its own component.

**Props:** `dark: boolean`, `onToggle: () => void`

**Co-located CSS:** Extract `.tt`, `.tt-l`, `.tt-s` styles.

---

## 10. Module 8 — Card Component

**Source lines:** `App.jsx:411–473`
**Target files:** `src/components/card/Card.jsx`, `src/components/card/Card.css`, `src/components/card/fields/*.jsx`

### `components/card/Card.jsx`
The current `Card` is a 62-line component with branching render logic per component type. The outer shell (drag, watermark, header, collapse) stays here.

**Current props (16!):**

```
comp, index, isLast, outputMode, lin, onLin, onUp, onDel, onDup,
onDS, onDE, onDO, onDr, isDg, isDov, dark, collapsed, onToggle
```

**Refactoring strategy:** Keep `Card.jsx` as the outer wrapper. Extract the per-type field sections into separate components under `fields/`:

### `components/card/fields/ServoFields.jsx`
Renders: Encoder PPR, Rated Torque, Rated Speed, Rotor Inertia.
**Props:** `comp`, `onUpdate`, `theme`

### `components/card/fields/GearboxFields.jsx`
Renders: Ratio (Num:Den), Efficiency.
**Props:** `comp`, `onUpdate`, `theme`

### `components/card/fields/GearMeshFields.jsx`
Renders: Driving Teeth, Driven Teeth, Efficiency.
**Props:** `comp`, `onUpdate`, `theme`

### `components/card/fields/BeltPulleyFields.jsx`
Renders: Mode toggle (Teeth vs Diameter), conditional teeth or diameter inputs, Efficiency.
**Props:** `comp`, `onUpdate`, `theme`

### `components/card/fields/RackPinionFields.jsx`
Renders: Pinion Teeth, Pitch, Units (in/mm toggle), Efficiency.
**Props:** `comp`, `onUpdate`, `theme`

### `components/card/fields/LoadCoupling.jsx`
Renders: Load coupling section (Sprocket vs Direct, with sub-fields). Currently conditionally rendered inside `Card` when `isLast && !isServo && !isRP && outputMode === "linear"`.
**Props:** `lin`, `onLinChange`, `theme`

### `components/card/Card.css`
Extract from App.css: `.cd`, `.cd-wm`, `.cd-h`, `.cd-ic`, `.cd-nm`, `.cd-acts`, `.cd-ab`, `.cd-b`, `.si`, `.fr`, `.fl`, `.fu`, `.bdg`, `.ct`, `.cs`, `.lc`, `.bp`.

---

## 11. Module 9 — Chain Canvas

**Source lines:** `App.jsx:475–494`
**Target files:** `src/components/chain/ChainCanvas.jsx`, `src/components/chain/ChainCanvas.css`, `src/components/chain/Palette.jsx`, `src/components/chain/Palette.css`, `src/components/chain/ModeBar.jsx`, `src/components/chain/ModeBar.css`

### `components/chain/ChainCanvas.jsx`
The auto-scaling container component. Currently uses a hidden measurement `div` and a visible `div`, with a `useEffect` that computes scale.

**Current props (19!):**

```
chain, dark, lastIdx, eMode, lin, setLin, up, del, dup,
onDS, onDE, onDO, onDr, dIdx, doIdx, dropOn, setDropOn, add,
collapsed, toggleCol
```

**Prop reduction strategy:** Many of these are drag-drop related. Once `useDragDrop` hook is extracted, these can be spread from the hook return.

**Co-located CSS:** `.co`, `.ci`, `.cw`, animation `@keyframes ci`.

### `components/chain/Palette.jsx`
Currently inline JSX in `App` (line 551–552). Extract to own component.

**Props:** `hasRackPinion`, `dark`, `onAdd`, `onPaletteDragStart`

Renders the row of "+" buttons (Gearbox, Gear Mesh, Belt/Pulley, Rack & Pinion).

**Co-located CSS:** `.pal`, `.pal-b`, `.pal-h`.

### `components/chain/ModeBar.jsx`
Currently inline JSX in `App` (lines 554–555). Extract to own component.

**Props:** `mode`, `onSetMode`, `isRackPinionForced`, `dark`

Renders either the Rotary/Linear toggle or the "Rack & Pinion forced" badge.

**Co-located CSS:** `.mb`, `.mb-b`, `.rpf-w`, `.rpf`.

---

## 12. Module 10 — Dashboard Panel

**Source lines:** `App.jsx:559–591`
**Target files:** `src/components/dashboard/Dashboard.jsx`, `src/components/dashboard/Dashboard.css`, `src/components/dashboard/ResultItem.jsx`

### `components/dashboard/Dashboard.jsx`
The "Axis Scaling Results" panel. Currently ~30 lines of repetitive JSX with three groups: Encoder & Resolution, Torque & Speed, Inertia Matching.

**Props:** `results` (the `r` object from `compute()`), `fmt` (the formatting function)

### `components/dashboard/ResultItem.jsx`
Extract the repetitive result tile pattern:

```jsx
<div className="ri ri-or">
  <div className="rl">Motor Rev / Load Rev</div>
  <div className="rv" style={{color:"var(--orn)"}}>
    {fmt(r.mrl)}
  </div>
</div>
```

Into a reusable component:

```jsx
<ResultItem label="Motor Rev / Load Rev" value={fmt(r.mrl)} color="orn" variant="or" />
```

**Props:** `label`, `value`, `unit?`, `color`, `variant` (for the `::before` accent bar)

This eliminates ~20 near-identical blocks.

**Co-located CSS:** `.dash`, `.dash-title`, `.dash-group`, `.dash-group-label`, `.rg`, `.ri`, `.rl`, `.rv`, `.ru`, `.inertia-health`.

---

## 13. Module 11 — Calculation Path Panel

**Source lines:** `App.jsx:593–605`
**Target files:** `src/components/calcpath/CalcPath.jsx`, `src/components/calcpath/CalcPath.css`, `src/components/calcpath/TableView.jsx`, `src/components/calcpath/EquationView.jsx`

### `components/calcpath/CalcPath.jsx`
The "Calculation Path" card with tab switching (Table / Equation).

**Props:** `formulaLines`, `latexSections`, `calcTab`, `onSetCalcTab`

### `components/calcpath/TableView.jsx`
The grouped table view (currently an IIFE inside JSX at line 596–602).

**Props:** `formulaLines` — groups them by `section` field and renders `tbl-group` blocks.

### `components/calcpath/EquationView.jsx`
The KaTeX equation view.

**Props:** `latexSections` — renders a `KatexBlock` per section with `eq-hr` dividers.

**Co-located CSS:** `.fc`, `.fc-tabs`, `.fc-tab`, `.fln`, `.fla`, `.flf`, `.flv`, `.tbl-group`, `.tbl-group-hdr`, `.tbl-group-body`, `.eq-sections`, `.eq-hr`, `.eq-block`, `.eq-block-title`.

---

## 14. Module 12 — App Shell & State

**Source lines:** `App.jsx:496–607`
**Target files:** `src/App.jsx`, `src/hooks/useChain.js`, `src/hooks/useDragDrop.js`, `src/hooks/useTheme.js`

### `hooks/useChain.js`
Encapsulate chain state + CRUD operations.

```js
export function useChain() {
  const [chain, setChain] = useState(createDefaultChain);
  // add, update, delete, duplicate
  return { chain, add, update, remove, duplicate };
}
```

**Extracts:** `chain` state, `add()`, `up()` -> `update()`, `del()` -> `remove()`, `dup()` -> `duplicate()`.

### `hooks/useDragDrop.js`
Encapsulate drag-drop indices and handlers.

```js
export function useDragDrop(chain, setChain) {
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  // onDragStart, onDragEnd, onDragOver, onDrop, paletteDragStart
  return { dragIdx, dragOverIdx, onDragStart, onDragEnd, onDragOver, onDrop, paletteDragStart };
}
```

**Name changes:** `dIdx` -> `dragIdx`, `doIdx` -> `dragOverIdx`, `onDS` -> `onDragStart`, `onDE` -> `onDragEnd`, `onDO` -> `onDragOver`, `onDr` -> `onDrop`, `palDS` -> `paletteDragStart`.

### `hooks/useTheme.js`
Simple dark mode toggle.

```js
export function useTheme() {
  const [dark, setDark] = useState(false);
  const toggle = useCallback(() => setDark(d => !d), []);
  return { dark, toggle };
}
```

### Slim `App.jsx`
After extraction, `App.jsx` becomes a ~60-line orchestrator:

```jsx
import { useState, useMemo, useCallback } from "react";
import { useChain } from "./hooks/useChain";
import { useDragDrop } from "./hooks/useDragDrop";
import { useTheme } from "./hooks/useTheme";
import { compute } from "./engine";
import { buildFormulaLines } from "./formatters/tableBuilder";
import { buildLatexSections, buildLatexFlat } from "./formatters/latexBuilder";
import { Header } from "./components/header";
import { Palette, ModeBar, ChainCanvas } from "./components/chain";
import { Dashboard } from "./components/dashboard";
import { CalcPath } from "./components/calcpath";
import "./styles/variables.css";

export default function App() {
  const { dark, toggle: toggleTheme } = useTheme();
  const { chain, add, update, remove, duplicate } = useChain();
  const drag = useDragDrop(chain, /* setChain from useChain */);
  // ... mode, lin, collapsed, calcTab state
  // ... memoized compute, buildFormulaLines, buildLatexSections
  // ... return JSX composing the above components
}
```

---

## 15. CSS Decomposition

### Strategy: Co-located CSS files per component

Each component gets its own `.css` file imported at the top of the component. The `App.css` monolith is deleted.

### Shared files under `src/styles/`

| File | Contents | Source lines in App.css |
|------|----------|------------------------|
| `variables.css` | `:root` + `[data-theme="light"]` + `[data-theme="dark"]` custom properties | 3–27 |
| `reset.css` | `*{box-sizing:...}`, `body,#root{...}` | Currently in `index.css` |
| `global.css` | `.vp` variable pill classes (`.vp-ratio`, `.vp-eff`, etc.), `.katex-wrap` | 151–159 |

### Component CSS mapping

| CSS Classes | Target File |
|-------------|------------|
| `.app` | `App.css` (keep, but only the `.app` rule) |
| `.hdr`, `.hdr-l`, `.hdr-r`, `.export-btn` | `components/header/Header.css` |
| `.tt`, `.tt-l`, `.tt-s` | `components/ui/ThemeToggle.css` |
| `.pal`, `.pal-b`, `.pal-h` | `components/chain/Palette.css` |
| `.mb`, `.mb-b`, `.rpf-w`, `.rpf` | `components/chain/ModeBar.css` |
| `.co`, `.ci`, `.cw`, `@keyframes ci` | `components/chain/ChainCanvas.css` |
| `.cn` | `components/ui/Connector.css` |
| `.cd`, `.cd-wm`, `.cd-h`, `.cd-ic`, `.cd-nm`, `.cd-acts`, `.cd-ab` | `components/card/Card.css` |
| `.cd-b`, `.si`, `.fr`, `.fl`, `.fu`, `.bdg`, `.ct`, `.cs`, `.lc`, `.bp` | `components/card/Card.css` |
| `.fi` | `components/ui/NumberInput.css` |
| `.dash`, `.dash-title`, `.dash-group`, `.dash-group-label`, `.rg`, `.ri`, `.rl`, `.rv`, `.ru`, `.inertia-health` | `components/dashboard/Dashboard.css` |
| `.fc`, `.fc-tabs`, `.fc-tab`, `.fln`, `.fln-sec`, `.fla`, `.flf`, `.flv` | `components/calcpath/CalcPath.css` |
| `.tbl-group`, `.tbl-group-hdr`, `.tbl-group-body` | `components/calcpath/CalcPath.css` |
| `.eq-sections`, `.eq-hr`, `.eq-block`, `.eq-block-title` | `components/calcpath/CalcPath.css` |
| `@media (max-width: 700px)` | Split responsive rules into each component's CSS file |

---

## 16. Variable & Class Name Expansion

The prototype uses extremely abbreviated names. These should be expanded for maintainability. Here is the complete renaming dictionary:

### JavaScript Constants & Functions

| Current | Proposed | Context |
|---------|----------|---------|
| `T` | `ComponentType` | Type enum |
| `CT` | `CARD_THEMES_LIGHT` | Light card color map |
| `CTD` | `CARD_THEMES_DARK` | Dark card color map |
| `DEFS` | `COMPONENT_DEFS` | Component definition defaults |
| `OD` | `OutputDevice` | Output device enum |
| `uid()` | `generateId()` | ID generator |
| `defChain()` | `createDefaultChain()` | Default chain factory |
| `IC` | `COMPONENT_ICONS` | Icon function map |
| `WM` | `WATERMARKS` | Watermark SVG map |
| `VC` | `VARIABLE_COLORS` | LaTeX variable color config |
| `n(v, fb)` | `num(value, fallback)` | Numeric parser |
| `sr(s)` | `stageRatio(stage)` | Stage ratio |
| `se(s)` | `stageEfficiency(stage)` | Stage efficiency |
| `vp(vc, content)` | `colorPill(vc, content)` | LaTeX color pill |
| `vt(cls, val)` | `variableTag(cls, val)` | HTML variable pill |
| `fl` | `formulaLines` | Formula lines array |
| `r` | `results` | Compute results object |
| `eM` | `effectiveMode` | Effective output mode |
| `rp` | `hasRP` | Has rack & pinion |
| `rpF` | `isRPForced` | R&P forces linear |
| `fmt` | `formatNumber` | Number formatter |
| `NI` | `NumberInput` | Number input component |
| `Conn` | `Connector` | Connector component |

### CSS Class Names

| Current | Proposed | Component |
|---------|----------|-----------|
| `.co` | `.chain-outer` | ChainCanvas |
| `.ci` | `.chain-inner` | ChainCanvas |
| `.cw` | `.chain-wrapper` | ChainCanvas item wrapper |
| `.cn` | `.connector` | Connector |
| `.cd` | `.card` | Card |
| `.cd-wm` | `.card-watermark` | Card watermark |
| `.cd-h` | `.card-header` | Card header |
| `.cd-ic` | `.card-icon` | Card icon |
| `.cd-nm` | `.card-name` | Card name input |
| `.cd-acts` | `.card-actions` | Card action buttons |
| `.cd-ab` | `.card-action-btn` | Card action button |
| `.cd-b` | `.card-body` | Card body |
| `.si` | `.section-indicator` | Section label in card |
| `.fr` | `.field-row` | Form field row |
| `.fl` | `.field-label` | Field label |
| `.fi` | `.field-input` | Number input |
| `.fu` | `.field-unit` | Unit label |
| `.bdg` | `.badge` | Component badge |
| `.ct` | `.chip-toggle` | Toggle chip (teeth/diameter) |
| `.cs` | `.chip-select` | Select dropdown |
| `.lc` | `.load-coupling` | Load coupling section |
| `.bp` | `.btn-pair` | Button pair container |
| `.ri` | `.result-item` | Dashboard result tile |
| `.rl` | `.result-label` | Result tile label |
| `.rv` | `.result-value` | Result tile value |
| `.ru` | `.result-unit` | Result tile unit |
| `.rg` | `.result-grid` | Result grid |
| `.fln` | `.formula-line` | Formula table row |
| `.fla` | `.formula-label` | Formula label column |
| `.flf` | `.formula-formula` | Formula middle column |
| `.flv` | `.formula-value` | Formula value column |

**Important:** CSS class renaming should be done in a single pass across both `.css` and `.jsx` files to avoid partial mismatches.

---

## 17. Execution Order & Dependency Graph

Refactor in this order to minimize breakage between steps:

### Phase 1 — Extract pure logic (no JSX changes)
1. `config/` — types, theme, defaults
2. `engine/` — helpers, compute
3. `formatters/` — latexBuilder, tableBuilder, numberFormat
4. `export/` — triggerDownload, pdfStyles, buildPdfReport
5. `icons/` — ComponentIcons, Watermarks

After Phase 1, `App.jsx` still works but imports from new locations instead of having inline definitions. All tests/manual verification can happen at this checkpoint.

### Phase 2 — Extract UI primitives
6. `components/ui/NumberInput`
7. `components/ui/Connector`
8. `components/ui/KatexBlock`
9. `components/ui/ThemeToggle`

### Phase 3 — Extract card system
10. `components/card/fields/*` (all 6 field components)
11. `components/card/Card`

### Phase 4 — Extract layout sections
12. `components/chain/Palette`
13. `components/chain/ModeBar`
14. `components/chain/ChainCanvas`
15. `components/dashboard/ResultItem`
16. `components/dashboard/Dashboard`
17. `components/calcpath/TableView`
18. `components/calcpath/EquationView`
19. `components/calcpath/CalcPath`
20. `components/header/Header`

### Phase 5 — Extract hooks & finalize App
21. `hooks/useChain`
22. `hooks/useDragDrop`
23. `hooks/useTheme`
24. Rewrite `App.jsx` as slim orchestrator

### Phase 6 — CSS decomposition
25. Create `styles/variables.css`, `styles/reset.css`, `styles/global.css`
26. Split `App.css` into co-located CSS files
27. Delete `App.css`

### Phase 7 (Optional) — Class name expansion
28. Rename CSS classes to readable names (see table above)
29. Update all JSX `className` references

```
Dependency Graph:

config/ ─────────────────────────────────────────┐
  ├── types.js                                    │
  ├── theme.js ← types                           │
  └── defaults.js ← types                        │
                                                  │
engine/ ──────────────────────────────────────────┤
  ├── helpers.js ← config/types                   │
  └── compute.js ← helpers, config/types          │
                                                  │
formatters/ ──────────────────────────────────────┤
  ├── latexBuilder.js ← config/types, engine      │
  ├── tableBuilder.js ← config/types, engine      │
  └── numberFormat.js (standalone)                │
                                                  │
icons/ ───────────────────────────────────────────┤
  ├── ComponentIcons.jsx ← config/types           │
  └── Watermarks.jsx ← config/types               │
                                                  │
export/ ──────────────────────────────────────────┤
  ├── triggerDownload.js (standalone)              │
  ├── pdfStyles.js (standalone)                   │
  └── buildPdfReport.js ← all of above + katex,   │
       html2canvas, jspdf                         │
                                                  │
components/ui/ ───────────────────────────────────┤
  ├── NumberInput ← (standalone)                  │
  ├── Connector ← (standalone)                    │
  ├── KatexBlock ← katex                          │
  └── ThemeToggle ← (standalone)                  │
                                                  │
components/card/ ─────────────────────────────────┤
  ├── fields/* ← ui/NumberInput, config           │
  └── Card ← fields/*, icons, config/theme        │
                                                  │
components/chain/ ────────────────────────────────┤
  ├── Palette ← icons, config                     │
  ├── ModeBar ← icons, config                     │
  └── ChainCanvas ← Card, Connector, config       │
                                                  │
components/dashboard/ ────────────────────────────┤
  ├── ResultItem ← (standalone)                   │
  └── Dashboard ← ResultItem                      │
                                                  │
components/calcpath/ ─────────────────────────────┤
  ├── TableView ← (standalone)                    │
  ├── EquationView ← KatexBlock                   │
  └── CalcPath ← TableView, EquationView          │
                                                  │
components/header/ ───────────────────────────────┤
  └── Header ← ThemeToggle, export/               │
                                                  │
hooks/ ───────────────────────────────────────────┤
  ├── useChain ← config/defaults                  │
  ├── useDragDrop ← (standalone)                  │
  └── useTheme ← (standalone)                     │
                                                  │
App.jsx ← hooks, engine, formatters, all components
```

---

## 18. Risks & Notes

### Critical Constraints
- **The `Conn` SVG gradient ID `"cg"` is not unique** — if multiple `Connector` instances render, they share a `<linearGradient id="cg">`. This works today because SVG defs are document-scoped and the same gradient is reused. If you ever have connectors with different colors, generate unique IDs.
- **`dangerouslySetInnerHTML`** is used in three places: card watermarks (`WM`), formula table cells (`.raw` lines), and the entire PDF hidden container. These are all developer-controlled strings — no user input reaches them — so this is safe but should be documented.
- **The `buildPDFReport` function mutates the DOM** (appends/removes a hidden container). This is inherently side-effectful and should not be called during render. It's currently triggered only by a button click, which is fine.
- **The module-scoped `_id` counter** in `uid()` resets on HMR during development. This is harmless because IDs are only used as React keys and for chain identity within a session.

### Testing Opportunities
After decomposition, these modules become independently testable:
- `engine/helpers.js` — pure functions, trivial to unit test
- `engine/compute.js` — pure function, test with various chain configurations
- `formatters/latexBuilder.js` — pure function, snapshot test LaTeX output
- `formatters/tableBuilder.js` — pure function, snapshot test line arrays
- `export/triggerDownload.js` — mock `document.createElement`, test both fallback paths

### Performance Notes
- `ChainCanvas` JSON-stringifies the entire chain + collapsed state on every render to use as a `useEffect` dependency (`sig`). This works but is O(n) serialization. Consider `useRef` + shallow comparison or a dedicated change counter.
- The hidden measurement `div` in `ChainCanvas` renders the full card tree a second time (with noop handlers). This doubles the card component count. An alternative is `ResizeObserver` on the visible container.
- `compute()`, `buildLines()`, `buildLatexSections()`, and `buildLatex()` are all memoized via `useMemo` — this is correct and should be preserved.

### CSS Architecture Decision
The plan above uses **co-located CSS files** (one per component). Alternatives:
- **CSS Modules** — `Card.module.css` — scoped class names, prevents collisions, but requires `styles.cardHeader` syntax changes everywhere
- **Tailwind** — utility-first, major rewrite of all styles
- **Styled-components / Emotion** — CSS-in-JS, collocated by nature, but adds runtime cost

**Recommendation:** Start with plain co-located CSS files (matching current approach). Migrate to CSS Modules in a future pass if class name collisions become an issue.
