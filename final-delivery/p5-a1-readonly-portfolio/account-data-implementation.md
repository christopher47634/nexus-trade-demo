# P5-A1 Account Data Implementation

**日期:** 2026-06-18

---

## 数据结构

### localStorage Keys

| Key | 类型 | 说明 |
|-----|------|------|
| nexus-trade-account | AccountSummary | 账户总览 |
| nexus-trade-positions | Position[] | 持仓列表 |
| nexus-trade-transactions | AccountTransaction[] | 资金流水 |
| nexus-trade-history | PortfolioHistory[] | 资产曲线 |
| nexus-trade-orders | Order[] | （已有，不修改） |

### 公式

| 字段 | 公式 |
|------|------|
| marketValue | currentPrice × quantity |
| unrealizedPnL | (currentPrice - avgCost) × quantity |
| unrealizedPnLPercent | (currentPrice - avgCost) / avgCost × 100 (avgCost=0 → 0) |
| todayPnL | (currentPrice - openPrice) × quantity |
| totalAssets | availableCash + sum(所有 Position.marketValue) |
| positionRatio | marketValue / totalAssets |

---

## SSR 兼容

account-storage.ts 中所有读取函数都有 `typeof window === 'undefined'` 保护：
- 服务端返回默认值
- 客户端从 localStorage 读取
- initializeAccount() 在页面 useEffect 中调用

---

## 初始化流程

1. 页面加载 → useEffect → initializeAccount()
2. 检查 localStorage 是否有 nexus-trade-account
3. 如无 → 写入默认 AccountSummary + 默认 Positions + Transactions + History
4. 如有 → 读取现有数据
5. 渲染页面
