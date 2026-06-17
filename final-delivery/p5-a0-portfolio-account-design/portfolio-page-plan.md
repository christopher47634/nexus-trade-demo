# P5-A0 持仓页面规划

## 1. 桌面端 /portfolio 页面

### 1.1 页面结构

```
/portfolio
├── AccountOverviewCard        // 账户概览卡片
├── Tabs                       // Tab 切换
│   ├── Tab: 持仓
│   │   └── PositionTable      // 持仓表格
│   ├── Tab: 资金流水
│   │   └── TransactionList    // 流水列表
│   └── Tab: 资产曲线
│       └── AssetChart         // 折线图
└── EmptyState                 // 无持仓时的空状态
```

### 1.2 AccountOverviewCard

| 展示项 | 数据来源 | 格式 | 说明 |
|--------|----------|------|------|
| 总资产 | `account.totalAssets` | `¥1,000,000.00` | — |
| 可用资金 | `account.availableCash` | `¥1,000,000.00` | — |
| 持仓市值 | `account.marketValue` | `¥0.00` | — |
| 今日盈亏 | `account.todayPnL` | `+¥0.00` / `-¥0.00` | 红涨绿跌 |
| 仓位比例 | `account.positionRatio` | `0%` | 颜色：绿(<30%) / 黄(30-70%) / 红(>70%) |
| 累计盈亏 | `account.totalPnL` | `+¥0.00` / `-¥0.00` | — |

### 1.3 PositionTable 列定义

| 列名 | 字段 | 宽度 | 格式 | 排序 |
|------|------|------|------|------|
| 股票名称 | `stockName` | 120px | 文本 | ✅ |
| 代码 | `stockCode` | 80px | 文本 | ✅ |
| 持仓量 | `quantity` | 80px | 数字 | ✅ |
| 成本 | `avgCost` | 100px | `¥0.00` | ✅ |
| 现价 | `currentPrice` | 100px | `¥0.00` | ✅ |
| 市值 | `marketValue` | 120px | `¥0.00` | ✅ |
| 盈亏 | `unrealizedPnL` | 100px | `+¥0.00` / `-¥0.00` | ✅ |
| 盈亏比例 | `unrealizedPnLPercent` | 80px | `+0.00%` | ✅ |
| 仓位 | `positionRatio` | 80px | `0.0%` | ✅ |

### 1.4 TransactionList

| 列名 | 字段 | 格式 |
|------|------|------|
| 时间 | `createdAt` | `YYYY-MM-DD HH:mm` |
| 类型 | `type` | 买入/卖出/费用/分红/调整 |
| 股票 | `stockCode` | 文本 |
| 金额 | `amount` | `+¥0.00` / `-¥0.00` |
| 已实现盈亏 | `realizedPnL` | `+¥0.00`（仅卖出） |

### 1.5 AssetChart

- 类型：折线图（Area Chart）
- X 轴：日期（`PortfolioHistory.date`）
- Y 轴：总资产（`PortfolioHistory.totalAssets`）
- 数据源：`nexus-trade-history`
- 无数据时显示空状态提示

## 2. 移动端 /mobile/portfolio

### 2.1 页面结构

```
/mobile/portfolio
├── AccountOverviewCard        // 紧凑版账户概览
├── PositionCardList           // 持仓卡片列表
│   ├── PositionCard           // 每只股票一个卡片
│   ├── PositionCard
│   └── ...
└── EmptyState                 // 无持仓时
```

### 2.2 移动端 AccountOverviewCard

紧凑布局，单行展示：

```
┌─────────────────────────────────────┐
│ 总资产 ¥1,000,000.00               │
│ 今日盈亏 +¥0.00   仓位 0%          │
└─────────────────────────────────────┘
```

### 2.3 PositionCard

```
┌─────────────────────────────────────┐
│ 贵州茅台  600519                    │
│ 现价 ¥1,800.00  成本 ¥1,750.00     │
│ 市值 ¥180,000   盈亏 +¥5,000.00    │
│                        +2.86%       │
└─────────────────────────────────────┘
```

## 3. 首页改动

### 3.1 当前状态（硬编码）

```typescript
// 硬编码资产概览
const totalAssets = 1256789.56
const todayPnL = 28956.78
```

### 3.2 改动方案

```typescript
// 从 localStorage 读取
function getAccountSummary(): AccountSummary {
  const stored = localStorage.getItem('nexus-trade-account')
  if (stored) {
    return JSON.parse(stored)
  }
  // 无数据时的默认值
  return {
    totalAssets: 1000000,      // 初始资金 ¥1,000,000
    availableCash: 1000000,
    marketValue: 0,
    totalPnL: 0,
    todayPnL: 0,               // 今日盈亏 ¥0.00
    riskLevel: 'low',
    positionRatio: 0,
    updatedAt: new Date().toISOString()
  }
}
```

### 3.3 默认值说明

| 场景 | 总资产 | 今日盈亏 | 说明 |
|------|--------|----------|------|
| 首次访问（无 localStorage） | ¥1,000,000 | ¥0.00 | 初始资金 |
| 已有交易数据 | 从 localStorage 读取 | 从 localStorage 读取 | 实时数据 |

## 4. DesktopShell 导航改动

### 4.1 当前导航项

- 首页（Home）
- 行情（Market）
- 交易（Trade）
- 订单（Orders）

### 4.2 新增导航项

在"订单"之前插入"持仓"：

| 顺序 | 图标 | 标签 | 路由 | 说明 |
|------|------|------|------|------|
| 1 | Home | 首页 | `/` | 已有 |
| 2 | TrendingUp | 行情 | `/market` | 已有 |
| 3 | BarChart2 | 交易 | `/trade` | 已有 |
| 4 | **PieChart** | **持仓** | **`/portfolio`** | **新增** |
| 5 | FileText | 订单 | `/orders` | 已有 |

### 4.3 移动端底部导航

同样在"订单"之前插入"持仓"Tab。

## 5. 文件清单

| 文件路径 | 操作 | 说明 |
|----------|------|------|
| `src/app/portfolio/page.tsx` | 新增 | 桌面端持仓页 |
| `src/app/mobile/portfolio/page.tsx` | 新增 | 移动端持仓页 |
| `src/components/portfolio/AccountOverviewCard.tsx` | 新增 | 账户概览卡片 |
| `src/components/portfolio/PositionTable.tsx` | 新增 | 持仓表格 |
| `src/components/portfolio/TransactionList.tsx` | 新增 | 流水列表 |
| `src/components/portfolio/AssetChart.tsx` | 新增 | 资产曲线图 |
| `src/components/portfolio/PositionCard.tsx` | 新增 | 移动端持仓卡片 |
| `src/app/page.tsx` | 修改 | 首页资产概览改为动态读取 |
| `src/components/layout/DesktopShell.tsx` | 修改 | 导航增加"持仓" |
| `src/components/layout/MobileShell.tsx` | 修改 | 底部导航增加"持仓" |
