# Component Duplication Report

## EmptyState Comparison

| Aspect | `common/EmptyState.tsx` (kept) | `ui/EmptyState.tsx` (removed) |
|--------|-------------------------------|-------------------------------|
| Lines | 28 | 42 |
| Dependencies | framer-motion | framer-motion, lucide-react |
| Default icon | None (icon only shown if provided) | Inbox icon from lucide |
| Styling | `.glass` class | Inline styles with rounded-xl |
| Animation | y: 20, duration: 0.5 | y: 12, duration: 0.4 |
| Min height | min-h-[200px] | min-h-[180px] |
| Imported by | orders, sectors pages (4 files) | 0 files |

**Decision**: Keep `common/` version (active imports), delete `ui/` version (dead code).

## ErrorState Comparison

| Aspect | `common/ErrorState.tsx` (kept) | `ui/ErrorState.tsx` (removed) |
|--------|-------------------------------|-------------------------------|
| Lines | 50 | 51 |
| Dependencies | framer-motion | framer-motion, lucide-react |
| Icon | Inline SVG (circle + line) | AlertCircle from lucide |
| Retry button | Text only | Text + RefreshCw icon |
| Styling | `.glass` class + border | Inline styles with rounded-xl |
| Animation | y: 20, duration: 0.5 | y: 12, duration: 0.4 |
| Imported by | stocks, sectors, mobile pages (4 files) | 0 files |

**Decision**: Keep `common/` version (active imports), delete `ui/` version (dead code).

## Files Deleted
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/ErrorState.tsx`

## Files Retained
- `src/components/common/EmptyState.tsx` - used by orders, sectors pages
- `src/components/common/ErrorState.tsx` - used by stocks, sectors, mobile pages
- `src/components/ui/LoadingState.tsx` - unique to ui/
- `src/components/ui/WarningBanner.tsx` - unique to ui/

## Import Changes Required
None - all existing imports already use `@/components/common/`.
