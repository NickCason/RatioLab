# config/

Central configuration, type definitions, defaults, theming, and tooltip content. All other modules import from here — this is the single source of truth for component types, default parameters, and visual identity.

## Files

### `types.js`

String-enum constants for the type system.

#### `ComponentType`
```
SERVO        → "servo"
GEARBOX      → "gearbox"
GEAR_MESH    → "gear_mesh"
BELT_PULLEY  → "belt_pulley"
RACK_PINION  → "rack_pinion"
LEADSCREW    → "lead_screw"
```

#### `OutputDevice`
```
SPROCKET → "sprocket"
DIRECT   → "direct"
```

---

### `defaults.js`

Component definitions, ID generation, and default chain factory.

#### `COMPONENT_DEFS`
Map of `ComponentType` → `{ label, defaults }`. Each `defaults` object contains the initial property values for that component type (name, numeric parameters, unit preferences).

| Type | Default Parameters |
|------|-------------------|
| Servo | `encoderPPR: 8192`, `ratedTorqueNm: 3.0`, `ratedSpeedRPM: 3000`, `rotorInertia: 1.2` |
| Gearbox | `ratioNum: 10`, `ratioDen: 1`, `efficiency: 95` |
| Gear Mesh | `drivingTeeth: 20`, `drivenTeeth: 60`, `efficiency: 98` |
| Belt/Pulley | `bpMode: "teeth"`, teeth: 16/48, dia: 2/6, `efficiency: 97` |
| Rack & Pinion | `pinionTeeth: 20`, `pinionPitch: 0.5`, `rpUnit: "in"`, `efficiency: 96` |
| Leadscrew | `lead: 5`, `lsUnit: "mm"`, `efficiency: 90` |

#### `generateId() → string`
Auto-incrementing ID with timestamp suffix: `c{n}_{base36_timestamp}`.

#### `createDefaultChain() → Array`
Returns a two-element chain: one Servo Motor + one Gearbox with fresh IDs.

---

### `theme.js`

Per-component-type color palettes for light and dark modes.

#### `CARD_THEMES_LIGHT` / `CARD_THEMES_DARK`
Map of `ComponentType` → color object with keys:
`accent`, `bg`, `bg2`, `text`, `sub`, `inBg`, `inBrd`, `inTxt`, `badge`, `icon`, `border`

Used by `Card.jsx` and `ChainCanvas.jsx` to style each mechanism card.

---

### `tooltips.js`

Educational tooltip content displayed on hover over mechanism cards and dashboard results.

#### `MECHANISM_TOOLTIPS`
Map of `ComponentType` → `{ title, description, math[] }` where `math` contains KaTeX strings explaining the mechanism's ratio formula.

#### `OUTPUT_TOOLTIPS`
Map of result keys (`mrl`, `cpl`, `upm`, `upc`, `dpl`, `tq`, `oRPM`, `oSpd`, `tr`, `te`) → same shape. Each explains what the output value means and how it's calculated.

---

### `index.js`
Barrel re-export of `types`, `theme`, `defaults`, and `tooltips`.
