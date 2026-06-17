# NexusTrade — 高质感股票交易界面 Demo

暗色、玻璃拟态、精致交互动画的股票交易界面。网页端 + 手机端，模拟行情与模拟交易。

## 技术栈

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS 3.4+
- Framer Motion 11+
- TradingView Lightweight Charts v5.2 (K线图)
- Lucide React (图标)

## 快速开始

```bash
npm install
npm run build
npx next start -p 3458
```

访问：
- 桌面端：http://localhost:3458
- 手机端：http://localhost:3458/mobile

## 项目结构

```
stock-trading-demo/
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # 根布局
│   │   ├── page.tsx                        # 桌面端首页
│   │   ├── sectors/[sectorId]/page.tsx     # 板块详情页
│   │   ├── stocks/[stockCode]/page.tsx     # 个股详情页
│   │   ├── orders/page.tsx                 # 订单记录页
│   │   └── mobile/
│   │       ├── page.tsx                    # 手机端首页
│   │       ├── sectors/[sectorId]/page.tsx # 手机板块详情
│   │       └── trade/[stockCode]/page.tsx  # 手机交易页
│   ├── components/
│   │   ├── common/                         # 通用组件
│   │   │   ├── GlassCard.tsx               # 玻璃拟态卡片
│   │   │   ├── MetricCard.tsx              # 数据指标卡
│   │   │   ├── AnimatedButton.tsx          # 动画按钮
│   │   │   ├── ThemeSwitcher.tsx           # 主题切换器
│   │   │   ├── EmptyState.tsx              # 空状态组件
│   │   │   └── ErrorState.tsx              # 错误状态组件
│   │   ├── layout/
│   │   │   ├── DesktopShell.tsx            # 桌面端布局壳
│   │   │   └── MobileShell.tsx             # 手机端布局壳
│   │   ├── market/
│   │   │   ├── IndexTicker.tsx             # 市场指数条
│   │   │   ├── MarketOverview.tsx          # 市场概览
│   │   │   ├── HotSectorGrid.tsx           # 热门板块网格
│   │   │   ├── RankingList.tsx             # 涨幅榜/成交额榜
│   │   │   └── Watchlist.tsx               # 自选股
│   │   ├── sector/
│   │   │   ├── SectorVisualBackground.tsx  # 板块程序化纹理
│   │   │   ├── SectorHeroArtwork.tsx       # 板块Hero视觉
│   │   │   └── HeroKpiCard.tsx             # Hero数据卡
│   │   ├── stock/
│   │   │   ├── KlineChart.tsx              # K线图(Lightweight Charts)
│   │   │   ├── ChartTypeSwitcher.tsx       # 图表类型切换器
│   │   │   ├── OrderBook.tsx               # 五档盘口
│   │   │   └── TradePanel.tsx              # 交易面板
│   │   └── demo/
│   │       └── DemoMode.tsx                # Demo模式引导
│   ├── mock/                               # Mock数据
│   │   ├── sectors.ts                      # 10个板块
│   │   ├── stocks.ts                       # 50+只股票
│   │   ├── market.ts                       # 市场指数
│   │   ├── kline.ts                        # K线历史
│   │   └── orders.ts                       # 订单管理
│   └── styles/
│       └── globals.css                     # 全局样式+主题系统
├── docs/
│   ├── demo/                               # 演示文档
│   │   ├── demo-flow.md
│   │   ├── demo-script.md
│   │   ├── screenshot-checklist.md
│   │   └── qa-checklist.md
│   └── research/                           # 视觉调研
├── package.json
└── README.md
```

## 开发阶段

### P1-A ✅ 视觉系统
- 东方暗金主题系统（4套主题可切换）
- 玻璃拟态组件（GlassCard / MetricCard）
- 桌面端首页 + 手机端首页
- 板块程序化纹理（10个行业独立视觉）
- 响应式布局 + 动效系统

### P1-B ✅ 核心交易闭环
- 板块详情页（桌面+手机）
- 个股详情页（桌面+手机）
- K线图（TradingView Lightweight Charts v5.2）
- 图表类型切换（蜡烛/面积/折线/OHLC）
- 成交量柱状图开关
- 五档盘口
- 交易面板（买入/卖出）
- 模拟成交动画（提交→撮合→成交）
- 订单记录页

### P1-E ✅ Demo包装
- Demo Mode 引导模式
- 演示路径高亮
- Loading / Empty / Error 状态
- 订单记录面板
- 路由导航完善
- 展示文档（demo-flow / demo-script / qa-checklist）

## 主题系统

默认主题：东方暗金金融科技风

| 主题 | 名称 | 强调色 |
|------|------|--------|
| 默认 | 东方暗金 | #D4A574 |
| Cyber | 赛博蓝紫 | #6366F1 |
| Institutional | 黑金机构 | #6B7280 |
| Ice | 冰川玻璃 | #A78BFA |

## Mock数据

所有数据为模拟数据，不接真实API。

| 文件 | 内容 |
|------|------|
| `mock/sectors.ts` | 10个板块（光通信/算力/半导体/新能源/机器人/低空/白酒/矿山/军工/医药） |
| `mock/stocks.ts` | 50+只股票（含价格/涨跌幅/成交额/换手率/市值/PE） |
| `mock/kline.ts` | K线历史数据（120天日K） |
| `mock/orders.ts` | 订单管理（创建/状态更新/查询） |

## 注意事项

- 不使用真实券商Logo
- 不接真实交易接口
- 不做真实下单
- 涨跌颜色：青绿涨/朱红跌（国际化配色）
- 玻璃拟态blur值≤24px

## 数据说明

本项目为股票交易界面 Demo，所有行情、订单、成交均为 Mock 数据，不接真实券商接口，不构成投资建议。

订单记录使用浏览器 localStorage 持久化：
- Key: `nexus-trade-orders`
- 刷新页面或清除浏览器数据后订单可能丢失
- 当前不包含真实交易、不接券商接口、不构成投资建议
