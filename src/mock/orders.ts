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

// In-memory order store (resets on page reload — this is a demo)
let orders: MockOrder[] = [];

export function createOrder(params: {
  stockCode: string;
  stockName: string;
  side: "buy" | "sell";
  price: number;
  quantity: number;
}): MockOrder {
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
  return order;
}

export function updateOrderStatus(
  orderId: string,
  status: MockOrder["status"]
): MockOrder | undefined {
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    if (status === "filled") {
      order.filledAt = Date.now();
    }
  }
  return order;
}

export function getOrders(): MockOrder[] {
  return [...orders];
}

export function getOrdersByStock(stockCode: string): MockOrder[] {
  return orders.filter((o) => o.stockCode === stockCode);
}
