# 交互前后对比

## 1. 首页板块卡片
| 属性 | Before | After |
|------|--------|-------|
| Hover | 无效果 | scale 1.02 + shadow 提升 |
| 点击 | 简单跳转 | 按下缩放 0.98 + 跳转 |
| 进入动画 | 无 | fadeUp + stagger |

## 2. 板块详情页
| 属性 | Before | After |
|------|--------|-------|
| 股票卡片 hover | 无 | 背景提亮 + border glow |
| 列表加载 | 瞬间出现 | stagger fade 入场 |

## 3. 个股详情页
| 属性 | Before | After |
|------|--------|-------|
| 页面进入 | 无动画 | fade + slide 入场 |
| K线图 | 静态 | canvas 渲染动画 |
| 交易按钮 | 普通 | hover 提升 + active 缩放 |

## 4. TradePanel
| 属性 | Before | After |
|------|--------|-------|
| 买入按钮 | 普通 | gradient + hover glow |
| 卖出按钮 | 普通 | gradient + hover glow |
| 数量选择 | 纯输入 | +/- 按钮 + 拖拽 |
| 确认下单 | 直接提交 | 确认步骤 + 动画 |

## 5. 持仓表格
| 属性 | Before | After |
|------|--------|-------|
| 列数 | 可能变化 | 固定 8 列 grid |
| 行 hover | 无 | 背景提亮 + cursor pointer |
| 数据加载 | 瞬间 | stagger fade |

## 6. 资金流水
| 属性 | Before | After |
|------|--------|-------|
| 行 hover | 无 | 背景提亮 |
| 交易记录 | 简单列表 | 分类标识 + 格式化 |

## 7. Demo Mode
| 属性 | Before | After |
|------|--------|-------|
| 引导 | 无 | 10 步引导流程 |
| 高亮 | 无 | glow + pulse 边框 |
| 步骤指示 | 无 | 进度条 + 步骤名 |

## 8. 移动端
| 属性 | Before | After |
|------|--------|-------|
| 触摸反馈 | 无 | press scale 0.98 |
| 横向溢出 | 可能 | 无溢出 |
| 手势 | 无 | touch-optimized |

生成时间: 2026-06-19T04:17:04.814Z
