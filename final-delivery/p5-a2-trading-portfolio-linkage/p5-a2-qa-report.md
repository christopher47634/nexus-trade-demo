## P5-A2 QA Report

Reviewed: 2026-06-18
Scope: Trading-Portfolio Linkage (trade-engine.ts + TradePanel.tsx)

### P1 Blockers

1. **Cash desync on page refresh** — `initializeAccount()` in account-storage.ts (line 91) always recalculates `availableCash = INITIAL_CASH - costBasis` from positions. This is correct for buy-only scenarios but breaks after sells:
   - After selling at a profit: `getAccountSummary` undercounts cash (doesn't include realized PnL proceeds).
   - After selling at a loss: `getAccountSummary` overcounts cash (doesn't deduct the loss).
   - Since `initializeAccount()` runs on home page and portfolio page load, any page refresh after a sell will overwrite the correct `availableCash` with an incorrect value.
   - The trade-engine correctly overrides `availableCash` after `getAccountSummary`, but `initializeAccount` does NOT do this override.
   - **Recommended fix** in account-storage.ts `initializeAccount()`:
     ```ts
     const positions = getPositions();
     const account = getAccountSummary(positions);
     const existing = getJson<AccountSummary>(STORAGE_KEY, defaultAccount);
     account.availableCash = existing.availableCash; // preserve trade-engine tracked cash
     saveAccount(account);
     ```
     This preserves the trade-engine's `availableCash` while still recalculating `totalAssets`, `marketValue`, etc. from current positions.

### P2 Should Fix

1. **Insufficient-funds warning uses totalAmount instead of totalCost** (TradePanel.tsx line 351):
   ```tsx
   {side === "buy" && priceNum > 0 && totalAmount > availableCash && (...)}
   ```
   The actual buy cost is `totalAmount + commission`. If `totalAmount < availableCash < totalAmount + commission`, the warning won't show but the trade will fail. Should compare `totalAmount + commission` against `availableCash`.

2. **Error display uses browser `alert()`** (TradePanel.tsx line 92):
   `alert(result.error)` — should use an in-UI error state for better UX consistency.

3. **Duplicated commission/tax formulas** — `calcCommission` and `calcStampTax` exist in both trade-engine.ts and TradePanel.tsx with identical logic. Should extract to a shared utility to avoid drift.

### P3 Nice to Have

1. **No T+1 restriction** — `executeBuy` sets `availableQuantity = newQuantity` immediately, allowing same-day selling. Real Chinese A-shares enforce T+1. Acceptable for demo, but could add a comment noting this is simplified.

2. **`getMaxBuyQuantity` slightly conservative** — Uses per-lot commission (`max(5, price*100*0.00025)`) which overestimates cost for large orders where the minimum commission wouldn't apply per-lot. Difference is negligible for typical order sizes.

3. **Missing JSDoc on exported functions** — `executeBuy`, `executeSell`, `getMaxBuyQuantity`, `getAvailableSellQuantity`, `resetDemoAccount` lack documentation comments.

### Build/Lint
- Build: PASS
- Lint: PASS

### localStorage Key Check
- No conflicts. Trade-engine uses account-storage functions for account/positions/transactions and orders.ts functions for orders.
- Keys used: nexus-trade-account, nexus-trade-positions, nexus-trade-transactions, nexus-trade-history, nexus-trade-orders — all distinct, no collisions.
- `resetDemoAccount` correctly clears all 5 keys.

### 公式验证
- avgCost 公式: 正确 — `(oldCost + price*qty + commission) / newQty` correctly includes commission in cost basis
- realizedPnL 公式: 正确 — `(price - avgCost) * qty - commission - stampTax` accounts for fees
- commission 公式: 正确 — `max(5, total * 0.00025)` matches orders.ts
- stampTax 公式: 正确 — `total * 0.0005` (sell-only) matches orders.ts
- 资金检查: 正确 — `availableCash < totalCost` where `totalCost = amount + commission`
- 持仓更新: 正确 — 加仓重算avgCost、减仓保留avgCost、清仓splice移除，均正确

### 最终判定
- FAIL — 1 P1 blocker (cash desync on page refresh after sells)
