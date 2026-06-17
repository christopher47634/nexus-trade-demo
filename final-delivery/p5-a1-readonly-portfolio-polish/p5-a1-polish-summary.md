# P5-A1 Polish Summary

**日期:** 2026-06-18
**分支:** p5-a1-readonly-portfolio

---

## 修复内容

### 1. 数据一致性修复

**问题：** 账户概览显示"总资产 ¥1,000,000 / 持仓市值 ¥0"，但持仓表有 4 只股票。

**根因：** `initializeAccount()` 直接写入 `defaultAccount`（无持仓），与 positions 数据脱节。

**修复：** 
- `initializeAccount()` 改为先写入 positions，再调用 `getAccountSummary(positions)` 计算 account
- `positions.ts` 的 positionRatio 改为动态计算

**修复后数据：**

| 字段 | 值 |
|------|-----|
| 总资产 | ¥1,006,936.00 |
| 可用资金 | ¥755,750.00 |
| 持仓市值 | ¥251,186.00 |
| 总盈亏 | +¥6,936.00 |
| 今日盈亏 | +¥1,936.00 |
| 仓位比例 | 24.9% |
| 风险等级 | 中风险 |

**持仓明细：**

| 股票 | 数量 | 成本 | 现价 | 市值 | 浮盈 |
|------|------|------|------|------|------|
| 贵州茅台 | 100 | ¥1,650 | ¥1,688 | ¥168,800 | +¥3,800 |
| 中际旭创 | 200 | ¥120 | ¥128.56 | ¥25,712 | +¥1,712 |
| 宁德时代 | 150 | ¥195 | ¥198.56 | ¥29,784 | +¥534 |
| 寒武纪 | 100 | ¥260 | ¥268.90 | ¥26,890 | +¥890 |

**公式验证：**
- 持仓市值 = 168,800 + 25,712 + 29,784 + 26,890 = ¥251,186 ✓
- 总资产 = 755,750 + 251,186 = ¥1,006,936 ✓
- 仓位比例 = 251,186 / 1,006,936 = 24.9% ✓

---

### 2. FlowHoverSurface 流光 hover 效果

**新增组件：** `src/components/common/FlowHoverSurface.tsx`

**3 种变体：**
- `card`: 流光边框 + cursor light（账户概览、资产配置、资产走势）
- `row`: 横向流光背景（持仓表格行）
- `subtle`: 微弱背景增强（资金流水行）

**参数：**
- hover fade in: 350-500ms
- hover fade out: 500-700ms
- glow opacity: 0.08-0.14
- border highlight: 0.12-0.22
- prefers-reduced-motion: 关闭动效
- mobile: press scale 0.98，无鼠标光晕

**应用范围：**
- AccountOverviewCard ✓
- PositionTable rows ✓
- TransactionList rows ✓
- AssetAllocation card ✓
- PortfolioMiniChart card ✓
- PositionCard (mobile) ✓

**未改动：**
- 首页 ✗
- 板块页 ✗
- 个股页 ✗
- TradePanel ✗
- Demo Mode ✗
- HoverGlow 主系统 ✗

---

## 审核

- Build: ✅ 通过
- Lint: ✅ 通过
- 移动端溢出: 无
- 数据一致性: ✅ 全部一致
