# RatioLab

**Servo Scaling Calculator** — an interactive web application for designing and analyzing mechanical motion chains. Build a drive train from servo motors, gearboxes, gear meshes, belt/pulley systems, rack & pinion mechanisms, and leadscrews, then instantly see encoder resolution, gear ratios, torque, speed, and travel computed in real time with full equation derivations.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

The dev server runs on `http://localhost:5173` by default.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | React | 19.2 |
| **Build** | Vite | 8.0 |
| **Language** | JavaScript (ES modules, JSX) | ES2022+ |
| **React Compiler** | babel-plugin-react-compiler via @rolldown/plugin-babel | 1.0 |
| **Math Rendering** | KaTeX | 0.16 |
| **PDF Export** | jsPDF + html2canvas | 4.2 / 1.4 |
| **Styling** | Plain CSS (custom properties, no CSS-in-JS) | — |
| **Linting** | ESLint 9 (flat config) + react-hooks + react-refresh | 9.39 |
| **Type Hints** | @types/react, @types/react-dom (editor support, no TypeScript compilation) | 19.2 |
| **Fonts** | Google Fonts (loaded via `<link>` in `index.html`) | — |

### Build Pipeline

```
Source (.jsx/.js/.css)
  → Vite 8 (Rolldown bundler)
  → @vitejs/plugin-react (JSX transform)
  → @rolldown/plugin-babel + react-compiler (auto-memoization)
  → dist/ (hashed assets)
```

---

## Project Structure

```
MotionCalc/
├── public/                  Static assets (favicon, icons SVG)
├── docs/
│   └── archive/             Historical dev documents (refactor plan, handoff notes, OG monolith)
├── src/
│   ├── main.jsx             App bootstrap (createRoot, StrictMode)
│   ├── App.jsx              Root orchestrator — hooks, state, composition
│   ├── App.css              Root layout styles
│   ├── index.css             CSS injection entry
│   │
│   ├── config/              Type constants, defaults, themes, tooltips
│   │   ├── types.js          ComponentType and OutputDevice enums
│   │   ├── defaults.js       COMPONENT_DEFS, generateId(), createDefaultChain()
│   │   ├── theme.js          CARD_THEMES_LIGHT / CARD_THEMES_DARK color maps
│   │   └── tooltips.js       MECHANISM_TOOLTIPS, OUTPUT_TOOLTIPS (educational content)
│   │
│   ├── engine/              Pure computation (zero UI dependencies)
│   │   ├── compute.js        Main kinematics pipeline: ratios, encoder, travel, torque, speed, inertia
│   │   └── helpers.js        stageRatio, stageEfficiency, chain queries, getBadgeText, num()
│   │
│   ├── formatters/          Display format builders
│   │   ├── latexBuilder.js   KaTeX equation sections with color-coded variables
│   │   ├── tableBuilder.js   HTML formula table rows with color-coded spans
│   │   └── numberFormat.js   formatNumber() — safe numeric display
│   │
│   ├── export/              PDF report generation
│   │   ├── buildPdfReport.js  Full pipeline: HTML → KaTeX → html2canvas → jsPDF → download
│   │   ├── pdfStyles.js       CSS string for off-screen PDF DOM
│   │   └── triggerDownload.js  Cross-browser blob download with fallback
│   │
│   ├── hooks/               Custom React hooks
│   │   ├── useChain.js        Chain CRUD: add, update, remove, duplicate components
│   │   ├── useDragDrop.js     Card reorder + palette insertion with constraint validation
│   │   └── useTheme.js        Dark/light theme with localStorage persistence
│   │
│   ├── components/
│   │   ├── header/           App header, branding, export button, theme toggle
│   │   ├── chain/            Chain builder: canvas, palette, mode bar
│   │   ├── card/             Component cards with per-type field inputs
│   │   │   └── fields/       ServoFields, GearboxFields, GearMeshFields, BeltPulleyFields,
│   │   │                     RackPinionFields, LeadscrewFields, LoadCoupling
│   │   ├── dashboard/        Results display with animated odometer values
│   │   ├── calcpath/         Tabbed equation (KaTeX) and table views
│   │   └── ui/               Shared primitives: NumberInput, Connector, KatexBlock,
│   │                         ThemeToggle, OdometerValue, Toast, Tooltip
│   │
│   ├── icons/               SVG React components and markup strings
│   │   ├── Logo.jsx           LogoIcon, Logotype, LOGO_SVG_MARKUP
│   │   ├── Watermarks.jsx     Per-type background watermark SVGs
│   │   └── ComponentIcons.jsx  Per-type small colored icons
│   │
│   └── styles/              CSS design system
│       ├── variables.css      Design tokens (colors, spacing, typography)
│       ├── global.css         Body and root element styles
│       └── reset.css          CSS reset / normalization
│
├── dist/                    Production build output (generated)
├── package.json             Dependencies and scripts
├── package-lock.json        Lockfile (lockfileVersion 3)
├── vite.config.js           Vite + React plugin + Babel/React Compiler
├── eslint.config.js         ESLint 9 flat config
├── index.html               HTML shell (Google Fonts, mount point)
└── .gitignore               Standard ignores
```

