# Demo Flow Map — 10 步产品展示流程

**项目**: stock-trading-demo  
**分支**: p5-a3-demo-portfolio-story  
**Commit**: 62bd71f

---

## 10 步流程表

| 步骤 | 标题 | 页面 | 触发 | 路由 | 说明 |
|------|------|------|------|------|------|
| 0 | 市场机会扫描 | 首页 | click | `/` | 高亮光通信板块卡片，点击进入板块页 |
| 1 | 热点板块识别 | 板块详情 | click | `/sectors/optical-communication` | 高亮第一行成分股，点击进入个股 |
| 2 | 板块成分股分析 | 个股页 | click | `/stocks/300308` | 高亮图表类型切换器，点击切换视图 |
| 3 | 个股技术视图 | 个股页 | click | `/stocks/300308` | 高亮买入按钮，点击打开交易面板 |
| 4 | 模拟交易入口 | 个股页 | click | `/stocks/300308` | 高亮交易面板价格/数量输入区 |
| 5 | 确认模拟委托 | 个股页 | delay 2.5s | `/stocks/300308` | 高亮确认买入按钮，2.5s 后自动推进 |
| 6 | 订单成交回执 | 个股页 | click | `/stocks/300308` | 高亮"查看订单"按钮，点击跳转订单页 |
| 7 | 订单记录归档 | 订单页 | click | `/orders` | 高亮订单表格，点击跳转持仓页 |
| 8 | 持仓与账户变化 | 持仓页 | delay 3s | `/portfolio` | **[新增]** 高亮持仓表格，3s 后自动推进 |
| 9 | 交易闭环完成 | 持仓页 | delay 3s | `/portfolio` | **[新增]** 高亮资金流水，3s 后自动结束 Demo |

---

## 跨页面路由图

```
首页 (/)
  │  click → Step 0 高亮光通信卡片
  ▼
板块详情 (/sectors/optical-communication)
  │  click → Step 1 高亮成分股行
  ▼
个股页 (/stocks/300308)
  │  click → Step 2 图表切换
  │  click → Step 3 买入按钮
  │  click → Step 4 交易面板
  │  delay → Step 5 确认买入
  │  click → Step 6 查看订单
  ▼
订单页 (/orders)
  │  click → Step 7 订单表格
  ▼
持仓页 (/portfolio)
  │  delay → Step 8 持仓表格
  │  delay → Step 9 资金流水
  ▼
Demo 结束 (自动退出)
```

---

## 移动端简化流程

移动端 (< 768px) 的流程与桌面端一致，但 UI 有以下差异：

| 特性 | 桌面端 | 移动端 |
|------|--------|--------|
| 进度指示器 | 顶部居中浮窗 + 10 个圆点 | 底部卡片式 (bottom-20) |
| 高亮效果 | 金色虚线边框 + glow | 同桌面端 |
| badge 位置 | 元素右上角 | 同桌面端 |
| 步骤标题 | 显示在进度条中 | 显示在底部卡片中 |
| 持仓表格 | 完整 8 列横排 | 水平滚动 (overflow-x: auto) |
| 资金流水 | 完整列表 | 同桌面端 |
| 退出按钮 | 进度条右上角 × | 底部卡片右侧 × |

### 移动端注意事项
- 390px 视口下所有页面无水平溢出
- 热门板块从 5 列降为 2 列 (grid-cols-5 → grid-cols-2 via responsive)
- 持仓表格保持 8 列，通过 `overflow-x: auto` 实现水平滚动
- 资金流水保持 flex 横向布局

---

## Step 详细配置

### Step 0 — 市场机会扫描
- **选择器**: `[data-demo-highlight="optical-communication"]`
- **Badge**: 市场总览
- **路由**: `/`
- **触发**: click → 导航到 `/sectors/optical-communication`

### Step 1 — 热点板块识别
- **选择器**: `[data-demo-highlight="first-stock"]`
- **Badge**: 板块分析
- **路由**: `/sectors/`
- **触发**: click → 导航到 `/stocks/300308`

### Step 2 — 板块成分股分析
- **选择器**: `[data-demo-highlight="chart-type-switcher"]`
- **Badge**: 技术视图
- **路由**: `/stocks/`
- **触发**: click (不导航)

### Step 3 — 个股技术视图
- **选择器**: `[data-demo-highlight="buy-button"]`
- **Badge**: 交易入口
- **路由**: `/stocks/`
- **触发**: click (不导航)

### Step 4 — 模拟交易入口
- **选择器**: `[data-demo-highlight="trade-inputs"]`
- **Badge**: 模拟交易
- **路由**: `/stocks/`
- **触发**: delay 2500ms

### Step 5 — 确认模拟委托
- **选择器**: `[data-demo-highlight="confirm-buy"]`
- **Badge**: 确认委托
- **路由**: `/stocks/`
- **触发**: click (不导航)

### Step 6 — 订单成交回执
- **选择器**: `[data-demo-highlight="view-orders"]`
- **Badge**: 订单回执
- **路由**: `/stocks/`
- **触发**: click → 导航到 `/orders`

### Step 7 — 订单记录归档
- **选择器**: `[data-demo-highlight="order-table"]`
- **Badge**: 订单归档
- **路由**: `/orders`
- **触发**: click → 导航到 `/portfolio`

### Step 8 — 持仓与账户变化 [新增]
- **选择器**: `[data-demo-highlight="portfolio-table"]`
- **Badge**: 持仓变化
- **路由**: `/portfolio`
- **触发**: delay 3000ms

### Step 9 — 交易闭环完成 [新增]
- **选择器**: `[data-demo-highlight="transaction-list"]`
- **Badge**: 闭环完成
- **路由**: `/portfolio`
- **触发**: delay 3000ms → 自动退出 Demo
