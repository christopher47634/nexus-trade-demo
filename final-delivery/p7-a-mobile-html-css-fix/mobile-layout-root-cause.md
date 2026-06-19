# Mobile Layout Root Cause

## 问题

移动端不是原生手机端排版，而是桌面端等比例压缩。

## 根因链

1. DesktopShell sidebar 固定 64px 宽度，始终显示
2. main content ml-16 始终生效
3. 所有 grid 无移动端断点
4. 交易页 K线(9/12) + 盘口(3/12) 左右并排
5. 底部四模块各 3/12 列

## 修复策略

- sidebar: hidden md:flex（移动端隐藏）
- main: md:ml-16（移动端无左 margin）
- 新增 mobile bottom nav（fixed bottom）
- 所有 grid 添加移动端断点
- 交易页改为 grid-cols-1 md:grid-cols-12（纵向堆叠）
- 所有页面添加 pb-20（为 bottom nav 留空间）
