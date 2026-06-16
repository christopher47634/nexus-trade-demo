# 参考映射表
# 高质感股票交易界面Demo — 参考→组件/页面映射
# 时间：2026-06-16

---

## 一、金融产品参考 → 组件映射

| 参考产品 | 借鉴特征 | 对应页面/组件 | 阶段 |
|---------|---------|--------------|------|
| TradingView | K线图表引擎 | KLineChart (个股详情页) | P1 |
| TradingView | Watchlist紧凑布局 | Watchlist组件 (首页右侧) | P1 |
| TradingView | Cmd+K全局搜索 | Command面板 (全局) | P2 |
| TradingView | 十字光标联动 | KLineChart交互 | P2 |
| Webull | 个股详情Tab式分层 | StockHeader + Tabs (个股详情) | P1 |
| Webull | 底部固定交易按钮 | TradePanel (个股详情) | P1 |
| Webull | 行情列表多视图 | SectorStockTable (板块详情) | P1 |
| Webull | 横屏全屏图表 | KLineChart全屏模式 | P2 |
| Moomoo/Futu | 五档盘口组件 | OrderBook (个股详情) | P1 |
| Moomoo/Futu | 资金流向可视化 | CapitalFlow组件 | P2 |
| Moomoo/Futu | 板块分类体系 | 板块导航 (首页) | P1 |
| Moomoo/Futu | 板块热力图 | SectorHeatmap | P2 |
| Robinhood Legend | Widget容器系统 | DesktopShell布局 | P1 |
| Robinhood Legend | Preset Layouts | 布局切换 | P2 |
| thinkorswim | 多场景标签页思路 | 页面信息组织 | P1 |
| 同花顺 | 涨幅榜多维度排行 | RankingList (首页) | P1 |
| 东方财富 | F10数据字段 | 股票基本面数据 | P2 |
| 华泰涨乐 | 交易下单流程 | TradePanel流程 | P1 |
| 华泰涨乐 | 代码搜索联想 | 股票搜索 | P1 |
| 老虎证券 | 多市场切换Tab | 市场切换 | P2 |

---

## 二、创意交互参考 → 组件映射

| 参考案例 | 借鉴特征 | 对应页面/组件 | 阶段 | 实现方式 |
|---------|---------|--------------|------|---------|
| Noomo "Power of Storytelling" | 鼠标shader | 首页背景 | P1→P3 | CSS变量+JS → GLSL |
| Noomo | 玻璃材质 | GlassCard | P1 | backdrop-filter |
| Noomo | 页面转场 | 板块卡片展开 | P1 | Framer Motion layoutId |
| Noomo | Scroll叙事 | 首页→板块详情 | P2 | GSAP ScrollTrigger |
| Noomo | 3D玻璃凤凰 | 板块封面图 | P3 | Three.js MeshPhysicalMaterial |
| Codrops Magnetic Buttons | 磁吸按钮 | 买入/卖出按钮 | P1 | CSS + JS mousemove |
| Hologram Landing | Tilt倾斜效果 | 板块卡片hover | P1 | CSS transform:perspective |
| Apple macOS Ventura | 玻璃层次感 | GlassCard多层叠加 | P1 | backdrop-filter + shadow |
| Stripe Press | Mesh gradient背景 | 全局背景 | P1 | CSS radial-gradient |
| Linear App | 暗色底+微妙高光 | 整体UI基调 | P1 | CSS变量系统 |
| Stripe Dashboard | 图表进入动画 | K线/走势图加载 | P1 | SVG stroke-dashoffset |
| Apple iPhone 15 Pro | Pin+scrub叙事 | 首页滚动体验 | P2 | GSAP ScrollTrigger |
| Cuberto Design | 方向性页面转场 | 卡片→详情展开 | P2 | GSAP Flip |
| Codrops | Animated Mesh Gradient | 背景渐变动画 | P1→P2 | CSS → Canvas |
| Codrops | Smooth Scrolling | 内容区滚动 | P1-2 | IntersectionObserver |

---

## 三、设计灵感 → 页面映射

