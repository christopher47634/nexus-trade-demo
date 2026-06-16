# 视觉决策文档
# 高质感股票交易界面Demo — 第一阶段执行决策
# 决策时间：2026-06-16

---

## 一、核心审美方向

### 最终定位
**"TradingView的专业交易密度 + Webull的移动端交易路径 + Robinhood Legend的桌面交易驾驶舱 + Apple Liquid Glass的高级玻璃拟态 + Linear暗色产品的克制感"**

### 不要做成
- ❌ 同花顺那种资讯门户感
- ❌ 东方财富那种拥挤信息流
- ❌ 普通后台管理系统
- ❌ SaaS模板站
- ❌ 只有表格的金融数据看板
- ❌ 霓虹过重的廉价赛博风
- ❌ 玻璃模糊过度导致看不清数字

---

## 二、第一阶段技术决策

### 技术栈确认
```
框架: Next.js 14 (App Router) + React 18 + TypeScript
样式: Tailwind CSS 3.4+ + CSS原生效果
动画: Framer Motion 11+
K线图: TradingView Lightweight Charts
统计图: Apache ECharts
基础组件: shadcn/ui (copy-paste模式)
微交互: Magic UI + Motion Primitives (精选组件)
图标: Lucide React
```

### 组件选型决策

| 场景 | 决策 | 说明 |
|------|------|------|
| 基础按钮 | shadcn Button + 自定义variant | 买入绿/卖出红/默认灰 |
| 交易弹窗 | shadcn Dialog + 磨砂玻璃背景 | 加边框光效 |
| 侧边面板 | shadcn Sheet | 移动端滑出面板 |
| Tab切换 | shadcn Tabs + FM layoutId滑动指示器 | 关键动效 |
| 股票搜索 | shadcn Command | Cmd+K命令面板 |
| 下拉选择 | shadcn Select/Dropdown | 订单类型、指标选择 |
| Tooltip | shadcn Tooltip | K线hover数据 |
| 涨跌标签 | shadcn Badge | 带涨跌颜色 |
| 价格展示 | 自定义 + Number Ticker | 支持delta变化+数字跳动 |
| 迷你走势 | Lightweight Charts (Area) | watchlist里的走势线 |
| K线图 | Lightweight Charts | 专业级，核心选择 |
| 成交量图 | Lightweight Charts (Histogram) | 与K线叠加 |
| 热力图 | ECharts Heatmap | 成交量分布 |
| 资产配置 | ECharts Pie/Doughnut | 持仓比例图 |
| 排行/统计 | ECharts Bar | 行业排行/资金流向 |
| 卡片hover | 自定义CSS + mousemove | Spotlight效果参考Aceternity |
| 数字跳动 | Magic UI Number Ticker | 所有价格/数字 |
| CTA按钮微光 | Magic UI Shimmer Button | 买入/卖出按钮 |
| 磁性按钮 | Motion Primitives Magnetic Button | 重要操作按钮 |
| 列表进场 | Framer Motion stagger | 订单/持仓列表 |
| 页面转场 | Framer Motion AnimatePresence | 路由切换动画 |
| 背景网格 | CSS repeating-linear-gradient | 交易页背景 |
| 毛玻璃效果 | CSS backdrop-filter | 弹窗/面板背景 |
| 渐变边框 | CSS background-clip + gradient | 卡片/按钮边框 |
| 滚动条 | shadcn Scroll Area | 自定义暗色滚动条 |

---

## 三、默认主题决策

### 主题1：东方暗金金融科技风（默认）
```
背景基底: #020612 (深黑蓝)
背景渐变: #020612 → #0a1628
玻璃背景: rgba(255,255,255,0.06)
玻璃边框: rgba(255,255,255,0.12)
玻璃阴影: 0 24px 80px rgba(0,0,0,0.35)
数据强调: #D4A574 (暗金色)
上涨: #34D399 (青绿)
下跌: #F87171 (朱红)
文字主色: #E2E8F0
文字辅助: #94A3B8
```

### 主题2：赛博蓝紫交易终端风（预留配置）
```
背景基底: #0a0a1a (蓝黑)
强调色: #6366f1 (靛蓝)
霓虹色: #a78bfa (紫)
```

