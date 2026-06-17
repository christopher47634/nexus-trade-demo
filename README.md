# NexusTrade — 高质感股票交易界面 Demo

暗色、玻璃拟态、精致交互动画的股票交易界面。网页端 + 手机端，模拟行情与模拟交易。

## 技术栈

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS 3.4+
- Framer Motion 11+
- TradingView Lightweight Charts (K线图)
- Apache ECharts (统计图表)
- Lucide React (图标)

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

启动后访问：

- 桌面端首页：http://localhost:3000
- 手机端首页：http://localhost:3000/mobile

## 项目结构

```
stock-trading-demo/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # 根布局
│   │   ├── page.tsx                  # 桌面端首页
│   │   └── mobile/
│   │       └── page.tsx              # 手机端首页
│   ├── components/
│   │   ├── ui/                       # shadcn/ui 基础组件
│   │   ├── common/                   # 通用组件
│   │   │   ├── GlassCard.tsx         # 玻璃拟态卡片
│   │   │   ├── MetricCard.tsx        # 数据指标卡（含数字跳动）
│   │   │   ├── AnimatedButton.tsx    # 动画按钮
│   │   │   └── ThemeSwitcher.tsx     # 主题切换器
│   │   ├── layout/                   # 布局组件
│   │   │   ├── DesktopShell.tsx      # 桌面端布局壳
│   │   │   └── MobileShell.tsx       # 手机端布局壳
│   │   ├── market/                   # 市场组件
│   │   │   ├── IndexTicker.tsx       # 市场指数条
│   │   │   ├── MarketOverview.tsx    # 市场概览
│   │   │   ├── HotSectorGrid.tsx     # 热门板块网格
│   │   │   ├── RankingList.tsx       # 涨幅榜/成交额榜
│   │   │   └── Watchlist.tsx         # 自选股
│   │   └── mobile/                   # 手机端组件
│   │       └── BottomTabBar.tsx      # 底部Tab栏
│   ├── hooks/
│   │   └── use-mouse-position.ts     # 鼠标位置Hook（光晕效果）
│   ├── lib/
│   │   ├── utils.ts                  # 工具函数
│   │   └── chart-theme.ts            # ECharts暗色主题
│   ├── mock/                         # Mock数据
│   │   ├── sectors.ts                # 10个板块数据
│   │   ├── stocks.ts                 # 50+只股票数据
│   │   ├── market.ts                 # 市场指数数据
│   │   └── kline.ts                  # K线历史数据
│   └── styles/
│       └── globals.css               # 全局样式 + 主题系统
├── docs/
│   └── research/                     # 视觉调研文档
│       ├── visual-research.md        # 完整调研报告
│       ├── visual-decision.md        # 视觉决策文档
│       ├── reference-map.md          # 参考映射表
│       └── implementation-roadmap.md # 实现路线图
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 已完成组件

### 通用组件
| 组件 | 路径 | 功能 |
|------|------|------|
| GlassCard | `components/common/GlassCard.tsx` | 玻璃拟态卡片，backdrop-filter模糊 |
| MetricCard | `components/common/MetricCard.tsx` | 数据指标卡，含数字跳动动画 |
| AnimatedButton | `components/common/AnimatedButton.tsx` | 动画按钮，hover光晕效果 |
| ThemeSwitcher | `components/common/ThemeSwitcher.tsx` | 主题切换器，4套主题可选 |

### 布局组件
| 组件 | 路径 | 功能 |
|------|------|------|
| DesktopShell | `components/layout/DesktopShell.tsx` | 桌面端布局壳，左侧导航+主内容区 |
| MobileShell | `components/layout/MobileShell.tsx` | 手机端布局壳，底部Tab栏 |

### 市场组件
| 组件 | 路径 | 功能 |
|------|------|------|
| IndexTicker | `components/market/IndexTicker.tsx` | 顶部市场指数条 |
| MarketOverview | `components/market/MarketOverview.tsx` | 市场概览（情绪/涨跌停/北向资金） |
| HotSectorGrid | `components/market/HotSectorGrid.tsx` | 热门板块网格（10个板块） |
| RankingList | `components/market/RankingList.tsx` | 涨幅榜/成交额榜 |
| Watchlist | `components/market/Watchlist.tsx` | 自选股（含迷你走势图） |

## Mock数据

所有数据为模拟数据，不接真实API。

| 文件 | 内容 | 数据量 |
|------|------|--------|
| `src/mock/sectors.ts` | 板块数据（光通信、算力、半导体等10个） | 10条 |
| `src/mock/stocks.ts` | 股票数据 | 50+条 |
| `src/mock/market.ts` | 市场指数数据 | 5条 |
| `src/mock/kline.ts` | K线历史数据 | 120+条 |

数据接口预留，后续替换真实API只需修改mock文件或添加API路由。

## 主题系统

主题配置位于 `src/styles/globals.css`，使用CSS变量。

### 四套主题
| 主题 | 名称 | 状态 |
|------|------|------|
| 东方暗金金融科技风 | 默认主题 | ✅ 已打磨 |
| 赛博蓝紫交易终端风 | Cyber | ⚙️ 预留配置 |
| 黑金机构投研风 | Institutional | ⚙️ 预留配置 |
| 冰川玻璃拟态风 | Ice | ⚙️ 预留配置 |

### 核心CSS变量
```css
--bg-primary: #020612        /* 深黑蓝背景 */
--accent: #D4A574            /* 暗金色强调 */
--up: #34D399                /* 上涨青绿 */
--down: #F87171              /* 下跌朱红 */
--glass-bg: rgba(255,255,255,0.06)
--glass-blur: 24px
--glass-border: rgba(255,255,255,0.12)
```

## 已完成页面

### 桌面端首页 (`/`)
- 顶部市场指数条（沪深/创业板/科创板/北证/总成交额/涨跌家数）
- 左侧导航栏
- 模拟账户资产卡片（总资产/今日盈亏/持仓市值/可用资金）
- 热门板块卡片区（10个，含主题色/涨跌幅/迷你走势图/成交额/资金流）
- 市场情绪卡片
- 涨幅榜
- 成交额榜
- 自选股（含迷你走势图）

### 手机端首页 (`/mobile`)
- 顶部市场状态栏
- 账户资产卡（含隐私隐藏功能）
- 市场指数横滑卡片
- 热门板块横滑卡片
- 涨幅榜简版
- 底部Tab Bar（市场/板块/交易/持仓/我的）

## 基础动效

| 动效 | 实现方式 |
|------|---------|
| 页面进入 | Framer Motion stagger 错落出现 |
| 卡片hover | CSS + JS mousemove（Tilt倾斜+光晕） |
| 鼠标跟随光晕 | CSS变量 + useMouseGlow hook |
| 数字递增 | requestAnimationFrame + easeOut |
| 板块卡片展开 | CSS transform scale |
| Tab切换 | Framer Motion AnimatePresence |

## 后续计划

### P1-B（下一阶段）
- 板块详情页（桌面+手机）
- 个股详情页（桌面）
- 手机交易确认页
- K线图（Lightweight Charts）
- 买入/卖出交易抽屉
- 股票排序动画
- 模拟成交动画

### P2（第二阶段）
- GSAP ScrollTrigger滚动叙事
- Canvas鼠标光晕/拖尾
- 高级页面转场
- 更多页面（搜索/持仓/设置）

### P3（第三阶段）
- Three.js 3D背景
- GLSL Shader效果
- 后处理（Bloom等）

## 注意事项

- 不使用真实券商Logo
- 不接真实交易接口
- 不做真实下单
- 涨跌颜色：青绿涨/朱红跌（国际化配色，非A股红涨绿跌）
- 玻璃拟态blur值≤24px，确保数字可读
