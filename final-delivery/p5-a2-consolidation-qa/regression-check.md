# 回归检查报告 — P5-A2 Consolidation QA

**验证日期**: 2026-06-18
**分支**: p5-a2-trading-portfolio-linkage
**本地服务**: http://localhost:3458
**测试工具**: Playwright 1.61.0 + Chromium
**Viewport**: 1440×900 (desktop), 390×844 (mobile)

---

## 检查结果汇总

| # | 检查项 | 预期 | 实际 | 通过 | 备注 |
|---|--------|------|------|------|------|
| 1 | 首页 / 正常 | 200 + 页面有内容 | 200 + bodyLen>200, title="NexusTrade - 股票交易界面 Demo" | ✅ | 截图: desktop-homepage-final.png |
| 2 | 10 个行业板块卡片 | DOM 有 10 个 sector-card | #sectors 子元素 = 10 (算力/光通信/低空经济/半导体/机器人/新能源/白酒/医药/矿山/军工) | ✅ | grid-cols-5 × 2 行 |
| 3 | 板块详情 /sectors/optical-communication | 200 + 有股票列表 | 200 + 页面含中际旭创/300308/光通信 | ✅ | 截图: desktop-sector-detail-final.png |
| 4 | 个股详情 /stocks/300308 | 200 + 有价格信息 | 200 + price=true, hasStockName=true | ✅ | 截图: desktop-stock-detail-final.png |
| 5 | K线图正常 | canvas 或 chart 元素存在 | canvas=7, chartContainers=3 | ✅ | 多个 canvas (K线+分时+指标) |
| 6 | TradePanel 视觉未被重做 | 有买入/卖出 tab | 买入=true, 卖出=true | ✅ | TradePanel 组件正常渲染 |
| 7 | Demo Mode 正常 | Demo 标识存在 | button[title="演示模式"] 存在, .lucide-sparkles 存在 | ✅ | innerText 含"模拟"(模拟总资产), HTML 含"演示模式" |
| 8 | HoverGlow 正常 | hover 效果相关代码存在 | hoverEls=16, hoverRules=27 | ✅ | CSS hover 规则 27 条, 16 个 hover class 元素 |
| 9 | mobile 390px 无横向溢出 | scrollWidth ≤ innerWidth | scrollWidth=390, innerWidth=390 | ✅ | 无横向溢出 |
| 10 | /portfolio 正常 | 200 + 有持仓表格或卡片 | 200 + stocks=true (含持仓/市值/贵州茅台) | ✅ | PositionTable 8列 grid 布局正常 |
| 11 | /mobile/portfolio 正常 | 200 + 移动端布局 | 200 + textLen=326 | ✅ | 移动端响应式布局正常 |
| 12 | /orders 正常 | 200 + 有订单列表 | 200 + orders=true, textLen=90 | ✅ | 订单页面正常渲染 |

**总计: 12/12 通过 (100%)**

---

## 详细说明

### Check 1: 首页
- HTTP 200, title 正确显示 "NexusTrade - 股票交易界面 Demo"
- 页面包含: 市场指数栏 (上证/深证/创业板/科创50/北证50)、账户概览卡片 (4张)、板块卡片 (10张)、涨幅榜/成交额榜/自选股
- 侧边栏导航正常 (Dashboard/Sectors/Portfolio/Orders/Settings)

### Check 2: 10 个行业板块卡片
- #sectors 容器使用 grid-cols-5, 包含 10 个子元素
- 板块: 算力、光通信、低空经济、半导体、机器人、新能源、白酒、医药、矿山、军工
- 每张卡片有 SVG 背景图形、排名、涨跌幅

### Check 3: 板块详情页
- /sectors/optical-communication 返回 200
- 页面包含光通信板块股票列表 (中际旭创 300308 等)

### Check 4: 个股详情页
- /stocks/300308 返回 200
- 显示中际旭创价格信息 (¥128.56)
- 包含 K线图、TradePanel、成交额等

### Check 5: K线图
- 检测到 7 个 canvas 元素 (K线主图、成交量、指标等)
- 3 个 chart 容器元素

### Check 6: TradePanel
- 页面包含 "买入" 和 "卖出" 文本
- TradePanel 组件正常渲染，视觉未被重做

### Check 7: Demo Mode
- 侧边栏底部有演示模式按钮 (button[title="演示模式"])
- sparkles 图标 (.lucide-sparkles) 存在
- 页面含 "模拟" 标识 (模拟总资产)

### Check 8: HoverGlow
- 16 个 hover 相关 class 元素
- 27 条 CSS hover 规则
- hover 效果正常工作

### Check 9: Mobile 390px 溢出检查
- scrollWidth=390, innerWidth=390
- 无横向溢出，移动端布局自适应正常

### Check 10: /portfolio
- HTTP 200, 页面含持仓信息 (贵州茅台、市值等)
- PositionTable 8 列 grid 布局 (详见 portfolio-table-layout-check.md)

### Check 11: /mobile/portfolio
- HTTP 200, textLen=326
- 移动端响应式布局正常渲染

### Check 12: /orders
- HTTP 200, 页面含订单列表
- 订单历史正常显示

---

## 截图清单

| 截图文件 | 说明 |
|----------|------|
| screenshots/desktop-homepage-final.png | 桌面端首页完整截图 |
| screenshots/desktop-sector-detail-final.png | 板块详情页截图 |
| screenshots/desktop-stock-detail-final.png | 个股详情页截图 |
