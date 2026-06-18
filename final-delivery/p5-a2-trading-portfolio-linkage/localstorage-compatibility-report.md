# localStorage Compatibility Report

**日期:** 2026-06-18

---

## Key 清单

| Key | P5-A1 | P5-A2 | 冲突 |
|-----|-------|-------|------|
| nexus-trade-orders | 不变 | 不变 | 无 |
| nexus-trade-account | 新增 | 交易后更新 | 无 |
| nexus-trade-positions | 新增 | 交易后更新 | 无 |
| nexus-trade-transactions | 新增 | 交易后新增 | 无 |
| nexus-trade-history | 新增 | 不变 | 无 |

## 兼容性

1. **旧订单数据**：nexus-trade-orders key 不变，旧数据不破坏
2. **首次访问**：initializeAccount() 自动初始化 mock 数据
3. **数据损坏**：JSON.parse 失败时 fallback 到默认值
4. **交易后刷新**：initializeAccount() 检测已有 availableCash，不重置
5. **resetDemoAccount()**：清除所有 key 并重新初始化

## 降级策略

- localStorage 不可用：catch 块静默处理，使用内存 fallback
- JSON 解析失败：返回默认 mock 数据
- 字段缺失：TypeScript 接口保证类型安全
