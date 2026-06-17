# P5-A0 买入/卖出联动规则

## 1. 买入流程（6 步）

```
用户提交买入 ──► Step 1~6 ──► 更新 localStorage
```

| 步骤 | 操作 | 伪代码 | 说明 |
|------|------|--------|------|
| 1 | 扣除可用资金 | `account.availableCash -= (price × quantity + commission + tax)` | 资金不足时拒绝 |
| 2 | 检查同股持仓 | `positions.find(p => p.stockCode === code)` | 判断是加仓还是新建 |
| 3a | 加仓：重算成本 | `avgCost = (旧avgCost × 旧qty + price × newQty) / (旧qty + newQty)` | 加权平均 |
| 3b | 加仓：更新数量 | `position.quantity += quantity` | — |
| 3c | 加仓：可卖数量 | `position.availableQuantity = position.quantity` | **Demo 简化：即刻可卖** |
| 4a | 新建持仓 | 创建 Position 对象 | — |
| 4b | 新建：可卖数量 | `availableQuantity = quantity` | **Demo 简化：即刻可卖** |
| 4c | 新建：开盘价 | `openPrice = price` | 买入价作为开盘价 |
| 5 | 生成订单 | 复用现有 Order 结构 | 写入 `nexus-trade-orders` |
| 6 | 生成流水 | 创建 AccountTransaction（type='buy'） | 写入 `nexus-trade-transactions` |

### 1.1 买入伪代码

```typescript
function executeBuy(stockCode, stockName, sectorId, price, quantity, orderType) {
  const commission = calculateCommission(price, quantity)
  const tax = calculateTax(price, quantity, 'buy')
  const totalCost = price * quantity + commission + tax

  // Step 1: 检查资金
  const account = getAccount()
  if (account.availableCash < totalCost) {
    throw new Error('可用资金不足')
  }
  account.availableCash -= totalCost

  // Step 2: 检查同股持仓
  const positions = getPositions()
  const existing = positions.find(p => p.stockCode === stockCode)

  if (existing) {
    // Step 3: 加仓
    const oldTotal = existing.avgCost * existing.quantity
    const newTotal = price * quantity
    existing.avgCost = (oldTotal + newTotal) / (existing.quantity + quantity)
    existing.quantity += quantity
    existing.availableQuantity = existing.quantity  // Demo 简化：即刻可卖
  } else {
    // Step 4: 新建持仓
    positions.push({
      stockCode,
      stockName,
      sectorId,
      quantity,
      availableQuantity: quantity,  // Demo 简化：即刻可卖
      avgCost: price,
      openPrice: price,             // 买入价作为开盘价
      currentPrice: price,
      marketValue: price * quantity,
      unrealizedPnL: 0,
      unrealizedPnLPercent: 0,
      todayPnL: 0,
      positionRatio: 0,
      riskLevel: 'low'
    })
  }

  // Step 5: 生成订单（复用现有结构）
  const order = createOrder(stockCode, stockName, 'buy', price, quantity, orderType, commission, tax)

  // Step 6: 生成流水
  createTransaction({
    id: generateId(),
    type: 'buy',
    stockCode,
    amount: -totalCost,  // 买入为负
    createdAt: new Date().toISOString(),
    relatedOrderId: order.id
  })

  // 更新账户汇总
  updateAccountSummary(account, positions)
  saveAccount(account)
  savePositions(positions)
}
```

## 2. 卖出流程（7 步）

```
用户提交卖出 ──► Step 1~7 ──► 更新 localStorage
```

| 步骤 | 操作 | 伪代码 | 说明 |
|------|------|--------|------|
| 1 | 检查可卖数量 | `position.availableQuantity >= sellQuantity` | 不足时拒绝 |
| 2 | 减少持仓 | `position.quantity -= sellQuantity` | — |
| 3 | 增加可用资金 | `account.availableCash += (price × quantity - commission - tax)` | — |
| 4 | 计算已实现盈亏 | `realizedPnL = (price - avgCost) × sellQuantity` | — |
| 5 | 生成订单 | 复用现有 Order 结构 | 写入 `nexus-trade-orders` |
| 6 | 生成流水 | 创建 AccountTransaction（type='sell'，含 realizedPnL） | 写入 `nexus-trade-transactions` |
| 7 | 清理空持仓 | `if (quantity === 0) positions.splice(index, 1)` | 全部卖出时删除 |

