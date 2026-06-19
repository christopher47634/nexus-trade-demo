# NexusTrade — User Flow

## Main User Journey (10 Steps)

```
Step 0: 首页 (/)
  │
  ├── 看到市场概览
  ├── 浏览板块卡片
  └── 点击板块 ──────────────┐
                              │
Step 1: 板块详情 (/sectors/optical-communication)
  │                           │
  ├── 查看板块内股票列表      │
  └── 点击个股 ───────────────┤
                              │
Step 2-5: 个股详情 (/stocks/300308)
  │                           │
  ├── 查看实时行情            │
  ├── 查看 K 线图             │
  ├── 打开交易面板 ───────────┤
  │   ├── 输入买入数量        │
  │   ├── 确认订单金额        │
  │   └── 提交买入订单        │
  └── 订单创建成功 ───────────┤
                              │
Step 6: 订单页 (/orders)
  │                           │
  ├── 查看订单列表            │
  ├── 确认 demo-order 订单    │
  └── 切换到持仓 ─────────────┤
                              │
Step 7-9: 持仓页 (/portfolio)
  │                           │
  ├── 查看持仓表格 (8列)      │
  ├── 查看总市值              │
  └── 查看当日盈亏            │
```

## Demo Mode Flow

```
1. 首页加载
2. 设置 localStorage: demoMode=true, nexus-trade-demo-active=true
3. 刷新页面 → Demo overlay 出现
4. 浏览各页面 → Demo 数据自动填充
5. 退出 Demo → 清除 localStorage
```

## Mobile Flow

```
首页 (390px)
  ├── 单列卡片布局
  ├── 底部导航
  └── 触摸交互优化

个股详情
  ├── 紧凑行情卡片
  ├── 交易面板底部弹出
  └── 滑动切换买卖

持仓页
  ├── 响应式表格
  └── 卡片式持仓显示
```

## Navigation Structure

```
/                              → 首页 Dashboard
/sectors/:sectorId             → 板块详情
/stocks/:stockCode             → 个股详情 + TradePanel
/orders                        → 订单管理
/portfolio                     → 持仓管理
```
