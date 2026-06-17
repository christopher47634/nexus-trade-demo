# P3-C Visual Comparison

## 改动总结

### 1. 右上角小框 (Micro Status Chip)

| 属性 | P3-B | P3-C |
|------|------|------|
| 高度 | ~28px | 21px |
| padding | 较大 | 3px 8px |
| border-radius | 8px | 6px |
| font-size | 12px | 10.5-11px |
| font-weight | 400 | 500-600 |
| border | 2px | 1px rgba(255,255,255,0.10-0.16) |
| background | 较亮 | rgba(8,12,24,0.45) |
| backdrop-filter | blur(16px) | blur(11px) |
| box-shadow | 无 | 0 0 10px rgba(255,190,90,0.06-0.10) |

**效果**：明显更小、更精致、更像金融终端里的 micro chip。

### 2. 行业图标

| 板块 | P3-B | P3-C |
|------|------|------|
| 光通信 | Zap图标（闪电） | 光纤汇聚线+光点端点 |
| 算力 | Cpu图标（通用芯片） | CPU die+引脚网格 |
| 半导体 | MemoryStick | 晶圆同心圆+扫描网格 |
| 新能源 | Sun图标（太阳） | 电池矩形+能量流箭头 |
| 机器人 | Bot图标（机器人脸） | 机械臂关节+伺服弧线 |
| 低空经济 | Plane图标（飞机） | 四旋翼+航线弧线 |
| 白酒 | Wine图标（酒坛） | 优雅酒瓶轮廓+液面高光 |
| 矿山 | Mountain图标（山） | 地质等高线+矿脉 |
| 军工 | Shield图标（盾） | 盾形+雷达弧线+坐标 |
| 医药 | HeartPulse图标（心电） | 分子节点+ECG线 |

**效果**：全部替换为行业专属的专业线条符号，不卡通。

### 3. 玻璃系统统一

| Token | P3-B | P3-C |
|-------|------|------|
| --glass-border | 0.12 | 0.08 |
| --glass-border-hover | 0.22 | 0.16 |
| --glass-blur | 22px | 18px |
| --glass-shadow | 过亮 | 更柔和 |
| 文字最小opacity | 0.30 | 0.40 |

### 4. P3-B 交互保持

- ✅ HoverGlow 惯性：未改动
- ✅ Canvas hover 响应：未改动
- ✅ Demo Mode：未改动
- ✅ 移动端 press：未改动

### 5. 白酒确认

✅ 酒瓶轮廓（非酒坛），有液面高光和瓶身折射线。

### 6. 医药确认

✅ 分子节点+ECG线（非红十字）。

## 建议

✅ 建议合入 main。视觉收口完成，交互未受影响。
