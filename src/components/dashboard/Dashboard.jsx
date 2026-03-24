import { OUTPUT_TOOLTIPS } from "../../config";
import { ResultItem } from "./ResultItem";
import "./Dashboard.css";

export function Dashboard({ results, formatNumber, exporting }) {
  if (!results) return null;

  /* INERTIA HIDDEN — uncomment to restore
  const inertiaClass = results.inertiaRatio <= 10 ? "ih-good" : results.inertiaRatio <= 25 ? "ih-warn" : "ih-bad";
  const inertiaLabel = results.inertiaRatio <= 10 ? "✓ Good" : results.inertiaRatio <= 25 ? "⚠ Marginal" : "✕ High";
  const inertiaColor = results.inertiaRatio <= 10 ? "grn" : results.inertiaRatio <= 25 ? "ylw" : "red";
  */

  return (
    <div className="dash">
      <div className="dash-title">Axis Scaling Results</div>

      <div className="dash-group">
        <div className="dash-group-label">Encoder & Resolution</div>
        <div className="rg">
          <ResultItem label="Motor Rev / Load Rev" value={formatNumber(results.mrl)} color="orn" variant="or" shimmer={exporting} tip={OUTPUT_TOOLTIPS.mrl} />
          <ResultItem label="Counts / Load Rev" value={formatNumber(results.cpl, 0)} color="grn" variant="gr" shimmer={exporting} tip={OUTPUT_TOOLTIPS.cpl} />
          <ResultItem label={`${results.u} / Motor Rev`} value={formatNumber(results.upm, 6)} unit={results.u} color="blu" variant="bl" shimmer={exporting} tip={OUTPUT_TOOLTIPS.upm} />
          <ResultItem label={`${results.u} / Count`} value={formatNumber(results.upc, 8)} unit={results.u} color="pur" variant="pu" shimmer={exporting} tip={OUTPUT_TOOLTIPS.upc} />
          <ResultItem label={`${results.u} / Load Rev`} value={formatNumber(results.dpl, 6)} unit={results.u} variant="n" shimmer={exporting} tip={OUTPUT_TOOLTIPS.dpl} />
        </div>
      </div>

      <div className="dash-group">
        <div className="dash-group-label">Torque & Speed</div>
        <div className="rg">
          <ResultItem label="Output Torque (w/ eff.)" value={formatNumber(results.tq, 2)} unit="Nm" color="orn" variant="or" shimmer={exporting} tip={OUTPUT_TOOLTIPS.tq} />
          <ResultItem label="Output Shaft Speed" value={formatNumber(results.oRPM, 2)} unit="RPM" color="blu" variant="bl" shimmer={exporting} tip={OUTPUT_TOOLTIPS.oRPM} />
          {results.u !== "deg" && <ResultItem label="Output Linear Speed" value={formatNumber(results.oSpd, 2)} unit={`${results.u}/min`} color="pur" variant="pu" shimmer={exporting} tip={OUTPUT_TOOLTIPS.oSpd} />}
          <ResultItem label="Total Gear Ratio" value={formatNumber(results.tr)} unit=":1" variant="n" shimmer={exporting} tip={OUTPUT_TOOLTIPS.tr} />
          <ResultItem label="Combined Efficiency" value={formatNumber(results.te * 100, 1)} unit="%" color={results.te > 0.9 ? "grn" : "red"} variant="gr" shimmer={exporting} tip={OUTPUT_TOOLTIPS.te} />
        </div>
      </div>

      {/* INERTIA HIDDEN — uncomment to restore
      {results.jMotor > 0 && (
        <div className="dash-group">
          <div className="dash-group-label">Inertia Matching</div>
          <div className="rg">
            <ResultItem label="Inertia Ratio (J_load / J_motor)" value={formatNumber(results.inertiaRatio, 2)} unit=":1" color={inertiaColor} variant={results.inertiaRatio <= 10 ? "gr" : results.inertiaRatio <= 25 ? "yl" : "rd"}>
              <div className={`inertia-health ${inertiaClass}`}>{inertiaLabel}</div>
            </ResultItem>
            <ResultItem label="Reflected Load Inertia" value={formatNumber(results.jReflected, 4)} unit="kg·cm²" variant="n" />
          </div>
        </div>
      )}
      */}
    </div>
  );
}
