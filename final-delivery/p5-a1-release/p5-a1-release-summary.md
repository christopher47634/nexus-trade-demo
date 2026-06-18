# P5-A1 Release Summary

**日期:** 2026-06-18
**版本:** V5-A1 Read-only Portfolio & Account Dashboard

---

## 版本信息

| 项目 | 值 |
|------|-----|
| 合并分支 | p5-a1-readonly-portfolio → main |
| main commit | e11bd66 |
| release tag | v5-a1-readonly-portfolio |
| Build | ✅ 通过 |
| Lint | ✅ 通过 (0 warning, 0 error) |
| Production URL | https://stock-trading-demo.vercel.app |
| Production buildId | yB1wKUs7FXN7vq4e9zeqn |
| **Production 已同步到最新 main** | **✅ 是** |
| **P5-A1 Production Ready** | **✅ 是** |

---

## 本次新增

### 页面

| 页面 | 说明 |
|------|------|
| /portfolio | 桌面端账户/持仓页 |
| /mobile/portfolio | 移动端账户/持仓页 |

### 组件

| 组件 | 说明 |
|------|------|
| AccountOverviewCard | 账户概览卡片 |
| PositionTable | 持仓表格 |
| AssetAllocation | 资产配置面板 |
| TransactionList | 资金流水列表 |
| PortfolioMiniChart | 资产曲线 mini chart |
| PositionCard | 移动端持仓卡片 |
| FlowHoverSurface | 流光 hover 效果组件 |

### 数据层

| 文件 | 说明 |
|------|------|
| src/types/account.ts | TypeScript 接口 |
| src/mock/account.ts | 账户 mock + getAccountSummary() |
| src/mock/positions.ts | 4 只持仓 mock |
| src/mock/portfolioHistory.ts | 30 天资产曲线 |
| src/mock/accountTransactions.ts | 11 条资金流水 |
| src/lib/account-storage.ts | localStorage CRUD |

---

## 数据一致性

| 字段 | 值 |
|------|-----|
| 总资产 | ¥1,006,936.00 |
| 可用资金 | ¥755,750.00 |
| 持仓市值 | ¥251,186.00 |
| 总盈亏 | +¥6,936.00 |
| 今日盈亏 | +¥1,936.00 |
| 仓位比例 | 24.9% |
| 风险等级 | 中风险 |

公式：755,750 + 251,186 = 1,006,936 ✓

---

## Smoke Test 结果：12/12 通过

详见 production-smoke-test.md

---

## 未改动

- TradePanel ✗
- 订单逻辑 ✗
- nexus-trade-orders ✗
- Demo Mode ✗
- 首页/板块/个股页原有功能 ✗
- HoverGlow 主系统 ✗
