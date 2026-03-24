import { NumberInput } from "../../ui";

export function GearMeshFields({ comp, onUpdate, theme }) {
  return (
    <>
      <div className="fr">
        <span className="fl" style={{ color: theme.sub }}>
          Driving Teeth
        </span>
        <NumberInput value={comp.drivingTeeth} min={1} onChange={(v) => onUpdate("drivingTeeth", v)} theme={theme} />
        <span className="fu" style={{ color: theme.sub }}>
          T
        </span>
      </div>
      <div className="fr">
        <span className="fl" style={{ color: theme.sub }}>
          Driven Teeth
        </span>
        <NumberInput value={comp.drivenTeeth} min={1} onChange={(v) => onUpdate("drivenTeeth", v)} theme={theme} />
        <span className="fu" style={{ color: theme.sub }}>
          T
        </span>
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
