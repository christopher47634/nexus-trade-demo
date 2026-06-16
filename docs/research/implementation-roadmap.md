# 实现路线图
# 高质感股票交易界面Demo — 三阶段规划
# 时间：2026-06-16

---

## 一、三阶段总览

```
┌─────────────────────────────────────────────────────────────────┐
│                    第一阶段：视觉原型（2-3周）                      │
│                    目标：80-85分视觉质量                           │
│                    技术：Framer Motion + Tailwind + CSS + LC + ECharts │
├─────────────────────────────────────────────────────────────────┤
│                    第二阶段：交互深化（+2-3周）                      │
│                    目标：90-92分视觉质量                           │
│                    技术：+GSAP + Lenis + Canvas                   │
├─────────────────────────────────────────────────────────────────┤
│                    第三阶段：WebGL沉浸（+3-4周）                    │
│                    目标：95-98分视觉质量                           │
│                    技术：+Three.js + R3F + GLSL                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、第一阶段详细规划

### 目标
- 建立完整项目骨架
- 实现6个核心页面（桌面3+手机3）
- 建立主题系统（默认东方暗金）
- 实现10个核心动效
- 建立Mock数据系统
- 达到可展示的视觉质量

### 技术栈
```
Next.js 14 (App Router)
React 18 + TypeScript
Tailwind CSS 3.4+
Framer Motion 11+
shadcn/ui (选定组件)
Lightweight Charts (K线)
ECharts (统计图表)
Magic UI (Number Ticker, Shimmer Button)
Motion Primitives (Magnetic Button, Stagger)
Lucide React (图标)
```

### 交付物清单

#### 1. 项目初始化
- [ ] Next.js + TypeScript + Tailwind项目
- [ ] ESLint + Prettier配置
- [ ] shadcn/ui初始化 + 选定组件安装
- [ ] Lightweight Charts + ECharts安装
- [ ] 项目结构搭建

#### 2. 主题系统
- [ ] CSS变量系统（颜色、间距、圆角、阴影）
- [ ] 4套主题配置（只打磨东方暗金，其他预留）
- [ ] ThemeSwitcher组件
- [ ] 暗色渐变背景系统

#### 3. 通用组件
- [ ] GlassCard — 玻璃拟态卡片
- [ ] MetricCard — 数据指标卡（含数字跳动）
- [ ] AnimatedButton — 动画按钮（含磁性效果）
- [ ] ThemeSwitcher — 主题切换器
- [ ] DesktopShell — 桌面端布局壳
- [ ] MobileShell — 手机端布局壳
- [ ] BottomTabBar — 手机端底部Tab

#### 4. 桌面端页面
- [ ] 首页（市场总览驾驶舱）
  - 顶部市场指数条
  - 左侧导航栏
  - 热门板块卡片区
  - 市场情绪卡片
  - 涨幅榜/成交额榜/自选股
  - 模拟账户资产卡片
- [ ] 板块详情页
  - 板块视觉Hero
  - 板块数据指标
  - 股票列表（支持排序）
  - 点击进入个股详情
- [ ] 个股详情页
  - 股票头部信息
  - K线图（Lightweight Charts）
  - 成交量图
  - 盘口五档
  - 买入/卖出按钮
  - 模拟交易面板
  - 订单反馈动画

#### 5. 手机端页面
- [ ] 首页
  - 账户资产卡
  - 市场指数横滑卡片
  - 热门板块横滑卡片
  - 涨幅榜简版
  - 底部Tab Bar
- [ ] 板块详情页
  - 板块Hero图
  - 板块核心数据
  - 股票列表（支持筛选排序）
- [ ] 交易确认页
  - 玻璃拟态交易抽屉
  - 价格/数量输入
  - 金额自动计算
  - 确认按钮
  - 成交状态动画

#### 6. Mock数据
- [ ] sectors.ts — 10个板块数据
- [ ] stocks.ts — 50+只股票数据
- [ ] market.ts — 市场指数数据
- [ ] orders.ts — 模拟订单数据
- [ ] kline.ts — K线历史数据

#### 7. 核心动效（10个）
- [ ] 玻璃拟态卡片（backdrop-filter）
- [ ] 鼠标跟随光晕（CSS变量+JS）
- [ ] 卡片Tilt倾斜效果
- [ ] 数字递增动画
- [ ] 股票走势SVG描边动画
- [ ] 微光/渐变边框
- [ ] Framer Motion卡片展开转场
- [ ] 文字reveal动画（clip-path）
- [ ] Hover状态过渡动画
- [ ] 列表错开进场动画

#### 8. 文档
- [ ] README.md（安装、启动、项目结构、已完成内容、后续计划）

### 第一阶段不做
- ❌ 登录/注册
- ❌ 真实交易
- ❌ 真实行情API
- ❌ 真实券商Logo
- ❌ Three.js / WebGL
- ❌ GLSL Shader
- ❌ GSAP ScrollTrigger
- ❌ Canvas shader背景
- ❌ 后处理效果
- ❌ 3D玻璃几何体
- ❌ 流体模拟
- ❌ 粒子系统
- ❌ 复杂权限系统
- ❌ 四套主题全部打磨

### 验收标准
1. 第一眼不是后台模板
2. 第一眼有高级金融终端感
3. 暗色背景有层次，不是纯黑
4. 玻璃拟态清楚但不影响数字可读性
5. 板块卡片有主题视觉，不是普通卡片
6. 数据卡片有金融产品感
7. 手机端像真实App，不是网页缩小版
8. 动画克制、顺滑、服务层级变化
9. 不出现真实券商Logo
10. 不接真实交易接口

---

## 三、第二阶段规划

### 目标
- 提升动效品质
- 增加交互深度
- 实现滚动叙事
- 实现高级页面转场

### 新增技术
```
GSAP 3 (Timeline + ScrollTrigger + Flip + SplitText)
Lenis (平滑滚动)
Canvas 2D API
SVG mask animation
CSS @property (CSS变量动画)
```

### 新增效果
- [ ] GSAP ScrollTrigger滚动叙事
- [ ] Canvas鼠标光晕/拖尾效果
- [ ] GSAP Flip页面转场
- [ ] Canvas动态渐变背景
- [ ] SVG图表GSAP动画
- [ ] 磁吸按钮效果增强
- [ ] 平滑滚动+视差
- [ ] 数据流粒子（Canvas 2D）
- [ ] 高级数字动画（带格式化）

### 新增页面
- [ ] Landing页（滚动叙事体验）
- [ ] 搜索结果页
- [ ] 持仓详情页
- [ ] 新闻/资讯页

---

## 四、第三阶段规划

### 目标
- 实现完整沉浸式体验
- 3D交互背景
- 高级shader效果

### 新增技术
```
Three.js
React Three Fiber
@react-three/drei
@react-three/postprocessing
GLSL Shader (Fragment + Vertex)
Raycaster (鼠标交互)
```

### 新增效果
- [ ] 3D粒子星空/网格背景
- [ ] 鼠标交互粒子波纹
- [ ] Bloom发光后处理
- [ ] 全息风格UI元素
- [ ] 3D玻璃几何体板块封面
- [ ] GLSL背景shader（流动/噪声/扭曲）
- [ ] 鼠标影响shader uniform
- [ ] 数据3D可视化（可选）
- [ ] 移动端自动降级为CSS动画

### 预留接口
```tsx
// WebGL背景容器
<div id="webgl-background" className="fixed inset-0 -z-10" />

