# RatioLab Refactor Handoff

## Purpose

This document explains the full refactor I completed so the next model can focus on bug fixing quickly without re-discovering architecture changes.

## Original Request

User asked to "perform the refactor plan" based on:

- `src/REFACTOR_PLAN.md`
- `src/App.jsx`
- `src/main.jsx`
- `src/index.css`
- `src/App.css`

The plan described migrating from a monolithic `App.jsx` + `App.css` to modular folders for config, engine, formatters, export, components, hooks, and styles.

## What I Implemented

I executed the plan end-to-end and rewired the app to the new architecture.

### 1) Config extraction

Created:

- `src/config/types.js`
- `src/config/theme.js`
- `src/config/defaults.js`
- `src/config/index.js`

Moved/renamed constants:

- `T` -> `ComponentType`
- `OD` -> `OutputDevice`
- `CT` -> `CARD_THEMES_LIGHT`
- `CTD` -> `CARD_THEMES_DARK`
- `DEFS` -> `COMPONENT_DEFS`
- `uid()` -> `generateId()`
- `defChain()` -> `createDefaultChain()`

### 2) Icons extraction

Created:

- `src/icons/ComponentIcons.jsx`
- `src/icons/Watermarks.jsx`
- `src/icons/index.js`

Moved:

- `IC` -> `COMPONENT_ICONS`
- `WM` -> `WATERMARKS`

### 3) Computation engine extraction

Created:

- `src/engine/helpers.js`
- `src/engine/compute.js`
- `src/engine/index.js`

Moved/renamed helpers:

- `n` -> `num`
- `sr` -> `stageRatio`
- `se` -> `stageEfficiency`
- `lastRP` -> `isLastRackPinion`
- `anyRP` -> `hasRackPinion`
- `badge` -> `getBadgeText`

Main compute stays as `compute`.

### 4) Formatter extraction

Created:

- `src/formatters/latexBuilder.js`
- `src/formatters/tableBuilder.js`
- `src/formatters/numberFormat.js`
- `src/formatters/index.js`

Moved/renamed:

- `VC` -> `VARIABLE_COLORS`
- `vp` -> `colorPill`
- `buildLatex` -> `buildLatexFlat`
- `vt` -> `variableTag`
- `buildLines` -> `buildFormulaLines`
- inline `fmt` -> `formatNumber`

### 5) PDF export extraction

Created:

- `src/export/triggerDownload.js`
- `src/export/pdfStyles.js`
- `src/export/buildPdfReport.js`
- `src/export/index.js`

Moved PDF logic out of `App.jsx`, keeping behavior and API equivalent.

### 6) UI primitives extraction

Created:

- `src/components/ui/NumberInput.jsx`
- `src/components/ui/NumberInput.css`
- `src/components/ui/Connector.jsx`
- `src/components/ui/Connector.css`
- `src/components/ui/KatexBlock.jsx`
- `src/components/ui/ThemeToggle.jsx`
- `src/components/ui/ThemeToggle.css`
- `src/components/ui/index.js`

### 7) Card system extraction

Created:

- `src/components/card/Card.jsx`
- `src/components/card/Card.css`
- `src/components/card/fields/ServoFields.jsx`
- `src/components/card/fields/GearboxFields.jsx`
- `src/components/card/fields/GearMeshFields.jsx`
- `src/components/card/fields/BeltPulleyFields.jsx`
- `src/components/card/fields/RackPinionFields.jsx`
- `src/components/card/fields/LoadCoupling.jsx`
- `src/components/card/fields/index.js`
- `src/components/card/index.js`

### 8) Chain/dashboard/calc/header extraction

Created:

- `src/components/chain/Palette.jsx`
- `src/components/chain/Palette.css`
- `src/components/chain/ModeBar.jsx`
- `src/components/chain/ModeBar.css`
- `src/components/chain/ChainCanvas.jsx`
- `src/components/chain/ChainCanvas.css`
- `src/components/chain/index.js`
- `src/components/dashboard/ResultItem.jsx`
- `src/components/dashboard/Dashboard.jsx`
- `src/components/dashboard/Dashboard.css`
- `src/components/dashboard/index.js`
- `src/components/calcpath/TableView.jsx`
- `src/components/calcpath/EquationView.jsx`
- `src/components/calcpath/CalcPath.jsx`
- `src/components/calcpath/CalcPath.css`
- `src/components/calcpath/index.js`
- `src/components/header/Header.jsx`
- `src/components/header/Header.css`
- `src/components/header/index.js`

### 9) Hooks extraction

Created:

- `src/hooks/useChain.js`
- `src/hooks/useDragDrop.js`
- `src/hooks/useTheme.js`

### 10) App shell rewrite

Rebuilt:

- `src/App.jsx`

Now acts as orchestrator only:

- theme state via `useTheme`
- chain CRUD via `useChain`
- drag/drop via `useDragDrop`
- compute + formatters via `useMemo`
- render composition using extracted components

### 11) CSS decomposition

Created:

