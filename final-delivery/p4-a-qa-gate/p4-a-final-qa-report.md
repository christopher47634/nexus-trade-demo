# P4-A 最终 QA 报告

**日期:** 2026-06-18
**分支:** p4-a-trading-product-reality-pass
**Commit:** ccbafc2 (P4-A Phase 4: Delivery)
**对比基线:** v3-c-terminal-visual-closeout (367f15a)

---

## 一、当前状态

| 项目 | 状态 |
|------|------|
| 当前分支 | p4-a-trading-product-reality-pass |
| 当前 commit | ccbafc2 |
| 未提交改动 | 0 |
| Build | ✅ 通过（10/10 页面） |
| TypeScript | ✅ 通过（0 error） |
| Lint | ✅ 通过（0 warning） |
| 未合入 main | ✅ 确认 |

---

## 二、数据一致性检查

| # | 检查项 | 当前表现 | 通过 | 风险 | 需修复 |
|---|--------|----------|------|------|--------|
| 1 | 热门板块涨跌幅/成交额/资金流一致 | hotRank 公式 10/10 匹配 | ✅ | - | 否 |
| 2 | 强势板块成分股大体同步强势 | 10/10 板块 4/5 股同向 | ✅ | - | 否 |
| 3 | 弱势板块有合理风险提示 | 医药low/矿山medium/军工medium | ✅ | - | 否 |
| 4 | hotRank 非随机排序 | changePercent×2 + turnover/50 | ✅ | - | 否 |
| 5 | 个股行业归属与板块一致 | 50/50 股票 sectorId 正确 | ✅ | - | 否 |
| 6 | K线趋势与当日涨跌幅一致 | 50/50 股票 trend 匹配 | ✅ | - | 否 |
| 7 | 涨跌颜色/单位/百分比/时间戳统一 | 绿涨红跌/亿/2位小数/Unix ms | ✅ | - | 否 |
| 8 | A股代码/名称/行业无错配 | 50 个合法 A 股代码 | ✅ | - | 否 |

**数据一致性: 8/8 通过，0 P0/P1，0 P2**

---

## 三、交易闭环检查

| # | 检查项 | 状态 | 说明 |
|---|--------|------|------|
| 1 | 订单编号生成 | ✅ | WT20260618xxxxxx 格式 |
| 2 | 委托时间存在 | ✅ | Unix ms 格式化显示 |
| 3 | 委托价格正确 | ✅ | 与输入一致 |
| 4 | 数量/手数正确 | ✅ | 100股=1手，验证倍数 |
| 5 | 成交金额正确 | ✅ | price × quantity |
| 6 | 佣金合理 | ✅ | 0.025%，最低¥5 |
| 7 | 印花税 | ✅ | 仅卖出 0.05%（当前测试买入=0） |
| 8 | 订单状态清楚 | ✅ | 6 种状态含 partial_filled/rejected |
| 9 | 风险等级显示 | ✅ | 板块详情页低/中/高风险徽章 |
| 10 | 免责声明存在 | ✅ | 交易面板 + 订单页底部 |
| 11 | 查看订单按钮可用 | ✅ | 提交后跳转 /orders |
| 12 | 刷新后订单仍在 | ✅ | localStorage 持久化 |

**交易闭环: 12/12 通过，0 P0/P1，0 P2**

---

## 四、V3/P3 回归检查

