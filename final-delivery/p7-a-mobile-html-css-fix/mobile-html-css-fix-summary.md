# P7-A Mobile HTML/CSS Fix Summary

## 问题

移动端把桌面端等比例压缩到手机屏幕，不是真正的手机端排版。

## 根因

1. DesktopShell sidebar (w-16, 64px) 在移动端始终显示，压缩内容区
2. 所有 grid 使用固定列数（grid-cols-4/5/12），无移动端断点
3. 交易页 K线和盘口使用 grid-cols-12 左右并排
4. 底部四模块 grid-cols-12 四列压缩

## 修复

| 文件 | 修改 |
|------|------|
| DesktopShell.tsx | sidebar hidden md:flex, main md:ml-16, 新增 mobile bottom nav |
| page.tsx | 账户卡片 grid-cols-2 md:grid-cols-4, 底部模块 grid-cols-1 md:grid-cols-12 |
| HotSectorGrid.tsx | grid-cols-2 sm:grid-cols-3 md:grid-cols-5 |
| stocks/[stockCode]/page.tsx | K线+盘口 grid-cols-1 md:grid-cols-12, 纵向堆叠 |
| sectors/[sectorId]/page.tsx | 响应式 padding + pb-20 |
| orders/page.tsx | 响应式 padding, overflow-x-auto |
| portfolio/page.tsx | 响应式 padding |

## 验收

| 检查项 | 390x844 | 430x932 |
|--------|---------|---------|
| / overflow | ✅ | ✅ |
| /stocks/300308 overflow | ✅ | ✅ |
| /portfolio overflow | ✅ | ✅ |
| sidebar hidden | ✅ | ✅ |
| bottom nav visible | ✅ | ✅ |
| K线+盘口上下排列 | ✅ | ✅ |
| 板块2列 | ✅ | ✅ |
| 账户卡片2列 | ✅ | ✅ |
| desktop cursor preserved | ✅ | — |

## Commit

`55f807c` on p7-a-advanced-cursor-interaction-layer