- `src/styles/variables.css`
- `src/styles/reset.css`
- `src/styles/global.css`

Updated:

- `src/index.css` now imports `reset.css`
- `src/App.css` reduced to `.app` shell style

## Validation Performed

I ran:

- `npm run lint` -> passed
- `npm run build` -> passed

Build shows a Vite chunk size warning (non-blocking), same type of issue often expected with KaTeX/jsPDF/html2canvas bundles.

## Important Notes For Next Model

### 1) Behavior parity target

The goal was structure refactor with no intended feature changes.

### 2) Areas most likely to hide regressions

If bugs appear, prioritize these files:

- `src/hooks/useChain.js`
  - Naming and auto-numbering logic for added components
  - Duplicate insertion behavior
- `src/hooks/useDragDrop.js`
  - Drag index bookkeeping and reordering edge cases
- `src/components/chain/ChainCanvas.jsx`
  - Auto-scale logic and palette drop behavior
- `src/export/buildPdfReport.js`
  - HTML generation and KaTeX injection
  - multipage canvas slicing
- `src/components/card/Card.jsx` + field components
  - Controlled input updates and conditional sections
- `src/formatters/tableBuilder.js` and `src/formatters/latexBuilder.js`
  - Formula rendering consistency with old output

### 3) Known technical debt still present

- Connector uses static SVG gradient id `cg` (same as before).
- `dangerouslySetInnerHTML` is still used (watermarks/table/PDF HTML), but values are app-generated.
- Large bundle warning remains.
- Optional class-name expansion phase from plan was NOT performed (short classes like `.cd`, `.fr`, etc. remain).

## Quick Bug-Fix Checklist

When debugging, run:

1. `npm run lint`
2. `npm run build`
3. `npm run dev`

Then manually verify:

1. Add/remove/duplicate/reorder stages
2. Rack & pinion forcing linear mode
3. Rotary vs linear mode toggle
4. Number input typing behavior while focused
5. Dashboard values update correctly with each field change
6. Table and Equation tabs both render
7. PDF export succeeds and includes sections/formulas

## File Inventory Added In This Refactor

All new files introduced:

- `src/config/types.js`
- `src/config/theme.js`
- `src/config/defaults.js`
- `src/config/index.js`
- `src/icons/ComponentIcons.jsx`
- `src/icons/Watermarks.jsx`
- `src/icons/index.js`
- `src/engine/helpers.js`
- `src/engine/compute.js`
- `src/engine/index.js`
- `src/formatters/latexBuilder.js`
- `src/formatters/tableBuilder.js`
- `src/formatters/numberFormat.js`
- `src/formatters/index.js`
- `src/export/triggerDownload.js`
- `src/export/pdfStyles.js`
- `src/export/buildPdfReport.js`
- `src/export/index.js`
- `src/components/ui/NumberInput.jsx`
- `src/components/ui/NumberInput.css`
- `src/components/ui/Connector.jsx`
- `src/components/ui/Connector.css`
- `src/components/ui/KatexBlock.jsx`
- `src/components/ui/ThemeToggle.jsx`
- `src/components/ui/ThemeToggle.css`
- `src/components/ui/index.js`
- `src/components/card/Card.jsx`
- `src/components/card/Card.css`
- `src/components/card/fields/ServoFields.jsx`
- `src/components/card/fields/GearboxFields.jsx`
- `src/components/card/fields/GearMeshFields.jsx`
- `src/components/card/fields/BeltPulleyFields.jsx`
- `src/components/card/fields/RackPinionFields.jsx`
- `src/components/card/fields/LoadCoupling.jsx`
- `src/components/card/fields/index.js`
- `src/components/card/index.js`
- `src/components/chain/Palette.jsx`
- `src/components/chain/Palette.css`
- `src/components/chain/ModeBar.jsx`
- `src/components/chain/ModeBar.css`
- `src/components/chain/ChainCanvas.jsx`
- `src/components/chain/ChainCanvas.css`
- `src/components/chain/index.js`
- `src/components/dashboard/ResultItem.jsx`
- `src/components/dashboard/Dashboard.jsx`
- `src/components/dashboard/Dashboard.css`
- `src/components/dashboard/index.js`
- `src/components/calcpath/TableView.jsx`
- `src/components/calcpath/EquationView.jsx`
- `src/components/calcpath/CalcPath.jsx`
- `src/components/calcpath/CalcPath.css`
- `src/components/calcpath/index.js`
- `src/components/header/Header.jsx`
- `src/components/header/Header.css`
- `src/components/header/index.js`
- `src/hooks/useChain.js`
- `src/hooks/useDragDrop.js`
- `src/hooks/useTheme.js`
- `src/styles/variables.css`
- `src/styles/reset.css`
- `src/styles/global.css`
- `MODEL_HANDOFF.md`

## Files Updated

- `src/App.jsx`
- `src/App.css`
- `src/index.css`

## Final Status

Refactor plan is implemented and project is compiling/linting. Next model should focus on behavioral regressions and UX edge cases rather than architecture setup.