| 灵感来源 | 借鉴特征 | 对应页面 | 阶段 |
|---------|---------|---------|------|
| Godly Tidal | 暗色渐变背景+亮色CTA | 首页Hero区 | P1 |
| Godly Auroral | 玻璃卡片层级 | 板块卡片 | P1 |
| Lapa Mercury | 金融产品信息架构 | 首页信息流 | P1 |
| Lapa Alpaca | 交易界面信息层级 | 个股详情页 | P1 |
| Land-book Linear | 暗色底层次感#0A0A0F→#111119 | 整体背景 | P1 |
| Land-book Vercel | 网格系统+渐变分割线 | 首页布局 | P1 |
| Dribbble Dark Dashboard | 暗色金融Dashboard布局 | 首页Dashboard | P1 |
| Dribbble Glassmorphism UI Kit | 玻璃参数规范 | GlassCard组件 | P1 |
| Mobbin Robinhood | 移动端布局 | 手机端首页 | P1 |
| Mobbin TradingView | 图表交互 | KLineChart | P1 |
| Codrops Image Hover | CSS hover效果 | 板块卡片hover | P1 |
| CodePen Glassmorphism | CSS参数 | GlassCard样式 | P1 |
| CodePen Stock Chart SVG | SVG图表动画 | 迷你走势图 | P1 |

---

## 四、开源组件 → 使用场景映射

| 组件库 | 组件 | 使用场景 | 页面 |
|--------|------|---------|------|
| shadcn/ui | Button | 买入/卖出/通用按钮 | 全局 |
| shadcn/ui | Dialog | 交易确认弹窗 | 个股详情 |
| shadcn/ui | Sheet | 移动端交易面板/持仓详情 | 手机端 |
| shadcn/ui | Tabs | 时间周期切换/信息分层 | 个股详情/板块详情 |
| shadcn/ui | Table | 股票列表/订单历史 | 板块详情/持仓 |
| shadcn/ui | Command | 股票搜索(Cmd+K) | 全局 |
| shadcn/ui | Tooltip | K线hover数据 | 个股详情 |
| shadcn/ui | Select | 订单类型选择 | 交易面板 |
| shadcn/ui | Badge | 涨跌标签/状态 | 全局 |
| shadcn/ui | Scroll Area | 自定义滚动条 | 全局 |
| shadcn/ui | Popover | 快捷交易面板 | Watchlist |
| shadcn/ui | Slider | 价格/数量滑块 | 交易面板 |
| Lightweight Charts | Candlestick | K线图 | 个股详情 |
| Lightweight Charts | Area | 迷你走势 | Watchlist/板块卡片 |
| Lightweight Charts | Histogram | 成交量图 | 个股详情 |
| ECharts | Heatmap | 热力图 | 板块详情 |
| ECharts | Pie/Doughnut | 资产配置 | 首页/持仓 |
| ECharts | Bar | 排行榜/资金流向 | 首页 |
| Magic UI | Number Ticker | 价格数字跳动 | 全局价格展示 |
| Magic UI | Shimmer Button | CTA按钮微光 | 买入/卖出按钮 |
| Magic UI | Blur Fade | 卡片/面板进场 | 全局 |
| Motion Primitives | Magnetic Button | 磁性按钮 | 重要操作按钮 |
| Motion Primitives | Stagger Children | 列表进场 | 订单/持仓列表 |
| Motion Primitives | Tilt Card | 3D倾斜卡片 | 板块卡片/Watchlist |

---

## 五、动效参考 → 实现方式映射

| 动效 | 参考来源 | 实现方式 | 阶段 |
|------|---------|---------|------|
| 玻璃拟态卡片 | Noomo + Linear | CSS backdrop-filter + box-shadow | P1 |
| 鼠标跟随光晕 | Noomo + Codrops | JS mousemove + CSS radial-gradient | P1 |
| 暗色渐变背景 | Linear + Stripe | CSS multi-gradient + SVG noise | P1 |
| 卡片Tilt倾斜 | Hologram + Codrops | JS mousemove + CSS transform:perspective | P1 |
| 数字递增 | Stripe + Bloomberg | requestAnimationFrame + easing | P1 |
| 走势图描边 | Stripe + Codrops | SVG stroke-dasharray + CSS animation | P1 |
| 微光边框 | Linear + Vercel | CSS background-clip + conic-gradient | P1 |
| 卡片展开转场 | Noomo + Cuberto | Framer Motion layoutId | P1 |
| 文字reveal | Apple + Codrops | CSS clip-path animation | P1 |
| Hover过渡 | Aceternity Spotlight | CSS + JS mousemove | P1 |
| 滚动叙事 | Apple iPhone | GSAP ScrollTrigger | P2 |
| Canvas光晕 | Codrops | Canvas 2D API | P2 |
| 页面转场 | Cuberto | GSAP Flip | P2 |
| 动态渐变背景 | Codrops | Canvas模拟 | P2 |
| 3D玻璃几何体 | Noomo | Three.js MeshPhysicalMaterial | P3 |
| Shader背景 | Noomo | GLSL fragment shader | P3 |
| 粒子系统 | Monopo | Three.js Points | P3 |
| 后处理效果 | Noomo | Three.js EffectComposer | P3 |