| # | 检查项 | 状态 | 证据 |
|---|--------|------|------|
| 1 | V3 玻璃金融终端视觉 | ✅ | 01-homepage-desktop.png 确认 |
| 2 | 10 个行业板块 Canvas 视觉 | ✅ | 20 个 Canvas 元素检测到 |
| 3 | micro chip 仍是小型标签 | ✅ | 10px/12px 字号，未放大 |
| 4 | 白酒仍是酒瓶 | ✅ | SectorIcons.tsx 未修改 |
| 5 | 医药仍是分子链/ECG | ✅ | SectorIcons.tsx 未修改 |
| 6 | 低空经济仍是四旋翼/航线 | ✅ | SectorIcons.tsx 未修改 |
| 7 | HoverGlow 惯性保持 | ✅ | git diff 空（未修改） |
| 8 | Canvas hover 保持 | ✅ | feature-flags.ts 未修改 |
| 9 | Demo Mode 保持 | ✅ | DemoWrapper.tsx 未修改 |
| 10 | mobile press feedback | ✅ | 代码层面未改动交互逻辑 |
| 11 | 移动端布局 | ⚠️ | 已知问题：market indices bar 导致横向溢出（V3 已存在） |
| 12 | K 线图切换正常 | ✅ | 蜡烛/面积/线型切换代码未改动 |

**回归检查: 11/12 通过，1 个已知问题（V3 已存在，非 P4-A 引入）**

---

## 五、UI 状态系统检查

| 状态 | 组件 | 使用位置 | 实际展示 |
|------|------|----------|----------|
| Loading | LoadingState.tsx (ui/) | 组件就绪，未在主流程导入 | ⚠️ 代码就绪未接入 |
| Empty | EmptyState.tsx (common/) | /orders 空订单状态 | ✅ 用户可见 |
| Error | ErrorState.tsx (common/) | 个股/板块详情 404 状态 | ✅ 用户可见 |
| Disabled | 内联实现 | 市价委托按钮（灰色+锁图标） | ✅ 用户可见 |
| Warning | WarningBanner.tsx (ui/) | 组件就绪，TradePanel 用内联实现 | ⚠️ 代码就绪未接入 |
| Success | 内联实现 | 订单提交成功提示 | ✅ 用户可见 |

**说明:** P4-A Phase 3 创建了 `src/components/ui/` 目录下的 4 个组件，但页面实际导入的是 `src/components/common/` 下的已有组件。功能不缺失（Empty/Error 状态正常展示），但存在重复组件。

**风险等级: P3（不阻塞发布，后续清理即可）**

---

## 六、截图验证

| # | 截图 | 大小 | 内容确认 |
|---|------|------|----------|
| 1 | 01-homepage-desktop.png | 882KB | ✅ 完整首页，玻璃卡片+板块+指数 |
| 2 | 02-homepage-mobile.png | 264KB | ✅ 375x812 移动端 |
| 3 | 03-sector-detail.png | 568KB | ✅ 板块详情+分析文案 |
| 4 | 04-stock-detail.png | 370KB | ✅ 个股+MA指标+分析 |
| 5 | 05-trade-panel.png | 243KB | ✅ 交易面板+佣金预估 |
| 6 | 06-trade-confirm.png | 232KB | ✅ 确认委托弹窗+费用明细 |
| 7 | 07-orders-page.png | 63KB | ✅ 订单页 |
| 8 | 08-risk-warning.png | 393KB | ✅ 寒武纪风险提示横幅 |

**截图: 8/8 通过，全部为真实渲染**

---

## 七、验收结论

### 建议合入 main: ✅ 是

### 问题汇总

| 等级 | 数量 | 说明 |
|------|------|------|
| P0 Blocker | 0 | 无 |
| P1 Critical | 0 | 无 |
| P2 Should Fix | 0 | 无 |
| P3 Nice to Have | 2 | ① ui/ 组件未接入主流程（功能不缺失） ② 移动端横向溢出（V3 已存在） |

### P3 不阻塞项（后续清理）

1. **ui/ 组件重复:** `src/components/ui/` 下的 4 个组件与 `src/components/common/` 重复，建议统一
2. **移动端溢出:** market indices bar `whitespace-nowrap` 导致横向滚动，V3 已存在

### 最终判定

**P4-A QA Gate 通过。** 数据真实感、交易闭环、订单状态、费用计算、风险提示、免责声明全部验证合格，V3 视觉系统和 P3 交互成果无退化。建议合入 main。
