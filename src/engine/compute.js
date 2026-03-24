import { ComponentType, OutputDevice } from "../config";
import { isLastLeadscrew, isLastRackPinion, num, stageEfficiency, stageRatio } from "./helpers";

export function compute(chain, outputMode, linearConfig, loadInertia) {
  const servo = chain.find((component) => component.type === ComponentType.SERVO);
  if (!servo) return null;

  const stages = chain.filter((component) => component.type !== ComponentType.SERVO);
  let totalRatio = 1;
  let totalEfficiency = 1;

  for (const stage of stages) {
    totalRatio *= stageRatio(stage);
    totalEfficiency *= stageEfficiency(stage);
  }

  const motorRevPerLoadRev = totalRatio;
  const ppr = num(servo.encoderPPR, 8192);
  const countsPerMotorRev = ppr * 4;
  const countsPerLoadRev = countsPerMotorRev * motorRevPerLoadRev;
  const rackPinionLast = isLastRackPinion(chain);
  const rackPinion = rackPinionLast ? stages[stages.length - 1] : null;
  const leadscrewLast = isLastLeadscrew(chain);
  const leadscrew = leadscrewLast ? stages[stages.length - 1] : null;

  let distancePerLoadRev;
  let unit;
  if (rackPinionLast) {
    distancePerLoadRev = num(rackPinion.pinionPitch, 0) * num(rackPinion.pinionTeeth, 0);
    unit = rackPinion.rpUnit || "in";
  } else if (leadscrewLast) {
    distancePerLoadRev = num(leadscrew.lead, 0);
    unit = leadscrew.lsUnit || "mm";
  } else if (outputMode === "linear") {
    if (linearConfig.device === OutputDevice.SPROCKET) {
      distancePerLoadRev = num(linearConfig.pitch, 0) * num(linearConfig.teeth, 0);
    } else {
      distancePerLoadRev = Math.PI * num(linearConfig.diameter, 0);
    }
    unit = linearConfig.unit || "in";
  } else {
    distancePerLoadRev = 360;
    unit = "deg";
  }

  const unitsPerMotorRev = motorRevPerLoadRev ? distancePerLoadRev / motorRevPerLoadRev : 0;
  const unitsPerCount = countsPerLoadRev ? distancePerLoadRev / countsPerLoadRev : 0;
  const motorRpm = num(servo.ratedSpeedRPM, 0);
  const outputRpm = motorRevPerLoadRev ? motorRpm / motorRevPerLoadRev : 0;
  const outputSpeed = outputRpm * distancePerLoadRev;
  const torqueOut = num(servo.ratedTorqueNm, 0) * totalRatio * totalEfficiency;
  const jMotor = num(servo.rotorInertia, 0);
  const jLoad = num(loadInertia, 0);
  const jReflected = totalRatio !== 0 ? jLoad / (totalRatio * totalRatio) : 0;
  const inertiaRatio = jMotor !== 0 ? jReflected / jMotor : 0;

  return {
    mrl: motorRevPerLoadRev,
    cpm: countsPerMotorRev,
    cpl: countsPerLoadRev,
    dpl: distancePerLoadRev,
    upm: unitsPerMotorRev,
    upc: unitsPerCount,
    u: unit,
    tr: totalRatio,
    te: totalEfficiency,
    tq: torqueOut,
    ppr,
    rpl: rackPinionLast,
    lsl: leadscrewLast,
    rpm: motorRpm,
    oRPM: outputRpm,
    oSpd: outputSpeed,
    jMotor,
    jLoad,
    jReflected,
    inertiaRatio,
  };
}
