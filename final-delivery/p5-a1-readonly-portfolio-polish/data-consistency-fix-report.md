# Data Consistency Fix Report

**日期:** 2026-06-18

---

## 问题

账户概览显示"总资产 ¥1,000,000 / 持仓市值 ¥0 / 仓位比例 0%"，但持仓表有 4 只股票。

## 根因

`initializeAccount()` 直接写入 `defaultAccount`（marketValue=0, positionRatio=0），与 positions 数据完全脱节。

## 修复

### src/lib/account-storage.ts

```typescript
// 修复前
export function initializeAccount(): void {
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveAccount(defaultAccount)  // ← 独立于 positions
  }
  // ...
}

// 修复后
export function initializeAccount(): void {
  // 先初始化 positions
  if (!localStorage.getItem(POSITIONS_KEY)) {
    savePositions(mockPositions)
  }
  // 然后从 positions 计算 account
  const positions = getPositions()
  const account = getAccountSummary(positions)
  saveAccount(account)
  // ...
}
```

### src/mock/positions.ts

positionRatio 从固定常量改为动态计算：

```typescript
// 修复前
const TOTAL_ASSETS = 1_000_000
positionRatio: marketValue / TOTAL_ASSETS  // ← 固定

// 修复后
const INITIAL_CASH = 1_000_000
const totalMarketValue = allPositions.reduce(...)
const totalAssets = INITIAL_CASH + totalMarketValue
positionRatio: marketValue / totalAssets  // ← 动态
```

## 验证

| 字段 | 期望值 | 实际值 |
|------|--------|--------|
| 持仓市值 | ¥251,186 | ¥251,186 ✓ |
| 总资产 | ¥1,006,936 | ¥1,006,936 ✓ |
| 仓位比例 | 24.9% | 24.9% ✓ |
| 现金占比 | 75.1% | 75.1% ✓ |
| 持仓占比 | 24.9% | 24.9% ✓ |
