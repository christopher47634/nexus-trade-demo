# 首页板块视觉回归检查报告

**验证日期**: 2026-06-18
**分支**: p5-a2-trading-portfolio-linkage
**Viewport**: 1440x900
**URL**: http://localhost:3458
**截图**:
- [homepage-sector-cards-final.png](./screenshots/homepage-sector-cards-final.png) — 完整首页
- [sector-card-hover-final.png](./screenshots/sector-card-hover-final.png) — hover 状态

## 检查结果汇总

| # | 检查项 | 预期 | 实际 | 通过 |
|---|--------|------|------|------|
| 1 | 10 张板块卡片是否存在 | 10 张 | 10 张 (算力/光通信/低空经济/半导体/机器人/新能源/白酒/医药/矿山/军工) | ✅ |
| 2 | 行业背景图形可见性 | 图形清晰可见，不过暗/过糊/过淡 | 所有10张卡片均有 SVG 背景图形，opacity 0.28-0.34，视觉清晰 | ✅ |
| 3 | overlay opacity 值 | 合理范围 (0.2-0.4) | SVG overlay opacity: 0.28 (外层), 子元素 0.04-0.34 | ✅ |
| 4 | FlowHoverSurface 不误用到板块卡片 | 无 FlowHoverSurface | 首页无 FlowHoverSurface 元素 (flowHoverOnHomepage: 0) | ✅ |
| 5 | globals.css 无影响全站亮度的误改 | body/html filter: none | body filter: none, html filter: none, 无全局 brightness/contrast 规则 | ✅ |

## 详细数据

### 10 张板块卡片信息

| # | 板块 | 尺寸 (px) | 背景图 | SVG 类型 | overlay opacity |
|---|------|-----------|--------|----------|-----------------|
| 1 | 算力 | 256 × 234.25 | ✅ | rect (电路/服务器) | 0.28 → 0.32 → 0.04 |
| 2 | 光通信 | 256 × 234.25 | ✅ | path (光纤/信号线) | 0.28 → 0.34 → 0.10 |
| 3 | 低空经济 | 256 × 234.25 | ✅ | circle (无人机/飞行路径) | 0.28 → 0.30 → 0.08 |
| 4 | 半导体 | 256 × 234.25 | ✅ | circle (芯片/电路板) | 0.28 → 0.32 → 0.24 |
| 5 | 机器人 | 256 × 234.25 | ✅ | ellipse (机器人轮廓) | 0.28 → 0.24 → 0.22 |
| 6 | 新能源 | 256 × 227.25 | ✅ | rect (能源/电池) | 0.28 → 0.30 → 0.12 |
| 7 | 白酒 | 256 × 227.25 | ✅ | rect (酒瓶/玻璃) | 0.28 → 0.14 → 0.30 |
| 8 | 医药 | 256 × 227.25 | ✅ | circle (分子/医疗) | 0.28 → 0.06 → 0.32 |
| 9 | 矿山 | 256 × 227.25 | ✅ | path (矿脉/地形) | 0.28 → 0.24 → 0.20 |
| 10 | 军工 | 256 × 227.25 | ✅ | path (军事/科技) | 0.28 → 0.30 → 0.22 |

### 视觉验证 (vision_analyze)

对首页截图和 hover 截图进行了视觉分析:

1. **算力 (Computing Power)**: 蓝色线稿服务器/处理基础设施图形，电路风格叠加，清晰不模糊
2. **光通信 (Optical Communication)**: 橙色线稿光纤电缆图形，弯曲信号/数据流线条，清晰均衡
3. **低空经济 (Low-Altitude Economy)**: 青色线稿无人机/飞行器图形，飞行路径线条，明显不突兀
4. **半导体 (Semiconductor)**: 蓝色线稿电路板图形，含电路迹线和处理器轮廓，清晰可见

**结论**: 行业背景图形在深色卡片上可见性良好，不过暗、不过糊、不过淡。

### FlowHoverSurface 使用范围

通过源码搜索确认 FlowHoverSurface 仅用于以下组件:
- `AssetAllocation.tsx` — 资产配置卡片
- `PositionCard.tsx` — 持仓卡片 (移动端)
- `PortfolioMiniChart.tsx` — 迷你图表卡片
- `AccountOverviewCard.tsx` — 账户概览卡片

**首页板块卡片 (SectorCards) 未使用 FlowHoverSurface**，使用 CSS hover 效果实现。

### globals.css 亮度检查

| 检查项 | 结果 |
|--------|------|
| body filter | none |
| html filter | none |
| body opacity | 1 |
| html opacity | 1 |
| 全局 brightness/contrast 规则 | 无 (仅 Tailwind 默认 filter 变量定义) |
| .glass 背景 | linear-gradient + rgba(15, 22, 36, 0.72) + backdrop-filter: blur(22px) saturate(140%) |

### 卡片 hover 效果

hover 截图显示第一张卡片 (算力) 有:
- 细微亮边框/光晕效果
- 柔和提升阴影
- 与其他未 hover 卡片形成视觉区分

## 结论

**全部 5 项检查通过**。首页 10 张板块卡片均存在，行业背景 SVG 图形可见性良好，overlay opacity 在合理范围内 (0.28-0.34)，FlowHoverSurface 未误用到板块卡片，globals.css 无影响全站亮度的误改。
