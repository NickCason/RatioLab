# icons/

SVG-based React icon components and markup strings. Provides the visual identity for component types and the app branding.

## Files

### `Logo.jsx`

#### `LogoIcon({ size = 28 })`
The RatioLab app icon — a gradient rounded rectangle with gear-like circles. Rendered as inline SVG.

#### `LOGO_SVG_MARKUP`
String copy of the logo SVG markup for use in HTML string contexts (PDF report header/footer).

#### `Logotype({ size = 28 })`
Combined logo icon + "RatioLab" text, with the name split as "Ratio" + "Lab" for styling.

---

### `Watermarks.jsx`

#### `WATERMARKS`
Map of `ComponentType` → SVG markup string. Each is a subtle background watermark icon rendered behind the card content (gear shapes, motor symbols, etc.). Used both in the live UI cards and in the PDF report.

---

### `ComponentIcons.jsx`

#### `COMPONENT_ICONS`
Map of `ComponentType` → `function(color) → JSX`. Returns small colored SVG icons for each mechanism type, used in the palette buttons, card headers, and mode bar.

---

### `index.js`
Barrel re-export of `ComponentIcons`, `Watermarks`, and `Logo`.
