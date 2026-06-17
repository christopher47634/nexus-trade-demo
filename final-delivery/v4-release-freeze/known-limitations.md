# V4 Known Limitations

**日期:** 2026-06-18
**版本:** V4 Trading Product Reality Release

---

## 功能限制

| # | 限制 | 说明 |
|---|------|------|
| 1 | 不接真实行情 | 所有市场数据为 Mock，非实时 |
| 2 | 不接券商 API | 无真实交易通道 |
| 3 | 不做真实交易 | 模拟交易，不涉及真实资金 |
| 4 | 不做登录注册 | 无用户系统 |
| 5 | 不做真实账户/持仓 | 模拟资产数据为静态 |
| 6 | 数据仍是 Mock | 股票价格/涨跌幅为固定值，不随时间变化 |
| 7 | 订单仍是 localStorage | 无后端存储，清除浏览器数据后订单丢失 |
| 8 | 不构成投资建议 | 法律声明，非专业投资工具 |

---

## 技术债务

| # | 问题 | 风险 | 优先级 |
|---|------|------|--------|
| 1 | ui/ 与 common/ 重复组件 | 低 | P3 |
| 2 | mobile indices bar 横向溢出 | 中 | P2 |

### 1. 组件重复
- `src/components/ui/EmptyState.tsx` ↔ `src/components/common/EmptyState.tsx`
- `src/components/ui/ErrorState.tsx` ↔ `src/components/common/ErrorState.tsx`
- `src/components/ui/LoadingState.tsx` (新增，无重复)
- `src/components/ui/WarningBanner.tsx` (新增，无重复)
- 页面实际导入 `common/` 版本，`ui/` 版本未使用
- 功能不缺失，后续清理统一即可

### 2. 移动端溢出
- market indices bar 使用 `whitespace-nowrap`
- 导致页面整体横向溢出
- V3 已存在，非 P4-A 引入
- 修复方案: 添加 `overflow-hidden` 或 `min-w-0`

---

## 已知行为

| 行为 | 说明 |
|------|------|
| K 线数据随机 | 每次刷新页面 K 线数据会重新生成 |
| 订单状态不自动变化 | 提交后状态停留在 submitted，不会自动变为 filled |
| 市价委托禁用 | 显示为灰色禁用态，提示 "Demo暂不支持" |
| 自选股固定 | 始终显示相同的 5 只股票 |
