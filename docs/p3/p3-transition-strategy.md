# P3 Transition Strategy

## 当前状态

只有板块卡片 → 板块详情的 shared layoutId（板块名+涨跌幅）。
其他页面之间无转场。

## 转场审计

| 转场 | 当前状态 | 值得做? | 成本 | 提升 |
|------|----------|---------|------|------|
| 首页卡片 → 板块详情 Hero | shared layout (name+change%) | ✅ 升级 | 1天 | 高 |
| 板块详情股票行 → 个股详情 | 无转场 | ⚠️ 可做 | 0.5天 | 中 |
| 个股详情 → TradePanel | 无（面板弹出） | ❌ 不做 | - | 低 |
| TradePanel → 成交完成 | 无（状态变化） | ❌ 不做 | - | 低 |
| Demo Mode 步骤间 | 高亮边框跳转 | ⚠️ 可做 | 1天 | 中 |

## 建议

### P3-B 做（低成本高回报）

**首页卡片 → 板块详情 Hero 升级**：
- 板块名 layoutId ✅（已有）
- 涨跌幅 layoutId ✅（已有）
- 新增：卡片背景 Canvas → Hero 背景 Canvas 的 scale-up 动画
- 新增：卡片边框 → Hero 边框的 morph
- 新增：卡片内图标 → Hero 内图标的飞入

技术：Framer Motion layoutId + layout prop + AnimatePresence

### P3-C 做（中等成本）

**板块详情股票行 → 个股详情**：
- 股票名 layoutId
- 涨跌幅数字 layoutId
- 行背景色 → 详情页背景色的 crossfade

### 不做

**TradePanel / 成交完成**：
- 交易面板是功能性组件，不需要花哨转场
- 成交完成是状态反馈，保持即时性更重要
- 过度动画会降低交易工具的"可靠感"

**Demo Mode 步骤间**：
- 当前高亮跳转已经够用
- 加转场可能让演示变慢
- 除非做 Presentation Mode（见 p3-demo-mode-upgrade.md）
