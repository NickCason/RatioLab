# styles/

Global CSS architecture. These files establish the design system that all component-level CSS builds upon.

## Files

### `variables.css`
CSS custom properties (variables) defining the design tokens:
- Color palette for light and dark themes (via `[data-theme]` selectors)
- Typography scale
- Spacing and sizing tokens
- Border radii and shadow values
- Transition timing

### `global.css`
Global styles applied to the `body` and root elements:
- Font stack and base typography
- Background and text color bindings to CSS variables
- Smooth scrolling
- Focus-visible outlines
- Global layout constraints

### `reset.css`
CSS reset / normalization:
- Box-sizing border-box
- Margin/padding resets
- Consistent form element styling
- Image max-width
- Button/input font inheritance

## CSS Architecture
- Component-level styles live alongside their components (e.g. `Card.css`, `Dashboard.css`)
- Theme switching is handled via `[data-theme="dark"]` / `[data-theme="light"]` attribute selectors on the root element
- No CSS-in-JS — all plain CSS files imported by their component modules
