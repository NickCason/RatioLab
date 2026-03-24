import { NumberInput } from "../../ui";

export function RackPinionFields({ comp, onUpdate, theme }) {
  return (
    <>
      <div className="fr">
        <span className="fl" style={{ color: theme.sub }}>
          Pinion Teeth
        </span>
        <NumberInput value={comp.pinionTeeth} min={1} onChange={(v) => onUpdate("pinionTeeth", v)} theme={theme} />
        <span className="fu" style={{ color: theme.sub }}>
          T
        </span>
      </div>
      <div className="fr">
        <span className="fl" style={{ color: theme.sub }}>
          Pitch
        </span>
        <NumberInput value={comp.pinionPitch} min={0.001} step={0.001} onChange={(v) => onUpdate("pinionPitch", v)} theme={theme} />
        <span className="fu" style={{ color: theme.sub }}>
          {comp.rpUnit}
        </span>
      </div>
      <div className="fr">
        <span className="fl" style={{ color: theme.sub }}>
          Units
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {["in", "mm"].map((unit) => (
            <button
              key={unit}
              className={`ct ${comp.rpUnit === unit ? "on" : ""}`}
              style={{ padding: "4px 12px", fontSize: 10, color: theme.text }}
              onClick={() => onUpdate("rpUnit", unit)}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>
      <div className="fr">
        <span className="fl" style={{ color: theme.sub }}>
          Efficiency
        </span>
        <NumberInput value={comp.efficiency} min={0} max={100} step={0.5} onChange={(v) => onUpdate("efficiency", v)} theme={theme} />
        <span className="fu" style={{ color: theme.sub }}>
          %
        </span>
      </div>
    </>
  );
}
