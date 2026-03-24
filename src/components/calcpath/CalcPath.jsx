import { EquationView } from "./EquationView";
import { TableView } from "./TableView";
import "./CalcPath.css";

export function CalcPath({ formulaLines, latexSections, calcTab, onSetCalcTab }) {
  return (
    <div className="fc">
      <h3>Calculation Path</h3>
      <div className="fc-tabs">
        <button className={`fc-tab ${calcTab === "katex" ? "on" : ""}`} onClick={() => onSetCalcTab("katex")}>
          Equations
        </button>
        <button className={`fc-tab ${calcTab === "table" ? "on" : ""}`} onClick={() => onSetCalcTab("table")}>
          Table
        </button>
      </div>

      {calcTab === "table" ? <TableView formulaLines={formulaLines} /> : <EquationView latexSections={latexSections} />}
    </div>
  );
}
