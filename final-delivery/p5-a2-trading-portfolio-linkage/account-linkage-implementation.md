# Account Linkage Implementation

**日期:** 2026-06-18

---

## 架构

```
TradePanel → trade-engine.ts → account-storage.ts → localStorage
                ↓
         orders.ts (createOrder)
```

## localStorage Keys

| Key | 内容 | P5-A2 改动 |
|-----|------|-----------|
| nexus-trade-orders | 订单列表 | 不变 |
| nexus-trade-account | AccountSummary | 交易后更新 |
| nexus-trade-positions | Position[] | 交易后更新 |
| nexus-trade-transactions | AccountTransaction[] | 交易后新增 |
| nexus-trade-history | PortfolioHistory[] | 不变 |

## 公式

| 公式 | 实现 |
|------|------|
| avgCost (加仓) | (oldCost × oldQty + newCost) / (oldQty + newQty) |
| avgCost (新建) | (price × qty + commission) / qty |
| commission | max(5, total × 0.00025) |
| stampTax (卖出) | total × 0.0005 |
| realizedPnL | (sellPrice - avgCost) × qty - commission - stampTax |
| totalAssets | availableCash + marketValue |

## 数据兼容

- 旧订单数据不破坏：nexus-trade-orders key 不变
- localStorage 损坏降级：initializeAccount() fallback 到 mock 初始值
- 交易后刷新：initializeAccount() 保留已有 availableCash
- resetDemoAccount()：清除所有 key 并重新初始化