---

## Architecture

### Module Dependency Graph

```
config  ←——  Foundation: types, defaults, themes, tooltips
  ↑
engine  ←——  Pure math: compute(), helpers (no UI imports)
  ↑
formatters ← Display transforms: LaTeX, tables, number formatting
  ↑
export  ←——  PDF pipeline (uses formatters + icons + config)
  ↑
hooks   ←——  Stateful React logic (uses config)
  ↑
components ← UI layer (consumes everything above)
```

Lower layers never import from higher layers.

### Data Flow

```
User Input  →  Card fields  →  useChain.update()  →  chain[] state
                                                          │
                              compute(chain, mode, lin, loadInertia)
                                                          │
                                                     results{}
                                                     ╱        ╲
                                              Dashboard    Formatters
                                              (display)   ╱          ╲
                                                  latexSections   formulaLines
                                                       │              │
                                                  EquationView   TableView
                                                       │              │
                                                  buildPdfReport (captures both)
```

### Supported Mechanism Types

| Type | Engine Key | Ratio Formula |
|------|-----------|---------------|
| Servo Motor | `SERVO` | — (source of motion) |
| Gearbox | `GEARBOX` | `ratioNum / ratioDen` |
| Gear Mesh | `GEAR_MESH` | `drivenTeeth / drivingTeeth` |
| Belt / Pulley | `BELT_PULLEY` | teeth ratio or diameter ratio (modal) |
| Rack & Pinion | `RACK_PINION` | Terminal linear: `pitch × teeth` per rev |
| Leadscrew | `LEADSCREW` | Terminal linear: `lead` per rev |

### Computation Pipeline (engine/compute.js)

The `compute()` function processes the chain in one pass:

1. **Stage accumulation** — multiply all stage ratios and efficiencies
2. **Encoder math** — PPR × 4 (quadrature) × total ratio = counts/load-rev
3. **Travel derivation** — distance per load revolution from terminal mechanism or coupling
4. **Resolution** — units/motor-rev, units/count
5. **Speed** — output RPM = motor RPM / ratio; linear speed = RPM × travel
6. **Torque** — rated torque × ratio × efficiency
7. **Inertia** — reflected inertia = J_load / N² (UI currently hidden)

---

## Component Types — Detailed Reference

### Servo Motor
The motion source. Provides encoder PPR, rated torque (Nm), and rated speed (RPM). Always the first element in the chain; cannot be reordered or deleted if it's the only servo.

### Gearbox
Simple ratio stage. Numerator:Denominator input (e.g., 10:1). Default efficiency: 95%.

### Gear Mesh
Tooth-count ratio. Driving teeth / driven teeth. Default efficiency: 98%.

### Belt / Pulley
Dual-mode input: by tooth count or by pulley diameter. Switches via `bpMode` toggle. Default efficiency: 97%.

### Rack & Pinion
Terminal linear output. Converts rotation to linear travel via `pitch × teeth`. Forces linear output mode when placed last. Supports imperial (in) or metric (mm) units. Default efficiency: 96%.

### Leadscrew
Terminal linear output. Converts rotation to linear travel via the lead value (distance per revolution). Forces linear output mode when placed last. Default efficiency: 90%.

### Load Coupling (virtual)
Not a chain stage — appears on the last rotary stage when linear output mode is manually selected. Configures the output device (sprocket or direct wheel) for computing linear travel.

---

## Output Values

| Output | Key | Unit | Description |
|--------|-----|------|-------------|
| Motor Rev / Load Rev | `mrl` | — | How many motor turns per one load turn |
| Counts / Motor Rev | `cpm` | counts | PPR × 4 (quadrature encoding) |
| Counts / Load Rev | `cpl` | counts | Full resolution at the load |
| Distance / Load Rev | `dpl` | in, mm, or deg | Travel per complete load revolution |
| Units / Motor Rev | `upm` | varies | Travel per single motor revolution |
| Units / Count | `upc` | varies | Position resolution per encoder count |
| Output Torque | `tq` | Nm | Rated torque × ratio × efficiency |
| Output RPM | `oRPM` | RPM | Motor RPM / total ratio |
| Output Linear Speed | `oSpd` | units/min | RPM × distance per load rev |
| Total Gear Ratio | `tr` | :1 | Product of all stage ratios |
| Combined Efficiency | `te` | % | Product of all stage efficiencies |

