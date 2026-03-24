import { ComponentType, OutputDevice, CARD_THEMES_DARK, CARD_THEMES_LIGHT, MECHANISM_TOOLTIPS } from "../../config";
import { getBadgeText } from "../../engine";
import { COMPONENT_ICONS, WATERMARKS } from "../../icons";
import {
  BeltPulleyFields,
  GearboxFields,
  GearMeshFields,
  LeadscrewFields,
  LoadCoupling,
  RackPinionFields,
  ServoFields,
} from "./fields";
import { NumberInput, Tooltip } from "../ui";
import "./Card.css";

export function Card({
  comp,
  index,
  isLast,
  outputMode,
  lin,
  onLin,
  onUp,
  onDel,
  onDup,
  onDS,
  onDE,
  onDO,
  onDr,
  isDg,
  isDov,
  dark,
  collapsed,
  onToggle,
  hideTermDup,
}) {
  const isServo = comp.type === ComponentType.SERVO;
  const isRackPinion = comp.type === ComponentType.RACK_PINION;
  const isLeadscrew = comp.type === ComponentType.LEADSCREW;
  const isTerminalLinear = isRackPinion || isLeadscrew;
  const showDup = !isServo && !(isTerminalLinear && hideTermDup);
  const theme = (dark ? CARD_THEMES_DARK : CARD_THEMES_LIGHT)[comp.type];
  const set = (key, value) => onUp(comp.id, { [key]: value });

  return (
    <div
      className={`cd ${isDg ? "dg" : ""} ${isDov ? "dov" : ""}`}
      draggable={!isServo}
      style={{
        background: `linear-gradient(135deg,${theme.bg},${theme.bg2})`,
        color: theme.text,
        border: dark ? `1px solid ${theme.inBrd}` : "1px solid transparent",
      }}
      onDragStart={(event) => onDS(event, index)}
      onDragEnd={onDE}
      onDragOver={(event) => onDO(event, index)}
      onDrop={(event) => onDr(event, index)}
    >
      <div className="cd-wm" style={{ color: theme.text }} dangerouslySetInnerHTML={{ __html: WATERMARKS[comp.type] }} />
      <Tooltip content={MECHANISM_TOOLTIPS[comp.type]} position="above">
        <div className="cd-ribbon" style={{ background: theme.badge, color: theme.icon }}>?</div>
      </Tooltip>
      <div className="cd-h">
        <div className="cd-ic" style={{ background: theme.badge }}>
          {COMPONENT_ICONS[comp.type](theme.icon)}
        </div>
        <input
          className="cd-nm"
          value={comp.name}
          onChange={(event) => set("name", event.target.value)}
          spellCheck={false}
          style={{ color: theme.text }}
        />
        <div className="cd-acts">
          <button className="cd-ab" onClick={onToggle} title={collapsed ? "Expand" : "Collapse"} style={{ color: theme.sub, fontSize: 10 }}>
            {collapsed ? "▼" : "▲"}
          </button>
          {showDup && (
            <button className="cd-ab" onClick={() => onDup(comp)} title="Duplicate" style={{ color: theme.sub }}>
              ⧉
            </button>
          )}
          {!isServo && (
            <button className="cd-ab del" onClick={() => onDel(comp.id)} title="Remove" style={{ color: theme.sub }}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div className={`cd-b ${collapsed ? "collapsed" : ""}`} style={collapsed ? { maxHeight: 0 } : { maxHeight: 500 }}>
        <div className="si" style={{ color: theme.sub }}>
          {isServo ? "DRIVE" : `STAGE ${index}`}
          {isLast && !isServo ? (isTerminalLinear ? " · LINEAR OUTPUT" : " · OUTPUT") : ""}
        </div>

        {isServo && <ServoFields comp={comp} onUpdate={set} theme={theme} />}
        {comp.type === ComponentType.GEARBOX && <GearboxFields comp={comp} onUpdate={set} theme={theme} />}
        {comp.type === ComponentType.GEAR_MESH && <GearMeshFields comp={comp} onUpdate={set} theme={theme} />}
        {comp.type === ComponentType.BELT_PULLEY && <BeltPulleyFields comp={comp} onUpdate={set} theme={theme} />}
        {comp.type === ComponentType.RACK_PINION && <RackPinionFields comp={comp} onUpdate={set} theme={theme} />}
        {comp.type === ComponentType.LEADSCREW && <LeadscrewFields comp={comp} onUpdate={set} theme={theme} />}

        {!isServo && (
          <div className="bdg" style={{ background: theme.badge, color: theme.text }}>
            {getBadgeText(comp)}
          </div>
        )}

        {isLast && !isServo && !isTerminalLinear && outputMode === "linear" && <LoadCoupling lin={lin} onLinChange={onLin} theme={theme} />}

        {/* INERTIA HIDDEN — uncomment to restore
        {isLast && !isServo && (
          <div className="lc">
            <div className="si" style={{ color: theme.text, marginBottom: 6 }}>
              LOAD INERTIA
            </div>
            <div className="fr">
              <span className="fl" style={{ color: theme.sub }}>
                J Load
              </span>
              <NumberInput value={comp.loadInertia != null ? comp.loadInertia : 5} min={0} step={0.1} onChange={(v) => set("loadInertia", v)} theme={theme} />
              <span className="fu" style={{ color: theme.sub }}>
                kg·cm²
              </span>
            </div>
          </div>
        )}
        */}
      </div>
    </div>
  );
}
