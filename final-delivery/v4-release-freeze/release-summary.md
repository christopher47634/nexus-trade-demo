# V4 Release Summary

**日期:** 2026-06-18
**版本定位:** V4 Trading Product Reality Release

---

## 版本信息

| 项目 | 值 |
|------|-----|
| Production URL | https://stock-trading-demo.vercel.app |
| main commit | 0d916d5 |
| tag | v4-a-trading-product-reality |
| Build | ✅ 通过 (10/10 页面) |
| Lint | ✅ 通过 (0 warning, 0 error) |
| TypeScript | ✅ 通过 (0 error) |
| 状态 | Production Ready |

---

## P4-A 核心升级内容

### 数据真实感
- 板块 hotRank 公式排序: `changePercent × 2 + turnover/50`
- 强势板块成分股 4/5 同向，弱势板块反向
- 资金流与板块强度正相关
- 50 只股票全部使用合法 A 股代码
- 价格公式 `price = prevClose + changeAmount` 50/50 一致
- K 线趋势与涨跌幅方向 50/50 一致

### 交易闭环
- 佣金计算: 0.025%，最低 ¥5
- 印花税: 卖出 0.05%
- 确认委托弹窗: 股票 + 费用明细
- 风险提示: 9 只高风险个股
- 免责声明: 交易面板 + 订单页
- 订单编号: WT + YYYYMMDD + 6位序号
- 订单状态: 6 种 (submitted/matching/filled/cancelled/partial_filled/rejected)
- localStorage 持久化

### 图表可信度
- MA5/MA10/MA20 技术指标
- 板块分析文案 (基于 trend/capitalInflow/riskLevel)
- 个股盘面分析 (基于 changePercent 阈值)
- 资金流向面板
- 终端风格市场信号表格

### UI 状态系统
- LoadingState / EmptyState / ErrorState / WarningBanner

---

## 版本历史

| 版本 | 内容 |
|------|------|
| V1 | 基础框架 |
| V2 | 交互系统 |
| V3 | 终端视觉 + 行业图标 + Demo Mode |
| **V4** | **交易产品真实感 + 数据逻辑一致性** |
