# 修改的组件清单

## P6 交互增强涉及组件

### 核心页面
| 组件 | 路径 | 改动 |
|------|------|------|
| Home | `src/app/page.tsx` | 板块卡片 hover 交互 |
| SectorDetail | `src/app/sectors/[sectorId]/page.tsx` | 股票列表 hover |
| StockDetail | `src/app/stocks/[stockCode]/page.tsx` | 页面进入动画 |
| Orders | `src/app/orders/page.tsx` | 订单列表动画 |
| Portfolio | `src/app/portfolio/page.tsx` | 持仓表格交互 |

### 交互组件
| 组件 | 路径 | 改动 |
|------|------|------|
| TradePanel | `src/components/stock/TradePanel.tsx` | 按钮状态反馈 |
| PositionTable | `src/components/portfolio/PositionTable.tsx` | 行 hover 效果, 8列 grid |
| TransactionList | `src/components/portfolio/TransactionList.tsx` | 流水行 hover |
| AdvancedSectorCard | `src/components/sector-visuals/AdvancedSectorCard.tsx` | 卡片 hover |
| HotSectorGrid | `src/components/market/HotSectorGrid.tsx` | 板块网格交互 |
| HoverGlow | `src/components/sector-visuals/HoverGlow.tsx` | Hover 发光效果 |
| FlowHoverSurface | `src/components/common/FlowHoverSurface.tsx` | 流式 hover 表面 |

### Demo 组件
| 组件 | 路径 | 改动 |
|------|------|------|
| DemoMode | `src/components/demo/DemoMode.tsx` | 10 步引导 |
| DemoGuide | `src/components/demo/DemoGuide.tsx` | 引导提示 |
| DemoWrapper | `src/components/demo/DemoWrapper.tsx` | 高亮包裹 |

### 账户/交易引擎
| 组件 | 路径 | 改动 |
|------|------|------|
| account-storage | `src/lib/account-storage.ts` | Demo 数据管理 |
| trade-engine | `src/lib/trade-engine.ts` | 买卖校验逻辑 |

生成时间: 2026-06-19T04:17:04.814Z
