# P7-A Mobile Regression Fix Summary

## 问题

P7-A 新增的 MagneticSurface 和 CursorOverlay 在移动端产生布局回归：
- 板块卡片被压窄
- 文字竖排不可读
- 资产卡片被裁切
- 交易页 orderbook 被裁切

## 根因

MagneticSurface 在移动端仍然渲染包裹 div，其 `overflow: hidden`、`position: relative`、`perspective` 属性破坏了移动端 flex/grid 布局。

CursorOverlay 的 DOM 节点在移动端仍然存在（虽然 opacity=0），占据 fixed 定位空间。

## 修复

1. **MagneticSurface**: 添加 `isDesktop` 状态检测（`!isTouchDevice && !prefersReduced && !isSmall`），移动端直接返回 `<>{children}</>`，不包裹任何额外 DOM。

2. **CursorOverlay**: 添加 `mounted` 和 `enabled` 状态，`!enabled` 时返回 `null`，移动端不渲染任何 DOM。

## 验证

| 检查项 | 结果 |
|--------|------|
| mobile home layout | ✅ 恢复正常 |
| mobile sector cards | ✅ 横向可读 |
| mobile trade layout | ✅ 不裁切 |
| mobile overflow | ✅ scrollWidth=clientWidth |
| cursor overlay on mobile | ✅ not found |
| magnetic wrappers on mobile | ✅ 0 |
| cursor overlay on desktop | ✅ 存在 |
| build/lint | ✅ 通过 |

## Commit

`1229f6b` on p7-a-advanced-cursor-interaction-layer
