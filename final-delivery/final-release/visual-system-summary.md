# NexusTrade — Visual System Summary

## Design Language

### Color Palette

| Role | Color | Usage |
|------|-------|-------|
| Background | #0a0e17 | Deep dark base |
| Surface | #111827 | Cards, panels |
| Surface Light | #1f2937 | Hover states |
| Primary | #3b82f6 | Accent, CTAs |
| Success | #10b981 | Positive P&L, buy |
| Danger | #ef4444 | Negative P&L, sell |
| Warning | #f59e0b | Alerts |
| Text Primary | #f9fafb | Main text |
| Text Secondary | #9ca3af | Labels, meta |
| Border | #374151 | Dividers |

### Typography

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| H1 | 2rem (32px) | 700 | Page titles |
| H2 | 1.5rem (24px) | 600 | Section headers |
| H3 | 1.25rem (20px) | 600 | Card titles |
| Body | 1rem (16px) | 400 | Content text |
| Small | 0.875rem (14px) | 400 | Meta, labels |
| Price | 1.5-2rem | 700 | Price displays |
| Monospace | Various | 500 | Numbers, codes |

### Spacing System

Based on 4px grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

### Border Radius

| Element | Radius |
|---------|--------|
| Cards | 12px (rounded-xl) |
| Buttons | 8px (rounded-lg) |
| Inputs | 8px (rounded-lg) |
| Badges | 6px (rounded-md) |

### Shadows & Effects

| Effect | CSS | Usage |
|--------|-----|-------|
| Card shadow | 0 4px 6px rgba(0,0,0,0.3) | Default card |
| Card hover | 0 8px 25px rgba(59,130,246,0.15) | Hover glow |
| Glassmorphism | backdrop-blur + bg opacity | Overlay panels |
| Gradient | linear-gradient(135deg, from-blue-500) | CTA buttons |

### Transitions

| Element | Duration | Easing |
|---------|----------|--------|
| Hover transform | 200ms | ease-out |
| Color change | 150ms | ease |
| Modal enter | 300ms | ease-out |
| Page transition | 200ms | ease-in-out |

## Component Styles

### Cards
```css
background: #111827
border: 1px solid #374151
border-radius: 12px
padding: 1.5rem
transition: all 200ms ease-out
hover: transform scale(1.02), shadow glow
```

### Buttons
```css
/* Primary */
background: linear-gradient(135deg, #3b82f6, #2563eb)
color: white
padding: 0.5rem 1.5rem
border-radius: 8px
hover: brightness(1.1)

/* Buy */
background: #10b981 (green)

/* Sell */
background: #ef4444 (red)
```

### Price Display
```css
font-family: monospace
font-weight: 700
/* Positive: color #10b981 */
/* Negative: color #ef4444 */
```

### Input Fields
```css
background: #1f2937
border: 1px solid #374151
border-radius: 8px
color: #f9fafb
focus: border-color #3b82f6, ring
```

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, compact |
| Tablet | 640-1024px | Two column |
| Desktop | > 1024px | Full grid |
| Wide | > 1440px | Expanded grid |
