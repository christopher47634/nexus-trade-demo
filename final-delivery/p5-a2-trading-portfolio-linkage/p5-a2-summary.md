# P5-A2 Summary

**日期:** 2026-06-18
**分支:** p5-a2-trading-portfolio-linkage

---

## 完成内容

### 新增文件

| 文件 | 说明 |
|------|------|
| src/lib/trade-engine.ts | 交易执行引擎（executeBuy/executeSell/getMaxBuyQuantity/getAvailableSellQuantity/resetDemoAccount） |

### 修改文件

| 文件 | 改动 |
|------|------|
| src/components/stock/TradePanel.tsx | 接入交易引擎，移除硬编码资金，新增资金/可卖检查 + 内联错误提示 |
| src/lib/account-storage.ts | initializeAccount() 保留已有 availableCash，不重置交易后资金 |

---

## 交易联动

### 买入流程
1. 验证：100 股整数倍
2. 计算费用：commission = max(5, total × 0.025%)
3. 检查资金：availableCash >= totalAmount + commission
4. 扣除资金 → 更新/创建持仓 → 重算 avgCost → 生成订单 → 生成资金流水
5. 保存 localStorage

### 卖出流程
1. 验证：100 股整数倍，quantity <= availableQuantity
2. 计算费用：commission + stampTax(0.05%)
3. 增加资金 → 减少持仓（清仓删除）→ 计算 realizedPnL → 生成订单 → 生成资金流水
4. 保存 localStorage

---

## 6 场景测试结果

| # | 场景 | 结果 |
|---|------|------|
| 1 | 买入已有持仓（300308） | ✅ 数量增加，avgCost 更新，资金减少 |
| 2 | 买入新股票 | ✅ 新增 position，账户更新 |
| 3 | 资金不足 | ✅ 内联错误提示，不扣资金 |
| 4 | 卖出部分持仓 | ✅ 数量减少，资金增加 |
| 5 | 超过可卖数量 | ✅ 内联错误提示，持仓不变 |
| 6 | 刷新持久化 | ✅ 数据保持 |

---

## 审核修复

| 问题 | 级别 | 修复 |
|------|------|------|
| 卖出后刷新资金重置 | P1 | initializeAccount() 保留已有 availableCash |
| 资金不足检查不含 commission | P2 | 改为 totalAmount + commission > availableCash |
| 错误用 alert() | P2 | 改为 React state + 内联错误提示 |
| 函数重复定义 | P2 | 从 trade-engine.ts export，TradePanel import |

---

## Build/Lint

- Build: ✅ 通过
- Lint: ✅ 通过 (0 warnings, 0 errors)
