# components/

All React UI components, organized by feature area. Each subdirectory groups related components with their styles and a barrel `index.js`.

## Directory Map

```
components/
├── calcpath/    — Calculation path display (equations + table tabs)
├── card/        — Individual chain component cards
│   └── fields/  — Per-mechanism-type input field sets
├── chain/       — Interactive chain builder (canvas, palette, mode bar)
├── dashboard/   — Results dashboard
├── header/      — App header and branding
└── ui/          — Shared UI primitives
```

---

## calcpath/

Tabbed view showing the calculation derivation in two formats.

### `CalcPath.jsx`
**`CalcPath({ formulaLines, latexSections, calcTab, onSetCalcTab })`**
Tab container with two modes: "Equations" (KaTeX) and "Table" (HTML rows). Switches rendered child based on `calcTab` state.

### `EquationView.jsx`
**`EquationView({ latexSections })`**
Maps `latexSections` array to titled `KatexBlock` components. Each section displays a titled group of rendered LaTeX equations.

### `TableView.jsx`
**`TableView({ formulaLines })`**
Groups formula lines by `{ section }` markers into titled sections, then renders rows as label / method / value columns. Uses `dangerouslySetInnerHTML` for rows flagged `raw` (containing color-coded HTML spans).

---

## card/

### `Card.jsx`
**`Card({ comp, index, isLast, outputMode, lin, onLin, onUp, onDel, onDup, onDS, onDE, onDO, onDr, isDg, isDov, dark, collapsed, onToggle, hideTermDup })`**

The primary component card shell. Renders:
- Themed background with SVG watermark
- Mechanism tooltip ribbon (educational hover content)
- Component icon and type label
- Editable name field
- Collapse/expand toggle
- Duplicate and delete buttons
- Type-specific input fields (delegated to `fields/` components)
- Badge text showing current ratio/travel config
- `LoadCoupling` (shown on last non-terminal stage in linear mode)

Internal helper `set(key, value)` dispatches updates via `onUp(comp.id, { [key]: value })`.

### fields/

Per-mechanism-type form input components. All share the signature `({ comp, onUpdate, theme })`.

| Component | Inputs Rendered |
|-----------|-----------------|
| `ServoFields` | Encoder PPR, rated torque (Nm), rated speed (RPM) |
| `GearboxFields` | Ratio numerator/denominator, efficiency % |
| `GearMeshFields` | Driving/driven teeth count, efficiency % |
| `BeltPulleyFields` | Mode toggle (teeth vs diameter), conditional teeth or diameter inputs, efficiency % |
| `RackPinionFields` | Pinion teeth, pitch, unit toggle (in/mm), efficiency % |
| `LeadscrewFields` | Lead value, unit toggle (in/mm), efficiency % |
| `LoadCoupling` | Output device select (sprocket/wheel), sprocket pitch+teeth or wheel diameter, unit toggle |

`LoadCoupling` receives `({ lin, onLinChange, theme })` — it manages the linear output coupling parameters independently from the chain stages.

---

## chain/

Interactive chain builder workspace.

### `ChainCanvas.jsx`
**`ChainCanvas({ chain, dark, lastIdx, effectiveMode, lin, setLin, update, remove, duplicate, onDragStart, onDragEnd, onDragOver, onDrop, dragIdx, dragOverIdx, dropOn, setDropOn, add, addAt, collapsed, toggleCol, paletteType, paletteInsertIdx, setPaletteInsertIdx, termLinIdx, hasTermLinear })`**

The central workspace rendering the card chain. Features:
- Hidden measurement row for auto-scaling cards to fit container width
- Visible row with CSS `transform: scale()` applied via `useEffect`
- `Connector` arrows between cards
- Drag-and-drop card reordering
- `DropSlot` component for palette insertion before terminal linear stages
- Palette drag-over appends new components

**Internal:** `DropSlot({ index, ... })` — drop zone UI with valid/invalid/hover states for inserting palette items at a specific position.

### `ModeBar.jsx`
**`ModeBar({ mode, onSetMode, isLinearForced, chain, dark })`**
Output mode selector. When a terminal linear stage forces linear mode, shows an informational label. Otherwise presents rotary/linear toggle buttons.

### `Palette.jsx`
**`Palette({ hasTerminalLinear, dark, onAdd, onPaletteDragStart, onPaletteDragEnd })`**
Component type buttons for adding stages to the chain. Each button is also draggable for insert-at-position. Disables adding extra terminal linears when one already exists. Shows a "drag to insert" hint in that case.

**Internal:** `isTermType(type)` — checks if type is rack/pinion or leadscrew.

---

## dashboard/

### `Dashboard.jsx`
**`Dashboard({ results, formatNumber, exporting })`**
Results display panel. Groups outputs into:
- **Encoder & Resolution** — motor rev/load rev, counts/load rev, units/motor rev, units/count, distance/load rev
- **Torque & Speed** — output torque, shaft speed, linear speed, gear ratio, efficiency

Each value rendered as a `ResultItem`. Applies shimmer animation during PDF export. Returns `null` when no results are available.

### `ResultItem.jsx`
**`ResultItem({ label, value, unit, color, variant, extraClass, shimmer, tip, children })`**
Single result display with animated `OdometerValue`, optional unit label, optional `Tooltip` from `tip` prop (for educational hover content), and optional children slot.

---

## header/

### `Header.jsx`
**`Header({ results, exporting, onExport, dark, onToggleTheme })`**
Top-level app header. Contains:
- `Logotype` (logo + "RatioLab" text)
- Subtitle ("Servo Scaling Calculator")
- Export PDF button (disabled during export, shows spinner; disabled when no results)
- `ThemeToggle` component
- Ctrl+S keyboard hint on the export button

---

## ui/

Shared UI building blocks used across the application.

### `NumberInput.jsx`
**`NumberInput({ value, onChange, width, step, min, max, theme })`**
Controlled numeric input with local string state while focused. Parses float on change and passes empty string for incomplete input.

### `Connector.jsx`
**`Connector({ dark })`**
SVG dashed animated line with arrowhead, used between chain cards to show flow direction.

### `KatexBlock.jsx`
**`KatexBlock({ tex })`**
Renders a KaTeX equation block. Wraps content in `\begin{gathered}...\end{gathered}`. Falls back to plain text on render error.

### `ThemeToggle.jsx`
**`ThemeToggle({ dark, onToggle })`**
Light/dark mode switch UI element.

### `OdometerValue.jsx`
**`OdometerValue({ value })`**
Animated digit display. Splits a formatted string into individual character drums that animate via CSS `translateY` transitions. Uses staggered timing via double `requestAnimationFrame`. Contains constant `DIGITS = "0123456789"`.

### `Toast.jsx`
**`Toast({ message, onDismiss })`**
Auto-dismissing notification. Shows for ~3.5 seconds with enter/exit CSS transitions. Calls `onDismiss` after the exit animation completes.

### `Tooltip.jsx`
**`Tooltip({ content, children, position })`**
Portal-rendered tooltip panel on hover/focus. Supports:
- String content (plain text)
- Object content: `{ title, description, math[] }` with KaTeX math lines
- Auto-positioning above/below with viewport flip
- Show/hide delays for smooth UX

**Internal:** `getAppRoot()` — returns `.app` element or `document.body` for portal mounting. `MiniKatex({ tex })` — inline KaTeX renderer for math array items.
