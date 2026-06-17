# V4 Trading Reality Summary

**日期:** 2026-06-18
**版本:** P4-A 核心升级

---

## 数据真实感

### hotRank 公式排序
- 公式: `changePercent × 2 + turnover / 50`
- 10/10 板块排名与公式一致
- 强势板块排名靠前，弱势板块排名靠后

### 成分股同步
- 强势板块: 4/5 股正涨，1/5 微跌 (模拟板块分化)
- 弱势板块: 1/5 股微涨，4/5 下跌
- 板块均值与板块涨跌幅方向一致

### K 线趋势一致
- 每只股票 K 线 trend 参数与当日 changePercent 方向一致
- 上涨股: trend="up" (bias=0.42, 平均每日正漂移)
- 下跌股: trend="down" (bias=0.58, 平均每日负漂移)
- 50/50 股票全部一致

### 板块数据逻辑
- riskLevel: 高波动板块→medium/high, 稳定板块→low
- trend: 正涨→up, 负跌→down, 微幅→sideways
- capitalInflow: 强势板块→正向, 弱势板块→负向

---

## 交易系统

### 佣金计算
- 费率: 0.025% of 交易金额
- 最低: ¥5
- 公式: `max(tradeValue × 0.00025, 5)`

### 印花税逻辑
- 仅卖出时收取
- 费率: 0.05% of 交易金额
- 买入时 = ¥0

### 订单编号
- 格式: `WT` + `YYYYMMDD` + 6位序号
- 示例: `WT20260618000001`
- 自动生成，不重复

### 订单状态
| 状态 | 说明 |
|------|------|
| submitted | 已提交 |
| matching | 撮合中 |
| filled | 已成交 |
| cancelled | 已撤单 |
| partial_filled | 部分成交 |
| rejected | 已拒绝 |

### 风险等级
- 板块级别: low / medium / high
- 个股级别: riskWarning 字段 (9只股票)
- 展示: 黄色警告横幅 + AlertTriangle 图标

### 免责声明
- 交易面板: "模拟交易，不构成投资建议。投资有风险，入市需谨慎。"
- 订单页: "本系统为模拟交易平台，所有数据均为虚拟数据，不涉及真实资金和证券。投资有风险，入市需谨慎。"

### localStorage 持久化
- 存储键: `nexus-trade-orders`
- 最多保留 50 条订单
- 页面刷新后订单仍在
- SSR 兼容 (typeof window 检查)
