# Flow Hover Polish Report

**日期:** 2026-06-18

---

## 新增组件

**src/components/common/FlowHoverSurface.tsx**

轻量级流光 hover 组件，纯 CSS + 少量 JS。

### 3 种变体

| 变体 | 效果 | 应用场景 |
|------|------|----------|
| card | 流光边框 + cursor light + box-shadow | 账户概览、资产配置、资产走势、移动端卡片 |
| row | 横向流光背景（从左到右渐变） | 持仓表格行 |
| subtle | 微弱背景增强 | 资金流水行 |

### CSS 参数

| 参数 | 值 |
|------|-----|
| hover fade in | 400ms |
| hover fade out | 500ms |
| glow opacity | 0.08 |
| border highlight | 0.15 |
| box-shadow | 0 0 20px rgba(212,175,55,0.05) |
| cursor light radius | 300px |
| cursor light color | rgba(212,175,55,0.08) |

### 无障碍

- prefers-reduced-motion: 关闭所有动效
- mobile @media(hover: none): 隐藏 glow，press scale 0.98

---

## 修改的文件

| 文件 | 改动 |
|------|------|
| src/styles/globals.css | 新增 .flow-hover CSS（79 行） |
| src/components/portfolio/AccountOverviewCard.tsx | 包裹 FlowHoverSurface variant="card" |
| src/components/portfolio/PositionTable.tsx | 每行包裹 variant="row" |
| src/components/portfolio/TransactionList.tsx | 每行包裹 variant="subtle" |
| src/components/portfolio/AssetAllocation.tsx | 包裹 variant="card" |
| src/components/portfolio/PortfolioMiniChart.tsx | 包裹 variant="card" |
| src/components/portfolio/PositionCard.tsx | 包裹 variant="card" |

---

## 未改动

- 首页 ✗
- 板块页 ✗
- 个股页 ✗
- TradePanel ✗
- Demo Mode ✗
- HoverGlow 主系统 ✗
- 无新依赖引入
