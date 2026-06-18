import type { AccountSummary, Position, AccountTransaction, PortfolioHistory } from '@/types/account';
import { defaultAccount, getAccountSummary } from '@/mock/account';
import { mockPositions } from '@/mock/positions';
import { mockTransactions } from '@/mock/accountTransactions';
import { mockPortfolioHistory } from '@/mock/portfolioHistory';

// ─── Storage Keys ──────────────────────────────────────────────────
const STORAGE_KEY = 'nexus-trade-account';
const POSITIONS_KEY = 'nexus-trade-positions';
const TRANSACTIONS_KEY = 'nexus-trade-transactions';
const HISTORY_KEY = 'nexus-trade-history';

// ─── SSR-safe helpers ──────────────────────────────────────────────
function isClient(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getJson<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setJson<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

// ─── Account ───────────────────────────────────────────────────────
export function getAccount(): AccountSummary {
  return getJson<AccountSummary>(STORAGE_KEY, defaultAccount);
}

export function saveAccount(account: AccountSummary): void {
  setJson(STORAGE_KEY, account);
}

// ─── Positions ─────────────────────────────────────────────────────
export function getPositions(): Position[] {
  return getJson<Position[]>(POSITIONS_KEY, []);
}

export function savePositions(positions: Position[]): void {
  setJson(POSITIONS_KEY, positions);
}

// ─── Transactions ──────────────────────────────────────────────────
export function getTransactions(): AccountTransaction[] {
  return getJson<AccountTransaction[]>(TRANSACTIONS_KEY, []);
}

export function saveTransactions(transactions: AccountTransaction[]): void {
  setJson(TRANSACTIONS_KEY, transactions);
}

// ─── Portfolio History ─────────────────────────────────────────────
export function getPortfolioHistory(): PortfolioHistory[] {
  return getJson<PortfolioHistory[]>(HISTORY_KEY, []);
}

export function savePortfolioHistory(history: PortfolioHistory[]): void {
  setJson(HISTORY_KEY, history);
}

// ─── Initialize / Reset ────────────────────────────────────────────

/**
 * Initialize account data in localStorage if empty.
 * Safe to call multiple times — only writes when keys are missing.
 */
export function initializeAccount(): void {
  if (!isClient()) return;

  // 先检查是否已有账户数据（用户做过交易）
  const existingAccount = window.localStorage.getItem(STORAGE_KEY);
  if (existingAccount) {
    try {
      const parsed = JSON.parse(existingAccount) as AccountSummary;
      // 如果有有效的 availableCash，不要重置
      if (typeof parsed.availableCash === 'number' && parsed.availableCash > 0) {
        // 只更新 positions 相关的字段，保留 availableCash
        const positions = getPositions();
        const marketValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
        const totalPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL, 0);
        const todayPnL = positions.reduce((sum, p) => sum + p.todayPnL, 0);
        const totalAssets = parsed.availableCash + marketValue;
        const positionRatio = totalAssets > 0 ? marketValue / totalAssets : 0;

        const highRiskValue = positions.filter(p => p.riskLevel === 'high').reduce((sum, p) => sum + p.marketValue, 0);
        const highRiskRatio = totalAssets > 0 ? highRiskValue / totalAssets : 0;
        const riskLevel = highRiskRatio > 0.3 ? 'high' : positionRatio > 0.6 ? 'medium' : 'low';

        saveAccount({
          ...parsed,
          totalAssets,
          marketValue,
          totalPnL,
          todayPnL,
          positionRatio,
          riskLevel,
          updatedAt: new Date().toISOString()
        });
        return;
      }
    } catch { /* fall through to reinitialize */ }
  }

  // 首次初始化：写入 positions 和 account
  const existingPositions = window.localStorage.getItem(POSITIONS_KEY);
  if (existingPositions === null) {
    savePositions(mockPositions);
  }

  const positions = getPositions();
  const account = getAccountSummary(positions);
  saveAccount(account);

  // Transactions & history (only if missing)
  if (window.localStorage.getItem(TRANSACTIONS_KEY) === null) {
    saveTransactions(mockTransactions);
  }
  if (window.localStorage.getItem(HISTORY_KEY) === null) {
    savePortfolioHistory(mockPortfolioHistory);
  }
}

/**
 * Reset all account data to default mock state.
 * Useful for "reset demo" functionality.
 */
export function resetAccount(): void {
  saveAccount(defaultAccount);
  savePositions(mockPositions);
  saveTransactions(mockTransactions);
  savePortfolioHistory(mockPortfolioHistory);
}
// ─── Demo Data Strategy ───────────────────────────────────────────

const DEMO_ORDERS_KEY = 'nexus-trade-demo-orders';
const DEMO_POSITIONS_KEY = 'nexus-trade-demo-positions';

export interface DemoIdentifiable {
  source?: string;
  [key: string]: unknown;
}

/**
 * Add a demo order with source: "demo" marker.
 * Deduplicates by order ID to prevent stacking on repeat runs.
 */
export function addDemoOrder<T extends { id: string }>(order: T): T & { source: string } {
  const tagged = { ...order, source: 'demo' };
  const existing = getJson<Array<{ id: string }>>(DEMO_ORDERS_KEY, []);
  if (!existing.some((o) => o.id === order.id)) {
    existing.push(tagged);
    setJson(DEMO_ORDERS_KEY, existing);
  }
  return tagged;
}

/**
 * Add a demo position with source: "demo" marker.
 * Deduplicates by stockCode to prevent stacking on repeat runs.
 */
export function addDemoPosition<T extends { stockCode: string }>(position: T): T & { source: string } {
  const tagged = { ...position, source: 'demo' };
  const existing = getJson<Array<{ stockCode: string }>>(DEMO_POSITIONS_KEY, []);
  if (!existing.some((p) => p.stockCode === position.stockCode)) {
    existing.push(tagged);
    setJson(DEMO_POSITIONS_KEY, existing);
  }
  return tagged;
}

/**
 * Get all demo orders.
 */
export function getDemoOrders<T>(): T[] {
  return getJson<T[]>(DEMO_ORDERS_KEY, []);
}

/**
 * Get all demo positions.
 */
export function getDemoPositions<T>(): T[] {
  return getJson<T[]>(DEMO_POSITIONS_KEY, []);
}

/**
 * Check if demo data exists.
 */
export function hasDemoData(): boolean {
  if (!isClient()) return false;
  return (
    window.localStorage.getItem(DEMO_ORDERS_KEY) !== null ||
    window.localStorage.getItem(DEMO_POSITIONS_KEY) !== null
  );
}

/**
 * Reset only demo data — clears source=demo items, preserves user's manual data.
 */
export function resetDemoData(): void {
  if (!isClient()) return;
  window.localStorage.removeItem(DEMO_ORDERS_KEY);
  window.localStorage.removeItem(DEMO_POSITIONS_KEY);
  // Also clean demo mode flags
  window.localStorage.removeItem('demoMode');
  window.localStorage.removeItem('demoModeStep');
}
