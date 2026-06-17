# P3 Cursor Interaction Strategy

## 当前状态

当前 HoverGlow 是一个 Canvas 层，跟随鼠标在卡片范围内绘制柔和光晕。
- lerp 系数 0.065（有轻微延迟）
- 淡入 500ms，淡出 600ms
- 最大 opacity 0.14
- 半径 170px desktop / 110px mobile

**问题**：太普通。没有物理感，没有惯性，没有对卡片内容的响应。

## 方案 A：保守版

**效果**：
- HoverGlow 加入 pointer velocity 影响（快速移动时光晕拉长）
- lerp 系数改为 0.04-0.08 动态范围（静止时慢跟，快速时快跟）
- 光晕边缘加 soft gradient falloff

**技术路径**：
- 修改 HoverGlow.tsx
- 计算 pointer velocity（两点距离/时间）
- velocity 映射到 lerp 系数和光晕椭圆变形

**成本**：0.5 天
**性能风险**：无（纯 Canvas 2D）
**上线**：✅ 直接上线

## 方案 B：产品级版

**效果**：
- 方案 A 全部 +
- 卡片 Canvas 对鼠标位置有轻微视差（mouseX/Y 影响 Canvas 内元素偏移 2-5px）
- hover 时行业视觉发生局部响应（光通信光点加速、算力芯片亮起、军工雷达锁定）
- K 线图 hover 时显示精确数值十字线（已有，可增强）
- 交易按钮 hover 时有 press 质感（scale 0.98 + shadow 变化）

**技术路径**：
- HoverGlow.tsx 升级
- 每个 Canvas 组件增加 mouseX/mouseY props
- Canvas 内部用 mouse position 做局部偏移
- AdvancedSectorCard 传递 mouse position
- TradePanel 按钮加 whileHover/whileTap

**成本**：2-3 天
**性能风险**：中（每帧多一次 mouse transform）
**上线**：✅ 上线，需性能测试

## 方案 C：Awwwards 实验版

**效果**：
- 方案 B 全部 +
- 全局 mouse shader / liquid light field（鼠标移动时整个页面有液态光场响应）
- 卡片边缘折射感（类似 glass refraction）
- 光标自定义样式（dot + ring + trail）
- 只放在 /visual-lab 或 landing hero

**技术路径**：
- 全局 Canvas overlay（fixed position, pointer-events-none）
- GLSL fragment shader（液态光场）
- 或 Canvas 2D 模拟（粒子系统 + metaball）
- 自定义 cursor CSS + trail animation

**成本**：4-5 天
**性能风险**：高（全局 overlay + shader）
**上线**：❌ 只放实验页

## 建议

**P3-B 做方案 A**（0.5 天，低成本高回报）
**P3-C 做方案 B**（2-3 天，产品级提升）
**P3-D 做方案 C**（实验页，不影响主站）

## 手机端替代方案

手机端没有鼠标，替代方案：
1. touch press 时在 press 位置显示光晕
2. 设备陀螺仪倾斜影响 Canvas 元素偏移（DeviceOrientation API）
3. 长按时显示更强的视觉响应
4. 滚动时卡片进入视口的 reveal animation
