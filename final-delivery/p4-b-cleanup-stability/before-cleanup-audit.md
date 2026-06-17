# Before Cleanup Audit

## Issue 1: Mobile Market Indices Bar Overflow

**Symptom**: On mobile viewports (375px-390px), the IndexTicker component causes horizontal page overflow, creating a horizontal scrollbar.

**Root Cause**: In `DesktopShell.tsx`, the `<main>` element uses `flex-1 ml-16 min-h-screen` but lacks `min-w-0`. In CSS flexbox, a flex child with `flex-1` but no `min-width: 0` will expand to fit its content width. The IndexTicker contains multiple `whitespace-nowrap` items that collectively exceed mobile viewport width. This causes the `main` element to grow beyond the viewport, triggering horizontal overflow on the body despite `overflow-x: hidden` being set.

**Files involved**:
- `src/components/layout/DesktopShell.tsx` - main wrapper, missing `min-w-0`
- `src/components/market/IndexTicker.tsx` - ticker with `overflow-x-auto no-scrollbar`
- `src/styles/globals.css` - has `overflow-x: hidden` on body (line 131)

**Status**: Fix pending

---

## Issue 2: Component Duplication

**Duplicate components found**:
- `src/components/ui/EmptyState.tsx` - newer version with lucide icon, inline styles, rounded-xl
- `src/components/common/EmptyState.tsx` - original version with glass class, no default icon
- `src/components/ui/ErrorState.tsx` - newer version with lucide AlertCircle+RefreshCw, inline styles
- `src/components/common/ErrorState.tsx` - original version with inline SVG, glass class

**Components only in ui/** (no duplicates):
- `src/components/ui/LoadingState.tsx`
- `src/components/ui/WarningBanner.tsx`

**Import analysis**:
- All pages import from `@/components/common/` (orders, sectors, stocks, mobile)
- Zero pages import from `@/components/ui/` for EmptyState or ErrorState
- `ui/EmptyState` and `ui/ErrorState` are dead code

**Status**: Cleanup pending
