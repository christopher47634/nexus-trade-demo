# Demo Mode Before/After — 8步教程 → 10步产品展示

**项目**: stock-trading-demo  
**分支**: p5-a3-demo-portfolio-story  
**Commit**: 62bd71f

---

## 概览

| 维度 | Before (P5-A2) | After (P5-A3) |
|------|----------------|----------------|
| 步骤数 | 8 | 10 |
| 覆盖页面 | 首页/板块/个股/订单 | 首页/板块/个股/订单/**持仓** |
| 目标定位 | 教程引导 (如何交易) | 产品展示 (完整闭环) |
| 结束位置 | 订单页 | **持仓页** |
| 新增功能 | — | 持仓表格高亮 + 资金流水高亮 |

---

## Before: 8 步教程流程

```
Step 0  市场机会扫描      → 首页
Step 1  热点板块识别      → 板块详情
Step 2  板块成分股分析    → 个股页
Step 3  个股技术视图      → 个股页
Step 4  模拟交易入口      → 个股页
Step 5  确认模拟委托      → 个股页
Step 6  订单成交回执      → 个股页
Step 7  订单记录归档      → 订单页
         ↓ Demo 结束
```

**特点**: 流程止步于订单页面，用户看不到交易对持仓和资金的实际影响。

---

## After: 10 步产品展示流程

```
Step 0  市场机会扫描      → 首页
Step 1  热点板块识别      → 板块详情
Step 2  板块成分股分析    → 个股页
Step 3  个股技术视图      → 个股页
Step 4  模拟交易入口      → 个股页
Step 5  确认模拟委托      → 个股页
Step 6  订单成交回执      → 个股页
Step 7  订单记录归档      → 订单页
Step 8  持仓与账户变化    → 持仓页  ← 新增
Step 9  交易闭环完成      → 持仓页  ← 新增
         ↓ Demo 结束
```

**特点**: 完整闭环 — 从市场扫描到持仓变化，展示交易的实际结果。

---

## 新增功能

### 1. 持仓表格高亮 (Step 8)

- **文件**: `src/components/portfolio/PositionTable.tsx`
- **改动**: 添加 `data-demo-highlight="portfolio-table"` 到持仓表格容器
- **效果**: Demo 模式下 Step 8 自动高亮持仓明细表格
- **触发**: delay 3s → 自动推进到 Step 9

### 2. 资金流水高亮 (Step 9)

- **文件**: `src/components/portfolio/TransactionList.tsx`
- **改动**: 添加 `data-demo-highlight="transaction-list"` 到资金流水容器
- **效果**: Demo 模式下 Step 9 自动高亮资金流水列表
- **触发**: delay 3s → 自动退出 Demo

### 3. Demo 步骤扩展

- **文件**: `src/components/demo/DemoMode.tsx`
- **改动**: `demoSteps` 数组从 8 项扩展到 10 项
- **新增步骤**:
  - `"持仓与账户变化"` (Step 8)
  - `"交易闭环完成"` (Step 9)

### 4. DemoGuide 配置扩展

- **文件**: `src/components/demo/DemoGuide.tsx`
- **改动**: `stepConfigs` 数组从 8 项扩展到 10 项
- **新增配置**:
  - Step 8: selector=`portfolio-table`, route=`/portfolio`, delay=3s
  - Step 9: selector=`transaction-list`, route=`/portfolio`, delay=3s → 退出

### 5. Demo Data 策略

- **文件**: `src/lib/account-storage.ts`
- **新增函数**: `addDemoOrder`, `addDemoPosition`, `getDemoOrders`, `getDemoPositions`, `hasDemoData`, `resetDemoData`
- **新增 key**: `nexus-trade-demo-orders`, `nexus-trade-demo-positions`

---

## 代码改动对比

### DemoMode.tsx

```diff
 export const demoSteps = [
   "市场机会扫描",
   "热点板块识别",
   "板块成分股分析",
   "个股技术视图",
   "模拟交易入口",
   "确认模拟委托",
   "订单成交回执",
   "订单记录归档",
+  "持仓与账户变化",
+  "交易闭环完成",
 ];
```

### DemoGuide.tsx — stepConfigs

```diff
   // Step 7: Orders page — highlight order table
   {
     selector: '[data-demo-highlight="order-table"]',
     badge: "订单归档",
     route: "/orders",
     advanceOn: "click",
     navigateTo: "/portfolio",
   },
+  // Step 8: Portfolio page — highlight position table
+  {
+    selector: '[data-demo-highlight="portfolio-table"]',
+    badge: "持仓变化",
+    route: "/portfolio",
+    advanceOn: "delay",
+    delayMs: 3000,
+  },
+  // Step 9: Portfolio page — highlight transaction list
+  {
+    selector: '[data-demo-highlight="transaction-list"]',
+    badge: "闭环完成",
+    route: "/portfolio",
+    advanceOn: "delay",
+    delayMs: 3000,
+  },
 ];
```

### DemoGuide.tsx — 移动端适配

```diff
+  const [isMobile, setIsMobile] = useState(false);
+
+  useEffect(() => {
+    const check = () => setIsMobile(window.innerWidth < 768);
+    check();
+    window.addEventListener("resize", check);
+    return () => window.removeEventListener("resize", check);
+  }, []);
```

移动端渲染底部卡片式进度指示器：
```tsx
{isMobile ? (
  <motion.div className="fixed bottom-20 left-3 right-3 z-[10000]">
    {/* Mobile: bottom card style */}
  </motion.div>
) : (
  <motion.div className="fixed top-3 left-1/2 -translate-x-1/2 z-[10000]">
    {/* Desktop: top progress bar */}
  </motion.div>
)}
```

### PositionTable.tsx

```diff
   <motion.div
     ...
+    data-demo-highlight="portfolio-table"
     className="glass overflow-hidden rounded-xl"
   >
```

### TransactionList.tsx

```diff
   <motion.div
     ...
+    data-demo-highlight="transaction-list"
     className="glass overflow-hidden rounded-xl"
   >
```

### account-storage.ts — 新增 Demo Data 策略

```diff
+const DEMO_ORDERS_KEY = 'nexus-trade-demo-orders';
+const DEMO_POSITIONS_KEY = 'nexus-trade-demo-positions';
+
+export interface DemoIdentifiable {
+  source?: string;
+  [key: string]: unknown;
+}
+
+export function addDemoOrder<T extends { id: string }>(order: T): T & { source: string } {
+  const tagged = { ...order, source: 'demo' };
+  const existing = getJson<Array<{ id: string }>>(DEMO_ORDERS_KEY, []);
+  if (!existing.some((o) => o.id === order.id)) {
+    existing.push(tagged);
+    setJson(DEMO_ORDERS_KEY, existing);
+  }
+  return tagged;
+}
+
+// ... addDemoPosition, getDemoOrders, getDemoPositions, hasDemoData, resetDemoData
```

---

## 统计

| 指标 | Before | After | 变化 |
|------|--------|-------|------|
| Demo 步骤数 | 8 | 10 | +2 |
| 覆盖页面数 | 4 | 5 | +1 (持仓页) |
| data-demo-highlight 属性 | 7 | 9 | +2 |
| account-storage.ts 行数 | ~145 | ~219 | +74 |
| DemoGuide.tsx 行数 | ~280 | ~508 | +228 |
