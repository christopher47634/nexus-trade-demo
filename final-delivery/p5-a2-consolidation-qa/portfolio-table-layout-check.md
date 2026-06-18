# PositionTable 桌面端 DOM 布局验证报告

**验证日期**: 2026-06-18
**分支**: p5-a2-trading-portfolio-linkage
**Viewport**: 1440x900
**URL**: http://localhost:3458/portfolio
**截图**: [desktop-position-table-final.png](./screenshots/desktop-position-table-final.png)

## 检查结果汇总

| # | 检查项 | 预期 | 实际 | 通过 |
|---|--------|------|------|------|
| 1 | 每行 cell 数量 | 8 列 | 8 列 (header: 8, data rows: 8×4) | ✅ |
| 2 | 表头列名 | 股票/板块/持仓/成本价/现价/市值/浮动盈亏/今日盈亏 | 股票/板块/持仓·可用/成本价/现价/市值/浮动盈亏/今日盈亏 | ✅ |
| 3 | 第一行与第二行 grid-template-columns 一致 | 一致 | 一致 (149.312px 91.8906px 91.8906px 91.8906px 91.9062px 114.859px 114.859px 103.375px) | ✅ |
| 4 | 表头与数据行 grid-template-columns 一致 | 一致 | 一致 (headerVsRow0Match: true) | ✅ |
| 5 | 数字列右对齐 (成本价/现价/市值/浮动盈亏/今日盈亏) | text-align: right | 成本价: right, 现价: right, 市值: right, 浮动盈亏: right, 今日盈亏: right | ✅ |
| 6 | 每行高度 64-76px | 64-76px | 68px (所有4行) | ✅ |
| 7 | FlowHoverSurface 不参与 grid 布局 | position: absolute 或不在 grid 内 | 无 FlowHoverSurface 在表格行内; flow-hover--card 在外层卡片容器 (position: relative) | ✅ |
| 8 | 无价格/市值/盈亏竖着堆在股票下面 | 数值列独立 grid cell | 成本价/现价/市值/浮动盈亏/今日盈亏均为独立 grid cell，非嵌套在股票列下 | ✅ |

## 详细数据

### 列宽度 (px)
| 列 | 股票 | 板块 | 持仓/可用 | 成本价 | 现价 | 市值 | 浮动盈亏 | 今日盈亏 |
|----|------|------|-----------|--------|------|------|----------|----------|
| 宽度 | 149.31 | 91.89 | 91.89 | 91.89 | 91.91 | 114.86 | 114.86 | 103.38 |
| Grid 定义 | minmax(140px, 1.3fr) | minmax(90px, 0.8fr) | minmax(90px, 0.8fr) | minmax(90px, 0.8fr) | minmax(90px, 0.8fr) | minmax(110px, 1fr) | minmax(110px, 1fr) | minmax(100px, 0.9fr) |

### 单元格对齐详情 (第一行数据)
| 列索引 | 内容 | cell textAlign | 实际对齐 |
|--------|------|----------------|----------|
| 0 | 贵州茅台 / 600519 | start | 左对齐 (flex-col, 正确) |
| 1 | 白酒 | start | 左对齐 (正确) |
| 2 | 100 / 100 | start (cell), items-end (inner flex) | 右对齐 (flex-col items-end) |
| 3 | ¥1650.00 | right | 右对齐 |
| 4 | ¥1688.00 | right | 右对齐 |
| 5 | ¥168,800.00 | right | 右对齐 |
| 6 | +3,800.00 | right | 右对齐 |
| 7 | +800.00 | right | 右对齐 |

### FlowHoverSurface 状态
- 表格行内: **无** FlowHoverSurface 元素
- 表格行使用 `hover:bg-[var(--surface-2)]` 实现 hover 效果 (非 FlowHoverSurface)
- FlowHoverSurface 仅用于: AccountOverviewCard, AssetAllocation, PortfolioMiniChart, PositionCard 等外层卡片

### 数据行内容
| 行 | 股票 | 板块 | 持仓/可用 | 成本价 | 现价 | 市值 | 浮动盈亏 | 今日盈亏 |
|----|------|------|-----------|--------|------|------|----------|----------|
| 1 | 贵州茅台 600519 | 白酒 | 100/100 | ¥1650.00 | ¥1688.00 | ¥168,800.00 | +3,800.00 | +800.00 |
| 2 | 中际旭创 300308 | 光通信 | 200/200 | ¥120.00 | ¥128.56 | ¥25,712.00 | +1,712.00 | +1,712.00 |
| 3 | 宁德时代 300750 | 新能源 | 150/150 | ¥195.00 | ¥198.56 | ¥29,784.00 | +534.00 | +534.00 |
| 4 | 寒武纪 688256 | 算力 | 100/100 | ¥260.00 | ¥268.90 | ¥26,890.00 | +890.00 | +890.00 |

## 结论

**全部 8 项检查通过**。PositionTable 桌面端布局正确，8 列 grid 布局一致，数字列右对齐，行高 68px 在预期范围内，无竖排堆叠问题。
