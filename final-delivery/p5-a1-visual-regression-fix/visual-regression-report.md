# Visual Regression Report

**日期:** 2026-06-18
**分支:** p5-a1-visual-regression-fix

---

## 问题 1: PositionTable 列不对齐

**根因：** FlowHoverSurface 包裹表格行，将 grid 子元素包在额外 div 中，破坏了 CSS grid 列对齐。

**修复：** 移除 FlowHoverSurface，改用纯 CSS hover（hover:bg-[var(--surface-2)]）。grid 列定义改为 style 内联（GRID_COLS 常量），确保表头和数据行完全对齐。

**结果：** 8 列严格对齐，数字右对齐，行高 68px。

---

## 问题 2: TransactionList 布局松散

**根因：** 金额没有右对齐，右侧大片空白。

**修复：** 三段式 flex 布局（左：图标+类型，中：时间+订单号，右：金额）。金额 text-right font-mono-nums。正负颜色正确（卖出/分红绿色，买入/费用红色）。

**结果：** 行高 62px，金额右对齐，视觉紧凑。

---

## 问题 3: 首页板块卡片变暗

**根因：** HotSectorGrid.tsx 中 CanvasCardBackground overlay opacity 过高（rgba(2,6,18,0.35)），叠加左侧渐变 overlay（0.65/0.45），导致行业背景几乎不可见。

**注意：** 这不是 P5-A1 引入的回归。git diff 确认 P5-A1 未修改 HotSectorGrid.tsx。overlay 本身过暗是原有问题，但 P5-A1 之前未被注意到。

**修复：**
- CanvasCardBackground overlay: 0.35 → 0.12
- 左侧渐变: 0.65/0.45 → 0.48/0.25

**修复后亮度：**
- 左侧: 23% → 46%
- 40% 处: 36% → 66%
- 右侧: 65% → 88%

**FlowHoverSurface 影响检查：** .flow-hover CSS 只作用于带 flow-hover class 的元素，不影响首页板块卡片。确认无副作用。

---

## 验证

| 检查项 | 结果 |
|--------|------|
| Build | ✅ 通过 |
| Lint | ✅ 通过 |
| PositionTable 列对齐 | ✅ 修复 |
| TransactionList 金额右对齐 | ✅ 修复 |
| 首页板块卡片视觉恢复 | ✅ 修复 |
| FlowHoverSurface 无副作用 | ✅ 确认 |
| 移动端无溢出 | ✅ 确认 |
