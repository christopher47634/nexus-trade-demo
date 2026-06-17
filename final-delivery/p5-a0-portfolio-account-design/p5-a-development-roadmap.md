# P5-A 开发路线图

## 阶段总览

| 阶段 | 名称 | 风险 | 预计周期 | 可回滚 |
|------|------|------|----------|--------|
| P5-A1 | 账户/持仓 Mock + 只读页面 | 低 | 1-2 天 | ✅ |
| P5-A2 | 接入买入/卖出联动 | 中 | 2-3 天 | ✅ |
| P5-A3 | Demo Mode 升级 + 移动端 | 低 | 1-2 天 | ✅ |
| P5-A4 | QA、Release、Production | 低 | 1 天 | ✅ |

---

## P5-A1：账户/持仓 Mock + 只读页面

### 目标

搭建账户数据模型和只读页面，不修改交易逻辑。

### 文件清单

| 文件路径 | 操作 | 说明 |
|----------|------|------|
| `src/types/account.ts` | 新增 | AccountSummary、Position、PortfolioHistory、AccountTransaction 接口 |
| `src/mock/account.ts` | 新增 | 默认账户数据、初始化函数 |
| `src/lib/account-storage.ts` | 新增 | localStorage 读写工具函数 |
| `src/app/portfolio/page.tsx` | 新增 | 桌面端持仓页 |
| `src/app/mobile/portfolio/page.tsx` | 新增 | 移动端持仓页 |
| `src/components/portfolio/AccountOverviewCard.tsx` | 新增 | 账户概览卡片 |
| `src/components/portfolio/PositionTable.tsx` | 新增 | 持仓表格 |
| `src/components/portfolio/TransactionList.tsx` | 新增 | 流水列表 |
| `src/components/portfolio/AssetChart.tsx` | 新增 | 资产曲线图 |
| `src/components/portfolio/PositionCard.tsx` | 新增 | 移动端持仓卡片 |
| `src/components/portfolio/EmptyState.tsx` | 新增 | 空状态组件 |
| `src/app/page.tsx` | 修改 | 首页资产概览改为动态读取 |
| `src/components/layout/DesktopShell.tsx` | 修改 | 导航增加"持仓" |
| `src/components/layout/MobileShell.tsx` | 修改 | 底部导航增加"持仓" |

### 风险等级

**低** — 仅新增文件和修改导航，不影响现有交易逻辑。

### 验收标准

| # | 验收项 | 判定条件 |
|------|--------|----------|
| 1 | 持仓页可访问 | `/portfolio` 和 `/mobile/portfolio` 正常渲染 |
| 2 | 空持仓显示 | 显示"暂无持仓"空状态 |
| 3 | 首页资产概览 | 显示默认值 ¥1,000,000 / ¥0.00 |
| 4 | 导航项 | 左侧/底部导航出现"持仓"图标 |
| 5 | 现有功能不受影响 | 首页、行情、交易、订单页正常 |

### 回滚方案

1. 删除新增文件（`src/types/account.ts`, `src/mock/account.ts`, `src/lib/account-storage.ts`, `src/app/portfolio/`, `src/app/mobile/portfolio/`, `src/components/portfolio/`）
2. 恢复 `src/app/page.tsx` 首页硬编码
3. 恢复 `DesktopShell.tsx` 和 `MobileShell.tsx` 导航

---

## P5-A2：接入买入/卖出联动

### 目标

将交易面板的提交逻辑与持仓系统打通。

### 文件清单

| 文件路径 | 操作 | 说明 |
|----------|------|------|
| `src/lib/account-storage.ts` | 修改 | 增加持仓读写、账户更新函数 |
| `src/lib/trading-engine.ts` | 新增 | executeBuy、executeSell 核心逻辑 |
| `src/components/trade/TradePanel.tsx` | 修改 | 提交时调用 trading-engine |
| `src/components/trade/ConfirmDialog.tsx` | 修改 | 确认后触发持仓更新 |
| `src/app/portfolio/page.tsx` | 修改 | 添加 currentPrice 快照更新逻辑 |

### 风险等级

**中** — 修改交易核心逻辑，需要充分测试。

### 验收标准

| # | 验收项 | 判定条件 |
|------|--------|----------|
| 1 | 买入后持仓增加 | 持仓页出现新股票 |
| 2 | 买入后资金减少 | 可用资金 = 初始资金 - (价格×数量 + 费用) |
| 3 | 卖出后持仓减少 | 持仓数量正确减少 |
| 4 | 全部卖出 | 持仓条目被删除 |
| 5 | 加仓成本 | avgCost 按加权平均正确计算 |
| 6 | 已实现盈亏 | 卖出时 realizedPnL 正确 |
| 7 | 浮动盈亏 | 持仓页显示正确盈亏 |
| 8 | 资金不足 | 拒绝交易，提示"可用资金不足" |
| 9 | 可卖不足 | 拒绝交易，提示"可卖数量不足" |
| 10 | 现有订单不受影响 | 订单页功能正常 |

