# hooks/

Custom React hooks encapsulating the app's core stateful logic. Each hook owns a specific domain: chain data management, drag-and-drop behavior, and theme persistence.

## Files

### `useChain.js`

#### `useChain() → { chain, setChain, add, update, remove, duplicate }`

Manages the motion chain array — the central data structure of the application.

**State:** Array of component objects initialized via `createDefaultChain()` (Servo + Gearbox).

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `update` | `(id, updates)` | Merges partial updates into the component matching `id` |
| `add` | `(type, insertIndex?)` | Creates a new component from `COMPONENT_DEFS`, auto-numbers duplicates (e.g. "Gearbox 2"), optionally splices at `insertIndex` |
| `remove` | `(id)` | Filters out the component with matching `id` |
| `duplicate` | `(component)` | Clones a component with a new ID and " Copy" suffix, inserts after the original |

All methods are `useCallback`-wrapped for referential stability.

---

### `useDragDrop.js`

#### `useDragDrop(setChain, chain) → Object`

Manages drag-and-drop interactions for both card reordering and palette insertion.

**Internal:** `isTerminalType(type)` — returns `true` for rack/pinion and leadscrew.

**State:**
- `dragIdx` / `dragOverIdx` — indices for card-to-card reorder
- `dropOn` — boolean drop target indicator
- `paletteType` / `paletteInsertIdx` — type and index for palette drag-to-insert

**Derived:** `termLinIdx` — index of the first terminal linear stage in the chain.

**Returned handlers:**

| Handler | Purpose |
|---------|---------|
| `onDragStart(event, index)` | Initiates card reorder; blocks dragging the servo (index 0) |
| `onDragEnd()` | Resets drag state |
| `onDragOver(event, index)` | Validates drop target; enforces terminal-linear-must-be-last rule |
| `onDrop(event, index)` | Commits reorder with the same terminal-linear constraint check |
| `paletteDragStart(event, type)` | Initiates palette-to-chain drag |
| `paletteDragEnd()` | Resets palette drag state |

**Key constraint:** Non-terminal components cannot be placed after a terminal linear (rack/pinion or leadscrew) in the chain.

---

### `useTheme.js`

#### `useTheme() → { dark, toggle }`

Manages light/dark theme with `localStorage` persistence.

**Internal:** `readStored()` — reads `localStorage` key `ratiolab-theme`, returns boolean.

**Behavior:**
- On mount, reads stored preference (defaults to light)
- `useEffect` sets `document.documentElement` attribute `data-theme` to `"dark"` or `"light"`
- `toggle()` flips state and persists to `localStorage`