### 2.1 卖出伪代码

```typescript
function executeSell(stockCode, price, quantity, orderType) {
  const positions = getPositions()
  const position = positions.find(p => p.stockCode === stockCode)

  // Step 1: 检查可卖数量
  if (!position || position.availableQuantity < quantity) {
    throw new Error('可卖数量不足')
  }

  const commission = calculateCommission(price, quantity)
  const tax = calculateTax(price, quantity, 'sell')
  const totalGain = price * quantity - commission - tax

  // Step 2: 减少持仓
  position.quantity -= quantity

  // Step 3: 增加可用资金
  const account = getAccount()
  account.availableCash += totalGain

  // Step 4: 计算已实现盈亏
  const realizedPnL = (price - position.avgCost) * quantity

  // Step 5: 生成订单（复用现有结构）
  const order = createOrder(stockCode, position.stockName, 'sell', price, quantity, orderType, commission, tax)

  // Step 6: 生成流水
  createTransaction({
    id: generateId(),
    type: 'sell',
    stockCode,
    amount: totalGain,  // 卖出为正
    realizedPnL,        // 已实现盈亏
    createdAt: new Date().toISOString(),
    relatedOrderId: order.id
  })

  // Step 7: 清理空持仓
  if (position.quantity === 0) {
    const index = positions.indexOf(position)
    positions.splice(index, 1)
  }

  // 更新账户汇总
  updateAccountSummary(account, positions)
  saveAccount(account)
  savePositions(positions)
}
```

## 3. T+1 说明

> **Demo 简化处理**
> 
> 真实 A 股实行 T+1 交易制度：当日买入的股票，次一交易日才能卖出。
> 
> 本 Demo 为简化演示，**不做 T+1 限制**，买入即刻可卖。
> 
> 实现方式：`availableQuantity = quantity`（始终等于持仓数量）。
> 
> 如需后续支持 T+1，需在买入时将 `availableQuantity` 设为 0，
> 并在每日开盘时批量更新 `availableQuantity = quantity`。

## 4. 除零保护

| 场景 | 保护逻辑 | 返回值 |
|------|----------|--------|
| `avgCost = 0` 时计算 `unrealizedPnLPercent` | `if (avgCost === 0) return 0` | `0` |
| `totalAssets = 0` 时计算 `positionRatio` | `if (totalAssets === 0) return 0` | `0` |
| `quantity = 0` 时计算 `avgCost`（加仓） | 不会出现，加仓时 quantity > 0 | — |

```typescript
function safePercent(currentPrice: number, avgCost: number): number {
  if (avgCost === 0) return 0  // 除零保护
  return ((currentPrice - avgCost) / avgCost) * 100
}

function safePositionRatio(marketValue: number, totalAssets: number): number {
  if (totalAssets === 0) return 0  // 除零保护
  return marketValue / totalAssets
}
```

## 5. 联动时序图

```
用户点击"买入"
       │
       ▼
┌─────────────────┐
│ 交易面板提交     │
│ (现有逻辑)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     失败     ┌──────────────┐
│ 检查资金/可卖   │──────────────►│ 提示错误      │
└────────┬────────┘              └──────────────┘
         │ 成功
         ▼
┌─────────────────┐
│ 写入 orders      │ ◄── 现有逻辑，不修改
│ (localStorage)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 更新 positions   │ ◄── 新增逻辑
│ (localStorage)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 更新 account     │ ◄── 新增逻辑
│ (localStorage)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 写入 transactions│ ◄── 新增逻辑
│ (localStorage)   │
└─────────────────┘
```
