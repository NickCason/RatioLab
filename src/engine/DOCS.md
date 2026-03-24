# engine/

Core kinematics and scaling computation for the motion chain. This is the mathematical heart of RatioLab — pure logic with zero UI dependencies.

## Files

### `compute.js`

Main computation pipeline. Takes a motion chain and produces all derived scaling values.

#### `compute(chain, outputMode, linearConfig, loadInertia) → Object | null`

Runs the full kinematics calculation across all chain stages.

**Parameters:**
- `chain` — Array of component objects (servo + stages)
- `outputMode` — `"rotary"` or `"linear"`
- `linearConfig` — `{ device, pitch, teeth, diameter, unit }` for load coupling
- `loadInertia` — Load inertia value in kg·cm²

**Algorithm:**
1. Finds the servo motor in the chain
2. Iterates non-servo stages, accumulating `totalRatio` (product of stage ratios) and `totalEfficiency` (product of stage efficiencies)
3. Computes encoder resolution: `PPR × 4` (quadrature), then `× totalRatio` for counts/load-rev
4. Determines travel per load revolution based on terminal mechanism:
   - **Rack & Pinion** → `pitch × teeth`
   - **Leadscrew** → `lead` value
   - **Linear coupling (sprocket)** → `pitch × teeth`
   - **Linear coupling (direct/wheel)** → `π × diameter`
   - **Rotary** → `360°`
5. Derives `unitsPerMotorRev`, `unitsPerCount`, output RPM, output linear speed
6. Computes output torque: `ratedTorque × ratio × efficiency`
7. Computes inertia: reflected load inertia `J_load / N²`, inertia ratio

**Returns:** Object with keys:
| Key | Meaning |
|-----|---------|
| `mrl` | Motor revolutions per load revolution |
| `cpm` | Counts per motor revolution (PPR × 4) |
| `cpl` | Counts per load revolution |
| `dpl` | Distance per load revolution |
| `upm` | Units per motor revolution |
| `upc` | Units per encoder count |
| `u` | Unit string (`"in"`, `"mm"`, `"deg"`) |
| `tr` | Total gear ratio |
| `te` | Total efficiency (0–1) |
| `tq` | Output torque (Nm) |
| `ppr` | Encoder PPR |
| `rpl` | Boolean — rack & pinion is last stage |
| `lsl` | Boolean — leadscrew is last stage |
| `rpm` | Motor rated RPM |
| `oRPM` | Output shaft RPM |
| `oSpd` | Output linear speed (units/min) |
| `jMotor` | Rotor inertia |
| `jLoad` | Load inertia |
| `jReflected` | Reflected load inertia |
| `inertiaRatio` | J_reflected / J_motor |

---

### `helpers.js`

Utility functions for chain analysis and stage-level calculations.

#### `num(value, fallback = 0) → number`
Safe numeric parser. Returns `fallback` when input is `NaN` or `0`.

#### `stageRatio(stage) → number`
Computes the transmission ratio for a single stage by type:
- **Gearbox** → `ratioNum / ratioDen`
- **Gear Mesh** → `drivenTeeth / drivingTeeth`
- **Belt/Pulley** → teeth ratio or diameter ratio depending on `bpMode`
- **All others** → `1`

#### `stageEfficiency(stage) → number`
Converts stage efficiency percentage to decimal (`efficiency / 100`).

#### Chain Query Functions
| Function | Returns |
|----------|---------|
| `isLastRackPinion(chain)` | `true` if the last non-servo stage is a rack & pinion |
| `hasRackPinion(chain)` | `true` if any stage is a rack & pinion |
| `isLastLeadscrew(chain)` | `true` if the last non-servo stage is a leadscrew |
| `hasLeadscrew(chain)` | `true` if any stage is a leadscrew |
| `hasTerminalLinear(chain)` | `true` if rack/pinion or leadscrew exists |
| `isLastTerminalLinear(chain)` | `true` if the last non-servo stage is a terminal linear |
| `getTerminalLinearIndex(chain)` | Index of the first rack/pinion or leadscrew, or `-1` |

#### `getBadgeText(stage) → string`
Returns a compact display string for a stage's configuration (e.g. `"10:1"`, `"60/20 = 3.000"`, `"10.000 in/rev"`).

---

### `index.js`
Barrel re-export of `compute` and all `helpers` exports.
