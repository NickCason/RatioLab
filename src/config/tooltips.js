import { ComponentType } from "./types";

export const MECHANISM_TOOLTIPS = {
  [ComponentType.SERVO]: {
    title: "Servo Motor",
    description:
      "The prime mover of the motion chain. Defines the source encoder resolution, rated torque, and rated speed. All downstream calculations reference the servo's output shaft.",
    math: [
      "\\text{Counts/rev} = \\text{PPR} \\times 4 \\quad \\footnotesize{\\text{(quadrature)}}",
      "\\tau_{\\text{out}} = \\tau_{\\text{rated}} \\times R_{\\text{total}} \\times \\eta_{\\text{total}}",
      "\\omega_{\\text{load}} = \\dfrac{\\omega_{\\text{motor}}}{R_{\\text{total}}}",
    ],
  },

  [ComponentType.GEARBOX]: {
    title: "Gearbox",
    description:
      "An enclosed gear reducer that multiplies torque and divides speed by a fixed ratio. Typical types include planetary, harmonic, and cycloidal reducers.",
    math: [
      "R = \\dfrac{N_1}{N_2}",
      "\\omega_{\\text{out}} = \\dfrac{\\omega_{\\text{in}}}{R} \\,,\\quad \\tau_{\\text{out}} = \\tau_{\\text{in}} \\times R \\times \\eta",
    ],
  },

  [ComponentType.GEAR_MESH]: {
    title: "Gear Mesh",
    description:
      "An open gear pair where a driving pinion meshes with a driven gear. The speed ratio is set by the tooth count ratio — more driven teeth means more torque multiplication and lower output speed.",
    math: [
      "R = \\dfrac{Z_{\\text{driven}}}{Z_{\\text{driving}}}",
      "\\omega_{\\text{out}} = \\omega_{\\text{in}} \\times \\dfrac{Z_{\\text{driving}}}{Z_{\\text{driven}}} \\,,\\quad \\tau_{\\text{out}} = \\tau_{\\text{in}} \\times R \\times \\eta",
    ],
  },

  [ComponentType.BELT_PULLEY]: {
    title: "Belt & Pulley",
    description:
      "Power transmission via a belt and two pulleys. The ratio is determined by either tooth counts (timing/synchronous belt) or pulley diameters. Timing belts provide zero-slip synchronous motion.",
    math: [
      "R_{\\text{teeth}} = \\dfrac{Z_{\\text{driven}}}{Z_{\\text{driving}}} \\,,\\quad R_{\\text{dia}} = \\dfrac{D_{\\text{driven}}}{D_{\\text{driving}}}",
      "\\omega_{\\text{out}} = \\dfrac{\\omega_{\\text{in}}}{R} \\,,\\quad \\tau_{\\text{out}} = \\tau_{\\text{in}} \\times R \\times \\eta",
    ],
  },

  [ComponentType.RACK_PINION]: {
    title: "Rack & Pinion",
    description:
      "Converts rotary motion to linear translation. A pinion gear rolls along a straight rack, producing linear displacement per revolution. This stage forces the output to linear units and must be the last stage in the chain.",
    math: [
      "d_{\\text{rev}} = Z_{\\text{pinion}} \\times \\text{Pitch}",
      "v = \\omega_{\\text{pinion}} \\times d_{\\text{rev}}",
      "\\text{counts/unit} = \\dfrac{\\text{counts/rev}}{d_{\\text{rev}}}",
    ],
  },

  [ComponentType.LEADSCREW]: {
    title: "Leadscrew",
    description:
      "Converts rotary motion to linear translation via a helical screw. The lead (axial travel per revolution) directly determines displacement. Ball screws offer higher efficiency than acme screws. Must be the last stage in the chain.",
    math: [
      "d_{\\text{rev}} = \\text{Lead}",
      "v = \\omega_{\\text{in}} \\times \\text{Lead}",
      "\\text{counts/unit} = \\dfrac{\\text{counts/rev}}{\\text{Lead}}",
    ],
  },
};

