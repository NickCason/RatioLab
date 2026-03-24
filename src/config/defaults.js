import { ComponentType } from "./types";

export const COMPONENT_DEFS = {
  [ComponentType.SERVO]: {
    label: "Servo Motor",
    defaults: {
      name: "Servo Motor",
      encoderPPR: 8192,
      ratedTorqueNm: 3.0,
      ratedSpeedRPM: 3000,
      rotorInertia: 1.2,
    },
  },
  [ComponentType.GEARBOX]: {
    label: "Gearbox",
    defaults: { name: "Gearbox", ratioNum: 10, ratioDen: 1, efficiency: 95 },
  },
  [ComponentType.GEAR_MESH]: {
    label: "Gear Mesh",
    defaults: { name: "Gear Mesh", drivingTeeth: 20, drivenTeeth: 60, efficiency: 98 },
  },
  [ComponentType.BELT_PULLEY]: {
    label: "Belt / Pulley",
    defaults: {
      name: "Belt / Pulley",
      bpMode: "teeth",
      drivingTeeth: 16,
      drivenTeeth: 48,
      drivingDia: 2,
      drivenDia: 6,
      efficiency: 97,
    },
  },
  [ComponentType.RACK_PINION]: {
    label: "Rack & Pinion",
    defaults: {
      name: "Rack & Pinion",
      pinionTeeth: 20,
      pinionPitch: 0.5,
      rpUnit: "in",
      efficiency: 96,
    },
  },
  [ComponentType.LEADSCREW]: {
    label: "Leadscrew",
    defaults: {
      name: "Leadscrew",
      lead: 5,
      lsUnit: "mm",
      efficiency: 90,
    },
  },
};

let idCounter = 0;

export function generateId() {
  idCounter += 1;
  return `c${idCounter}_${Date.now().toString(36)}`;
}

export function createDefaultChain() {
  return [
    { id: generateId(), type: ComponentType.SERVO, ...COMPONENT_DEFS[ComponentType.SERVO].defaults },
    { id: generateId(), type: ComponentType.GEARBOX, ...COMPONENT_DEFS[ComponentType.GEARBOX].defaults },
  ];
}
