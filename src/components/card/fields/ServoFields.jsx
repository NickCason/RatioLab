import { NumberInput } from "../../ui";

export function ServoFields({ comp, onUpdate, theme }) {
  return (
    <>
      <div className="fr">
        <span className="fl" style={{ color: theme.sub }}>
          Encoder PPR
        </span>
        <NumberInput value={comp.encoderPPR} min={1} onChange={(v) => onUpdate("encoderPPR", v)} theme={theme} />
      </div>
      <div className="fr">
        <span className="fl" style={{ color: theme.sub }}>
          Rated Torque
        </span>
        <NumberInput value={comp.ratedTorqueNm} min={0} step={0.1} onChange={(v) => onUpdate("ratedTorqueNm", v)} theme={theme} />
        <span className="fu" style={{ color: theme.sub }}>
          Nm
        </span>
      </div>
      <div className="fr">
        <span className="fl" style={{ color: theme.sub }}>
          Rated Speed
        </span>
        <NumberInput value={comp.ratedSpeedRPM} min={0} step={100} onChange={(v) => onUpdate("ratedSpeedRPM", v)} theme={theme} />
        <span className="fu" style={{ color: theme.sub }}>
          RPM
        </span>
      </div>
      {/* INERTIA HIDDEN — uncomment to restore
      <div className="fr">
        <span className="fl" style={{ color: theme.sub }}>
          Rotor Inertia
        </span>
        <NumberInput value={comp.rotorInertia} min={0} step={0.1} onChange={(v) => onUpdate("rotorInertia", v)} theme={theme} />
        <span className="fu" style={{ color: theme.sub }}>
          kg·cm²
        </span>
      </div>
      */}
    </>
  );
}
