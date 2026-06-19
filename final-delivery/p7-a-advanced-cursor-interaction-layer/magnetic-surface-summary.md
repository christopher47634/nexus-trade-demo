# Magnetic Surface Summary

## Component: `MagneticSurface` (`src/components/interaction/MagneticSurface.tsx`)

A wrapper component that adds a subtle 3D tilt + glow effect on hover, giving cards a "magnetic" feel as the cursor moves over them.

## Parameters
| Property | Value |
|---|---|
| Perspective | 800px |
| Max tilt | 1.5 degrees (X and Y) |
| Max lift (translateZ) | -3px |
| Glow | Radial gradient that follows the mouse position within the card |
| Transition | Smooth on mouse-leave (spring-like ease-out) |

## Usage
```tsx
<MagneticSurface>
  <AdvancedSectorCard ... />
</MagneticSurface>
```

## Applied To
1. **AdvancedSectorCard** (`src/components/sector-visuals/AdvancedSectorCard.tsx`) — sector overview cards
2. **AccountOverviewCard** (`src/components/portfolio/AccountOverviewCard.tsx`) — portfolio summary card

## Technical Notes
- Uses `onMouseMove` to calculate cursor offset relative to card center.
- Applies transform via inline style (no state updates, no re-renders for other components).
- Glow is a pseudo-element with radial-gradient positioned at cursor coordinates.
- On touch devices, the component renders children with no transform/glow overlay.
- `pointer-events` on the glow layer is `none` so it never intercepts clicks.
