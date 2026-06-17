export interface KlineBar {
  time: number; // unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

function generateKlineData(
  basePrice: number,
  days: number,
  volatility: number = 0.02
): KlineBar[] {
  const data: KlineBar[] = [];
  let price = basePrice;
  const now = Math.floor(Date.now() / 1000);
  const daySeconds = 86400;

  for (let i = days; i >= 0; i--) {
    const time = now - i * daySeconds;
    const change = (Math.random() - 0.48) * volatility * price;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * price * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * price * 0.5;
    const volume = Math.floor(Math.random() * 5000000 + 1000000);

    data.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    price = close;
  }

  return data;
}

// Pre-generated kline data for key stocks
export const klineData: Record<string, KlineBar[]> = {
  "600519": generateKlineData(1650, 120, 0.015),  // 贵州茅台
  "300750": generateKlineData(180, 120, 0.025),   // 宁德时代
  "688256": generateKlineData(230, 120, 0.035),   // 寒武纪
  "000977": generateKlineData(30, 120, 0.03),     // 浪潮信息
  "300308": generateKlineData(110, 120, 0.025),   // 中际旭创
};

// Generate kline for a stock code (fallback to random if not pre-generated)
export function getKlineData(code: string, days: number = 120): KlineBar[] {
  if (klineData[code]) return klineData[code];
  return generateKlineData(100, days, 0.025);
}

// Sector trend data (area chart, simple {time, value} format)
export interface TrendPoint {
  time: number;
  value: number;
}

const sectorTrendCache: Record<string, TrendPoint[]> = {};

export function getSectorTrend(sectorId: string, days: number = 60): TrendPoint[] {
  if (sectorTrendCache[sectorId]) return sectorTrendCache[sectorId];
  const data: TrendPoint[] = [];
  let value = 1000;
  const now = Math.floor(Date.now() / 1000);
  const daySeconds = 86400;
  for (let i = days; i >= 0; i--) {
    const time = now - i * daySeconds;
    value += (Math.random() - 0.47) * 20;
    value = Math.max(800, Math.min(1200, value));
    data.push({ time, value: parseFloat(value.toFixed(2)) });
  }
  sectorTrendCache[sectorId] = data;
  return data;
}
