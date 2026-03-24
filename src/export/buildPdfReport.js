import katex from "katex";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ComponentType } from "../config";
import { getBadgeText } from "../engine";
import { LOGO_SVG_MARKUP } from "../icons/Logo";
import { WATERMARKS } from "../icons/Watermarks";
import { PDF_REPORT_STYLES } from "./pdfStyles";
import { triggerDownload } from "./triggerDownload";

function createSectionContainer(innerHtml) {
  const el = document.createElement("div");
  el.style.cssText = "position:fixed;left:-9999px;top:0;width:720px;background:#fff;padding:40px 44px 10px;z-index:-1;";
  el.innerHTML = `<style>${PDF_REPORT_STYLES}</style><div id="pr">${innerHtml}</div>`;
  return el;
}

async function captureCanvas(container) {
  const canvasPromise = html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    width: 720,
    windowWidth: 720,
    logging: false,
  });
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("html2canvas timed out")), 10000),
  );
  return Promise.race([canvasPromise, timeout]);
}

function renderCanvasToPages(canvas, pdf, margin, contentWidth, pageHeight, isFirstSection) {
  const ratio = contentWidth / canvas.width;
  const sliceHeight = (pageHeight - margin * 2) / ratio;
  let yOffset = 0;
  let slice = 0;

  while (yOffset < canvas.height) {
    const remaining = canvas.height - yOffset;
    if (slice > 0 && remaining < sliceHeight * 0.05) break;
    if (slice > 0 || !isFirstSection) pdf.addPage();
    const sourceHeight = Math.min(sliceHeight, remaining);
    const destHeight = sourceHeight * ratio;
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sourceHeight;
    sliceCanvas.getContext("2d").drawImage(canvas, 0, yOffset, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
    pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", margin, margin, contentWidth, destHeight);
    yOffset += sliceHeight;
    slice += 1;
  }
}

export async function buildPdfReport({
  chain,
  results,
  formulaLines,
  formatNumber,
  setExporting,
  latexSections,
}) {
  if (!results) return;
  setExporting(true);

  const safetyTimer = setTimeout(() => {
    setExporting(false);
  }, 15000);

  const stages = chain.filter((component) => component.type !== ComponentType.SERVO);
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const colors = {
    [ComponentType.SERVO]: { bg: "#D48A3A", label: "Servo Motor" },
    [ComponentType.GEARBOX]: { bg: "#4888C8", label: "Gearbox" },
    [ComponentType.GEAR_MESH]: { bg: "#4EA063", label: "Gear Mesh" },
    [ComponentType.BELT_PULLEY]: { bg: "#8E62A8", label: "Belt / Pulley" },
    [ComponentType.RACK_PINION]: { bg: "#C46848", label: "Rack & Pinion" },
    [ComponentType.LEADSCREW]: { bg: "#42A0AA", label: "Leadscrew" },
  };

  const CARDS_PER_ROW = 3;
  const CARD_W = 160;
  const ARROW_W = 28;
  const GAP = 6;
  const CARD_STEP = CARD_W + GAP + ARROW_W + GAP;
  const ARROW_STROKE = 'stroke="#b0b0b8" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const inlineArrow = `<div class="chain-arrow"><svg width="28" height="14" viewBox="0 0 28 14"><path d="M0 7h22" ${ARROW_STROKE}/><path d="M18 3l6 4-6 4" ${ARROW_STROKE}/></svg></div>`;

  function cardCenterX(index) {
    return index * CARD_STEP + CARD_W / 2;
  }

  function buildWrapSvg(topRowCardCount) {
    const sx = cardCenterX(topRowCardCount - 1);
    const ex = cardCenterX(0);
    const w = Math.max(sx, ex) + CARD_W / 2 + 2;
    let d;
    if (sx <= ex) {
      d = `M${sx} 0 V28`;
    } else {
      d = `M${sx} 0 V8 Q${sx} 14 ${sx - 6} 14 H${ex + 6} Q${ex} 14 ${ex} 20 V28`;
    }
    const chevron = `M${ex - 4} 23 L${ex} 28 L${ex + 4} 23`;
    return `<div class="chain-wrap"><svg width="${w}" height="28" viewBox="0 0 ${w} 28"><path d="${d}" ${ARROW_STROKE}/><path d="${chevron}" ${ARROW_STROKE}/></svg></div>`;
  }

  const cardHtmls = chain.map((component) => {
    const col = colors[component.type];
    let details = "";
    if (component.type === ComponentType.SERVO) {
      details = `<div class="cd-detail">PPR: ${component.encoderPPR} · ${component.ratedTorqueNm} Nm · ${component.ratedSpeedRPM} RPM</div>`;
    } else if (component.type === ComponentType.GEARBOX) {
      details = `<div class="cd-detail">Ratio: ${component.ratioNum}:${component.ratioDen} · Eff: ${component.efficiency}%</div>`;
    } else if (component.type === ComponentType.GEAR_MESH) {
      details = `<div class="cd-detail">${component.drivingTeeth}T / ${component.drivenTeeth}T · Eff: ${component.efficiency}%</div>`;
    } else if (component.type === ComponentType.BELT_PULLEY) {
      details =
        component.bpMode === "teeth"
          ? `<div class="cd-detail">${component.drivingTeeth}T / ${component.drivenTeeth}T · Eff: ${component.efficiency}%</div>`
          : `<div class="cd-detail">⌀${component.drivingDia} / ⌀${component.drivenDia} · Eff: ${component.efficiency}%</div>`;
    } else if (component.type === ComponentType.RACK_PINION) {
      details = `<div class="cd-detail">${component.pinionTeeth}T · Pitch: ${component.pinionPitch} ${component.rpUnit} · Eff: ${component.efficiency}%</div>`;
    } else if (component.type === ComponentType.LEADSCREW) {
      details = `<div class="cd-detail">Lead: ${component.lead} ${component.lsUnit}/rev · Eff: ${component.efficiency}%</div>`;
    }
    const badge = component.type !== ComponentType.SERVO ? `<div class="cd-badge">${getBadgeText(component)}</div>` : "";
    const wm = WATERMARKS[component.type] || "";
    return `<div class="chain-card" style="border-left:3px solid ${col.bg};box-shadow:0 2px 12px ${col.bg}22, 0 0 0 1px ${col.bg}18"><div class="cd-wm" style="color:${col.bg}">${wm}</div><div class="cd-type" style="color:${col.bg}">${col.label}</div><div class="cd-name">${component.name}</div>${details}${badge}</div>`;
  });

  const chainRows = [];
  for (let i = 0; i < cardHtmls.length; i += CARDS_PER_ROW) {
    chainRows.push(cardHtmls.slice(i, i + CARDS_PER_ROW));
  }
  const chainCards = chainRows
    .map((row, i) => {
      const rowHtml = `<div class="chain-row">${row.join(inlineArrow)}</div>`;
      if (i < chainRows.length - 1) return rowHtml + buildWrapSvg(row.length);
      return rowHtml;
    })
    .join("");

  /* INERTIA HIDDEN — uncomment to restore
  const irClass = results.jMotor > 0 ? (results.inertiaRatio <= 10 ? "good" : results.inertiaRatio <= 25 ? "warn" : "bad") : "";
  const irLabel = results.jMotor > 0 ? (results.inertiaRatio <= 10 ? "✓ Good" : results.inertiaRatio <= 25 ? "⚠ Marginal" : "✕ High") : "";
  */
  const formulaRows = formulaLines
    .filter((line) => line.l && line.m && line.v)
    .map((line) => `<tr><td class="fl-label">${line.l}</td><td class="fl-formula">${line.m}</td><td class="fl-value">= ${line.v}</td></tr>`)
    .join("");

  const footerHtml = `<div class="rf"><span class="rf-brand"><span class="rf-logo">${LOGO_SVG_MARKUP}</span>RatioLab</span><span>Generated ${dateStr} at ${timeStr}</span></div>`;
  const pageTagHtml = (label, pageNum) =>
    `<div class="pg-tag"><span>${label}</span><span>Page ${pageNum}</span></div>`;

  /* ── Section 1: Results (header + chain + dashboard cards) ── */
  const section1Html = `
    <div class="rh"><div class="rh-brand"><div class="rh-logo">${LOGO_SVG_MARKUP}</div><div><div class="rh-t">RatioLab</div><div class="rh-s">Servo Scaling Report</div></div></div><div class="rh-m">${dateStr}<br>${timeStr}<br>${chain.length} component${chain.length > 1 ? "s" : ""} · ${stages.length} stage${stages.length !== 1 ? "s" : ""}</div></div>
    <div class="sec"><div class="sl">Drive Train Configuration</div><div class="cw">${chainCards}</div></div>
    <div class="sec"><div class="sl">Encoder & Resolution</div><div class="rg">
      <div class="rt"><div class="rt-l">Motor Rev / Load Rev</div><div class="rt-v c-or">${formatNumber(results.mrl)}</div></div>
      <div class="rt"><div class="rt-l">Counts / Load Rev</div><div class="rt-v c-gr">${formatNumber(results.cpl, 0)}</div></div>
      <div class="rt"><div class="rt-l">${results.u} / Motor Rev</div><div class="rt-v c-bl">${formatNumber(results.upm, 6)}<span class="rt-u">${results.u}</span></div></div>
      <div class="rt"><div class="rt-l">${results.u} / Count</div><div class="rt-v c-pu">${formatNumber(results.upc, 8)}<span class="rt-u">${results.u}</span></div></div>
      <div class="rt"><div class="rt-l">${results.u} / Load Rev</div><div class="rt-v">${formatNumber(results.dpl, 6)}<span class="rt-u">${results.u}</span></div></div>
    </div></div>
    <div class="sec"><div class="sl">Torque & Speed</div><div class="rg">
      <div class="rt"><div class="rt-l">Output Torque (w/ eff.)</div><div class="rt-v c-or">${formatNumber(results.tq, 2)}<span class="rt-u">Nm</span></div></div>
      <div class="rt"><div class="rt-l">Output Shaft Speed</div><div class="rt-v c-bl">${formatNumber(results.oRPM, 2)}<span class="rt-u">RPM</span></div></div>
      ${results.u !== "deg" ? `<div class="rt"><div class="rt-l">Output Linear Speed</div><div class="rt-v c-pu">${formatNumber(results.oSpd, 2)}<span class="rt-u">${results.u}/min</span></div></div>` : ""}
      <div class="rt"><div class="rt-l">Total Gear Ratio</div><div class="rt-v">${formatNumber(results.tr)}<span class="rt-u">:1</span></div></div>
      <div class="rt"><div class="rt-l">Combined Efficiency</div><div class="rt-v" style="color:${results.te > 0.9 ? "#3d9952" : "#d44040"}">${formatNumber(results.te * 100, 1)}<span class="rt-u">%</span></div></div>
    </div></div>
    ${"" /* INERTIA HIDDEN — uncomment to restore:
      results.jMotor > 0
        ? `<div class="sec"><div class="sl">Inertia Matching</div><div class="rg">
      <div class="rt w2"><div class="rt-l">Inertia Ratio (J_load / J_motor)</div><div class="rt-v" style="color:${results.inertiaRatio <= 10 ? "#3d9952" : results.inertiaRatio <= 25 ? "#c89520" : "#d44040"}">${formatNumber(results.inertiaRatio, 2)}<span class="rt-u">:1</span></div><div class="rt-h ${irClass}">${irLabel}</div></div>
      <div class="rt"><div class="rt-l">Reflected Load Inertia</div><div class="rt-v">${formatNumber(results.jReflected, 4)}<span class="rt-u">kg·cm²</span></div></div>
    </div></div>`
        : ""
    */}
    ${pageTagHtml("Scaling Results", 1)}
    ${footerHtml}`;

  /* ── Section 2: Equations ── */
  const section2Html = `
    ${pageTagHtml("Calculation Path — Equations", 2)}
    <div class="sec"><div class="eq-sections">${
      latexSections.map((section, index) => `<div class="eq-b"><div class="eq-t">${section.title}</div><div class="kb" id="pdf-katex-${index}"></div></div>`).join('<hr class="eq-d"/>')
    }</div></div>
    ${footerHtml}`;

  /* ── Section 3: Table ── */
  const section3Html = `
    ${pageTagHtml("Calculation Path — Table", 3)}
    <div class="sec"><table class="ft">${formulaRows}</table></div>
    ${footerHtml}`;

  const container1 = createSectionContainer(section1Html);
  const container2 = createSectionContainer(section2Html);
  const container3 = createSectionContainer(section3Html);

  document.body.appendChild(container1);
  document.body.appendChild(container2);
  document.body.appendChild(container3);

  latexSections.forEach((section, index) => {
    const el = container2.querySelector(`#pdf-katex-${index}`);
    if (!el) return;
    try {
      katex.render(`\\begin{gathered}${section.tex}\\end{gathered}`, el, {
        displayMode: true,
        throwOnError: false,
        trust: true,
        strict: false,
      });
    } catch {
      el.textContent = section.tex;
    }
  });

  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 400));

  try {
    const [canvas1, canvas2, canvas3] = await Promise.all([
      captureCanvas(container1),
      captureCanvas(container2),
      captureCanvas(container3),
    ]);

    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 36;
    const contentWidth = pageWidth - margin * 2;

    renderCanvasToPages(canvas1, pdf, margin, contentWidth, pageHeight, true);
    renderCanvasToPages(canvas2, pdf, margin, contentWidth, pageHeight, false);
    renderCanvasToPages(canvas3, pdf, margin, contentWidth, pageHeight, false);

    const pdfBlob = pdf.output("blob");
    const ok = triggerDownload(pdfBlob, "ratiolab-report.pdf");
    if (!ok) {
      const dataUri = pdf.output("datauristring");
      const popup = window.open("");
      if (popup) popup.document.write(`<iframe width="100%" height="100%" src="${dataUri}"></iframe>`);
    }
  } catch (error) {
    console.error("PDF generation failed:", error);
  }

  [container1, container2, container3].forEach((c) => {
    try { document.body.removeChild(c); } catch { /* already removed */ }
  });
  clearTimeout(safetyTimer);
  setExporting(false);
}