### 主题3：黑金机构投研风（预留配置）
```
背景基底: #0a0a0a (近纯黑)
强调色: #d4a574 (暗金)
辅助色: #6b7280 (灰)
```

### 主题4：冰川玻璃拟态风（预留配置）
```
背景基底: #f8fafc (浅色)
玻璃主色: #E5DDF9 (浅紫白)
玻璃次色: #A78BFA (中紫)
```

**决策**: 第一阶段只打磨"东方暗金"，其他三套只预留CSS变量配置结构。

---

## 四、页面范围决策

### 第一阶段页面（只做6个）
1. **桌面端首页** — 市场总览驾驶舱
2. **桌面端板块详情页** — 板块Hero+股票列表
3. **桌面端个股详情页** — K线+盘口+交易面板
4. **手机端首页** — 账户资产+指数+板块横滑
5. **手机端板块详情页** — Hero+股票列表
6. **手机端交易确认页** — 玻璃拟态交易抽屉

### 第一阶段不做的页面
- 登录/注册页
- 持仓详情页
- 设置页
- 搜索结果页
- 新闻/资讯页

---

## 五、动效范围决策

### 第一阶段做（10个核心动效）
1. ✅ 玻璃拟态卡片（backdrop-filter）
2. ✅ 鼠标跟随光晕（CSS变量+JS）
3. ✅ 暗色渐变背景系统
4. ✅ 卡片Tilt倾斜效果
5. ✅ 数字递增动画
6. ✅ 股票走势SVG描边动画
7. ✅ 微光/渐变边框
8. ✅ Framer Motion卡片展开转场
9. ✅ 文字reveal动画（clip-path）
10. ✅ Hover状态过渡动画

### 第一阶段不做
- ❌ GSAP ScrollTrigger滚动叙事
- ❌ Canvas鼠标光晕/拖尾
- ❌ GSAP Flip页面转场
- ❌ Canvas动态渐变背景
- ❌ 3D玻璃几何体
- ❌ GLSL shader背景
- ❌ 粒子系统
- ❌ 后处理效果

---

## 六、板块视觉决策

### 板块列表（10个）
```
光通信、算力、半导体、矿山、新能源、机器人、低空经济、军工、医药、白酒
```

### 板块卡片视觉
- 每个板块有独立accentColor
- 卡片使用玻璃拟态
- hover时Tilt倾斜+光晕
- 点击时展开转场到详情页
- 封面图先用渐变+文字占位，后续AI生成图片替换

### 板块数据字段
```ts
{
  id: string
  name: string
  changePercent: number
  turnover: string
  capitalInflow: string
  hotRank: number
  imageUrl: string      // 后续替换
  accentColor: string
  themeType: "gold" | "cyber" | "institutional" | "ice"
}
```

---

## 七、Mock数据决策

### 数据文件
```
src/mock/sectors.ts   — 10个板块数据
src/mock/stocks.ts    — 50+只股票数据
src/mock/market.ts    — 市场指数数据
src/mock/orders.ts    — 模拟订单数据
```

### 数据结构
- 所有数据接口预留，方便后续替换真实API
- 股票数据包含：code, name, sectorId, price, changePercent, volume, turnover, turnoverRate, marketCap
- K线数据包含：time, open, high, low, close, volume

---

## 八、验收标准

第一阶段交付时，V按以下标准验收：

| # | 标准 | 说明 |
|---|------|------|
| 1 | 第一眼是否高级 | 不能像模板站或后台系统 |
| 2 | 是否像金融交易Demo | 有交易终端感，不是普通Dashboard |
| 3 | 桌面端是否有驾驶舱感 | 多面板布局、信息密度适中 |
| 4 | 手机端是否像真实App | 不是网页缩小版，有底部Tab、滑动卡片 |
| 5 | 板块卡片是否有视觉记忆点 | 有主题色、有hover动效、有玻璃质感 |
| 6 | 玻璃拟态是否精致且不影响可读性 | 数字清楚、层次分明 |
| 7 | 动效是否顺滑且服务产品层级 | 克制、不浮夸、有目的 |
| 8 | 数据区域是否清楚 | 涨跌颜色、数字字体、对齐方式 |
| 9 | 是否没有真实券商Logo | 全部使用通用设计 |
| 10 | 是否没有真实交易功能 | 纯模拟，不接真实接口 |
