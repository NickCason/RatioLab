import { NumberInput } from "../../ui";

export function BeltPulleyFields({ comp, onUpdate, theme }) {
  return (
    <>
      <div className="bp">
        <button className={`ct ${comp.bpMode === "teeth" ? "on" : ""}`} style={{ flex: 1, color: theme.text }} onClick={() => onUpdate("bpMode", "teeth")}>
          By Teeth
        </button>
        <button className={`ct ${comp.bpMode === "diameter" ? "on" : ""}`} style={{ flex: 1, color: theme.text }} onClick={() => onUpdate("bpMode", "diameter")}>
          By Diameter
        </button>
      </div>
      {comp.bpMode === "teeth" ? (
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
        </>
      ) : (
        <>
          <div className="fr">
            <span className="fl" style={{ color: theme.sub }}>
              Driving ⌀
            </span>
            <NumberInput value={comp.drivingDia} min={0.01} step={0.01} onChange={(v) => onUpdate("drivingDia", v)} theme={theme} />
          </div>
          <div className="fr">
            <span className="fl" style={{ color: theme.sub }}>
              Driven ⌀
            </span>
            <NumberInput value={comp.drivenDia} min={0.01} step={0.01} onChange={(v) => onUpdate("drivenDia", v)} theme={theme} />
          </div>
        </>
      )}
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
