# src/ — Application Source

Root of all application code for RatioLab. Organized into feature-based modules with clear dependency boundaries.

## Entry Points

### `main.jsx`
Application bootstrap. Creates the React root with `StrictMode` and mounts `<App />`. Imports `index.css` (minimal reset entry).

### `App.jsx`
Root composition component — the orchestrator. Wires together all hooks, state, and child components.

**State managed:**
| State | Purpose |
|-------|---------|
| `dark` / `toggleTheme` | Theme (via `useTheme`) |
| `chain` / CRUD methods | Motion chain data (via `useChain`) |
| `mode` | Output mode: `"rotary"` or `"linear"` |
| `lin` | Linear coupling config: `{ device, pitch, teeth, diameter, unit }` |
| `collapsed` | Map of card ID → collapsed boolean |
| `calcTab` | Active calc path tab: `"katex"` or `"table"` |
| `exporting` | Boolean — PDF generation in progress |
| `toast` | Notification message string or null |

**Derived values (memoized):**
- `hasTermLinear` — whether chain contains terminal linear stage
- `isLinearForced` — whether terminal linear forces linear output mode
- `effectiveMode` — resolved output mode
- `results` — full compute output from `compute()`
- `formulaLines` — table row data from `buildFormulaLines()`
- `latexSections` — KaTeX section data from `buildLatexSections()`

**Keyboard shortcut:** `Ctrl/Cmd+S` triggers PDF export.

**Render tree:**
```
<div.app data-theme>
  <Header />
  <Palette />
  <ModeBar />
  <ChainCanvas />
  <Dashboard />
  <CalcPath />
  <Toast />    (conditional)
</div>
```

### `App.css`
Layout styles for the root app container and primary layout grid.

### `index.css`
Minimal entry-point CSS (1 line), exists for Vite's CSS injection order.

## Module Architecture

```
config/      ← type constants, defaults, themes, tooltips
    ↓
engine/      ← pure computation (no UI deps)
    ↓
formatters/  ← LaTeX + table + number formatting (uses engine types)
    ↓
export/      ← PDF generation (uses formatters + icons + config)
    ↓
hooks/       ← stateful React logic (uses config)
    ↓
components/  ← UI components (use everything above)
    ↓
icons/       ← SVG assets (standalone, used by components + export)
    ↓
styles/      ← CSS design system (standalone)
```

**Dependency rule:** Lower layers never import from higher layers. `config` is the foundation; `components` sits at the top.

## Data Flow

```
User Input → Card fields → useChain.update() → chain state
                                                    ↓
                                              compute(chain, mode, lin, loadInertia)
                                                    ↓
                                              results object
                                              ↙          ↘
                                    Dashboard            formatters
                                   (display)          ↙           ↘
                                              latexSections    formulaLines
                                                   ↓               ↓
                                             EquationView     TableView
                                                   ↓               ↓
                                              buildPdfReport (uses both)
```
