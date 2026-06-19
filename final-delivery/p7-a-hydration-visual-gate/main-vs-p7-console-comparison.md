# Main vs P7-A Console Comparison

## 测试环境

- Browser: Chromium (Playwright)
- Viewport: 1440x900 (desktop) + 390x844 (mobile)
- Pages tested: /, /sectors/optical-communication, /stocks/300308, /orders, /portfolio, /mobile/portfolio

## 对比结果

| 分支 | 总 console.error | React #418 | 其他错误 |
|------|-----------------|-----------|---------|
| main (1036a71) | 0 | 0 | 0 |
| p7-a (69bbf57) | 0 | 0 | 0 |

## 结论

两分支 console 行为一致。P7-A 未引入新的 hydration 问题。
