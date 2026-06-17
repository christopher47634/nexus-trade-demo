# Mobile Overflow Fix Report

## Problem
On mobile viewports (320px-390px), the IndexTicker component in the market indices bar caused horizontal page overflow. The `whitespace-nowrap` items inside the ticker made it wider than the viewport.

## Root Cause
The `<main>` element in `DesktopShell.tsx` used `flex-1 ml-16 min-h-screen` without `min-w-0`. CSS flexbox defaults `min-width` to `auto`, meaning the flex child expands to fit its content width. The IndexTicker's content (6 market indices with separators + summary stats) exceeds 390px, causing the `main` to grow beyond viewport width.

Despite `overflow-x: hidden` on `body` (globals.css line 131), the expanded `main` element created a layout overflow that the browser's scrollbar mechanism still detected.

## Fix Applied

**File**: `src/components/layout/DesktopShell.tsx`

**Change**:
```
- <main className="flex-1 ml-16 min-h-screen">
+ <main className="flex-1 ml-16 min-h-screen min-w-0 overflow-hidden">
```

**Why this works**:
- `min-w-0` overrides the default `min-width: auto`, allowing the flex child to shrink below its content width
- `overflow-hidden` clips any overflow within the main content area
- The IndexTicker's existing `overflow-x-auto no-scrollbar` handles horizontal scrolling within its own container
- Desktop layout unchanged - `min-w-0` has no effect when viewport is wider than content

## Visual Impact
- **Desktop**: No change (content fits within viewport)
- **Mobile**: Index ticker scrolls horizontally within its bar, no page-level horizontal scroll
- **No style changes**: Same appearance, same animations, same colors
