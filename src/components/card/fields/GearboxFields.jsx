import { NumberInput } from "../../ui";

export function GearboxFields({ comp, onUpdate, theme }) {
  return (
    <>
      <div className="fr">
        <span className="fl" style={{ color: theme.sub }}>
          Ratio
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <NumberInput value={comp.ratioNum} min={1} width={50} onChange={(v) => onUpdate("ratioNum", v)} theme={theme} />
          <span className="fu" style={{ color: theme.sub }}>
            :
          </span>
          <NumberInput value={comp.ratioDen} min={1} width={50} onChange={(v) => onUpdate("ratioDen", v)} theme={theme} />
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
