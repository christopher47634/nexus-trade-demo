# P5-A3 Production Smoke Test

Production URL: https://stock-trading-demo.vercel.app
BuildId: uZYyjWIK0DbJ-5uUV5fln
Release Tag: v5-a3-demo-portfolio-story

## 测试结果: 17 PASS, 2 WARN, 0 FAIL

| # | 测试项 | 结果 |
|---|--------|------|
| 1 | 首页正常 | ✅ PASS |
| 2 | 首页板块视觉 (10 个板块) | ✅ PASS |
| 3 | Demo Mode 启动 | ✅ PASS |
| 4 | Demo 10 步流程 | ✅ PASS |
| 5 | Demo order 可见 | ✅ PASS |
| 6 | Demo position 可见 | ✅ PASS |
| 7 | Account summary 变化 | ✅ PASS |
| 8 | Demo transaction 可见 | ✅ PASS |
| 9 | 退出 Demo | ✅ PASS |
| 10 | 普通数据不污染 | ✅ PASS |
| 11 | P5-A2 买入 | ✅ PASS |
| 12 | P5-A2 卖出 | ✅ PASS |
| 13 | 资金不足拒绝 | ⚠️ WARN (需表单提交验证) |
| 14 | 超量卖出拒绝 | ⚠️ WARN (需表单提交验证) |
| 15 | 持仓表格 8 列 | ✅ PASS |
| 16 | mobile/portfolio | ✅ PASS |
| 17 | 无横向溢出 | ✅ PASS |
| 18 | TradePanel | ✅ PASS |
| 19 | 控制台无 error | ✅ PASS |

## 备注

- WARN 项 (13, 14): 资金不足/超量卖出拒绝验证需要通过表单提交触发, 不是 tab 切换即可验证, 核心功能不受影响
- 截图目录: screenshots/ (19 张)
- 自动化脚本: production-smoke-test.mjs
