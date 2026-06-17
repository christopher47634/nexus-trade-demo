# P5-A0 Demo Mode 升级计划

## 1. 概述

将现有 Demo Mode 从 6 步扩展为 8 步，新增持仓页引导和首页资产变化对比。

## 2. 8 步引导流程

### Step 1：首页 — 高亮板块卡片

| 项目 | 内容 |
|------|------|
| 页面 | `/`（首页） |
| 高亮元素 | 第一个板块卡片（如"白酒"） |
| 遮罩 | 全屏遮罩，仅高亮区域可交互 |
| 提示文案 | "欢迎体验 Nexus Trade！点击板块卡片查看该板块的成分股。" |
| 提示位置 | 高亮元素右侧/下方 |
| 期望操作 | 用户点击板块卡片 |
| 完成条件 | 路由跳转到 `/sector/[sectorId]` |
| 气泡箭头 | 指向板块卡片 |

### Step 2：板块详情 — 高亮成分股

| 项目 | 内容 |
|------|------|
| 页面 | `/sector/[sectorId]` |
| 高亮元素 | 第一只成分股行 |
| 提示文案 | "这是该板块的成分股列表，点击任意股票查看详情。" |
| 期望操作 | 用户点击股票行 |
| 完成条件 | 路由跳转到 `/stock/[stockCode]` |

### Step 3：个股详情 — 高亮买入按钮

| 项目 | 内容 |
|------|------|
| 页面 | `/stock/[stockCode]` |
| 高亮元素 | "买入"按钮 |
| 提示文案 | "查看完股票详情后，点击买入按钮开始模拟交易。" |
| 期望操作 | 用户点击"买入"按钮 |
| 完成条件 | 交易面板打开（弹窗或侧边栏） |

### Step 4：交易面板 — 高亮价格+数量输入

| 项目 | 内容 |
|------|------|
| 页面 | 交易面板（弹窗/侧边栏） |
| 高亮元素 | 价格输入框 + 数量输入框 |
| 提示文案 | "输入买入价格和数量。价格已自动填入当前价，数量默认 100 股。" |
| 期望操作 | 用户确认价格和数量（可修改或直接使用默认值） |
| 完成条件 | 用户点击"下一步"或"确认" |

### Step 5：确认委托 — 高亮确认按钮

| 项目 | 内容 |
|------|------|
| 页面 | 委托确认弹窗 |
| 高亮元素 | "确认买入"按钮 |
| 提示文案 | "确认委托信息无误后，点击确认提交订单。" |
| 期望操作 | 用户点击"确认买入" |
| 完成条件 | 订单提交成功，显示成功提示 |

### Step 6：订单页 — 高亮新订单

| 项目 | 内容 |
|------|------|
| 页面 | `/orders`（自动跳转） |
| 高亮元素 | 最新的订单行（第一条） |
| 提示文案 | "订单已提交！你可以在订单页查看所有交易记录。接下来去看看你的持仓吧。" |
| 期望操作 | 用户查看订单后点击"下一步" |
| 完成条件 | 用户点击"下一步" |

### Step 7：持仓页 — 高亮持仓列表 ⭐ 新增

| 项目 | 内容 |
|------|------|
| 页面 | `/portfolio`（自动跳转） |
| 高亮元素 | 持仓列表（PositionTable 或第一个 PositionCard） |
| 提示文案 | "这是你的持仓页面。可以看到刚才买入的股票、成本、市值和盈亏情况。" |
| 期望操作 | 用户查看持仓后点击"下一步" |
| 完成条件 | 用户点击"下一步" |

### Step 8：首页资产变化 — 对比买入前后 ⭐ 新增

| 项目 | 内容 |
|------|------|
| 页面 | `/`（自动跳转回首页） |
| 高亮元素 | 资产概览区域（总资产、可用资金、持仓市值） |
| 提示文案 | "回到首页，可以看到资产概览已经更新。可用资金减少了，持仓市值增加了。恭喜完成首次模拟交易！" |
| 期望操作 | 用户查看资产变化 |
| 完成条件 | 用户点击"完成"，Demo Mode 结束 |

## 3. Demo Mode 状态管理

