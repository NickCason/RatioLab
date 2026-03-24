import { ComponentType, CARD_THEMES_DARK, CARD_THEMES_LIGHT, MECHANISM_TOOLTIPS } from "../../config";
import { COMPONENT_ICONS } from "../../icons";
import { Tooltip } from "../ui";
import "./Palette.css";

function isTermType(type) {
  return type === ComponentType.RACK_PINION || type === ComponentType.LEADSCREW;
}

export function Palette({ hasTerminalLinear, dark, onAdd, onPaletteDragStart, onPaletteDragEnd }) {
  const paletteItems = [
    { type: ComponentType.GEARBOX, label: "+ Gearbox" },
    { type: ComponentType.GEAR_MESH, label: "+ Gear Mesh" },
    { type: ComponentType.BELT_PULLEY, label: "+ Belt / Pulley" },
    { type: ComponentType.RACK_PINION, label: "+ Rack & Pinion" },
    { type: ComponentType.LEADSCREW, label: "+ Leadscrew" },
  ];
  const themes = dark ? CARD_THEMES_DARK : CARD_THEMES_LIGHT;

  return (
    <div className="pal">
      {paletteItems.map(({ type, label }) => {
        const isTerm = isTermType(type);
        const disabled = hasTerminalLinear && isTerm;
        const dragOnly = hasTerminalLinear && !isTerm;

        return (
          <Tooltip key={type} content={MECHANISM_TOOLTIPS[type]} position="below">
            <div
              className={`pal-b ${disabled ? "off" : ""} ${dragOnly ? "pal-drag-only" : ""}`}
              draggable={!disabled}
              onClick={() => onAdd(type)}
              onDragStart={(event) => onPaletteDragStart(event, type)}
              onDragEnd={onPaletteDragEnd}
            >
              <span className={`pal-icon ${type === ComponentType.GEARBOX ? "pal-icon-gearbox" : ""}`}>
                {COMPONENT_ICONS[type](disabled ? "#999" : themes[type].accent)}
              </span>
              <span>{label}</span>
              {dragOnly && <span className="pal-drag-tag">drag</span>}
            </div>
          </Tooltip>
        );
      })}
      {hasTerminalLinear && (
        <div className="pal-h">Drag to insert before the linear output stage</div>
      )}
    </div>
  );
}
