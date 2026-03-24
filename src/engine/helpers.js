import { ComponentType } from "../config";

export function num(value, fallback = 0) {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) || parsed === 0 ? fallback : parsed;
}

export function stageRatio(stage) {
  switch (stage.type) {
    case ComponentType.GEARBOX:
      return num(stage.ratioNum, 1) / num(stage.ratioDen, 1);
    case ComponentType.GEAR_MESH:
      return num(stage.drivenTeeth, 1) / num(stage.drivingTeeth, 1);
    case ComponentType.BELT_PULLEY:
      return stage.bpMode === "teeth"
        ? num(stage.drivenTeeth, 1) / num(stage.drivingTeeth, 1)
        : num(stage.drivenDia, 1) / num(stage.drivingDia, 1);
    default:
      return 1;
  }
}

export function stageEfficiency(stage) {
  return num(stage.efficiency, 100) / 100;
}

export function isLastRackPinion(chain) {
  for (let i = chain.length - 1; i >= 0; i -= 1) {
    if (chain[i].type !== ComponentType.SERVO) {
      return chain[i].type === ComponentType.RACK_PINION;
    }
  }
  return false;
}

export function hasRackPinion(chain) {
  return chain.some((component) => component.type === ComponentType.RACK_PINION);
}

export function isLastLeadscrew(chain) {
  for (let i = chain.length - 1; i >= 0; i -= 1) {
    if (chain[i].type !== ComponentType.SERVO) {
      return chain[i].type === ComponentType.LEADSCREW;
    }
  }
  return false;
}

export function hasLeadscrew(chain) {
  return chain.some((component) => component.type === ComponentType.LEADSCREW);
}

export function hasTerminalLinear(chain) {
  return hasRackPinion(chain) || hasLeadscrew(chain);
}

export function isLastTerminalLinear(chain) {
  return isLastRackPinion(chain) || isLastLeadscrew(chain);
}

export function getTerminalLinearIndex(chain) {
  return chain.findIndex(
    (c) => c.type === ComponentType.RACK_PINION || c.type === ComponentType.LEADSCREW
  );
}

export function getBadgeText(stage) {
  switch (stage.type) {
    case ComponentType.GEARBOX:
      return `${stage.ratioNum || "?"}:${stage.ratioDen || "?"}`;
    case ComponentType.GEAR_MESH:
      return `${stage.drivenTeeth || "?"}/${stage.drivingTeeth || "?"} = ${stageRatio(stage).toFixed(3)}`;
    case ComponentType.BELT_PULLEY:
      return stage.bpMode === "teeth"
        ? `${stage.drivenTeeth || "?"}/${stage.drivingTeeth || "?"} = ${stageRatio(stage).toFixed(3)}`
        : `⌀${stage.drivenDia || "?"}/⌀${stage.drivingDia || "?"} = ${stageRatio(stage).toFixed(3)}`;
    case ComponentType.RACK_PINION:
      return `${(num(stage.pinionTeeth, 0) * num(stage.pinionPitch, 0)).toFixed(3)} ${stage.rpUnit}/rev`;
    case ComponentType.LEADSCREW:
      return `${num(stage.lead, 0)} ${stage.lsUnit}/rev`;
    default:
      return "";
  }
}
