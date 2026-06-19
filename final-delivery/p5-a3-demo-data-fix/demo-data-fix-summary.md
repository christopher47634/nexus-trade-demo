# Demo Data Fix Summary

**Date**: 2026-06-19
**Branch**: p5-a3-demo-portfolio-story
**Issue**: Demo 模式下 /orders 和 /portfolio 页面数据不可见

---

## 原现象

进入 demo 模式后:
1. **/orders 显示 0 笔订单** — 委托订单列表为空，尽管 demo 流程中已执行买入操作
2. **/portfolio 不显示持仓** — 持仓明细表格为空，无任何股票持仓
3. **/portfolio 不显示交易记录** — 资金流水为空
4. **Account Summary 不变化** — 总资产/可用资金/持仓市值始终保持 ¥0 或初始值

---

## 根因分析

### 直接原因: 旧 `.next` Build Cache

Next.js v14.2.35 的 `.next` build output 中缺少关键 vendor chunk:

```
Error: Cannot find module './vendor-chunks/motion-dom.js'
Require stack:
- /home/chris47634/stock-trading-demo/.next/server/app/stocks/[stockCode]/page.js
```

这导致:
- `/stocks/[stockCode]` 页面 SSR 阶段直接报错
- `framer-motion` 的 `motion-dom` 模块无法加载
- DemoGuide 组件无法正确执行 `ensureDemoTradeSeeded()`
- 下游的 `/orders` 和 `/portfolio` 页面因未 seed 数据而显示空状态

### 修复: 重新构建

```bash
rm -rf .next
npx next build
```

重建后 `motion-dom.js` vendor chunk 正确生成，所有页面恢复正常。

---

## 最终修复方案 (3 层保障)

### 1. DemoGuide Seed (主要)
`DemoGuide.tsx` 组件在 demo 模式激活时自动调用 `ensureDemoTradeSeeded()`:
- 写入 `nexus-trade-demo-orders` (1 笔 demo 订单)
- 写入 `nexus-trade-demo-positions` (4 只 demo 持仓)
- 写入 `nexus-trade-demo-transactions` (12 笔 demo 交易)
- 更新 account summary (总资产/可用资金/持仓市值)

### 2. Pages 兜底 Seed (防御)
`/orders` 和 `/portfolio` 页面在客户端 mount 时检查:
- 如果 `isDemoModeActive()` 为 true 且数据为空 → 重新调用 `ensureDemoTradeSeeded()`
- 确保即使 DemoGuide 尚未完成初始化，页面也能显示数据

### 3. Hydrate State (恢复)
客户端 hydrate 时从 localStorage 恢复:
- `demoMode` / `demoModeStep` → DemoProvider context
- `nexus-trade-demo-*` → 各页面组件 state
- 确保页面刷新后数据不丢失

---

## 验证结果

| 检查项 | 修复前 | 修复后 |
|--------|--------|--------|
| /orders 订单数 | 0 笔 | 1 笔 (demo-order-p5-a3-001) |
| /portfolio 持仓数 | 0 只 | 4 只 (600519/300308/300750/688256) |
| /portfolio 交易记录 | 0 笔 | 12 笔 |
| Account Summary | ¥0 | ¥1,006,936 |
| 300308 页面 | SSR Error | 正常渲染 K 线图 + 盘口 |
