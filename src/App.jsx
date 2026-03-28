import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import "./styles/variables.css";
import "./styles/global.css";
import { ComponentType, OutputDevice } from "./config";
import { compute, hasTerminalLinear, isLastTerminalLinear, num } from "./engine";
import { buildFormulaLines, buildLatexSections, formatNumber } from "./formatters";
import { Header } from "./components/header";
import { ChainCanvas, ModeBar, Palette } from "./components/chain";
import { Dashboard } from "./components/dashboard";
import { CalcPath } from "./components/calcpath";
import { Toast } from "./components/ui";
import { useChain } from "./hooks/useChain";
import { useDragDrop } from "./hooks/useDragDrop";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { dark, toggle: toggleTheme } = useTheme();
  const { chain, setChain, add, update, remove, duplicate } = useChain();
  const [mode, setMode] = useState("rotary");
  const [lin, setLin] = useState({ device: OutputDevice.SPROCKET, pitch: 0.5, teeth: 12, diameter: 2.5, unit: "in" });
  const [collapsed, setCollapsed] = useState({});
  const [calcTab, setCalcTab] = useState("katex");
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null);

  const hasTermLinear = hasTerminalLinear(chain);
  const isLinearForced = isLastTerminalLinear(chain);
  const effectiveMode = isLinearForced ? "linear" : mode;
  const drag = useDragDrop(setChain, chain);

  const toggleCol = useCallback((id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const addComponent = useCallback((type) => {
    if (hasTermLinear) {
      setToast(null);
      setTimeout(() => setToast("Linear output is in place \u2014 drag to insert before it"), 10);
      return;
    }
    add(type);
  }, [add, hasTermLinear]);

  const addAtPosition = useCallback((type, insertIndex) => {
    add(type, insertIndex);
  }, [add]);

  const duplicateComponent = useCallback((component) => duplicate(component), [duplicate]);

  const lastIdx = useMemo(() => {
    for (let i = chain.length - 1; i >= 0; i -= 1) {
      if (chain[i].type !== ComponentType.SERVO) return i;
    }
    return -1;
  }, [chain]);

  const loadInertia = lastIdx >= 0 ? (chain[lastIdx].loadInertia != null ? num(chain[lastIdx].loadInertia, 5) : 5) : 5;
  const results = useMemo(() => compute(chain, effectiveMode, lin, loadInertia), [chain, effectiveMode, lin, loadInertia]);
  const formulaLines = useMemo(() => buildFormulaLines(chain, effectiveMode, lin, results), [chain, effectiveMode, lin, results]);
  const latexSections = useMemo(() => buildLatexSections(chain, effectiveMode, lin, results), [chain, effectiveMode, lin, results]);

  const onExport = useCallback(() => {
    void import("./export/buildPdfReport.js").then(({ buildPdfReport }) =>
      buildPdfReport({
        chain,
        results,
        formulaLines,
        formatNumber,
        setExporting,
        latexSections,
      }),
    );
  }, [chain, results, formulaLines, latexSections]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (results && !exporting) onExport();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [results, exporting, onExport]);

  return (
    <div className="app" data-theme={dark ? "dark" : "light"}>
      <Header results={results} exporting={exporting} onExport={onExport} dark={dark} onToggleTheme={toggleTheme} />
      <Palette
        hasTerminalLinear={hasTermLinear}
        dark={dark}
        onAdd={addComponent}
        onPaletteDragStart={drag.paletteDragStart}
        onPaletteDragEnd={drag.paletteDragEnd}
      />
      <ModeBar mode={mode} onSetMode={setMode} isLinearForced={isLinearForced} chain={chain} dark={dark} />
      <ChainCanvas
        chain={chain}
        dark={dark}
        lastIdx={lastIdx}
        effectiveMode={effectiveMode}
        lin={lin}
        setLin={setLin}
        update={update}
        remove={remove}
        duplicate={duplicateComponent}
        onDragStart={drag.onDragStart}
        onDragEnd={drag.onDragEnd}
        onDragOver={drag.onDragOver}
        onDrop={drag.onDrop}
        dragIdx={drag.dragIdx}
        dragOverIdx={drag.dragOverIdx}
        dropOn={drag.dropOn}
        setDropOn={drag.setDropOn}
        add={addComponent}
        addAt={addAtPosition}
        collapsed={collapsed}
        toggleCol={toggleCol}
        paletteType={drag.paletteType}
        paletteInsertIdx={drag.paletteInsertIdx}
        setPaletteInsertIdx={drag.setPaletteInsertIdx}
        termLinIdx={drag.termLinIdx}
        hasTermLinear={hasTermLinear}
      />
      <Dashboard results={results} formatNumber={formatNumber} exporting={exporting} />
      <CalcPath formulaLines={formulaLines} latexSections={latexSections} calcTab={calcTab} onSetCalcTab={setCalcTab} />
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
