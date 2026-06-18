# TransactionList 桌面端 DOM 布局验证报告

**验证日期**: 2026-06-18
**分支**: p5-a2-trading-portfolio-linkage
**Viewport**: 1440x900
**URL**: http://localhost:3458/portfolio
**截图**: [desktop-transactions-final.png](./screenshots/desktop-transactions-final.png)

## 检查结果汇总

| # | 检查项 | 预期 | 实际 | 通过 |
|---|--------|------|------|------|
| 1 | 每行横向布局 (非竖排) | display: flex, flex-direction: row | flex items-center justify-between (flexDirection: row) | ✅ |
| 2 | 左侧类型+图标 | flex 布局含图标+类型标签+股票代码 | flex items-center gap-3, 含 icon + label + stockCode | ✅ |
| 3 | 中间股票/时间/订单号 | flex 布局含时间+订单号 | flex items-center gap-2, 含时间 + orderId | ✅ |
| 4 | 右侧金额右对齐 | text-align: right | text-right font-semibold font-mono-nums (textAlign: right) | ✅ |
| 5 | 行高 58-72px | 58-72px | 62px (所有11行) | ✅ |
| 6 | hover 流光不破坏布局 | FlowHoverSurface 不在交易行内 | 无 FlowHoverSurface; 使用 hover:bg-[var(--surface-2)] | ✅ |

## 详细数据

### 行结构分析

每行由 3 个子元素组成 (flex row, justify-between):

```
[左侧: icon+类型+股票]  ←→  [中间: 时间+订单号]  ←→  [右侧: 金额]
```

| 子元素 | 标签 | className | 内容示例 |
|--------|------|-----------|----------|
| 左侧 | div | flex items-center gap-3 min-w-0 | 分红 / 600519 |
| 中间 | div | flex items-center gap-2 | 06/10 17:00 / ord-div-20260610-001 |
| 右侧 | span | text-sm font-semibold font-mono-nums text-right flex-shrink-0 | +500.00 |

### 交易行数据 (前 8 行)

| # | 类型 | 股票代码 | 时间 | 订单号 | 金额 | 行高 |
|---|------|----------|------|--------|------|------|
| 1 | 分红 | 600519 | 06/10 17:00 | ord-div-20260610-001 | +500.00 | 62px |
| 2 | 买入 | 688256 | 06/05 18:08 | ord-20260605-005 | -26,000.00 | 62px |
| 3 | 费用 | 688256 | 06/05 18:08 | ord-20260605-005 | -26.00 | 62px |
| 4 | 买入 | 300750 | 05/30 17:45 | ord-20260530-004 | -29,250.00 | 62px |
| 5 | 费用 | 300750 | 05/30 17:45 | ord-20260530-004 | -29.25 | 62px |
| 6 | 卖出 | 000858 | 05/28 22:22 | ord-20260528-003 | +45,500.00 | 62px |
| 7 | 费用 | 000858 | 05/28 22:22 | ord-20260528-003 | -45.50 | 62px |
| 8 | 买入 | 300308 | 05/26 18:12 | ord-20260526-002 | -24,000.00 | 62px |

### 源码确认 (TransactionList.tsx)

```tsx
// 行容器: flex row, minHeight 62px
<motion.div
  className="flex items-center justify-between px-5 hover:bg-[var(--surface-2)] transition-colors"
  style={{ minHeight: "62px" }}
>
  {/* 左侧: icon + type + stock code */}
  <div className="flex items-center gap-3 min-w-0">...</div>
  {/* 中间: time + order ID */}
  <div className="flex items-center gap-2">...</div>
  {/* 右侧: amount */}
  <span className="text-sm font-semibold font-mono-nums text-right flex-shrink-0">
    ...
  </span>
</motion.div>
```

## 结论

**全部 6 项检查通过**。TransactionList 桌面端布局正确，每行横向 flex 布局，左侧类型+图标，中间时间+订单号，右侧金额右对齐，行高 62px 在预期范围内，hover 效果不破坏布局。
