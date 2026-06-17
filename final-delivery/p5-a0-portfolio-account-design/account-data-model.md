# P5-A0 账户数据模型

## 1. TypeScript 接口定义

### 1.1 AccountSummary（账户摘要）

```typescript
interface AccountSummary {
  totalAssets: number        // 总资产 = availableCash + marketValue
  availableCash: number      // 可用资金（初始值 1,000,000）
  marketValue: number        // 持仓市值 = sum(所有 Position.marketValue)
  totalPnL: number           // 累计盈亏 = totalAssets - 初始资金(1,000,000)
  todayPnL: number           // 今日盈亏 = sum(所有 Position.todayPnL)
  riskLevel: 'low' | 'medium' | 'high'  // 基于 positionRatio
  positionRatio: number      // 仓位比例 = marketValue / totalAssets
  updatedAt: string          // ISO 时间戳
}
```

| 字段 | 类型 | 默认值 | 计算公式 | 说明 |
|------|------|--------|----------|------|
| `totalAssets` | `number` | `1000000` | `availableCash + marketValue` | 账户总资产 |
| `availableCash` | `number` | `1000000` | 买入时扣减，卖出时增加 | 可用资金 |
| `marketValue` | `number` | `0` | `Σ(position.marketValue)` | 所有持仓市值之和 |
| `totalPnL` | `number` | `0` | `totalAssets - 1000000` | 累计盈亏 |
| `todayPnL` | `number` | `0` | `Σ(position.todayPnL)` | 今日盈亏 |
| `riskLevel` | `'low' \| 'medium' \| 'high'` | `'low'` | `low(<30%) / medium(30%-70%) / high(>70%)` | 风险等级 |
| `positionRatio` | `number` | `0` | `marketValue / totalAssets` | 仓位比例（0-1） |
| `updatedAt` | `string` | 当前 ISO 时间 | 每次更新时刷新 | 最后更新时间 |

### 1.2 Position（持仓）

```typescript
interface Position {
  stockCode: string          // 股票代码
  stockName: string          // 股票名称
  sectorId: string           // 所属板块 ID
  quantity: number           // 持仓数量
  availableQuantity: number  // 可卖数量（Demo 简化：= quantity，不做 T+1）
  avgCost: number            // 平均成本
  openPrice: number          // 今日开盘价，用于计算 todayPnL
  currentPrice: number       // 当前价格（快照更新）
  marketValue: number        // 市值 = currentPrice × quantity
  unrealizedPnL: number      // 浮动盈亏 = (currentPrice - avgCost) × quantity
  unrealizedPnLPercent: number // 浮盈比例 = (currentPrice - avgCost) / avgCost × 100
  todayPnL: number           // 今日盈亏 = (currentPrice - openPrice) × quantity
  positionRatio: number      // 仓位占比 = marketValue / AccountSummary.totalAssets
  riskLevel: 'low' | 'medium' | 'high'
}
```

| 字段 | 类型 | 默认值 | 计算公式 | 说明 |
|------|------|--------|----------|------|
| `stockCode` | `string` | — | — | 股票代码，如 `"600519"` |
| `stockName` | `string` | — | — | 股票名称，如 `"贵州茅台"` |
| `sectorId` | `string` | — | — | 所属板块 ID |
| `quantity` | `number` | `0` | 买入增加，卖出减少 | 持仓数量 |
| `availableQuantity` | `number` | `0` | **Demo 简化：= quantity** | 可卖数量（不做 T+1） |
| `avgCost` | `number` | 买入价 | `(旧avgCost×旧qty + price×newQty) / (旧qty+newQty)` | 平均成本 |
| `openPrice` | `number` | 买入价 | 首次买入时设为买入价 | 今日开盘价 |
| `currentPrice` | `number` | 买入价 | 访问持仓页时从 Mock 股票数据快照更新 | 当前价格 |
| `marketValue` | `number` | `0` | `currentPrice × quantity` | 市值 |
| `unrealizedPnL` | `number` | `0` | `(currentPrice - avgCost) × quantity` | 浮动盈亏 |
| `unrealizedPnLPercent` | `number` | `0` | `(currentPrice - avgCost) / avgCost × 100` | **除零保护：avgCost=0 时返回 0** |
| `todayPnL` | `number` | `0` | `(currentPrice - openPrice) × quantity` | 今日盈亏 |
| `positionRatio` | `number` | `0` | `marketValue / AccountSummary.totalAssets` | 仓位占比 |
| `riskLevel` | `'low' \| 'medium' \| 'high'` | `'low'` | `low(<30%) / medium(30%-70%) / high(>70%)` | 风险等级 |

