# P5-A0 设计总摘要：模拟账户与持仓系统

## 1. 设计目标

在现有 V4 股票交易 Demo（Next.js + Mock 数据 + localStorage 订单）基础上，补齐"交易闭环"的账户侧功能：模拟账户、持仓管理、盈亏计算、仓位风险展示。

## 2. 核心设计决策

| # | 决策 | 理由 |
|---|------|------|
| D1 | 数据全部存 localStorage，新增 4 个 key | 与现有 `nexus-trade-orders` 隔离，零后端依赖 |
| D2 | Demo 简化：不做 T+1 限制 | 降低复杂度，买入即刻可卖 |
| D3 | 持仓 currentPrice 快照更新 | 访问持仓页时更新，不做定时器，节省资源 |
| D4 | 初始资金 ¥1,000,000 | 首页无数据时的默认值 |
| D5 | 持仓是订单的下游 | 订单提交成功后才触发持仓更新，保证数据一致性 |
| D6 | avgCost=0 时除零保护 | unrealizedPnLPercent 返回 0 |

## 3. 公式汇总

| 公式 | 表达式 | 说明 |
|------|--------|------|
| 总资产 | `totalAssets = availableCash + marketValue` | 账户总资产 |
| 持仓市值 | `marketValue = Σ(currentPrice × quantity)` | 所有持仓市值之和 |
| 平均成本（加仓） | `avgCost = (旧avgCost × 旧qty + price × newQty) / (旧qty + newQty)` | 买入已有股票时重算 |
| 浮动盈亏 | `unrealizedPnL = (currentPrice - avgCost) × quantity` | 未实现盈亏 |
| 浮盈比例 | `unrealizedPnLPercent = (currentPrice - avgCost) / avgCost × 100` | avgCost=0 时返回 0 |
| 今日盈亏 | `todayPnL = (currentPrice - openPrice) × quantity` | 单只股票今日盈亏 |
| 账户今日盈亏 | `account.todayPnL = Σ(position.todayPnL)` | 所有持仓今日盈亏之和 |
| 已实现盈亏 | `realizedPnL = (sellPrice - avgCost) × sellQuantity` | 卖出时计算 |
| 仓位比例 | `positionRatio = marketValue / totalAssets` | 单只股票或整体仓位 |
| 风险等级 | `low(<30%) / medium(30%-70%) / high(>70%)` | 基于仓位比例 |

## 4. localStorage Key 设计

| Key | 数据类型 | 说明 |
|-----|----------|------|
| `nexus-trade-orders` | `Order[]` | **已有**，不修改 |
| `nexus-trade-account` | `AccountSummary` | 新增，账户摘要 |
| `nexus-trade-positions` | `Position[]` | 新增，持仓列表 |
| `nexus-trade-transactions` | `AccountTransaction[]` | 新增，资金流水 |
| `nexus-trade-history` | `PortfolioHistory[]` | 新增，资产历史曲线 |

## 5. 验收标准

| # | 验收项 | 判定条件 |
|---|--------|----------|
| A1 | 首页资产概览 | 无数据时显示 ¥1,000,000 / ¥0.00 |
| A2 | 买入后持仓 | 持仓列表新增一条，可用资金减少 |
| A3 | 卖出后持仓 | 持仓数量减少，可用资金增加 |
| A4 | 全部卖出 | 持仓条目删除 |
| A5 | 加仓成本 | avgCost 按加权平均重算 |
| A6 | 盈亏计算 | 浮动盈亏、今日盈亏数值正确 |
| A7 | 仓位风险 | 颜色标识 low/medium/high |
| A8 | Demo Mode | 8 步引导完整可走通 |
| A9 | localStorage 隔离 | 现有订单数据不受影响 |
| A10 | Reset | 清除所有 key，恢复初始状态 |

## 6. 开发路线概览

| 阶段 | 内容 | 风险 | 预计周期 |
|------|------|------|----------|
| P5-A1 | 账户/持仓 Mock + 只读页面 | 低 | 1-2 天 |
| P5-A2 | 接入买入/卖出联动 | 中 | 2-3 天 |
| P5-A3 | Demo Mode 升级 + 移动端 | 低 | 1-2 天 |
| P5-A4 | QA、Release、Production | 低 | 1 天 |

## 7. 相关文档索引

| 文档 | 内容 |
|------|------|
| `account-data-model.md` | TypeScript 接口定义、字段说明、localStorage key |
| `trading-position-linkage.md` | 买入/卖出联动规则、T+1 说明、除零保护 |
| `portfolio-page-plan.md` | 持仓页面结构、首页改动、导航改动 |
| `demo-mode-upgrade-plan.md` | Demo Mode 8 步引导设计 |
| `risk-and-compatibility-plan.md` | 风险控制、兼容性、Reset 机制 |
| `p5-a-development-roadmap.md` | 4 阶段开发计划、文件清单、回滚方案 |
