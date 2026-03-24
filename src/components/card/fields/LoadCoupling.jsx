import { OutputDevice } from "../../../config";
import { NumberInput } from "../../ui";

export function LoadCoupling({ lin, onLinChange, theme }) {
  return (
    <div className="lc">
      <div className="si" style={{ color: theme.text, marginBottom: 6 }}>
        LOAD COUPLING
      </div>
      <div className="fr" style={{ marginBottom: 10 }}>
        <select className="cs" value={lin.device} onChange={(event) => onLinChange({ ...lin, device: event.target.value })}>
          <option value={OutputDevice.SPROCKET}>Sprocket / Gear (Pitch × Teeth)</option>
          <option value={OutputDevice.DIRECT}>Direct Diameter (π × D)</option>
        </select>
      </div>

      {lin.device === OutputDevice.SPROCKET ? (
        <>
          <div className="fr">
            <span className="fl" style={{ color: theme.sub }}>
              Pitch
            </span>
            <NumberInput
              value={lin.pitch}
              min={0.001}
              step={0.001}
              onChange={(v) => onLinChange({ ...lin, pitch: typeof v === "number" ? v : 0 })}
              theme={theme}
            />
            <span className="fu" style={{ color: theme.sub }}>
              {lin.unit}
            </span>
          </div>
          <div className="fr">
            <span className="fl" style={{ color: theme.sub }}>
              Teeth
            </span>
            <NumberInput value={lin.teeth} min={1} onChange={(v) => onLinChange({ ...lin, teeth: typeof v === "number" ? v : 0 })} theme={theme} />
            <span className="fu" style={{ color: theme.sub }}>
              T
            </span>
          </div>
        </>
      ) : (
        <div className="fr">
          <span className="fl" style={{ color: theme.sub }}>
            Diameter
          </span>
          <NumberInput
            value={lin.diameter}
            min={0.001}
            step={0.01}
            onChange={(v) => onLinChange({ ...lin, diameter: typeof v === "number" ? v : 0 })}
            theme={theme}
          />
          <span className="fu" style={{ color: theme.sub }}>
            {lin.unit}
          </span>
        </div>
      )}

      <div className="fr" style={{ marginTop: 4 }}>
        <span className="fl" style={{ color: theme.sub }}>
          Units
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {["in", "mm"].map((unit) => (
            <button
              key={unit}
              className={`ct ${lin.unit === unit ? "on" : ""}`}
              style={{ padding: "4px 12px", fontSize: 10, color: theme.text }}
              onClick={() => onLinChange({ ...lin, unit })}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
