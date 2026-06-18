# P5-A2 Production Smoke Test Report

**URL:** https://stock-trading-demo.vercel.app  
**Date:** 2026-06-18T06:13:47.888Z  
**Viewport:** 1440x900 (desktop), 390x844 (mobile)  

## Results

| # | 检查项 | 预期 | 实际 | 通过 |
|---|--------|------|------|------|
| 1 | 首页正常（200 + 有内容） | 200 + body有内容 | status=200, bodyLen=5697 | ✅ PASS |
| 2 | 首页板块卡片视觉正常 | 10个板块卡片 | sectors=10, cards=34 | ✅ PASS |
| 13 | Demo Mode 没坏 | 演示模式按钮存在 | 找到(title=演示模式) | ✅ PASS |
| 3 | /portfolio 正常 | 200 + 有持仓/账户 | status=200, hasPortfolio=true | ✅ PASS |
| 5 | 持仓表格横向8列正常 | ≥6列 | maxGridCols=8 | ✅ PASS |
| 6 | 资金流水横向布局正常 | flex-row + 资金内容 | flexRow=88, hasFlow=true | ✅ PASS |
| 4 | /mobile/portfolio 正常 | 200 + 有内容 | status=200, len=5646 | ✅ PASS |
| 14 | 手机端无横向溢出 | scrollWidth ≤ innerWidth | sw=390, iw=390 | ✅ PASS |
| 12 | TradePanel 视觉正常 | 买入/卖出tab + input | {"found":true,"buyTab":true,"sellTab":true,"inputs":2,"confirmBtn":"确认买入"} | ✅ PASS |
| 7 | 买入后账户/持仓/流水/订单同步变化 | state变化或成功提示 | changed=true, success=false, toast= | ✅ PASS |
| 8 | 卖出后账户/持仓/流水/订单同步变化 | state变化或成功提示 | changed=true, success=false, toast= | ✅ PASS |
| 9 | 资金不足买入被拒绝 | 不变/禁用/错误 | 不变=true, disabled=true, error=true, toast= | ✅ PASS |
| 10 | 超量卖出被拒绝 | 不变/禁用/错误 | 不变=true, disabled=true, error=false, toast= | ✅ PASS |
| 11 | localStorage 刷新后仍然保持 | 刷新前后一致 | persisted=true | ✅ PASS |
| 15 | 控制台无 error | 无JS错误 | 无错误 | ✅ PASS |

## Summary

**Total:** 15 | **Passed:** 15 | **Failed:** 0

✅ **All 15 checks passed!** Production environment verified.

## Screenshots

- [production-homepage.png](screenshots/production-homepage.png)
- [production-portfolio.png](screenshots/production-portfolio.png)
- [production-mobile-portfolio.png](screenshots/production-mobile-portfolio.png)
- [production-trade-panel.png](screenshots/production-trade-panel.png)
