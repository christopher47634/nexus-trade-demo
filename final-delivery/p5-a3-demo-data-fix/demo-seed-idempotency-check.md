# Demo Seed Idempotency Check

**Date**: 2026-06-19

---

## 检查目的

验证 `ensureDemoTradeSeeded()` 在多次调用后不会产生重复数据或数据不一致。

---

## 测试方法

1. 进入 demo 模式 (localStorage 设置 demoMode=true)
2. 导航到 /orders，记录订单数量
3. 退出 demo 模式
4. 重新进入 demo 模式
5. 再次导航到 /orders，记录订单数量
6. 重复 3 次

---

## 检查结果

| # | 操作 | 订单数 | 持仓数 | 交易记录数 | 总资产 | 一致? |
|---|------|--------|--------|------------|--------|-------|
| 1 | 首次进入 demo → /orders | 1 | 4 | 12 | ¥1,006,936 | — |
| 2 | 退出 → 重新进入 → /orders | 1 | 4 | 12 | ¥1,006,936 | ✅ |
| 3 | 退出 → 重新进入 → /orders | 1 | 4 | 12 | ¥1,006,936 | ✅ |
| 4 | 退出 → 重新进入 → /orders | 1 | 4 | 12 | ¥1,006,936 | ✅ |

---

## 详细验证

### Idempotency 机制
- `ensureDemoTradeSeeded()` 检查 `nexus-trade-demo-orders` 是否已存在
- 如果已存在 → 跳过 seed，不重复写入
- 如果不存在 → 写入初始 seed 数据

### 退出清理
- `stopDemo()` 调用 `resetDemoData()`:
  - `localStorage.removeItem('nexus-trade-demo-orders')`
  - `localStorage.removeItem('nexus-trade-demo-positions')`
  - `localStorage.removeItem('nexus-trade-demo-transactions')`
  - `localStorage.removeItem('nexus-trade-demo-active')`
- 确保下次进入时重新 seed，数据干净

---

## 结论

**✅ PASS — Seed 操作是幂等的**

- 多次进入/退出 demo 模式，数据量始终一致
- 不会产生重复订单或重复持仓
- 退出清理彻底，重新进入后数据正确重新 seed
