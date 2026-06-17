# P5-A0 风险控制与兼容性计划

## 1. 订单逻辑保护

### 1.1 数据流方向

```
用户操作 ──► 订单提交 ──► 订单写入成功 ──► 触发持仓更新
                                          │
                                          ├─ 更新 positions
                                          ├─ 更新 account
                                          └─ 写入 transactions
```

### 1.2 保护规则

| 规则 | 说明 | 实现方式 |
|------|------|----------|
| 订单优先 | 订单写入 localStorage 成功后才触发持仓更新 | `try-catch` 包裹订单写入，成功后调用持仓更新函数 |
| 原子性 | 持仓更新失败不影响订单数据 | 持仓更新在独立 `try-catch` 中，失败仅 console.warn |
| 回滚 | 订单失败时不做任何写入 | 订单写入前检查资金/可卖数量，不足直接拒绝 |

### 1.3 伪代码

```typescript
async function submitOrder(orderData) {
  // 1. 预检查
  if (orderData.direction === 'buy') {
    const account = getAccount()
    if (account.availableCash < totalCost) {
      throw new Error('资金不足')  // 拒绝，不写入任何数据
    }
  } else {
    const positions = getPositions()
    const pos = positions.find(p => p.stockCode === orderData.stockCode)
    if (!pos || pos.availableQuantity < orderData.quantity) {
      throw new Error('可卖不足')  // 拒绝，不写入任何数据
    }
  }

  // 2. 写入订单（核心数据）
  try {
    const order = createOrder(orderData)
    saveOrder(order)  // 写入 nexus-trade-orders
  } catch (e) {
    throw new Error('订单写入失败')  // 订单失败，终止
  }

  // 3. 更新持仓（下游数据，失败不回滚订单）
  try {
    if (orderData.direction === 'buy') {
      executePositionUpdate_buy(orderData)
    } else {
      executePositionUpdate_sell(orderData)
    }
  } catch (e) {
    console.warn('持仓更新失败，订单已保存:', e)
    // 订单已保存，持仓更新失败仅告警
  }
}
```

## 2. localStorage 隔离

### 2.1 Key 清单

| Key | 数据类型 | 操作 | 说明 |
|-----|----------|------|------|
| `nexus-trade-orders` | `Order[]` | **只读/追加** | 现有，不修改结构 |
| `nexus-trade-account` | `AccountSummary` | 读写 | 新增 |
| `nexus-trade-positions` | `Position[]` | 读写 | 新增 |
| `nexus-trade-transactions` | `AccountTransaction[]` | 读写 | 新增 |
| `nexus-trade-history` | `PortfolioHistory[]` | 读写 | 新增 |

### 2.2 隔离原则

| 原则 | 说明 |
|------|------|
| 不改现有 key 结构 | `nexus-trade-orders` 的字段不变 |
| 不改现有写入逻辑 | 订单创建函数不修改 |
| 新增独立 key | 4 个新 key，互不干扰 |
| 命名前缀统一 | 全部使用 `nexus-trade-` 前缀 |

## 3. 旧订单降级处理

### 3.1 场景

用户 localStorage 中可能已有旧格式订单（无账户相关字段）。

### 3.2 降级策略

| 场景 | 处理方式 |
|------|----------|
| 旧订单存在，无 account 数据 | 初始化默认账户（¥1,000,000） |
| 旧订单存在，有 account 数据 | 正常读取 account |
| 旧订单格式不兼容 | 忽略旧订单，不影响当前账户 |
| positions 中引用已删除的股票 | 跳过，不报错 |

### 3.3 初始化逻辑

```typescript
function initializeAccount() {
  // 检查是否已有账户数据
  const stored = localStorage.getItem('nexus-trade-account')
  if (stored) {
    return JSON.parse(stored)  // 已有数据，直接返回
  }

  // 无账户数据，初始化默认值
  const defaultAccount: AccountSummary = {
    totalAssets: 1000000,
    availableCash: 1000000,
    marketValue: 0,
    totalPnL: 0,
    todayPnL: 0,
    riskLevel: 'low',
    positionRatio: 0,
    updatedAt: new Date().toISOString()
  }

  localStorage.setItem('nexus-trade-account', JSON.stringify(defaultAccount))
  return defaultAccount
}
```