---

## Key Features

- **Interactive chain builder** — drag-and-drop card reordering and palette insertion
- **Real-time computation** — results update instantly as parameters change
- **Dual calculation view** — KaTeX equations and formula table with color-coded variables
- **PDF export** — multi-page report with chain diagram, results, equations, and table (Ctrl/Cmd+S shortcut)
- **Dark/light theme** — persisted to localStorage
- **Educational tooltips** — hover any mechanism or result for an explanation with math
- **Animated values** — odometer-style digit transitions on result changes
- **Terminal linear enforcement** — rack & pinion and leadscrew automatically force linear output mode and must be the last stage
- **Auto-scaling canvas** — chain cards scale to fit the viewport width

---

## Environment Migration Guide

### Prerequisites

- **Node.js** ≥ 18 (recommended: latest LTS)
- **npm** ≥ 9

### Steps to Set Up in a New Environment

1. **Copy the project** (or clone if using git):
   ```bash
   # Copy these directories and files:
   # src/, public/, docs/, package.json, package-lock.json,
   # vite.config.js, eslint.config.js, index.html, .gitignore
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   # Uses package-lock.json for exact reproducible installs
   # If lock file issues occur: npm install
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Verify the build:**
   ```bash
   npm run build && npm run preview
   ```

### What NOT to Copy

- `node_modules/` — regenerated by `npm install`
- `dist/` — regenerated by `npm run build`

### Potential Issues

| Issue | Fix |
|-------|-----|
| `package-lock.json` root name mismatch (`motioncalc` vs `ratiolab`) | Cosmetic only; does not affect functionality |
| Node version too old | Vite 8 requires Node ≥ 18 |
| Google Fonts not loading offline | Fonts loaded via CDN `<link>` in `index.html`; will fall back to system fonts |
| PDF export blank | Requires `html2canvas` access to rendered DOM; fails in SSR or headless contexts |

---

## Documentation Map

Every `src/` subdirectory contains a `DOCS.md` with detailed function-level documentation:

| Path | Covers |
|------|--------|
| [`src/DOCS.md`](src/DOCS.md) | App entry points, module architecture, data flow |
| [`src/engine/DOCS.md`](src/engine/DOCS.md) | `compute()` algorithm, helpers, return shape |
| [`src/config/DOCS.md`](src/config/DOCS.md) | Type system, defaults, themes, tooltips |
| [`src/formatters/DOCS.md`](src/formatters/DOCS.md) | LaTeX builder, table builder, number formatting |
| [`src/export/DOCS.md`](src/export/DOCS.md) | PDF pipeline, canvas capture, download |
| [`src/hooks/DOCS.md`](src/hooks/DOCS.md) | useChain, useDragDrop, useTheme |
| [`src/components/DOCS.md`](src/components/DOCS.md) | All UI components by feature area |
| [`src/icons/DOCS.md`](src/icons/DOCS.md) | Logo, watermarks, component icons |
| [`src/styles/DOCS.md`](src/styles/DOCS.md) | CSS architecture and design tokens |
| [`docs/archive/README.md`](docs/archive/README.md) | Index of archived development documents |

---

## Known Technical Debt

These items are inherited from the refactoring process and documented for awareness:

1. **Connector gradient ID** — the SVG gradient `id="cg"` in `Connector.jsx` is not unique per instance; multiple connectors share the same gradient definition (works but is technically incorrect SVG)
2. **`dangerouslySetInnerHTML`** — used in `TableView.jsx` for color-coded formula values; the content is fully generated internally (not user-supplied), but a migration to React elements would be cleaner
3. **Inertia UI hidden** — inertia ratio computation exists in `compute.js` and return values are populated, but the UI display is commented out in `Dashboard.jsx` and `buildPdfReport.js`
4. **No test suite** — no unit or integration tests; recommended to add tests for `compute.js` and `helpers.js` as a priority
5. **No TypeScript** — JSDoc or TS migration would improve IDE support and catch type errors

---

## File Inventory

**95 project-owned files** (excluding `node_modules`):

- **Root config:** 7 files (package.json, vite.config.js, eslint.config.js, index.html, .gitignore, README.md, package-lock.json)
- **Public assets:** 2 files (favicon.svg, icons.svg)
- **Source code:** 74 files across 14 directories
  - 56 JavaScript/JSX modules
  - 12 CSS files
  - 6 barrel index.js files
- **Documentation:** 12 files (this README + 9 DOCS.md + archive index + 2 archived docs + 1 archived snapshot)
