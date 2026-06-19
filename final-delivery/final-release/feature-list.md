# NexusTrade — Feature List

## Core Features

### 1. 首页 Dashboard
- Market overview with sector cards
- Real-time index display
- Responsive grid layout
- Hover interaction with scale/glow effects

### 2. 板块详情 (Sector Detail)
- Sector-specific stock listing
- Sector performance metrics
- Navigation breadcrumb
- Responsive card grid

### 3. 个股详情 (Stock Detail)
- Real-time price display (¥)
- K-line chart visualization
- Volume and turnover data
- Price change indicators (涨跌幅)
- Technical indicators

### 4. 交易面板 (TradePanel)
- Buy/Sell toggle (买入/卖出)
- Price input with market price default
- Quantity input with increment controls
- Order total calculation
- Submit order with confirmation
- Trade success/failure feedback

### 5. 订单管理 (Orders)
- Order history list
- Order status display (pending/filled/cancelled)
- Order details (stock, price, quantity, total)
- Demo order integration

### 6. 持仓管理 (Portfolio)
- Position table with 8 columns
- Stock code, name, quantity, cost, current price, P&L, P&L%, market value
- Total portfolio value
- Daily P&L summary
- Responsive table layout

### 7. Demo Mode System
- localStorage-based activation
- `demoMode` + `nexus-trade-demo-active` keys
- Demo overlay indicator
- Pre-populated demo data (100股 300308 @ ¥128.56)
- Demo order: demo-order-p5-a3-001
- Clean exit with localStorage cleanup

### 8. Visual Design System
- Dark theme (professional trading UI)
- Glassmorphism effects
- Gradient accents
- Smooth transitions (200-300ms)
- Responsive breakpoints (mobile/tablet/desktop)

### 9. Interaction System
- Card hover with scale(1.02) + glow
- Button press feedback
- Smooth page transitions
- Touch-friendly mobile interactions
- Loading states

### 10. Responsive Design
- Mobile (390px): Single column, compact cards
- Tablet (768px): Two column layout
- Desktop (1440px): Full grid with side panels

## Demo Data Constants

| Key | Value |
|-----|-------|
| DEMO_ORDER_ID | demo-order-p5-a3-001 |
| DEMO_POSITION_STOCK | 300308 (中际旭创) |
| DEMO_ACTIVE_KEY | nexus-trade-demo-active |
| Demo Trade | 买入 100股 @ ¥128.56 = ¥12,856 |