// 能力检测
const useWebGLSupport = () => {
  // 检测GPU能力
  // 低端设备自动降级为CSS动画
  // 返回 { supported: boolean, quality: 'high' | 'low' | 'off' }
}

// 背景效果组件
interface BackgroundEffectProps {
  quality: 'webgl' | 'canvas' | 'css' | 'none';
  mousePosition?: { x: number; y: number };
}
```

---

## 五、项目结构

```
stock-trading-demo/
├── docs/
│   └── research/
│       ├── visual-research.md
│       ├── visual-decision.md
│       ├── reference-map.md
│       └── implementation-roadmap.md
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # 桌面端首页
│   │   ├── sectors/
│   │   │   └── [sectorId]/page.tsx     # 板块详情
│   │   ├── stocks/
│   │   │   └── [stockCode]/page.tsx    # 个股详情
│   │   └── mobile/
│   │       ├── page.tsx                # 手机端首页
│   │       ├── sectors/[sectorId]/page.tsx
│   │       └── trade/[stockCode]/page.tsx
│   ├── components/
│   │   ├── ui/                         # shadcn/ui组件
│   │   ├── common/                     # 通用组件
│   │   │   ├── GlassCard.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── AnimatedButton.tsx
│   │   │   └── ThemeSwitcher.tsx
│   │   ├── layout/                     # 布局组件
│   │   │   ├── DesktopShell.tsx
│   │   │   └── MobileShell.tsx
│   │   ├── market/                     # 市场组件
│   │   │   ├── IndexTicker.tsx
│   │   │   ├── MarketOverview.tsx
│   │   │   └── HotSectorGrid.tsx
│   │   ├── sector/                     # 板块组件
│   │   │   ├── SectorCard.tsx
│   │   │   ├── SectorHero.tsx
│   │   │   ├── SectorStockTable.tsx
│   │   │   └── SortControl.tsx
│   │   ├── stock/                      # 个股组件
│   │   │   ├── StockHeader.tsx
│   │   │   ├── KLineChart.tsx
│   │   │   ├── OrderBook.tsx
│   │   │   └── TradePanel.tsx
│   │   ├── mobile/                     # 手机端组件
│   │   │   ├── MobileHome.tsx
│   │   │   ├── MobileSectorDetail.tsx
│   │   │   ├── MobileTradeSheet.tsx
│   │   │   └── BottomTabBar.tsx
│   │   └── charts/                     # 图表组件
│   │       ├── EChartsWrapper.tsx
│   │       ├── Heatmap.tsx
│   │       └── MiniSparkline.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── chart-theme.ts
│   │   └── mock-data.ts
│   ├── hooks/
│   │   ├── use-mouse-position.ts
│   │   ├── use-resize.ts
│   │   └── use-stock-data.ts
│   ├── mock/
│   │   ├── sectors.ts
│   │   ├── stocks.ts
│   │   ├── market.ts
│   │   ├── orders.ts
│   │   └── kline.ts
│   └── styles/
│       └── globals.css
├── public/
│   └── sectors/                        # 板块封面图（后续AI生成）
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## 六、依赖包清单

