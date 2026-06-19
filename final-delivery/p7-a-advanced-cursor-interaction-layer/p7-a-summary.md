# P7-A: Advanced Cursor Interaction Layer

## Goal
Add a premium cursor glow effect and magnetic card interactions to the stock trading demo, enhancing the visual polish without modifying any business logic.

## Branch & Commit
- **Branch:** `p7-a-advanced-cursor-interaction-layer`
- **Commit:** `7003827`

## Implementation
- `useCursorGlow` hook — tracks cursor via ref + rAF, writes CSS custom properties (no React re-renders)
- `CursorOverlay` — full-viewport radial-gradient glow (220px, soft-light blend, opacity 0.12)
- `MagneticSurface` — perspective tilt (max 1.5deg) + lift (-3px) + glow follow on hover
- `ClickRipple` — expanding ripple on click for TradePanel
- Integrated into DesktopShell, AdvancedSectorCard, AccountOverviewCard, TradePanel
- CSS additions: `ripple-expand`, `cursor-glow-overlay`, `row-interactive::before`, `demo-ring-pulse`

## QA Result
**12 / 13 PASS** (1 unrelated fail — React #418 SSR hydration warning, pre-existing)

## Risk
**Low.** All additions are pure CSS / `pointer-events: none` overlays. Zero changes to business logic, data flow, or API calls.