export const OUTPUT_TOOLTIPS = {
  mrl: {
    title: "Motor Rev / Load Rev",
    description:
      "The total gear ratio of the motion chain. This is how many times the motor shaft must rotate to produce one full revolution at the load (output) shaft. It is the cumulative product of every stage ratio.",
    math: [
      "R_{\\text{total}} = \\prod_{i} R_i",
    ],
  },
  cpl: {
    title: "Counts / Load Rev",
    description:
      "Total encoder counts accumulated over one full load-shaft revolution. The servo encoder's PPR is first quadrature-decoded (×4) to get counts per motor rev, then multiplied by the total ratio. Higher values mean finer positioning resolution.",
    math: [
      "\\text{Counts/Load Rev} = \\text{PPR} \\times 4 \\times R_{\\text{total}}",
    ],
  },
  upm: {
    title: "Distance / Motor Rev",
    description:
      "How far the output moves for each single revolution of the motor shaft. Useful for tuning drive scaling parameters. Derived by dividing the distance per load rev by the total ratio.",
    math: [
      "\\dfrac{\\text{units}}{\\text{motor rev}} = \\dfrac{d_{\\text{rev}}}{R_{\\text{total}}}",
    ],
  },
  upc: {
    title: "Distance / Count",
    description:
      "The smallest resolvable output motion — the distance the load moves per single encoder count. This defines the theoretical positioning resolution of the system.",
    math: [
      "\\dfrac{\\text{units}}{\\text{count}} = \\dfrac{d_{\\text{rev}}}{\\text{PPR} \\times 4 \\times R_{\\text{total}}}",
    ],
  },
  cpu: {
    title: "Counts / Unit",
    description:
      "The number of encoder counts per unit of output travel — the reciprocal of distance per count. Higher values mean finer feedback resolution. This is the value typically entered into a servo drive's electronic gearing or scaling parameter.",
    math: [
      "\\dfrac{\\text{counts}}{\\text{unit}} = \\dfrac{\\text{PPR} \\times 4 \\times R_{\\text{total}}}{d_{\\text{rev}}}",
    ],
  },
  dpl: {
    title: "Distance / Load Rev",
    description:
      "The distance the output travels for one full revolution of the load shaft. For rotary output this is 360°. For linear outputs it depends on the mechanism — rack pitch × teeth, leadscrew lead, sprocket pitch, or wheel circumference.",
    math: [
      "d_{\\text{rev}} = \\begin{cases} Z \\times P & \\text{rack/sprocket} \\\\ \\text{Lead} & \\text{leadscrew} \\\\ \\pi D & \\text{wheel} \\end{cases}",
    ],
  },
  tq: {
    title: "Output Torque",
    description:
      "Torque available at the output shaft when the motor delivers its rated torque. The gear ratio multiplies torque while the cumulative efficiency accounts for frictional losses at every stage.",
    math: [
      "\\tau_{\\text{out}} = \\tau_{\\text{rated}} \\times R_{\\text{total}} \\times \\eta_{\\text{total}}",
    ],
  },
  oRPM: {
    title: "Output Shaft Speed",
    description:
      "Rotational speed of the output shaft when the motor runs at its rated speed. The total gear ratio divides motor speed — higher ratios mean lower output speed but greater torque.",
    math: [
      "\\omega_{\\text{out}} = \\dfrac{\\omega_{\\text{motor}}}{R_{\\text{total}}}",
    ],
  },
  oSpd: {
    title: "Output Linear Speed",
    description:
      "Linear velocity of the output when the motor runs at rated speed. Combines the output shaft speed with the distance traveled per revolution of the load shaft.",
    math: [
      "v = \\omega_{\\text{out}} \\times d_{\\text{rev}}",
    ],
  },
  oFrc: {
    title: "Output Linear Force",
    description:
      "Ideal linear thrust or tangential force at the motion output when the motor delivers its rated output torque. Derived from power balance at the load shaft: rotary power τω equals linear power Fv, with v = ω d / (2π) for advance d per revolution, so F = 2πτ / d. Uses the same d per load revolution as scaling; stage efficiencies are already included in τ_out. Does not model screw lead angle, rack friction, or peak overload.",
    math: [
      "P = \\tau_{\\text{out}} \\, \\omega = F \\, v \\,,\\quad v = \\dfrac{\\omega \\, d_{\\text{SI}}}{2\\pi}",
      "F_{\\text{out}} = \\dfrac{2\\pi \\, \\tau_{\\text{out}}}{d_{\\text{SI}}} \\quad (d_{\\text{SI}} = \\text{travel/load rev in m})",
    ],
  },
  tr: {
    title: "Total Gear Ratio",
    description:
      "The cumulative product of all individual stage ratios in the motion chain. A ratio of N:1 means the motor turns N times for every one turn of the output. Determines the tradeoff between speed and torque.",
    math: [
      "R_{\\text{total}} = \\prod_{i} R_i",
    ],
  },
  te: {
    title: "Combined Efficiency",
    description:
      "The overall power-transfer efficiency from motor shaft to load. Each mechanical stage introduces friction losses; the total is the product of all individual efficiencies. Values below 90% may indicate significant power loss in the drivetrain.",
    math: [
      "\\eta_{\\text{total}} = \\prod_{i} \\eta_i",
    ],
  },
};
