# P5-A3 Pre-Merge QA Report

**Date**: 2026-06-19
**Branch**: p5-a3-demo-portfolio-story
**Server**: http://localhost:3458 (Next.js v14.2.35, production mode)
**Playwright**: v1.61.0, Chromium 149.0.7827.55

---

## 验收总表

| 检查项 | 状态 | 说明 |
|--------|------|------|
| Demo 10步截图 | ✅ PASS | 10/10 步骤全部正确渲染，localStorage 控制正常 |
| Demo Order 可见性 | ✅ PASS | /orders 显示 1 笔 demo-order-p5-a3-001 (买入 300308 x100 @ 128.56) |
| Demo Position 可见性 | ✅ PASS | /portfolio 显示 4 只持仓 (600519/300308/300750/688256) |
| Account Summary | ✅ PASS | 总资产 ¥1,006,936 / 可用资金 ¥755,750 / 持仓市值 ¥251,186 |
| Transaction 可见性 | ✅ PASS | 资金流水共 12 笔，包含买入/卖出/分红/费用 |
| Demo Reset | ✅ PASS | 退出 demo 后 localStorage 清除，数据回退 |
| 重复运行 | ✅ PASS | 重复进入 demo 模式数据一致 (idempotent) |
| 普通数据 (非Demo) | ✅ PASS | 清除 demo 状态后页面正常显示基础数据 |
| Mobile 响应式 | ✅ PASS | 390x844 视口下 portfolio 正常渲染，4 只持仓可见 |
| P5-A2 回归 | ✅ PASS | 买入/卖出/持仓/资金流水/首页板块 全部正常 |
| Build & Lint | ✅ PASS | `next build` 成功，无 lint error |

---

## P0/P1/P2 统计

| 级别 | 数量 | 说明 |
|------|------|------|
| P0 (阻塞) | 0 | 无 |
| P1 (严重) | 0 | 无 |
| P2 (一般) | 0 | 无 |

---

## 根因说明

### 旧问题：Demo 数据不可见

**原现象**: /orders 显示 0 笔订单，/portfolio 不显示持仓和交易记录，account summary 金额不变。

**根因**: 旧 `.next` build cache 中缺少 `motion-dom.js` vendor chunk，导致：
- `/stocks/[stockCode]` 页面 SSR 报错 `Cannot find module './vendor-chunks/motion-dom.js'`
- `/orders` 和 `/portfolio` 客户端渲染时未正确加载 demo 数据

**修复**: `rm -rf .next && npx next build` 重新构建后所有页面正常。

**最终方案**:
1. `DemoGuide` 组件在 demo 模式下自动调用 `ensureDemoTradeSeeded()` seed 数据
2. `/orders` 和 `/portfolio` 页面增加兜底 seed 逻辑
3. 客户端 hydrate 时从 localStorage 恢复 demo state

---

## 截图清单

| 文件 | 大小 | 说明 |
|------|------|------|
| demo-step-0.png | 940KB | 首页 + Demo 1/10 市场总览 |
| demo-step-1.png | 479KB | 板块页 + Demo 2/10 板块分析 |
| demo-step-2.png | 361KB | 股票页 + Demo 3/10 技术视图 |
| demo-step-3.png | 361KB | 股票页 + Demo 4/10 交易入口 |
| demo-step-4.png | 358KB | 股票页 + Demo 5/10 模拟交易 |
| demo-step-5.png | 354KB | 股票页 + Demo 6/10 确认委托 |
| demo-step-6.png | 48KB | 订单页 + Demo 7/10 订单回执 |
| demo-step-7.png | 52KB | 订单页 + Demo 8/10 订单归档 |
| demo-step-8.png | 452KB | Portfolio + Demo 9/10 持仓变化 |
| demo-step-9.png | 319KB | Portfolio + Demo 10/10 闭环完成 |
| regression-after-buy.png | 222KB | 买入确认弹窗 (300308 x10000 @ 128.56) |
| regression-portfolio.png | 484KB | 桌面 Portfolio (4只持仓) |
| regression-mobile-portfolio.png | 598KB | 移动端 Portfolio (4只持仓) |

## 视频清单

| 文件 | 大小 | 说明 |
|------|------|------|
| p5-a3-final-desktop-demo-flow.mp4 | 3.1MB | 桌面 1440x900 全流程录屏 |
| p5-a3-final-mobile-demo-flow.mp4 | 0.8MB | 移动端 390x844 简化流程录屏 |

---

## 建议

**✅ 建议进入 Release Merge**

- 所有验收项全部 PASS
- 0 个 P0/P1/P2 问题
- Demo 全流程 10 步正常运作
- P5-A2 功能回归无异常
- 移动端响应式正常
- Build & Lint 通过
