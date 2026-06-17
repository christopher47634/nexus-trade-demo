# V3 Visual System Summary

## 玻璃系统 Token (globals.css)

### 暗色主题

| Token | 值 | 用途 |
|-------|-----|------|
| `--glass-bg` | `linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025)), rgba(15,22,36,0.72)` | 卡片默认背景 |
| `--glass-bg-hover` | `linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04)), rgba(15,22,36,0.78)` | 卡片 hover 背景 |
| `--glass-border` | `rgba(255,255,255,0.08)` | 卡片默认边框 |
| `--glass-border-hover` | `rgba(255,255,255,0.16)` | 卡片 hover 边框 |
| `--glass-shadow` | `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 20px rgba(0,0,0,0.3)` | 卡片默认阴影 |
| `--glass-shadow-hover` | `0 0 30px rgba(255,190,90,0.08), 0 0 20px rgba(0,0,0,0.3)` | 卡片 hover 阴影 |
| `--glass-blur` | `18px` | 背景模糊 |

### 文字层级

| 层级 | 最小 opacity | 说明 |
|------|-------------|------|
| 主标题 | 1.0 | 行业名称 |
| 数值 | 0.9+ | 涨跌幅、成交额 |
| 次级文本 | 0.6-0.8 | 标签、单位 |
| 辅助文本 | 0.40+ | 最低可见阈值 |

## Micro Status Chip 规格

| 属性 | 值 |
|------|-----|
| 高度 | 21px |
| padding | 3px 8px |
| border-radius | 6px |
| font-size | 10.5-11px |
| font-weight | 500-600 |
| border | 1px rgba(255,255,255,0.10-0.16) |
| background | rgba(8,12,24,0.45) |
| backdrop-filter | blur(11px) |
| box-shadow | 0 0 10px rgba(255,190,90,0.06-0.10) |
| hover 增强 | ≤10% |

## 行业图标系统 (SectorIcons.tsx)

| 行业 | 图标描述 | SVG 特征 |
|------|----------|----------|
| 光通信 | 光纤汇聚线 + 光点端点 | 6 条汇聚线 + 中心光点 + 脉冲环 |
| 算力 | CPU die + 引脚网格 | 矩形 die + 内核 + 四向引脚 |
| 半导体 | 晶圆同心圆 + 扫描网格 | 3 层同心圆 + 十字扫描线 + die mark |
| 新能源 | 电池矩形 + 能量流箭头 | 电池体 + 终端 + 能量条 + 上升箭头 |
| 机器人 | 机械臂关节 + 伺服弧线 | 底座 + 3 段臂 + 3 关节 + 夹爪 + 伺服弧 |
| 低空经济 | 四旋翼 + 航线弧线 | 机身 + 4 臂 + 4 旋翼圆 + 抛物航线 |
| 白酒 | 酒瓶轮廓 + 液面高光 | 瓶颈 + 瓶体 + 瓶盖 + 液面线 + 折射线 |
| 矿山 | 地质等高线 + 矿脉 | 3 层波浪地层 + 对角矿脉 + 矿石节点 |
| 军工 | 盾形 + 雷达弧线 + 坐标 | 盾轮廓 + 2 层雷达弧 + 扫描线 + 十字坐标 |
| 医药 | 分子节点 + ECG 线 | 5 个分子节点 + 化学键 + 底部心电图线 |

设计原则：
- strokeWidth 1.2，线条克制
- fill="currentColor"，继承父级颜色
- opacity 0.15-0.6，不抢视觉
- viewBox 24×24，20px 默认尺寸
- 无卡通、无装饰、无多余颜色

## Canvas 视觉系统

### 10 张行业 Canvas 卡片

| 文件 | 行业 | 核心动效 |
|------|------|----------|
| OpticalCanvas.tsx | 光通信 | 光纤汇聚线 + 光点传输 |
| ComputeCanvas.tsx | 算力 | CPU 引脚脉冲 + 网格呼吸 |
| SemiconductorCanvas.tsx | 半导体 | 晶圆扫描线 + 蚀刻电路 |
| NewEnergyCanvas.tsx | 新能源 | 电池能量流 + 箭头动画 |
| RoboticsCanvas.tsx | 机器人 | 机械臂运动轨迹 |
| LowAltitudeCanvas.tsx | 低空经济 | 四旋翼 + 航线动画 |
| BaijiuCanvas.tsx | 白酒 | 酒瓶轮廓 + 液面波纹 |
| MiningCanvas.tsx | 矿山 | 矿脉发光 + 地质层 |
| DefenseCanvas.tsx | 军工 | 雷达扫描 + 盾形轮廓 |
| PharmaCanvas.tsx | 医药 | 分子键振动 + ECG 波形 |

### Canvas 动画参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 光点速度 | ×0.35-0.5 | 比默认慢 50-65% |
| hover 提速 | ≤1.15× | 最多快 15% |
| 主线 opacity | 0.14-0.24 | 光纤主线 |
| 亮点 opacity | 0.18-0.35 | 端点光点 |
| 脉冲速度 | -40-50% | 算力脉冲降速 |
| 网格呼吸 | 5-8 秒 | 算力网格明暗周期 |
| 芯片呼吸 | 0.08-0.18 | 算力芯片 opacity |
| DPR 上限 | 2 | 高分屏适配 |
| prefers-reduced-motion | 自动降级 | 无障碍支持 |
| IntersectionObserver | 懒加载 | 不在视口内不渲染 |

## HoverGlow 系统

| 参数 | 值 |
|------|-----|
| 实现方式 | Canvas-based，跟随鼠标 |
| lerp 系数 | 0.065 |
| 进入时间 | 420-600ms |
| 离开时间 | 500-700ms |
| Desktop 光晕半径 | 150-190px |
| 最大 opacity | ≤0.14 |
| 范围限制 | 卡片内部 |
| 移动端 | 禁用（无 hover） |

## Feature Flag

| 变量 | 默认值 | 效果 |
|------|--------|------|
| `NEXT_PUBLIC_ENABLE_CANVAS_VISUALS` | `true` | Canvas 视觉启用 |
| 设为 `false` | — | 降级到 P1 静态渐变 |
