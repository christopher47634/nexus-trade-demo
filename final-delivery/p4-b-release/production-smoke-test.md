# P4-B Production Smoke Test Report

**Date:** 2026-06-18
**Server:** Local (http://localhost:3458)
**Build:** Next.js 14.2.35, buildId: E9d1_8VEvHpffcvXU9uIq

> **Note:** Production deployment pending - Vercel token unavailable. Tests run against local server (port 3458). Local build matches production code.

---

## Test Results Summary

| # | Check | Status | Details |
|---|-------|--------|---------|
| 1 | Homepage loads | ✅ PASS | HTTP 200, contains "热门板块" |
| 2 | Sector detail (/sectors/optical-communication) | ✅ PASS | HTTP 200 |
| 3 | Stock detail (/stocks/300308) | ✅ PASS | HTTP 200, contains "中际旭创" |
| 4 | Orders page (/orders) | ✅ PASS | HTTP 200 |
| 5 | Mobile 390px - no horizontal overflow | ✅ PASS | scrollWidth=390, clientWidth=390 |
| 6 | Mobile 360px - no horizontal overflow | ✅ PASS | scrollWidth=360, clientWidth=360 |
| 7 | Mobile 320px - no horizontal overflow | ✅ PASS | scrollWidth=320, clientWidth=320 |
| 8 | Desktop 1440px - layout correct | ✅ PASS | Sector cards visible, no overflow, hasSectorData=true |

**Overall: 8/8 PASS**

---

## Detailed Results

### HTTP Route Checks (1-4)

All four routes return HTTP 200:

```
GET /                              → 200  (contains "热门板块")
GET /sectors/optical-communication → 200
GET /stocks/300308                 → 200  (contains "中际旭创")
GET /orders                        → 200
```

### Mobile Responsive Checks (5-7)

Tested with Playwright using Chromium, `isMobile: true`, `deviceScaleFactor: 2`:

- **390px** (iPhone 14 Pro): No horizontal overflow. Full sector list visible with category filters, sector names, performance percentages, and leading stocks.
- **360px** (smaller Android): No horizontal overflow. Layout adapts correctly.
- **320px** (smallest target): No horizontal overflow. All content fits within viewport.

### Desktop Layout Check (8)

Tested at 1440×900 viewport:

- Sidebar navigation visible with icons (Dashboard, Trending, Portfolio, Orders, Settings)
- Market indices bar at top: 上证指数, 深证成指, 创业板指, 科创50, 北证50
- Portfolio summary cards: 模拟总资产, 今日盈亏, 持仓市值, 可用资金
- **热门板块** sector grid: 10 sector cards (算力, 光通信, 低空经济, 半导体, 机器人, 新能源, 白酒, 医药, 矿山, 军工)
- Market sentiment gauge, 涨幅榜, 成交额榜, 自选股 panels
- No horizontal overflow (scrollWidth = clientWidth = 1440)

---

## Screenshots

| View | File |
|------|------|
| Mobile 390px | `mobile-390.png` |
| Mobile 360px | `mobile-360.png` |
| Mobile 320px | `mobile-320.png` |
| Desktop 1440px | `desktop-1440.png` |

---

## Pre-test Fix Applied

The initial local server instance had a stale build (chunk hash mismatch causing 400 errors on JS chunks). The server was rebuilt (`next build`) and restarted before running the smoke test. All tests pass on the fresh build.

---

## Conclusion

All 8 smoke test checks pass. The application renders correctly at mobile (320-390px) and desktop (1440px) viewports with no horizontal overflow. All key routes return HTTP 200 with expected content. The app is ready for production deployment once a Vercel token becomes available.
