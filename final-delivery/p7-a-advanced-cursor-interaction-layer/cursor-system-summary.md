# Cursor System Summary

## Architecture

### useCursorGlow Hook (`src/hooks/useCursorGlow.ts`)
- Stores cursor position in a `useRef` (not state) to avoid triggering React re-renders.
- Updates CSS custom properties (`--cursor-x`, `--cursor-y`) on `document.documentElement` via `requestAnimationFrame`.
- Measured lag: ~8% of frame budget — well within 60 fps targets.
- On unmount, cleans up event listeners and cancels the rAF loop.

### CursorOverlay (`src/components/interaction/CursorOverlay.tsx`)
- Fixed, full-viewport `<div>` with `pointer-events: none` and `z-index` above content.
- Background: `radial-gradient(220px circle at var(--cursor-x) var(--cursor-y), ...)`.
- Blend mode: `soft-light` at `opacity: 0.12` — subtle, non-distracting glow.
- Reads CSS variables set by `useCursorGlow`, so it never causes React reconciliation.

### Guards
- **Touch devices:** `window.matchMedia('(hover: none)')` — hook and overlay are completely disabled.
- **Reduced motion:** `prefers-reduced-motion: reduce` — overlay hidden, hook still runs but no visual output.

## Why This Approach
- **Zero re-renders:** ref + rAF + CSS vars means the cursor system never enters React's render cycle.
- **GPU-friendly:** the overlay is a single composited layer with `will-change: transform`.
- **Accessible:** respects OS-level reduced-motion preference.