### 回滚方案

1. `localStorage.removeItem('nexus-trade-account')`
2. `localStorage.removeItem('nexus-trade-positions')`
3. `localStorage.removeItem('nexus-trade-transactions')`
4. `localStorage.removeItem('nexus-trade-history')`
5. 恢复 `TradePanel.tsx` 和 `ConfirmDialog.tsx` 原始提交逻辑

---

## P5-A3：Demo Mode 升级 + 移动端

### 目标

扩展 Demo Mode 引导至 8 步，完善移动端持仓页。

### 文件清单

| 文件路径 | 操作 | 说明 |
|----------|------|------|
| `src/components/demo/DemoWrapper.tsx` | 修改 | 扩展步骤至 8 步 |
| `src/components/demo/DemoOverlay.tsx` | 修改 | 支持新的高亮目标 |
| `src/components/demo/DemoSteps.ts` | 修改 | 新增 Step 7、Step 8 |
| `src/components/portfolio/PositionTable.tsx` | 修改 | 添加 `data-position-table` 属性 |
| `src/components/portfolio/PositionCard.tsx` | 修改 | 添加 `data-position-card` 属性 |
| `src/components/portfolio/AccountOverviewCard.tsx` | 修改 | 添加 `data-account-overview` 属性 |
| `src/app/page.tsx` | 修改 | 添加 `data-sector-card` 属性 |
| `src/components/stock/StockRow.tsx` | 修改 | 添加 `data-stock-row` 属性 |
| `src/components/trade/TradePanel.tsx` | 修改 | 添加 `data-trade-input` 属性 |
| `src/app/mobile/portfolio/page.tsx` | 测试 | 确保移动端布局正确 |

### 风险等级

**低** — 仅修改 Demo Mode 配置和添加 data 属性。

### 验收标准

| # | 验收项 | 判定条件 |
|------|--------|----------|
| 1 | 8 步完整 | 从首页到资产变化对比，全流程可走通 |
| 2 | 高亮正确 | 每步高亮目标元素正确 |
| 3 | 提示文案 | 每步文案准确 |
| 4 | 跳过功能 | 可随时跳过 Demo |
| 5 | 移动端适配 | 移动端持仓页布局正确 |

### 回滚方案

1. 恢复 `DemoWrapper.tsx`、`DemoOverlay.tsx`、`DemoSteps.ts` 为 6 步版本
2. 移除新增的 `data-*` 属性

---

## P5-A4：QA、Release、Production

### 目标

全面测试、文档整理、生产部署。

### 任务清单

| # | 任务 | 说明 |
|------|------|------|
| 1 | Smoke Test | 全流程走通：首页 → 板块 → 个股 → 买入 → 持仓 → 卖出 → 首页 |
| 2 | 边界测试 | 资金不足、可卖不足、全部卖出、加仓成本 |
| 3 | 兼容性测试 | Chrome、Firefox、Safari、移动端 |
| 4 | localStorage 测试 | 清除数据后重新初始化、Reset 功能 |
| 5 | Demo Mode 测试 | 8 步引导完整走通 |
| 6 | 性能检查 | 持仓页加载速度、大量持仓（50+）场景 |
| 7 | 文档更新 | README、CHANGELOG、设计文档归档 |
| 8 | Git 提交 | 合并到主分支，打 tag |

### 风险等级

**低** — 仅测试和文档，不修改代码。

### 验收标准

| # | 验收项 | 判定条件 |
|------|--------|----------|
| 1 | Smoke Test | 全部通过 |
| 2 | 无 Console 错误 | 浏览器控制台无报错 |
| 3 | Reset 功能 | 清除所有数据后恢复正常 |
| 4 | 文档完整 | 7 个设计文档 + README + CHANGELOG |

### 回滚方案

`git revert <merge-commit>` 或 `git reset --hard <tag>`

---

## 依赖关系

```
P5-A1 (Mock + 只读页面)
   │
   ▼
P5-A2 (买入/卖出联动) ◄── 依赖 A1 的数据模型和页面
   │
   ▼
P5-A3 (Demo Mode + 移动端) ◄── 依赖 A2 的交易联动
   │
   ▼
P5-A4 (QA + Release) ◄── 依赖 A1~A3 全部完成
```

## 风险矩阵

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| localStorage 数据不一致 | 中 | 高 | 预检查 + 原子写入 + Reset 功能 |
| 现有订单逻辑被破坏 | 低 | 高 | 不修改订单写入逻辑，仅在下游追加 |
| Mock 股价与持仓不同步 | 低 | 中 | 快照更新，用户可刷新 |
| 浏览器兼容性 | 低 | 中 | 使用标准 localStorage API |
| 大量持仓性能 | 低 | 低 | 限制持仓数量（50 只） |
