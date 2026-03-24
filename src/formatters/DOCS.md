# formatters/

Transforms computation results into display-ready formats: KaTeX equations, HTML formula tables, and formatted numbers. These modules sit between the engine and the UI/PDF layers.

## Files

### `latexBuilder.js`

Builds KaTeX math markup for the equation view and PDF report.

#### `VARIABLE_COLORS`
Color map for semantic variable categories used in color-coded KaTeX pills:
| Key | Purpose | Color |
|-----|---------|-------|
| `ratio` | Gear ratio values | Blue |
| `eff` | Efficiency values | Green |
| `travel` | Distance/travel values | Purple |
| `mrl` | Motor-rev-per-load-rev | Orange |
| `speed` | Speed values | Blue |
| `enc` | Encoder/count values | Brown |

#### `colorPill(varColor, content) → string`
Wraps a value in a `\colorbox`/`\color` LaTeX fragment for styled display.

#### `buildLatexSections(chain, outputMode, linearConfig, results) → Array<{ title, tex }>`
Generates an array of titled LaTeX section objects:
1. **Encoder & Resolution** — PPR, counts/motor-rev, counts/load-rev
2. **Total Gear Ratio** — Annotated fraction chain with stage labels
3. **Combined Efficiency** — Product of stage efficiencies
4. **Travel per Revolution** — Distance per load rev and per motor rev
5. **Output Torque** — τ_motor × N × η
6. **Output Speed** — RPM and linear speed (when applicable)

#### `buildLatexFlat(chain, outputMode, linearConfig, results) → string`
Joins all sections into a single LaTeX string with bold titles and spacing. Used for flat rendering contexts.

---

### `tableBuilder.js`

Builds structured row data for the formula table view.

#### `variableTag(className, value) → string`
Returns an HTML `<span>` with CSS class `vp vp-{className}` for color-coded inline values.

#### `buildFormulaLines(chain, outputMode, linearConfig, results) → Array`
Returns an array of objects:
- **Section markers:** `{ section: "Title" }` — used by `TableView` to group rows
- **Data rows:** `{ l, m, v, raw }` where:
  - `l` — label (e.g. "Output Torque (τ_out)")
  - `m` — formula/method string
  - `v` — computed value (may contain HTML tags)
  - `raw` — boolean, `true` when `v`/`m` contain HTML requiring `dangerouslySetInnerHTML`

Sections mirror the LaTeX builder: Encoder & Resolution, Gear Ratio, Efficiency, Travel per Revolution, Torque & Speed.

---

### `numberFormat.js`

#### `formatNumber(value, digits = 4) → string`
Formats a numeric value for display:
- `null` / `NaN` → `"—"`
- Large integers → locale-formatted string
- Otherwise → `toFixed(digits)`

---

### `index.js`
Barrel re-export of `latexBuilder`, `tableBuilder`, and `numberFormat`.