```typescript
interface DemoState {
  currentStep: number        // 当前步骤 1-8
  isActive: boolean          // Demo 是否激活
  highlightSelector: string  // CSS 选择器，高亮目标元素
  tipText: string            // 提示文案
  expectedAction: 'click' | 'input' | 'wait'
  completionCondition: string // 完成条件描述
}

const DEMO_STEPS: DemoState[] = [
  {
    currentStep: 1,
    isActive: true,
    highlightSelector: '[data-sector-card="first"]',
    tipText: '欢迎体验 Nexus Trade！点击板块卡片查看该板块的成分股。',
    expectedAction: 'click',
    completionCondition: 'route:/sector/*'
  },
  {
    currentStep: 2,
    isActive: true,
    highlightSelector: '[data-stock-row="first"]',
    tipText: '这是该板块的成分股列表，点击任意股票查看详情。',
    expectedAction: 'click',
    completionCondition: 'route:/stock/*'
  },
  {
    currentStep: 3,
    isActive: true,
    highlightSelector: '[data-action="buy"]',
    tipText: '查看完股票详情后，点击买入按钮开始模拟交易。',
    expectedAction: 'click',
    completionCondition: 'panel:trade-open'
  },
  {
    currentStep: 4,
    isActive: true,
    highlightSelector: '[data-trade-input="price"], [data-trade-input="quantity"]',
    tipText: '输入买入价格和数量。价格已自动填入当前价，数量默认 100 股。',
    expectedAction: 'input',
    completionCondition: 'button:next-click'
  },
  {
    currentStep: 5,
    isActive: true,
    highlightSelector: '[data-action="confirm-buy"]',
    tipText: '确认委托信息无误后，点击确认提交订单。',
    expectedAction: 'click',
    completionCondition: 'order:submitted'
  },
  {
    currentStep: 6,
    isActive: true,
    highlightSelector: '[data-order-row="first"]',
    tipText: '订单已提交！你可以在订单页查看所有交易记录。接下来去看看你的持仓吧。',
    expectedAction: 'click',
    completionCondition: 'button:next-click'
  },
  {
    currentStep: 7,
    isActive: true,
    highlightSelector: '[data-position-table], [data-position-card="first"]',
    tipText: '这是你的持仓页面。可以看到刚才买入的股票、成本、市值和盈亏情况。',
    expectedAction: 'click',
    completionCondition: 'button:next-click'
  },
  {
    currentStep: 8,
    isActive: true,
    highlightSelector: '[data-account-overview]',
    tipText: '回到首页，可以看到资产概览已经更新。可用资金减少了，持仓市值增加了。恭喜完成首次模拟交易！',
    expectedAction: 'click',
    completionCondition: 'button:finish-click'
  }
]
```

## 4. 高亮实现方案

```typescript
// DemoOverlay 组件
function DemoOverlay({ step }: { step: DemoState }) {
  const target = document.querySelector(step.highlightSelector)
  if (!target) return null

  const rect = target.getBoundingClientRect()

  return (
    <div className="demo-overlay">
      {/* 全屏半透明遮罩 */}
      <div className="demo-mask" />
      
      {/* 高亮区域（透明洞） */}
      <div
        className="demo-highlight"
        style={{
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16
        }}
      />
      
      {/* 提示气泡 */}
      <div className="demo-tip" style={{ top: rect.bottom + 16, left: rect.left }}>
        <p>{step.tipText}</p>
        <div className="demo-step-indicator">
          {step.currentStep} / {DEMO_STEPS.length}
        </div>
      </div>
    </div>
  )
}
```

## 5. 数据属性标记

需要在现有组件中添加 `data-*` 属性：

| 组件 | 属性 | 值 |
|------|------|-----|
| 板块卡片（第一个） | `data-sector-card` | `"first"` |
| 成分股行（第一个） | `data-stock-row` | `"first"` |
| 买入按钮 | `data-action` | `"buy"` |
| 价格输入框 | `data-trade-input` | `"price"` |
| 数量输入框 | `data-trade-input` | `"quantity"` |
| 确认买入按钮 | `data-action` | `"confirm-buy"` |
| 订单行（第一个） | `data-order-row` | `"first"` |
| 持仓表格 | `data-position-table` | `""` |
| 持仓卡片（第一个） | `data-position-card` | `"first"` |
| 账户概览 | `data-account-overview` | `""` |
