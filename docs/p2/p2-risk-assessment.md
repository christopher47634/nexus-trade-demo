# P2 风险评估

## 风险矩阵

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| Canvas 动画拖慢首屏 | 中 | 高 | requestAnimationFrame + 节流 + IntersectionObserver 懒加载 |
| 板块卡片视觉风格不统一 | 中 | 中 | 先做 3 张验证，统一设计规范后再铺开 |
| hover 光晕在移动端无效 | 低 | 低 | 移动端禁用光晕，fallback 为静态高亮 |
| shared layout transition 闪烁 | 中 | 中 | Framer Motion 的 layoutId 需要严格配对，测试覆盖 |
| 主题切换导致组件色值溢出 | 高 | 中 | 强制使用 CSS 变量，不允许硬编码色值 |
| Canvas 和 React 状态冲突 | 中 | 中 | Canvas 独立于 React 渲染周期，用 ref 挂载 |
| 视觉增强被 V 否定方向 | 中 | 高 | visual-lab 先行，不直接改主页 |
| 性能在低端设备下降 | 高 | 中 | 提供降级方案：关闭动画 / 静态 fallback |
| P2 周期过长 | 中 | 高 | 每批独立交付，不互相依赖 |

## 技术风险详情

### Canvas 2D

**风险**：Canvas 绘制周期和 React 渲染周期不同步，可能导致闪烁或内存泄漏。

**缓解**：
- Canvas 用 ref 挂载，不进入 React 渲染树
- 组件卸载时销毁 animation frame
- 每张卡片独立 Canvas，不共用
- IntersectionObserver 控制：不在视口内时暂停绘制

**预计影响**：低。Canvas 2D 是成熟技术，风险可控。

### Framer Motion shared layout

**风险**：layoutId 配对错误会导致页面跳转时元素飞到错误位置。

**缓解**：
- 严格使用 `{sectorId}` / `{stockCode}` 作为 layoutId
- 只在确定的元素对之间做 shared layout
- 保留 fallback：如果 transition 失败，元素直接出现而不飞

**预计影响**：中。需要仔细测试每个转场路径。

### CSS 变量主题

**风险**：现有组件可能有硬编码色值（Tailwind class 或 inline style），切换主题时不会生效。

**缓解**：
- P2-B 前先 grep 所有硬编码色值
- 建立色值映射表：每个 Tailwind color → CSS 变量
- 新增的主题色值必须覆盖所有已有变量

**预计影响**：中。需要前期检查工作，但后期维护成本低。

### hover 光晕

**风险**：高频鼠标事件可能卡顿。

**缓解**：
- mousemove 事件用 requestAnimationFrame 节流
- Canvas 光晕用独立 Canvas 层，不污染卡片 Canvas
- 移动端完全禁用

**预计影响**：低。

## 性能预算

| 指标 | 当前值 | P2 目标 | 红线 |
|------|--------|---------|------|
| 首屏 LCP | ~1.5s | < 2.0s | > 2.5s |
| 首页 JS 大小 | 169KB | < 200KB | > 250KB |
| 板块卡片 FPS | 60 | ≥ 55 | < 45 |
| 内存占用 | ~50MB | < 80MB | > 120MB |
| 首页 Canvas 数量 | 0 | ≤ 10 | > 15 |

## 回退方案

每个增强点都有独立的开关：

```typescript
// 环境变量控制
NEXT_PUBLIC_ENABLE_CANVAS_BG=true
NEXT_PUBLIC_ENABLE_HOVER_GLOW=true
NEXT_PUBLIC_ENABLE_SHARED_LAYOUT=true
NEXT_PUBLIC_THEME=dark-gold
```

任何增强点出问题，设为 false 即回退到 V1 行为。不改代码，只改环境变量。
