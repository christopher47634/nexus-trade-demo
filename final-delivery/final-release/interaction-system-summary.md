# NexusTrade — Interaction System Summary

## Interaction Patterns

### 1. Card Hover Interaction

**Trigger:** Mouse enter on sector/stock card
**Effect:**
- `transform: scale(1.02)` — subtle lift
- `box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15)` — blue glow
- `border-color` transition to primary
- Duration: 200ms ease-out

**Purpose:** Affordance — signals clickability

### 2. Button Press Feedback

**Trigger:** Click/press on any button
**Effect:**
- `transform: scale(0.98)` — press down
- `brightness(0.9)` — darken
- Duration: 100ms

**Purpose:** Tactile feedback

### 3. Trade Panel Interaction

**Flow:**
1. Toggle Buy/Sell → color change (green/red)
2. Input price → market price default, editable
3. Input quantity → increment/decrement buttons
4. Real-time total calculation → price × quantity
5. Submit → loading state → success toast

### 4. Demo Mode Toggle

**Activation:**
```javascript
localStorage.setItem('demoMode', 'true')
localStorage.setItem('nexus-trade-demo-active', 'true')
// → Reload → Demo overlay appears
```

**Deactivation:**
```javascript
localStorage.removeItem('demoMode')
localStorage.removeItem('nexus-trade-demo-active')
// → Reload → Normal mode
```

### 5. Navigation Transitions

**Route Change:**
- Next.js client-side navigation
- Page content swap (no full reload)
- Scroll to top on navigate
- Loading indicator for slow routes

### 6. Responsive Interactions

**Mobile (390px):**
- Touch targets ≥ 44px
- Swipe gestures where applicable
- Bottom sheet for trade panel
- Tap-to-expand cards

**Desktop (1440px):**
- Hover states active
- Keyboard navigation
- Side panel for trade
- Multi-column layout

### 7. Loading States

**Pattern:**
- Skeleton placeholders for data
- Spinner for actions
- Disabled buttons during submission
- Optimistic UI where safe

### 8. Error Handling

**Trade Errors:**
- Insufficient balance → inline error message
- Invalid quantity → field validation
- Network error → toast notification
- Recovery: clear error on input change

## Animation Catalog

| Animation | Trigger | Duration | Property |
|-----------|---------|----------|----------|
| Card hover | mouseenter | 200ms | transform, shadow |
| Button press | mousedown | 100ms | transform |
| Price flash | data update | 300ms | color (flash green/red) |
| Modal enter | mount | 300ms | opacity, transform |
| Modal exit | unmount | 200ms | opacity, transform |
| Toast show | action result | 300ms | transform (slide up) |
| Toast hide | auto-dismiss | 200ms | opacity |
| Skeleton pulse | loading | 1.5s | opacity (loop) |

## Accessibility

- Focus visible outlines on interactive elements
- ARIA labels on buttons and inputs
- Keyboard navigation support
- Color contrast ratio ≥ 4.5:1 (WCAG AA)
- Screen reader compatible structure