### 1.3 PortfolioHistory（资产历史）

```typescript
interface PortfolioHistory {
  date: string               // YYYY-MM-DD
  totalAssets: number        // 当日总资产
  marketValue: number        // 当日持仓市值
  cash: number               // 当日可用资金
  pnl: number                // 当日盈亏
}
```

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `date` | `string` | — | 日期，格式 `YYYY-MM-DD` |
| `totalAssets` | `number` | `1000000` | 当日收盘总资产 |
| `marketValue` | `number` | `0` | 当日收盘持仓市值 |
| `cash` | `number` | `1000000` | 当日收盘可用资金 |
| `pnl` | `number` | `0` | 当日盈亏 = totalAssets - 前一日 totalAssets |

### 1.4 AccountTransaction（资金流水）

```typescript
interface AccountTransaction {
  id: string                 // 唯一 ID
  type: 'buy' | 'sell' | 'fee' | 'dividend' | 'adjustment'
  stockCode: string          // 股票代码
  amount: number             // 金额（买入为负，卖出为正）
  realizedPnL?: number       // 仅 sell 类型有值
  createdAt: string          // ISO 时间戳
  relatedOrderId: string     // 关联订单 ID
}
```

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `id` | `string` | `uuid()` | 唯一标识 |
| `type` | `'buy' \| 'sell' \| 'fee' \| 'dividend' \| 'adjustment'` | — | 交易类型 |
| `stockCode` | `string` | — | 股票代码 |
| `amount` | `number` | — | 金额，买入为负，卖出为正 |
| `realizedPnL` | `number \| undefined` | `undefined` | **仅 sell 类型有值** = `(sellPrice - avgCost) × sellQuantity` |
| `createdAt` | `string` | 当前 ISO 时间 | 创建时间 |
| `relatedOrderId` | `string` | — | 关联的订单 ID |

## 2. localStorage Key 设计

| Key | 数据类型 | 初始值 | 说明 |
|-----|----------|--------|------|
| `nexus-trade-orders` | `Order[]` | `[]` | **已有，不修改** |
| `nexus-trade-account` | `AccountSummary` | 见下方默认值 | 新增 |
| `nexus-trade-positions` | `Position[]` | `[]` | 新增 |
| `nexus-trade-transactions` | `AccountTransaction[]` | `[]` | 新增 |
| `nexus-trade-history` | `PortfolioHistory[]` | 见下方默认值 | 新增 |

### 2.1 AccountSummary 默认值

```typescript
const DEFAULT_ACCOUNT: AccountSummary = {
  totalAssets: 1000000,
  availableCash: 1000000,
  marketValue: 0,
  totalPnL: 0,
  todayPnL: 0,
  riskLevel: 'low',
  positionRatio: 0,
  updatedAt: new Date().toISOString()
}
```

### 2.2 PortfolioHistory 默认值

```typescript
const DEFAULT_HISTORY: PortfolioHistory[] = [
  {
    date: new Date().toISOString().split('T')[0],  // 今天
    totalAssets: 1000000,
    marketValue: 0,
    cash: 1000000,
    pnl: 0
  }
]
```

## 3. 数据关系图

```
nexus-trade-orders (已有)
       │
       │ 订单提交成功后触发
       ▼
nexus-trade-positions (新增)  ◄─── Mock 股票数据（快照更新 currentPrice）
       │
       │ 汇总计算
       ▼
nexus-trade-account (新增)
       │
       │ 每日快照
       ▼
nexus-trade-history (新增)

nexus-trade-transactions (新增) ◄─── 每次买卖生成流水
```
