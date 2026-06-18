# Demo Flow 10-Step Check

**Date**: 2026-06-19
**Viewport**: 1440x900
**Server**: http://localhost:3458

---

## 10 步逐步检查结果

| Step | 标题 (Badge) | 页面 | 高亮元素 | 引导文案 | 进度条 | 通过 |
|------|-------------|------|----------|----------|--------|------|
| 0 | 市场总览 | / | 光通信板块卡片 `[data-demo-highlight="optical-communication"]` | "点击光通信板块查看详情" | 1/10 ✓ | ✅ |
| 1 | 板块分析 | /sectors/optical-communication | 第一行股票 `[data-demo-highlight="first-stock"]` (中际旭创 300308) | "点击中际旭创查看详情" | 2/10 ✓ | ✅ |
| 2 | 技术视图 | /stocks/300308 | 图表切换器 `[data-demo-highlight="chart-type-switcher"]` (蜡烛/面积/折线/OHLC) | "切换图表类型查看不同技术视图" | 3/10 ✓ | ✅ |
| 3 | 交易入口 | /stocks/300308 | 买入按钮 `[data-demo-highlight="buy-button"]` | "点击买入按钮开始模拟交易" | 4/10 ✓ | ✅ |
| 4 | 模拟交易 | /stocks/300308 | 交易输入区 `[data-demo-highlight="trade-inputs"]` (价格/数量) | "设置交易价格和数量" | 5/10 ✓ | ✅ |
| 5 | 确认委托 | /stocks/300308 | 确认买入按钮 `[data-demo-highlight="confirm-buy"]` | "确认委托买入" | 6/10 ✓ | ✅ |
| 6 | 订单回执 | /orders | 查看订单按钮 → 跳转到 /orders | "查看委托订单记录" | 7/10 ✓ | ✅ |
| 7 | 订单归档 | /orders | 订单表格 `[data-demo-highlight="order-table"]` | "查看完整订单详情" | 8/10 ✓ | ✅ |
| 8 | 持仓变化 | /portfolio | 持仓表格 `[data-demo-highlight="portfolio-table"]` | "查看持仓变化" | 9/10 ✓ | ✅ |
| 9 | 闭环完成 | /portfolio | 交易记录 `[data-demo-highlight="transaction-list"]` | "查看资金流水，完成闭环演示" | 10/10 ✓ | ✅ |

---

## 各步骤详细验证

### Step 0: 市场总览 (首页)
- **页面**: 首页 /, 显示市场指数、热门板块、涨幅榜、成交额榜、自选股
- **高亮**: 光通信板块卡片有呼吸动画高亮效果
- **账户**: 模拟总资产 ¥1,006,936 / 今日盈亏 ¥1,936 / 持仓市值 ¥251,186 / 可用资金 ¥755,750
- **结果**: ✅ PASS

### Step 1: 板块分析 (光通信)
- **页面**: /sectors/optical-communication, 显示板块趋势图、成分股列表
- **板块数据**: 涨跌幅 +3.85%, 成交额 287.6亿, 资金流入 +18.3亿, 热度 #2
- **成分股**: 中际旭创(300308), 天孚通信(300394), 新易盛(300502), 亨通光电(600487), 博创科技(300548)
- **结果**: ✅ PASS

### Step 2: 技术视图 (中际旭创)
- **页面**: /stocks/300308, K线图、盘口、技术指标
- **高亮**: 图表类型切换器 (分时/日K/周K/月K + 蜡烛/面积/折线/OHLC)
- **图表**: 日K蜡烛图正常渲染，成交量柱状图可见
- **结果**: ✅ PASS

### Step 3: 交易入口
- **页面**: /stocks/300308
- **高亮**: 买入按钮 (绿色, 数据属性 `data-demo-highlight="buy-button"`)
- **结果**: ✅ PASS

### Step 4: 模拟交易
- **页面**: /stocks/300308 (TradePanel 已展开)
- **高亮**: 价格/数量输入区域
- **结果**: ✅ PASS

### Step 5: 确认委托
- **页面**: /stocks/300308 (TradePanel 确认弹窗)
- **高亮**: 确认买入按钮
- **结果**: ✅ PASS

### Step 6: 订单回执
- **页面**: /orders (从 /stocks/300308 跳转)
- **数据**: 共 1 笔委托订单, demo-order-p5-a3-001
- **结果**: ✅ PASS

### Step 7: 订单归档
- **页面**: /orders
- **数据**: 同上 1 笔订单, 显示完整字段 (编号/股票/方向/价格/数量/金额/状态/时间)
- **结果**: ✅ PASS

### Step 8: 持仓变化
- **页面**: /portfolio (从 /orders 跳转)
- **数据**: 共 4 只持仓, 账户概览正确
- **结果**: ✅ PASS

### Step 9: 闭环完成
- **页面**: /portfolio
- **数据**: 资金流水共 12 笔, 包含买入/卖出/分红/费用
- **结果**: ✅ PASS

---

## 总结

**10/10 步骤全部通过** ✅

- 所有步骤的 localStorage 控制 (demoMode + demoModeStep) 正确生效
- 高亮元素定位准确，动画效果正常
- 页面间导航正确 (首页 → 板块 → 股票 → 订单 → Portfolio)
- Demo Guide overlay 步骤标题、进度条与实际步骤匹配
- 退出 demo 后状态完全清除
