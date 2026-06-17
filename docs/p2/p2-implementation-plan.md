# P2 实施计划

## 总体节奏

```
P2-B  →  visual-lab 实验 + 3张高级卡片 + hover光晕 + shared layout
P2-C  →  Glacier Glass 主题 + 资产卡片增强 + 更多卡片
P2-D  →  Neon Quant 主题 + 剩余卡片 + 粒子效果
```

每批独立交付，不互相依赖。P2-B 失败不影响 V1 稳定版。

---

## P2-B 开发任务书

### 任务 1：visual-lab 实验页

**目标**：创建 `/visual-lab` 页面，所有视觉实验先在这里验证。

**规格**：
- 路由：`src/app/visual-lab/page.tsx`
- 布局：3列网格，展示 3 张实验卡片
- 每张卡片有 2 个版本切换：CSS/Framer 版 | Canvas 版
- 底部有性能监控（FPS 计数器）
- 页面不进主导航，只通过 URL 访问
- 移动端适配：单列布局

**验收**：
- `/visual-lab` 可访问
- 3 张卡片正常渲染
- 可切换 CSS / Canvas 版本
- FPS 计数器正常显示
- build 通过

---

### 任务 2：光通信高级卡片

**目标**：为光通信板块创建高级视觉卡片。

**CSS/Framer 版本**：
- 底层：深色渐变背景（暗金 → 深蓝）
- 光纤流线：CSS linear-gradient + animation（横向流动的细线）
- 微粒光点：Framer Motion 绝对定位的小圆点，缓慢漂移
- hover：scale(1.02) + box-shadow 增强

**Canvas 版本**：
- 底层：Canvas fillRect 深色渐变
- 光纤流线：Canvas drawLine + 全局 alpha 渐变动画
- 微粒光点：Canvas arc + 随机运动
- hover：Canvas 鼠标位置检测 + 光晕绘制

**验收**：
- 两个版本都正常渲染
- 视觉风格保持金融终端感（不花哨）
- hover 效果正常
- Canvas 版本 FPS ≥ 55

---

### 任务 3：算力高级卡片

**目标**：为算力板块创建高级视觉卡片。

**CSS/Framer 版本**：
- 底层：深色渐变（深紫 → 深蓝）
- 芯片电路：CSS pseudo-element + border 模拟电路线
- 数据网格：CSS repeating-linear-gradient 网格线
- hover：电路线发光

**Canvas 版本**：
- 底层：Canvas 渐变
- 芯片电路：Canvas strokeRect + moveTo/lineTo 电路线
- 数据网格：Canvas drawLine 网格
- hover：鼠标附近电路线变亮

**验收**：同任务 2

---

### 任务 4：半导体高级卡片

**目标**：为半导体板块创建高级视觉卡片。

**CSS/Framer 版本**：
- 底层：深色渐变（深灰 → 深蓝）
- 晶圆刻蚀线：CSS radial-gradient 同心圆
- 刻蚀纹理：CSS repeating-conic-gradient
- hover：同心圆呼吸动画

**Canvas 版本**：
- 底层：Canvas 渐变
- 晶圆刻蚀线：Canvas arc 同心圆
- 刻蚀纹理：Canvas 径向渐变
- hover：鼠标附近圆环变亮

**验收**：同任务 2

---

### 任务 5：hover 光晕系统

**目标**：为板块卡片创建鼠标跟随光晕效果。

**规格**：
- 独立 Canvas 层叠加在卡片上方（pointer-events: none）
- 光晕跟随鼠标位置，半径 120px，颜色跟随板块主色调
- mousemove 用 requestAnimationFrame 节流
- 鼠标离开时光晕淡出
- 移动端禁用

**验收**：
- 光晕跟随鼠标正常
- 不卡顿（FPS ≥ 55）
- 移动端无异常
- 不影响卡片点击

---

### 任务 6：shared layout transition

**目标**：板块卡片 → 板块详情 Hero 的转场动画。

**规格**：
- 板块卡片的标题/涨跌幅区域用 `layoutId={sectorId}` 标记
- 板块详情 Hero 的对应区域用相同 layoutId
- Framer Motion `AnimatePresence` 包裹路由
- 转场时长 300ms，spring 动画

**验收**：
- 点击板块卡片后，标题/涨跌幅平滑飞入详情页
- 返回时反向动画
- 不闪烁、不错位
- build 通过

---

## P2-B 依赖关系

```
任务 1 (visual-lab)  ←  必须先做
   ↓
任务 2-4 (3张卡片)   ←  可并行
   ↓
任务 5 (hover光晕)   ←  依赖卡片完成
任务 6 (shared layout) ←  独立，可并行
```

## P2-B 预计耗时

| 任务 | 预计耗时 | 复杂度 |
|------|----------|--------|
| visual-lab 实验页 | 1h | 低 |
| 光通信卡片 | 2h | 中 |
| 算力卡片 | 1.5h | 中 |
| 半导体卡片 | 1.5h | 中 |
| hover 光晕 | 2h | 中 |
| shared layout | 1.5h | 中 |
| **总计** | **~9.5h** | |

## P2-C 预计耗时（粗估）

| 任务 | 预计耗时 |
|------|----------|
| Glacier Glass 主题 | 3h |
| 资产卡片反射 + 数字滚动 | 2h |
| 更多板块卡片 (3张) | 3h |
| **总计** | **~8h** |
