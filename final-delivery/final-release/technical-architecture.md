# NexusTrade — Technical Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI Library | React 18+ |
| Styling | Tailwind CSS |
| State | React Context + localStorage |
| Deployment | Vercel |
| Testing | Playwright |
| CI/CD | Vercel Git Integration |

## Project Structure

```
stock-trading-demo/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage (/)
│   ├── sectors/
│   │   └── [sectorId]/
│   │       └── page.tsx   # Sector detail
│   ├── stocks/
│   │   └── [code]/
│   │       └── page.tsx   # Stock detail + TradePanel
│   ├── orders/
│   │   └── page.tsx       # Orders page
│   └── portfolio/
│       └── page.tsx       # Portfolio page
├── components/            # Shared components
│   ├── TradePanel.tsx     # Trading interface
│   ├── DemoOverlay.tsx    # Demo mode indicator
│   ├── SectorCard.tsx     # Sector card component
│   └── PortfolioTable.tsx # Portfolio table
├── lib/                   # Utilities
│   ├── demo-data.ts       # Demo constants & data
│   └── store.ts           # State management
├── public/                # Static assets
├── final-delivery/        # Release artifacts
└── package.json
```

## Key Architectural Decisions

### 1. App Router (Next.js 13+)
- File-based routing with dynamic segments
- Server Components for static content
- Client Components for interactive features
- Streaming SSR for performance

### 2. Demo Mode Architecture
- localStorage-based state (no server dependency)
- Two keys: `demoMode` + `nexus-trade-demo-active`
- Client-side data injection
- Clean separation from real data

### 3. Responsive Design
- Mobile-first approach
- Tailwind responsive prefixes (sm:, md:, lg:)
- Flexible grid layouts
- Touch-optimized interactions

### 4. Component Design
- Atomic design principles
- Composition over inheritance
- Props-driven configuration
- Controlled components for forms

## Data Flow

```
User Action → Component State → localStorage
     ↓
  UI Update ← React Re-render ← Context Update
```

## Build & Deploy

```
Git Push → Vercel Build → Preview/Production
                ↓
        Build ID: d8n02h2eBn04xpiTmias5
                ↓
        https://stock-trading-demo.vercel.app
```

## Performance Considerations

- Next.js automatic code splitting
- Image optimization (Next.js Image)
- Font optimization
- Tailwind CSS purging
- Static generation where possible
