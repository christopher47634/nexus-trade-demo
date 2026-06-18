# Demo Data Strategy — 隔离与清理机制

**项目**: stock-trading-demo  
**分支**: p5-a3-demo-portfolio-story  
**Commit**: 62bd71f  
**文件**: `src/lib/account-storage.ts`

---

## 问题描述

Demo Mode 在多步骤流程中会触发模拟交易（买入 300308），产生订单和持仓数据。
如果 Demo 数据与用户的实际交易数据混在同一组 localStorage key 中，会导致：

1. **数据污染**: 用户手动交易的持仓/订单被 Demo 数据覆盖或干扰
2. **重复堆叠**: 多次运行 Demo 后，相同订单/持仓重复累积
3. **清理困难**: 无法区分哪些数据来自 Demo，哪些来自用户操作
4. **不可恢复**: 清除所有数据会丢失用户的真实交易记录

---

## 解决方案

### 1. 独立 Storage Key

| 用途 | Key | 说明 |
|------|-----|------|
| 用户账户 | `nexus-trade-account` | 总资产/可用资金/市值等 |
| 用户持仓 | `nexus-trade-positions` | 持仓列表 |
| 用户交易 | `nexus-trade-transactions` | 交易流水 |
| 用户历史 | `nexus-trade-history` | 组合净值历史 |
| **Demo 订单** | `nexus-trade-demo-orders` | Demo 流程产生的订单 |
| **Demo 持仓** | `nexus-trade-demo-positions` | Demo 流程产生的持仓 |
| Demo 标志 | `demoMode` | Demo 模式开关 |
| Demo 步骤 | `demoModeStep` | 当前步骤索引 |

### 2. Source 标记

所有通过 Demo 流程写入的数据都带 `source: "demo"` 标记：

```typescript
// 订单
const tagged = { ...order, source: 'demo' };

// 持仓
const tagged = { ...position, source: 'demo' };
```

### 3. 去重机制

- **订单**: 按 `id` 去重 — 相同 ID 的订单不重复写入
- **持仓**: 按 `stockCode` 去重 — 相同股票代码的持仓不重复写入

```typescript
// 订单去重
if (!existing.some((o) => o.id === order.id)) {
  existing.push(tagged);
}

// 持仓去重
if (!existing.some((p) => p.stockCode === position.stockCode)) {
  existing.push(tagged);
}
```

### 4. 精准清理

`resetDemoData()` 仅清除 Demo 专用 key，不触碰用户数据：

```typescript
export function resetDemoData(): void {
  window.localStorage.removeItem('nexus-trade-demo-orders');
  window.localStorage.removeItem('nexus-trade-demo-positions');
  window.localStorage.removeItem('demoMode');
  window.localStorage.removeItem('demoModeStep');
}
```

---

## API 列表

| 函数 | 签名 | 说明 |
|------|------|------|
| `addDemoOrder` | `<T extends {id: string}>(order: T) => T & {source: string}` | 添加 Demo 订单，带 source 标记，按 ID 去重 |
| `addDemoPosition` | `<T extends {stockCode: string}>(position: T) => T & {source: string}` | 添加 Demo 持仓，带 source 标记，按 stockCode 去重 |
| `getDemoOrders` | `<T>() => T[]` | 获取所有 Demo 订单 |
| `getDemoPositions` | `<T>() => T[]` | 获取所有 Demo 持仓 |
| `hasDemoData` | `() => boolean` | 检查是否存在 Demo 数据 |
| `resetDemoData` | `() => void` | 清除 Demo 数据 + Demo 模式标志 |

---

## 与 P5-A2 的关系

| 层面 | P5-A2 (交易联动) | P5-A3 (Demo Data 策略) |
|------|-------------------|------------------------|
| 交易引擎 | `executeBuy()` / `executeSell()` 写入用户 key | 不改动交易引擎 |
| 数据存储 | `nexus-trade-*` 系列 key | 新增 `nexus-trade-demo-*` key |
| 数据隔离 | 无 (全在用户 key 中) | 独立 key + source 标记 |
| 清理策略 | `resetAccount()` 全量重置 | `resetDemoData()` 仅清 Demo |
| 去重 | 无 | 按 ID / stockCode 去重 |

> 注意：当前 Demo 流程的交易仍通过 `executeBuy()` 写入用户 key（`nexus-trade-*`），
> Demo 专用 key (`nexus-trade-demo-*`) 作为独立存储层存在，
> 未来可扩展为将 Demo 交易完全隔离到 demo key 中。
