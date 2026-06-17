import type { AccountSummary, Position, AccountTransaction, PortfolioHistory } from '@/types/account';
import { defaultAccount } from '@/mock/account';
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

  // Only initialize if account key doesn't exist yet
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing === null) {
    saveAccount(defaultAccount);
  }

  const existingPositions = window.localStorage.getItem(POSITIONS_KEY);
  if (existingPositions === null) {
    savePositions(mockPositions);
  }

  const existingTransactions = window.localStorage.getItem(TRANSACTIONS_KEY);
  if (existingTransactions === null) {
    saveTransactions(mockTransactions);
  }

  const existingHistory = window.localStorage.getItem(HISTORY_KEY);
  if (existingHistory === null) {
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
