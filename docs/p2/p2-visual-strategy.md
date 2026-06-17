# P2 视觉增强总策略

## 定位

P2 的目标不是重做产品，是在 V1 稳定版基础上，**有选择地**提升视觉上限，让 Demo 从"可以展示"升级到"值得发朋友圈"。

核心原则：**克制、可逆、可测、不拖慢主流程**。

## 评估的 5 个方向

### 1. 板块卡片背景增强

| 板块 | 视觉方向 | 技术方案 | 推荐 |
|------|----------|----------|------|
| 光通信 | 光纤流线 + 微粒光点 | Canvas 2D | ✅ 第一批 |
| 算力 | 芯片电路 + 数据网格 | Canvas 2D | ✅ 第一批 |
| 半导体 | 晶圆刻蚀线 | Canvas 2D | ✅ 第一批 |
| 新能源 | 电流 / 能量场 | Canvas 2D | 第二批 |
| 机器人 | 雷达线 / 机械臂 | Canvas 2D | 第二批 |
| 白酒 | 液体折射 | CSS + Framer | 第二批 |
| 矿山 | 地层线 | Canvas 2D | 第三批 |
| 军工 | 雷达 / 航迹 | Canvas 2D | 第三批 |
| 医药 | 分子结构 | Canvas 2D | 第三批 |

**策略**：先做光通信、算力、半导体三张。验证 Canvas 路线可行后再铺开。

### 2. 鼠标跟随光晕 / hover 增强

| 场景 | 方案 | 优先级 |
|------|------|--------|
| 板块卡片 hover | Canvas 光晕跟随鼠标 | 高 |
| 交易按钮 hover | CSS glow + scale | 高 |
| Demo Mode 引导 | 金色光晕追踪高亮元素 | 中 |
| 图表区域边缘光 | CSS gradient overlay | 低 |

**策略**：hover 光晕先在 visual-lab 实验页做，验证性能和视觉效果后迁移。

### 3. 主题系统

| 主题 | 定位 | 色系 | 优先级 |
|------|------|------|--------|
| Oriental Dark Gold | 默认，继续打磨 | 暗金 / 琥珀 | 已有 |
| Glacier Glass | 冰川蓝紫玻璃 | #4fc3f7 / #7c4dff | 第一批 |
| Neon Quant | 量化终端霓虹 | #00e5ff / #d500f9 | 第二批 |
| Paper Ink Finance | 水墨金融 | #e8e3d9 / #2c2c2c | 第三批（风险高） |

**策略**：P2-B 只做 Glacier Glass。用 CSS 变量切换，不重写组件。Neon Quant 看效果再定。Paper Ink 风险高（需要重新调所有组件的色值），放最后或砍掉。

### 4. 首页 Hero / 资产区增强

| 增强点 | 方案 | 推荐 |
|--------|------|------|
| 资产卡片微弱反射 | CSS pseudo-element + gradient | ✅ 做 |
| 数字滚动动画 | Framer Motion animate | ✅ 做 |
| 全局环境光 | CSS radial-gradient 漂移 | 实验 |
| 动态背景光场 | Canvas / WebGL | ❌ 不做 |

**策略**：只做资产卡片反射 + 数字滚动。不动首页结构。

### 5. 页面转场

| 转场 | 方案 | 推荐 |
|------|------|------|
| 板块卡片 → 板块详情 Hero | Framer Motion shared layout | ✅ 做 |
| 股票行 → 个股详情头部 | Framer Motion shared layout | ✅ 做 |
| TradePanel 弹出 | Framer Motion spring | 已有，微调 |
| 成交完成 | Framer Motion + particle burst | 实验 |

**策略**：shared layout transition 是最值得做的增强之一。成本低、效果明显、不拖性能。

## 推荐优先级

### 第一批（P2-B，必做）

1. **visual-lab 实验页** — 所有实验先在这里验证
2. **3张高级板块卡片** — 光通信 / 算力 / 半导体，Canvas 2D
3. **hover 光晕** — 板块卡片鼠标跟随
4. **shared layout transition** — 板块卡片 → 板块详情

### 第二批（P2-C，看效果再定）

5. **Glacier Glass 主题** — CSS 变量切换
6. **资产卡片反射 + 数字滚动**
7. **更多板块卡片** — 新能源 / 机器人 / 白酒

### 第三批（P2-D，待评估）

8. **Neon Quant 主题**
9. **剩余板块卡片**
10. **成交完成粒子效果**

### 不建议做

- **Paper Ink Finance 主题** — 风险高，调色工作量大，视觉方向可能和金融终端感冲突
- **Three.js 3D 背景** — 成本高、收益不确定、容易拖慢首屏
- **全页面 WebGL** — 维护复杂，不适合 Demo 项目
- **动态背景光场** — 首页结构不该大改

## 技术路线选择

**P2-B 主路线：Canvas 2D + Framer Motion + CSS**

- Canvas 2D 负责板块背景动画
- Framer Motion 负责转场和微交互
- CSS 变量负责主题切换
- 不引入 Three.js / R3F / GLSL

**理由**：
- Canvas 2D 性能好、可控、不拖首屏
- Framer Motion 已在项目中，零引入成本
- CSS 变量切换主题最简单
- Three.js / GLSL 留给 P3（如果 P2 效果好再考虑）
