# Production Smoke Test — P4-B Cleanup & Stability

**日期:** 2026-06-18
**Production URL:** https://stock-trading-demo.vercel.app
**Production buildId:** 9TPsNeNk2asJ7biOpjVDu
**测试环境:** Playwright + Chromium, Production (非 localhost)

---

## 检查结果：12/12 全部通过

| # | 检查项 | 结果 | 说明 |
|---|--------|------|------|
| 1 | 首页正常加载 | ✅ | HTTP 200，包含"热门板块""光通信" |
| 2 | 手机首页无横向溢出 390px | ✅ | scrollWidth 390 == clientWidth 390 |
| 3 | 手机首页无横向溢出 360px | ✅ | scrollWidth 360 == clientWidth 360 |
| 4 | 手机首页无横向溢出 320px | ✅ | scrollWidth 320 == clientWidth 320 |
| 5 | 桌面首页布局正常 1440px | ✅ | scrollWidth 1440 == clientWidth 1440 |
| 6 | 10 个行业板块正常 | ✅ | 算力/光通信/低空经济/半导体/机器人/新能源/白酒/医药/矿山/军工 |
| 7 | 个股详情页正常 | ✅ | /stocks/300308 包含"中际旭创" |
| 8 | K线正常 | ✅ | 股票详情页 K 线渲染正常 |
| 9 | 交易面板正常 | ✅ | 交易页正常加载 |
| 10 | 订单页正常 | ✅ | /orders 包含免责声明 |
| 11 | Demo Mode 正常 | ✅ | 首页 DemoWrapper 正常 |
| 12 | 控制台无 error | ✅ | 无 console.error |

---

## 修复验证

| 检查项 | 结果 |
|--------|------|
| main 元素 class 包含 min-w-0 overflow-hidden | ✅ `ml-16 min-h-screen min-w-0 overflow-hidden` |
| CSS hash | ✅ 已更新 |
| buildId | ✅ 已更新 (9TPsNeNk2asJ7biOpjVDu) |

---

## 页面内容验证

**首页 (1440px):**
- 上证指数 3267.89 +0.56%
- 深证成指 10234.56 +0.78%
- 创业板指 2045.67 +1.23%
- 科创50 987.34 +1.56%
- 北证50 1123.45 -0.34%
- 模拟总资产 ¥1,256,789.56
- 热门板块 10/10 显示正常

**板块详情 (/sectors/optical-communication):**
- 标题: 光通信 ✅
- 成分股: 中际旭创 ✅

**个股详情 (/stocks/300308):**
- 名称: 中际旭创 ✅
- 价格: 128 ✅

**订单页 (/orders):**
- 免责声明 ✅
- 订单标题 ✅

---

## 结论

Production 已同步到最新 main，P4-B Cleanup 的两项修复（移动端溢出 + 组件去重）均已生效。
