# NexusTrade — Portfolio Case Study

## Project Overview

**NexusTrade** — A production-quality stock trading interface demo showcasing
modern frontend engineering, responsive design, and interactive UX patterns.

**Live Demo:** https://stock-trading-demo.vercel.app

---

## The Challenge

Design and build a professional-grade stock trading interface that demonstrates:
- Real-time data visualization
- Complex interactive forms (trade execution)
- Responsive design across all devices
- Demo mode for portfolio presentation without real data

## The Solution

### Tech Stack
- **Next.js** (App Router) for server-side rendering and routing
- **React 18** for component architecture
- **TypeScript** for type safety
- **Tailwind CSS** for rapid, consistent styling
- **Vercel** for zero-config deployment

### Key Features Built

#### 1. Market Dashboard
A dark-themed dashboard with sector cards featuring hover interactions
(scale + glow effects), real-time index display, and responsive grid layout.

#### 2. Stock Detail & Trading
Individual stock pages with price charts, volume data, and an integrated
trade panel supporting buy/sell with real-time total calculation.

#### 3. Portfolio Management
Position tracking with 8-column table showing stock code, name, quantity,
cost basis, current price, P&L, P&L%, and market value.

#### 4. Demo Mode System
A localStorage-based demo system that pre-populates realistic trading data
(100 shares of 300308 at ¥128.56 = ¥12,856) for seamless portfolio
presentations without real API dependencies.

## Design Decisions

### Visual Language
- **Dark theme** — Professional trading terminal aesthetic
- **Glassmorphism** — Modern depth with backdrop-blur effects
- **Green/Red** — Universal trading color semantics (profit/loss)
- **Monospace numbers** — Aligned financial data display

### Interaction Design
- **Subtle hover** — scale(1.02) + blue glow for discoverability
- **Button feedback** — scale(0.98) press effect for tactile feel
- **Smooth transitions** — 200ms ease-out for professional polish

### Responsive Strategy
- **Mobile-first** — Starts at 390px (iPhone 14)
- **Progressive enhancement** — Adds features at larger breakpoints
- **Touch-optimized** — 44px minimum touch targets

## Results

| Metric | Value |
|--------|-------|
| Smoke Tests | 8/9 passed (1 non-blocking warning) |
| Screenshots | 10 production captures |
| Videos | 2 complete demo flows |
| Routes | 5 fully functional pages |
| Responsive | 3 breakpoints (mobile/tablet/desktop) |
| Demo Mode | Full data lifecycle (create → view → exit) |

## Technical Highlights

1. **Zero external API dependencies** — Fully self-contained demo
2. **localStorage state management** — Clean demo data lifecycle
3. **SSR + Client hydration** — Fast initial load + interactive
4. **Component composition** — Reusable, testable architecture
5. **Production-ready** — Deployed and verified on Vercel

## What I Learned

- Designing for financial data requires special attention to number formatting,
  alignment, and color semantics
- Demo mode is a powerful portfolio presentation tool — no backend needed
- Dark themes need careful contrast management for accessibility
- Responsive tables are challenging; card-based mobile layouts work better

---

**Built by:** [Your Name]
**Date:** June 2026
**Repository:** GitHub (stock-trading-demo)
