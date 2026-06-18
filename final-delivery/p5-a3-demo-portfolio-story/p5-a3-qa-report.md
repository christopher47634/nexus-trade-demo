# P5-A3 QA Report — 桌面端截图 + 回归检查

**日期**: 2026-06-19
**测试环境**: WSL + Chromium (headless), 1440x900 / 390x844
**服务地址**: http://localhost:3458
**分支**: p5-a3-demo-portfolio-story

## 总结

| 指标 | 值 |
|------|-----|
| 总检查项 | 10 |
| 通过 | 8 |
| 未通过 | 2 |
| 通过率 | 80% |

## 任务 1: Demo Mode 截图 (1440x900)

| Step | 截图文件 | 说明 |
|------|---------|------|
| 0 | demo-home-step.png | 首页 — 市场机会扫描 |
| 1 | demo-sector-step.png | 光通信板块详情 |
| 2 | demo-stock-step.png | 个股 300308 技术视图 |
| 3-5 | demo-trade-step.png | 交易面板 — 模拟交易 |
| 6 | demo-order-step.png | 订单记录 |
| 7 | demo-portfolio-step.png | 持仓页面 |
| 8-9 | demo-account-change-step.png | 资金流水区域 |

> 截图目录: `final-delivery/p5-a3-demo-portfolio-story/screenshots/`

## 任务 2: 回归检查

| # | 检查项 | 预期 | 实际 | 通过 |
|---|--------|------|------|------|
| 1 | 2.1 买入100股300308 → 持仓变化 | 数量增加(原200→新200), 资金减少 | qty: 200→200, cash: 755750→755750 | ❌ |
| 2 | 2.2 卖出100股300308 → 资金变化 | 数量减少(原200→新200), 资金增加 | qty: 200→200, cash: 755750→755750 | ❌ |
| 3 | 2.3 资金不足买入 → 验证拒绝 | 持仓不变(应为200) | qty: 200→200 | ✅ |
| 4 | 2.4 超量卖出 → 验证拒绝 | 持仓不变(应为200) | qty: 200→200 | ✅ |
| 5 | 2.5 刷新页面 → 验证持久化 | localStorage数据一致 | persistence=True, keys=['demoMode', 'demoModeStep', 'nexus-trade-account', 'nexus-trade-history', 'nexus-trade-positions', 'nexus-trade-transactions'] | ✅ |
| 6 | 2.6 /portfolio 持仓表格8列横向 | 8列: 股票/板块/持仓可用/成本价/现价/市值/浮动盈亏/今日盈亏 | 8列: ['股票', '板块', '持仓/可用', '成本价', '现价', '市值', '浮动盈亏', '今日盈亏'] | ✅ |
| 7 | 2.7 /portfolio 资金流水横向布局 | 横向布局 | display=block, items=11, layout=flex | ✅ |
| 8 | 2.8 首页板块视觉(10张卡片) | 10张卡片 | 10张, grid=grid grid-cols-5 gap-3 | ✅ |
| 9 | 2.9 手机端390px首页无溢出 | 无水平溢出 | bodyW=390, vpW=390, overflow=False | ✅ |
| 10 | 2.10 手机端390px持仓页无溢出 | 无水平溢出 | bodyW=390, vpW=390, overflow=False | ✅ |

## 截图清单

| 文件 | 说明 |
|------|------|
| demo-home-step.png | Step 0 首页 |
| demo-sector-step.png | Step 1 板块详情 |
| demo-stock-step.png | Step 2 个股页面 |
| demo-trade-step.png | Step 3 交易面板 |
| demo-order-step.png | Step 6 订单页 |
| demo-portfolio-step.png | Step 7 持仓页 |
| demo-account-change-step.png | Step 9 资金流水 |
| regression-home.png | 回归首页 |
| regression-portfolio.png | 回归持仓页 |
| regression-mobile-390.png | 手机端首页 |
| regression-mobile-portfolio-390.png | 手机端持仓页 |
| regression-mobile-stock-390.png | 手机端个股页 |

## 备注

- 约束：不修改代码，只做验证
- Demo Mode 通过 localStorage `demoMode=true` + `demoModeStep=N` 控制
- 交易验证采用静默拒绝：输入不合法数量时持仓数据不变，无显式错误弹窗
- 持仓表格使用 DIV grid 布局（非 `<table>`），8列: 股票/板块/持仓可用/成本价/现价/市值/浮动盈亏/今日盈亏
- 资金流水使用 DIV 布局，横向列表展示
- 手机端390px视口下首页和持仓页均无水平溢出

---

## 任务 3: 回归复测 (2026-06-19 补充)

**测试工具**: Playwright + Chromium (headless)  
**测试脚本**: `regression-test.mjs`  
**测试时间**: 2026-06-19

### 复测背景

初始回归检查中 #1/#2 标记为 ❌，经排查发现原因是 **测试脚本数量单位错误**：
- TradePanel 的数量输入单位为「手」(1手 = 100股)
- 初始测试将输入值设为 `100`，实际为 100手 = 10,000股，超过可用资金
- 修正为默认值 `1` (1手 = 100股) 后，交易正常执行

### 复测结果

| # | 检查项 | 预期 | 实际 | 通过 |
|---|--------|------|------|------|
| 1 | 买入1手(100股) 300308 → 持仓联动 | cash↓, qty↑, txn新增 | cash: 755750→742889, qty: 200→300, txns: 11→12 | ✅ |
| 2 | 卖出1手(100股) 300308 → 资金联动 | qty↓, sell txn新增 | cash: 742889→755733.57, qty: 300→200, sellTxns: 1, txns: 12→13 | ✅ |
| 3 | 资金不足买入 → 验证拒绝 | 持仓不变, txn不变 | qty不变, cash不变, txns不变 | ✅ |
| 4 | 超量卖出 → 验证拒绝 | 持仓不变, txn不变 | qty不变, txns不变 | ✅ |
| 5 | 刷新页面 → localStorage 持久化 | keys 保持一致 | keys match: demoMode, demoModeStep, nexus-trade-account, nexus-trade-history, nexus-trade-positions, nexus-trade-transactions | ✅ |
| 6 | /portfolio 持仓表格 8 列 | 8列横向 | count=8, labels=股票/板块/持仓可用/成本价/现价/市值/浮动盈亏/今日盈亏 | ✅ |
| 7 | /portfolio 资金流水横向 | flex 布局 | display=flex, items>0 | ✅ |
| 8 | 首页 10 张板块卡片 | grid-cols-5, 10 cards | count=10, class=grid grid-cols-5 gap-3 | ✅ |
| 9 | mobile 390px 无溢出 | bodyW≤vpW | home: 390≤390, portfolio: 390≤390 | ✅ |

### 复测结论

| 指标 | 初测 | 复测 |
|------|------|------|
| 总检查项 | 10 | 9 |
| 通过 | 8 | 9 |
| 未通过 | 2 | 0 |
| 通过率 | 80% | **100%** |

> 初测 #1/#2 失败根因为测试脚本单位错误 (手 vs 股)，非代码缺陷。
> 修正测试参数后，P5-A2 买入/卖出联动功能正常工作。
> Build ✅ | Lint ✅ | 9/9 回归通过 ✅

### 关键验证数据

**买入验证**:
- 初始: cash=755,750, qty=200
- 买入1手后: cash=742,889 (-12,861), qty=300 (+100)
- 新增交易记录: 12条 (原11条)

**卖出验证**:
- 卖出前: cash=742,889, qty=300
- 卖出1手后: cash=755,733.57 (+12,844.57), qty=200 (-100)
- 新增卖出记录: 1条
