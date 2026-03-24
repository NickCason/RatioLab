# export/

PDF report generation pipeline. Assembles HTML sections off-screen, renders them with KaTeX, captures as canvas images via html2canvas, and assembles a multi-page PDF with jsPDF.

## Files

### `buildPdfReport.js`

The main PDF export orchestrator.

#### Internal Functions

**`createSectionContainer(innerHtml) → HTMLElement`**
Creates an off-screen `div` (positioned at `-9999px`) with the PDF stylesheet injected. Returns the container for DOM insertion.

**`captureCanvas(container) → Promise<Canvas>`**
Renders a DOM container to a canvas via `html2canvas` at 2× scale. Races against a 10-second timeout to prevent hangs.

**`renderCanvasToPages(canvas, pdf, margin, contentWidth, pageHeight, isFirstSection)`**
Slices a tall canvas into letter-sized page segments and adds each as a PNG image to the jsPDF document. Handles page breaks and avoids tiny trailing slices (< 5% of page height).

**`cardCenterX(index) → number`**
Calculates the horizontal center position of a chain card at a given index for the PDF layout grid.

**`buildWrapSvg(topRowCardCount) → string`**
Generates an SVG connector arrow that wraps from the end of one row to the start of the next in the chain visualization.

#### Exported Function

**`buildPdfReport({ chain, results, formulaLines, formatNumber, setExporting, latexSections }) → Promise<void>`**

Full PDF generation flow:
1. Sets `exporting` state (triggers UI shimmer)
2. Starts a 15-second safety timer to auto-reset export state
3. Builds three HTML sections:
   - **Section 1:** Header, chain card visualization, results dashboard
   - **Section 2:** KaTeX equation view (renders LaTeX into placeholder elements)
   - **Section 3:** Formula table
4. Appends all three to `document.body` (hidden)
5. Renders KaTeX into Section 2 placeholders
6. Captures all three as canvases in parallel
7. Builds multi-page PDF using `jsPDF` (letter format, portrait)
8. Downloads via `triggerDownload` with `createObjectURL` fallback
9. Cleans up DOM containers and resets export state

**Layout constants:** `CARDS_PER_ROW = 3`, `CARD_W = 160`, `ARROW_W = 28`, `GAP = 6`

---

### `pdfStyles.js`

#### `PDF_REPORT_STYLES`
A single CSS string that styles the `#pr` PDF DOM container. Covers:
- Report header and branding
- Chain card layout and colors
- Results grid
- Formula table
- Equation sections
- Footer with logo
- Page tags

---

### `triggerDownload.js`

#### `triggerDownload(blob, filename) → boolean`
Cross-browser file download:
1. Creates an `<a>` element with `URL.createObjectURL` and triggers click
2. Falls back to `FileReader.readAsDataURL` if `createObjectURL` is unavailable
3. Returns `true` on success, `false` on failure

---

### `index.js`
Barrel re-export of `triggerDownload`, `pdfStyles`, and `buildPdfReport`.
