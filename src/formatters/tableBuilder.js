import { ComponentType, OutputDevice } from "../config";
import { num } from "../engine";

export function variableTag(className, value) {
  return `<span class="vp vp-${className}">${value}</span>`;
}

export function buildFormulaLines(chain, outputMode, linearConfig, results) {
  const servo = chain.find((component) => component.type === ComponentType.SERVO);
  if (!servo || !results) return [];

  const stages = chain.filter((component) => component.type !== ComponentType.SERVO);
  const lines = [];
  const f = (value, digits = 6) => parseFloat((value || 0).toFixed(digits)).toString();

  lines.push({ section: "Encoder & Resolution" });
  lines.push({ l: "Encoder PPR", m: `${servo.encoderPPR || "?"}`, v: `${num(servo.encoderPPR, 0)}`, raw: false });
  lines.push({ l: "Counts / Motor Rev", m: `PPR × 4 = ${num(servo.encoderPPR, 0)} × 4`, v: variableTag("enc", `${results.cpm}`), raw: true });
  lines.push({ l: "Counts / Load Rev", m: `${variableTag("enc", results.cpm)} × ${variableTag("mrl", f(results.mrl, 4))}`, v: variableTag("enc", f(results.cpl, 0)), raw: true });

  lines.push({ section: "Gear Ratio" });
  const ratioTerms = [];
  for (const stage of stages) {
    if (stage.type === ComponentType.GEARBOX) ratioTerms.push(`(${stage.ratioNum || "?"}/${stage.ratioDen || "?"})`);
    else if (stage.type === ComponentType.GEAR_MESH) ratioTerms.push(`(${stage.drivenTeeth || "?"}/${stage.drivingTeeth || "?"})`);
    else if (stage.type === ComponentType.BELT_PULLEY) {
      if (stage.bpMode === "teeth") ratioTerms.push(`(${stage.drivenTeeth || "?"}/${stage.drivingTeeth || "?"})`);
      else ratioTerms.push(`(⌀${stage.drivenDia || "?"}/⌀${stage.drivingDia || "?"})`);
    } else if (stage.type === ComponentType.RACK_PINION) {
      ratioTerms.push("(1:1 R&P)");
    } else if (stage.type === ComponentType.LEADSCREW) {
      ratioTerms.push("(1:1 Leadscrew)");
    }
  }
  if (ratioTerms.length) {
    lines.push({ l: "Total Gear Ratio (N)", m: ratioTerms.join(" × "), v: variableTag("ratio", f(results.tr)), raw: true });
    lines.push({ l: "Motor Rev / Load Rev", m: "= N", v: variableTag("mrl", f(results.mrl)), raw: true });
  }

  lines.push({ section: "Efficiency" });
  const efficiencyTerms = stages.map((stage) => `(${(stage.efficiency ?? 100) / 100})`);
  lines.push({ l: "Combined Efficiency (η)", m: efficiencyTerms.length ? efficiencyTerms.join(" × ") : "1.0", v: variableTag("eff", f(results.te, 4)), raw: true });

  lines.push({ section: "Travel per Revolution" });
  if (results.rpl) {
    const rackPinion = stages[stages.length - 1];
    lines.push({
      l: "Travel / Load Rev (d_load)",
      m: `Pitch × Teeth = ${rackPinion.pinionPitch || "?"} × ${rackPinion.pinionTeeth || "?"}`,
      v: variableTag("travel", `${f(results.dpl)} ${results.u}`),
      raw: true,
    });
  } else if (results.lsl) {
    const leadscrew = stages[stages.length - 1];
    lines.push({
      l: "Travel / Load Rev (d_load)",
      m: `Lead = ${leadscrew.lead || "?"}`,
      v: variableTag("travel", `${f(results.dpl)} ${results.u}`),
      raw: true,
    });
  } else if (outputMode === "linear") {
    if (linearConfig.device === OutputDevice.SPROCKET) {
      lines.push({
        l: "Travel / Load Rev (d_load)",
        m: `Pitch × Teeth = ${linearConfig.pitch} × ${linearConfig.teeth}`,
        v: variableTag("travel", `${f(results.dpl)} ${results.u}`),
        raw: true,
      });
    } else {
      lines.push({
        l: "Travel / Load Rev (d_load)",
        m: `π × D = π × ${linearConfig.diameter}`,
        v: variableTag("travel", `${f(results.dpl)} ${results.u}`),
        raw: true,
      });
    }
  } else {
    lines.push({ l: "Deg / Load Rev (d_load)", m: "360°", v: variableTag("travel", "360 deg"), raw: true });
  }
  lines.push({
    l: "Travel / Motor Rev (d_motor)",
    m: `${variableTag("travel", f(results.dpl, 4))} / ${variableTag("ratio", f(results.mrl, 4))}`,
    v: `${f(results.upm)} ${results.u}`,
    raw: true,
  });
  lines.push({
    l: `${results.u} / Count`,
    m: `${variableTag("travel", f(results.dpl, 4))} / ${f(results.cpl, 2)}`,
    v: `${f(results.upc, 8)} ${results.u}`,
    raw: true,
  });

  lines.push({ section: "Torque & Speed" });
  lines.push({
    l: "Output Torque (τ_out)",
    m: `${servo.ratedTorqueNm || "?"} Nm × ${variableTag("ratio", f(results.tr, 4))} × ${variableTag("eff", f(results.te, 4))}`,
    v: `${f(results.tq, 3)} Nm`,
    raw: true,
  });
  lines.push({
    l: "Output Shaft Speed (n_out)",
    m: `${servo.ratedSpeedRPM || "?"} RPM / ${variableTag("ratio", f(results.mrl, 4))}`,
    v: variableTag("speed", `${f(results.oRPM, 2)} RPM`),
    raw: true,
  });
  if (results.u !== "deg") {
    lines.push({
      l: "Output Linear Speed (v_out)",
      m: `${variableTag("speed", f(results.oRPM, 2))} RPM × ${variableTag("travel", f(results.dpl, 4))}`,
      v: `${f(results.oSpd, 2)} ${results.u}/min`,
      raw: true,
    });
  }

  return lines;
}