```bash
# 核心框架
npm install next@14 react@18 react-dom@18 typescript @types/react @types/node

# 样式
npm install tailwindcss postcss autoprefixer tailwindcss-animate

# 动画
npm install framer-motion

# 图表
npm install lightweight-charts echarts echarts-for-react

# shadcn/ui (通过CLI安装)
npx shadcn@latest init
npx shadcn@latest add button dialog sheet tabs table dropdown-menu \
  command tooltip select form badge card separator scroll-area popover slider

# 图标
npm install lucide-react

# 工具
npm install clsx tailwind-merge class-variance-authority

# 开发依赖
npm install -D eslint prettier eslint-config-next
```

---

## 七、风险与注意事项

### 技术风险
1. **backdrop-filter性能**: 低端Android可能卡顿，需准备降级方案（semi-transparent background + box-shadow）
2. **Lightweight Charts SSR**: 需要dynamic import + Suspense
3. **ECharts体积**: 需要tree-shaking减少包体积
4. **Framer Motion bundle**: 注意代码分割

### 设计风险
1. **玻璃拟态可读性**: blur值不能过高，数字必须清楚
2. **动效克制**: 不能为了炫酷牺牲实用性
3. **模板味**: shadcn/Aceternity组件需要大幅改造
4. **移动端适配**: 不是网页缩小版，要像真实App

### 时间风险
1. **第一阶段2-3周**: 需要严格控制范围，不做额外功能
2. **视觉打磨时间**: 玻璃拟态、配色、间距需要反复调整
3. **动效调试**: Framer Motion动画需要精细调参
