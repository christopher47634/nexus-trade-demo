# V3 Interaction System Summary

## 交互系统总览

V3 的交互系统由三个核心组件构成：HoverGlow 惯性光晕、Canvas hover 响应、移动端 press feedback。所有交互在 P3-B 精修后保持稳定，P3-C 视觉收口未破坏任何交互。

## 1. HoverGlow 惯性系统

**组件**: `src/components/sector-visuals/HoverGlow.tsx` (252 行)

**实现方式**: Canvas-based 光晕，跟随鼠标位置，使用线性插值 (lerp) 实现惯性跟随。

| 参数 | 值 | 说明 |
|------|-----|------|
| lerp 系数 | 0.065 | 越小越"拖尾"，越大越紧跟 |
| 进入过渡 | 420-600ms | 鼠标进入时光晕渐显 |
| 离开过渡 | 500-700ms | 鼠标离开时光晕渐隐 |
| Desktop 半径 | 150-190px | 光晕覆盖范围 |
| 最大 opacity | ≤0.14 | 不抢主视觉 |
| 范围限制 | 卡片内部 | 光晕不溢出卡片边界 |

**行为**:
- 鼠标在卡片上移动时，光晕以 lerp 惯性跟随，产生"拖尾"质感
- 鼠标离开后，光晕在 500-700ms 内渐隐，不突然消失
- 光晕亮度克制，最大 opacity 0.14，不会盖过卡片内容
- 多张卡片之间切换时光晕平滑过渡

**代码位置**: `src/components/sector-visuals/HoverGlow.tsx`

## 2. Canvas Hover 响应

**组件**: 各 `*Canvas.tsx` 文件

**机制**: 当鼠标 hover 到某张行业卡片时，该卡片的 Canvas 动效会微妙加速。

| 参数 | 值 | 说明 |
|------|-----|------|
| 光点速度提升 | ≤1.15× | 最多快 15%，不破坏慢节奏 |
| 响应方式 | 读取 hover state | AdvancedSectorCard 传递 hovered 状态 |
| 恢复 | 鼠标离开后自动恢复原速 |

**行为**:
- 光通信卡片 hover 时，光纤传输光点微微加速
- 算力卡片 hover 时，引脚脉冲微微加快
- 加速幅度极小（≤15%），保持"慢、稳、高级"基调
- 鼠标离开后平滑恢复

**代码位置**: `src/components/sector-visuals/canvas/*.tsx`

## 3. Demo Mode 8 步引导

**组件**: `src/components/demo/DemoWrapper.tsx`

**流程**:

| 步骤 | 位置 | 内容 |
|------|------|------|
| 0 | 首页 | 引导关注光通信板块 |
| 1 | 首页 | 引导点击中际旭创 |
| 2 | 股票详情 | 引导切换 K 线图类型 |
| 3 | 股票详情 | 引导点击买入按钮 |
| 4 | 股票详情 | 引导输入买入数量 |
| 5 | 股票详情 | 引导确认买入 |
| 6 | 首页 | 引导查看订单 |
| 7 | 订单页 | 引导查看订单表格 |

**持久化**: localStorage 存储当前 step，页面跳转后继续。

**P3-B 优化**:
- 引导框样式更克制
- 动画过渡更平滑
- 步骤切换无闪烁

**代码位置**: `src/components/demo/DemoWrapper.tsx`

## 4. 移动端 Press Feedback

**组件**: `AdvancedSectorCard.tsx` 中的移动端分支

**行为**:
- 手指按下时：卡片缩放 + 触觉反馈（如设备支持）
- 手指抬起时：恢复原状 + 导航

**适配**:
- 仅在移动端（touch 设备）激活
- Desktop 端使用 hover + click，不触发 press
- Canvas 动效在移动端使用 `MobileCanvasWrapper` 降级

**代码位置**: `src/components/sector-visuals/AdvancedSectorCard.tsx`

## 5. Shared Layout Transition

**组件**: `DemoWrapper.tsx` (LayoutGroup) + `AdvancedSectorCard.tsx` (layoutId)

**行为**:
- 从首页点击某板块卡片 → 进入板块详情页时，卡片有 shared element transition
- 使用 Framer Motion 的 `layoutId` 实现
- 过渡平滑，不闪烁

## 交互兼容性

| 设备 | HoverGlow | Canvas hover | Demo Mode | Press | Layout Transition |
|------|-----------|-------------|-----------|-------|-------------------|
| Desktop | ✅ | ✅ | ✅ | N/A | ✅ |
| Mobile | ❌ (禁用) | ✅ (降级) | ✅ | ✅ | ✅ |
| prefers-reduced-motion | ❌ (禁用) | ✅ (降级) | ✅ | ✅ | ✅ |
