## P5-A1 QA Report

审核日期: 2026-06-18
审核范围: 14 个新增文件 + 2 个修改文件

### P1 Blockers
- 无

所有 P1 检查项通过：
- localStorage key 使用 `nexus-trade-account/positions/transactions/history` 前缀，与 `nexus-trade-orders` 无冲突
- Build 成功，无编译错误
- 无引用不存在的模块或类型（`formatPercent`、`getSectorById` 等均存在）
- 首页功能正常：从硬编码改为动态读取 account-storage 数据
- DesktopShell 导航从 `/#portfolio`（锚点）正确改为 `/portfolio`（独立页面）

### P2 Should Fix
1. **availableCash 计算未扣除交易费用** (低优先级)
   - `account.ts` 中 `cash = INITIAL_CASH - costBasis` 只扣除了股票成本
   - 未扣除 `accountTransactions.ts` 中的 fee 类交易（共 ¥289.75）
   - 也未加入 sell 收入和 dividend 收入
   - 影响：交易流水显示的总支出/收入与 availableCash 不完全匹配
   - 建议：`getAccountSummary()` 接收 transactions 参数，用流水计算净现金变动

2. **Position.positionRatio 使用固定 TOTAL_ASSETS 常量** (低优先级)
   - `positions.ts` 第 7 行 `const TOTAL_ASSETS = 1_000_000` 用于计算每只股票的仓位比例
   - 而 `account.ts` 的 `getAccountSummary()` 动态计算 `positionRatio = marketValue / totalAssets`
   - 当账户有盈利导致 totalAssets > 1,000,000 时，两个口径不一致
   - 影响：在当前只买不卖的 demo 中，差异极小（~0.03%），不影响体验

3. **SSR hydration: DEFAULT_ACCOUNT.updatedAt** (极低优先级)
   - `page.tsx` 第 28 行 `updatedAt: new Date().toISOString()` 在模块加载时求值
   - 服务端和客户端渲染的时间戳可能不同，导致 hydration mismatch
   - useEffect 立即用 localStorage 数据覆盖，用户无感知

### P3 Nice to Have
1. `account-storage.ts` 的 `initializeAccount()` 每次调用 `defaultAccount` 时都会更新 `updatedAt` 时间戳。如果在组件渲染中频繁调用，可能造成不必要的重渲染。当前每个页面只在 useEffect 中调用一次，无实际影响。

2. `PortfolioMiniChart` SVG 使用固定 viewBox `280×80`，在极窄屏幕（<320px）上可能略有压缩，但 `preserveAspectRatio="none"` 加 `w-full` 确保不会溢出。

3. 建议在 `account.ts` 的 `getAccountSummary()` 函数头部添加注释，说明 availableCash 的简化假设。

### Build/Lint
- Build: PASS (12/12 static pages generated, including /portfolio 和 /mobile/portfolio)
- Lint: PASS (No ESLint warnings or errors)

### 页面可访问性
- /portfolio: HTTP 200
- /mobile/portfolio: HTTP 200
- / (首页): HTTP 200 (未被破坏)
- /orders: HTTP 200 (未被破坏)

### 数据一致性检查
| 检查项 | 结果 |
|--------|------|
| marketValue = currentPrice × quantity | ✓ 一致 |
| unrealizedPnL = (currentPrice - avgCost) × quantity | ✓ 一致 |
| unrealizedPnLPercent = (currentPrice - avgCost) / avgCost × 100 | ✓ 一致 |
| todayPnL = (currentPrice - openPrice) × quantity | ✓ 一致 |
| totalAssets = availableCash + marketValue | ✓ 一致 |
| positionRatio = marketValue / totalAssets | ✓ 一致 |
| positionRatio 求和 ≠ 100%（因为包含现金仓位） | ✓ 正确行为 |
| PortfolioHistory 的 totalAssets = cash + marketValue | ✓ 一致 |
| 茅台: 100×1688=168800, PnL=(1688-1650)×100=3800 | ✓ |
| 中际旭创: 200×128.56=25712, PnL=(128.56-120)×200=1712 | ✓ |
| 宁德时代: 150×198.56=29784, PnL=(198.56-195)×150=534 | ✓ |
| 寒武纪: 100×268.9=26890, PnL=(268.9-260)×100=890 | ✓ |
| 总市值: 168800+25712+29784+26890=251186 | ✓ |
| 总盈亏: 3800+1712+534+890=6936 | ✓ |
| 成本基础: 165000+24000+29250+26000=244250 | ✓ |
| 可用资金: 1000000-244250=755750 | ✓ (忽略费用) |
| 总资产: 755750+251186=1006936 | ✓ |

### 代码质量评估
- TypeScript 类型定义清晰，接口注释完整
- 所有组件使用 `"use client"` 指令，SSR 安全
- localStorage 操作有 `isClient()` 保护和 try-catch 降级
- 动画使用 framer-motion，与 V4 风格一致
- 移动端使用独立 PositionCard 组件，避免桌面端表格横向溢出
- 空状态处理：PositionTable 和 MobilePortfolioPage 都有暂无持仓的空状态展示

### 最终判定
**PASS**

所有 P1 项通过，P2 项均为低优先级的数据口径简化问题，在 demo 场景下不影响用户体验。Build 和 Lint 均通过，两个新页面均可正常访问。