## 4. Reset 机制

### 4.1 Reset 按钮位置

- 桌面端：设置页面或账户概览卡片右上角
- 移动端：设置页面

### 4.2 Reset 范围

| Key | Reset 后 | 说明 |
|-----|----------|------|
| `nexus-trade-orders` | `[]` | 清空所有订单 |
| `nexus-trade-account` | 默认值 | 恢复初始账户 |
| `nexus-trade-positions` | `[]` | 清空所有持仓 |
| `nexus-trade-transactions` | `[]` | 清空所有流水 |
| `nexus-trade-history` | 默认值 | 恢复初始历史 |

### 4.3 Reset 伪代码

```typescript
function resetAllData() {
  const KEYS = [
    'nexus-trade-orders',
    'nexus-trade-account',
    'nexus-trade-positions',
    'nexus-trade-transactions',
    'nexus-trade-history'
  ]

  KEYS.forEach(key => localStorage.removeItem(key))

  // 重新初始化
  initializeAccount()
  initializeHistory()

  // 刷新页面
  window.location.reload()
}
```

### 4.4 Reset 确认弹窗

```
┌─────────────────────────────────────┐
│ ⚠️ 确认重置                         │
│                                     │
│ 此操作将清除所有模拟交易数据：       │
│ • 所有订单记录                       │
│ • 账户资产数据                       │
│ • 持仓数据                           │
│ • 交易流水                           │
│ • 资产历史曲线                       │
│                                     │
│ 重置后资产将恢复为 ¥1,000,000       │
│                                     │
│        [取消]    [确认重置]          │
└─────────────────────────────────────┘
```

## 5. Mock 股价隔离

### 5.1 问题

Mock 股票数据（`src/mock/stocks.ts`）中的价格是静态的，持仓中的 `currentPrice` 需要与之同步。

### 5.2 方案：快照更新

| 策略 | 说明 |
|------|------|
| 不做定时器 | 避免频繁更新，节省资源 |
| 按需快照 | 访问持仓页时，从 Mock 数据快照更新 `currentPrice` |
| 更新时机 | `/portfolio` 页面 `useEffect` 中触发 |

### 5.3 快照更新伪代码

```typescript
// 在 /portfolio 页面加载时调用
function snapshotCurrentPrices(positions: Position[], stocks: MockStock[]): Position[] {
  return positions.map(pos => {
    const stock = stocks.find(s => s.code === pos.stockCode)
    if (stock) {
      return {
        ...pos,
        currentPrice: stock.currentPrice,
        marketValue: stock.currentPrice * pos.quantity,
        unrealizedPnL: (stock.currentPrice - pos.avgCost) * pos.quantity,
        unrealizedPnLPercent: pos.avgCost === 0
          ? 0
          : ((stock.currentPrice - pos.avgCost) / pos.avgCost) * 100,
        todayPnL: (stock.currentPrice - pos.openPrice) * pos.quantity
      }
    }
    return pos  // 找不到对应股票，保持原值
  })
}
```

### 5.4 注意事项

| 项 | 说明 |
|----|------|
| 不自动更新 | 离开持仓页后不后台更新 |
| 手动刷新 | 用户可通过浏览器刷新触发更新 |
| 首页概览 | 首页资产概览读取的是 `account` 中的值，不会实时更新 |
| 一致性 | 持仓页显示的是快照时间点的数据，非实时 |

## 6. 错误处理

| 错误场景 | 处理方式 | 用户提示 |
|----------|----------|----------|
| localStorage 满 | catch 错误，提示用户 | "存储空间不足，请清理浏览器数据" |
| JSON 解析失败 | 返回默认值 | 静默降级 |
| 资金不足 | 拒绝交易 | "可用资金不足" |
| 可卖不足 | 拒绝交易 | "可卖数量不足" |
| 股票不存在 | 跳过该持仓 | 静默忽略 |
