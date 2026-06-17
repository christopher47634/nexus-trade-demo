export interface MockOrder {
  id: string;
  stockCode: string;
  stockName: string;
  side: "buy" | "sell";
  price: number;
  quantity: number;
  totalAmount: number;
  status: "submitted" | "matching" | "filled" | "cancelled";
  createdAt: number; // unix timestamp ms
  filledAt?: number;
}

const STORAGE_KEY = "nexus-trade-orders";

/** Load orders from localStorage (falls back to in-memory during SSR) */
function loadOrders(): MockOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MockOrder[];
  } catch {
    return [];
  }
}

/** Save orders to localStorage (no-op during SSR) */
function saveOrders(list: MockOrder[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

// In-memory store: hydrated from localStorage on first client-side access
let orders: MockOrder[] = [];
let initialised = false;

function ensureInit(): void {
  if (!initialised && typeof window !== "undefined") {
    orders = loadOrders();
    initialised = true;
  }
}

export function createOrder(params: {
  stockCode: string;
  stockName: string;
  side: "buy" | "sell";
  price: number;
  quantity: number;
}): MockOrder {
  ensureInit();
  const order: MockOrder = {
    id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    stockCode: params.stockCode,
    stockName: params.stockName,
    side: params.side,
    price: params.price,
    quantity: params.quantity,
    totalAmount: parseFloat((params.price * params.quantity).toFixed(2)),
    status: "submitted",
    createdAt: Date.now(),
  };
  orders.unshift(order);
  // Keep last 50 orders
  if (orders.length > 50) orders = orders.slice(0, 50);
  saveOrders(orders);
  return order;
}

export function updateOrderStatus(
  orderId: string,
  status: MockOrder["status"]
): MockOrder | undefined {
  ensureInit();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    if (status === "filled") {
      order.filledAt = Date.now();
    }
    saveOrders(orders);
  }
  return order;
}

export function getOrders(): MockOrder[] {
  ensureInit();
  return [...orders];
}

export function getOrdersByStock(stockCode: string): MockOrder[] {
  ensureInit();
  return orders.filter((o) => o.stockCode === stockCode);
}
