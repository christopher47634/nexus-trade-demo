# Mobile Interaction Disable Rules

## MagneticSurface

**禁用条件**（任一满足即禁用）：
- `ontouchstart` in window (touch 设备)
- `prefers-reduced-motion: reduce` (无障碍)
- `window.innerWidth < 768` (移动端视口)

**禁用行为**：直接返回 `<>{children}</>`，不包裹任何 DOM。

**桌面端行为**：正常启用 tilt、glow、perspective。

## CursorOverlay

**禁用条件**（任一满足即禁用）：
- `ontouchstart` in window
- `prefers-reduced-motion: reduce`
- `window.innerWidth < 768`

**禁用行为**：返回 `null`，不渲染任何 DOM。

**桌面端行为**：正常渲染 fixed overlay with radial gradient。

## ClickRipple

不受影响（基于 click 事件，移动端也可用）。

## useCursorGlow

不受影响（useEffect 中注册 mousemove，touch 设备不会触发）。

## CSS .cursor-glow-overlay

已有 `@media (hover: hover) and (pointer: fine)` 媒体查询，移动端不显示。
