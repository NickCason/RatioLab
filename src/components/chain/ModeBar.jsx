import { ComponentType } from "../../config";
import { isLastLeadscrew, isLastRackPinion } from "../../engine";
import { COMPONENT_ICONS } from "../../icons";
import "./ModeBar.css";

export function ModeBar({ mode, onSetMode, isLinearForced, chain, dark }) {
  if (isLinearForced) {
    const rpForced = isLastRackPinion(chain);
    const lsForced = isLastLeadscrew(chain);
    const type = rpForced ? ComponentType.RACK_PINION : ComponentType.LEADSCREW;
    const label = rpForced ? "Rack & Pinion" : "Leadscrew";
    const colorMap = {
      [ComponentType.RACK_PINION]: dark ? "#E0937A" : "#D47352",
      [ComponentType.LEADSCREW]: dark ? "#5CC4CE" : "#4AABB5",
    };
    return (
      <div className="rpf-w">
        <span className="rpf">
          {COMPONENT_ICONS[type](colorMap[type])} {label} — linear output forced
        </span>
      </div>
    );
  }

  return (
    <div className="mb">
      <button className={`mb-b ${mode === "rotary" ? "on" : ""}`} onClick={() => onSetMode("rotary")}>
        Rotary (deg)
      </button>
      <button className={`mb-b ${mode === "linear" ? "on" : ""}`} onClick={() => onSetMode("linear")}>
        Linear
      </button>
    </div>
  );
}
