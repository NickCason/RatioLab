import { ComponentType, OutputDevice } from "../config";

export const VARIABLE_COLORS = {
  ratio: { fg: "#3570a8", bg: "#dde9f5" },
  eff: { fg: "#2d7a3e", bg: "#d9efdd" },
  travel: { fg: "#7a5299", bg: "#e8ddf0" },
  mrl: { fg: "#b07030", bg: "#f5e6d4" },
  speed: { fg: "#3570a8", bg: "#dde9f5" },
  enc: { fg: "#8a6540", bg: "#f5ead8" },
};

export function colorPill(varColor, content) {
  return `\\colorbox{${varColor.bg}}{\\color{${varColor.fg}}{\\,${content}\\,}}`;
}

export function buildLatexSections(chain, outputMode, linearConfig, results) {
  if (!results) return [];
  const servo = chain.find((component) => component.type === ComponentType.SERVO);
  if (!servo) return [];

  const stages = chain.filter((component) => component.type !== ComponentType.SERVO);
  const sections = [];

  let encoderTex = `\\text{PPR} = ${servo.encoderPPR || "?"}\\\\[4pt]`;
  encoderTex += `\\text{Counts/Motor Rev} = \\text{PPR} \\times 4 = ${servo.encoderPPR || "?"} \\times 4 = ${colorPill(VARIABLE_COLORS.enc, results.cpm)}\\\\[4pt]`;
  encoderTex += `\\text{Counts/Load Rev} = ${colorPill(VARIABLE_COLORS.enc, results.cpm)} \\times ${colorPill(VARIABLE_COLORS.mrl, parseFloat(results.mrl.toFixed(4)))} = ${colorPill(VARIABLE_COLORS.enc, parseFloat(results.cpl.toFixed(0)))}`;
  sections.push({ title: "Encoder & Resolution", tex: encoderTex });

  const fractions = stages.map((stage) => {
    if (stage.type === ComponentType.GEARBOX) return `\\frac{${stage.ratioNum || "?"}}{${stage.ratioDen || "?"}}`;
    if (stage.type === ComponentType.GEAR_MESH) return `\\frac{${stage.drivenTeeth || "?"}}{${stage.drivingTeeth || "?"}}`;
    if (stage.type === ComponentType.BELT_PULLEY) {
      return stage.bpMode === "teeth"
        ? `\\frac{${stage.drivenTeeth || "?"}}{${stage.drivingTeeth || "?"}}`
        : `\\frac{\\varnothing${stage.drivenDia || "?"}}{\\varnothing${stage.drivingDia || "?"}}`;
    }
    return "1";
  });
  const labels = stages.map((stage) => {
    if (stage.type === ComponentType.GEARBOX) return `\\small\\text{${stage.name || "Gearbox"}}`;
    if (stage.type === ComponentType.GEAR_MESH) return `\\small\\text{${stage.name || "Gear Mesh"}}`;
    if (stage.type === ComponentType.BELT_PULLEY) return `\\small\\text{${stage.name || "Belt/Pulley"}}`;
    if (stage.type === ComponentType.RACK_PINION) return "\\small\\text{R\\&P}";
    if (stage.type === ComponentType.LEADSCREW) return "\\small\\text{Leadscrew}";
    return "";
  });
  if (fractions.length) {
    let ratioTex = `N = ${fractions.map((fraction, i) => `\\underbrace{${fraction}}_{${labels[i]}}`).join("\\times")} = ${colorPill(VARIABLE_COLORS.ratio, parseFloat(results.tr.toFixed(4)))}\\\\[4pt]`;
    ratioTex += `\\text{Motor Rev / Load Rev} = N = ${colorPill(VARIABLE_COLORS.mrl, parseFloat(results.mrl.toFixed(4)))}`;
    sections.push({ title: "Total Gear Ratio", tex: ratioTex });
  }

  const efficiencies = stages.map((stage, i) => `\\underbrace{${(stage.efficiency ?? 100) / 100}}_{${labels[i]}}`);
  const efficiencyTex = `\\eta = ${efficiencies.join("\\times")} = ${colorPill(VARIABLE_COLORS.eff, parseFloat(results.te.toFixed(4)))} \\;(${parseFloat((results.te * 100).toFixed(2))}\\%)`;
  sections.push({ title: "Combined Efficiency", tex: efficiencyTex });

  let travelExpression = "";
  if (results.rpl) {
    const rackPinion = stages[stages.length - 1];
    travelExpression = `\\text{pitch}\\times\\text{teeth} = ${rackPinion.pinionPitch || "?"}\\times${rackPinion.pinionTeeth || "?"}`;
  } else if (results.lsl) {
    const leadscrew = stages[stages.length - 1];
    travelExpression = `\\text{lead} = ${leadscrew.lead || "?"}`;
  } else if (outputMode === "linear") {
    if (linearConfig.device === OutputDevice.SPROCKET) {
      travelExpression = `\\text{pitch}\\times\\text{teeth} = ${linearConfig.pitch}\\times${linearConfig.teeth}`;
    } else {
      travelExpression = `\\pi\\times D = \\pi\\times${linearConfig.diameter}`;
    }
  } else {
    travelExpression = "360";
  }
  let travelTex = `d_{\\text{load}} = ${travelExpression} = ${colorPill(VARIABLE_COLORS.travel, parseFloat(results.dpl.toFixed(4)))}\\;\\text{${results.u}/load rev}\\\\[6pt]`;
  travelTex += `d_{\\text{motor}} = \\frac{d_{\\text{load}}}{N} = \\frac{${colorPill(VARIABLE_COLORS.travel, parseFloat(results.dpl.toFixed(4)))}}{${colorPill(VARIABLE_COLORS.ratio, parseFloat(results.tr.toFixed(4)))}} = ${parseFloat(results.upm.toFixed(6))}\\;\\text{${results.u}/motor rev}`;
  sections.push({ title: "Travel per Revolution", tex: travelTex });

  const torqueTex = `\\tau_{\\text{out}} = \\tau_{\\text{motor}} \\times N \\times \\eta = ${servo.ratedTorqueNm || "?"}\\;\\text{Nm} \\times ${colorPill(VARIABLE_COLORS.ratio, parseFloat(results.tr.toFixed(3)))} \\times ${colorPill(VARIABLE_COLORS.eff, parseFloat(results.te.toFixed(4)))} = ${parseFloat(results.tq.toFixed(3))}\\;\\text{Nm}`;
  sections.push({ title: "Output Torque", tex: torqueTex });

  let speedTex = `n_{\\text{out}} = \\frac{n_{\\text{motor}}}{N} = \\frac{${servo.ratedSpeedRPM || "?"}\\;\\text{RPM}}{${colorPill(VARIABLE_COLORS.ratio, parseFloat(results.mrl.toFixed(3)))}} = ${colorPill(VARIABLE_COLORS.speed, parseFloat(results.oRPM.toFixed(2)))}\\;\\text{RPM}`;
  if (results.u !== "deg") {
    speedTex += `\\\\[6pt]v_{\\text{out}} = ${colorPill(VARIABLE_COLORS.speed, parseFloat(results.oRPM.toFixed(2)))}\\;\\text{RPM} \\times d_{\\text{load}} = ${colorPill(VARIABLE_COLORS.speed, parseFloat(results.oRPM.toFixed(2)))} \\times ${colorPill(VARIABLE_COLORS.travel, parseFloat(results.dpl.toFixed(4)))} = ${parseFloat(results.oSpd.toFixed(2))}\\;\\text{${results.u}/min}`;
  }
  sections.push({ title: "Output Speed", tex: speedTex });
  return sections;
}

export function buildLatexFlat(chain, outputMode, linearConfig, results) {
  return buildLatexSections(chain, outputMode, linearConfig, results)
    .map((section) => `\\textbf{${section.title}}\\\\[4pt]${section.tex}`)
    .join("\\\\[14pt]");
}
