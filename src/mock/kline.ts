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

// Pre-generated kline data for all sector stocks
export const klineData: Record<string, KlineBar[]> = {
  // 光通信
  "300308": generateKlineData(110, 120, 0.025),   // 中际旭创
  "300502": generateKlineData(75, 120, 0.028),    // 新易盛
  "300394": generateKlineData(140, 120, 0.022),   // 天孚通信
  "600487": generateKlineData(17, 120, 0.02),     // 亨通光电
  "300548": generateKlineData(38, 120, 0.035),    // 博创科技

  // 算力
  "000977": generateKlineData(30, 120, 0.03),     // 浪潮信息
  "603019": generateKlineData(48, 120, 0.025),    // 中科曙光
  "000938": generateKlineData(23, 120, 0.02),     // 紫光股份
  "002415": generateKlineData(33, 120, 0.015),    // 海康威视
  "688256": generateKlineData(230, 120, 0.035),   // 寒武纪

  // 半导体
  "688981": generateKlineData(72, 120, 0.022),    // 中芯国际
  "002371": generateKlineData(320, 120, 0.025),   // 北方华创
  "603501": generateKlineData(105, 120, 0.028),   // 韦尔股份
  "688012": generateKlineData(140, 120, 0.03),    // 中微公司
  "688396": generateKlineData(45, 120, 0.02),     // 华润微

  // 矿山
  "002466": generateKlineData(45, 120, 0.03),     // 天齐锂业
  "601899": generateKlineData(16, 120, 0.018),    // 紫金矿业
  "601088": generateKlineData(39, 120, 0.012),    // 中国神华
  "603993": generateKlineData(8.5, 120, 0.025),   // 洛阳钼业
  "002460": generateKlineData(40, 120, 0.028),    // 赣锋锂业

  // 新能源
  "601012": generateKlineData(21, 120, 0.022),    // 隆基绿能
  "300750": generateKlineData(180, 120, 0.025),   // 宁德时代
  "300274": generateKlineData(72, 120, 0.025),    // 阳光电源
  "002129": generateKlineData(16, 120, 0.02),     // 中环股份
  "688599": generateKlineData(27, 120, 0.022),    // 天合光能

  // 机器人
  "300124": generateKlineData(55, 120, 0.025),    // 汇川技术
  "688017": generateKlineData(80, 120, 0.032),    // 绿的谐波
  "300607": generateKlineData(25, 120, 0.03),     // 拓斯达
  "688160": generateKlineData(50, 120, 0.028),    // 步科股份
  "002747": generateKlineData(17, 120, 0.025),    // 埃斯顿

  // 低空经济
  "688566": generateKlineData(140, 120, 0.04),    // 亿航智能
  "000099": generateKlineData(20, 120, 0.028),    // 中信海直
  "002085": generateKlineData(14, 120, 0.025),    // 万丰奥威
  "688609": generateKlineData(40, 120, 0.035),    // 纵横股份
  "300722": generateKlineData(30, 120, 0.028),    // 新余国科

  // 军工
  "600893": generateKlineData(44, 120, 0.02),     // 航发动力
  "600760": generateKlineData(53, 120, 0.018),    // 中航沈飞
  "600118": generateKlineData(30, 120, 0.022),    // 中国卫星
  "002049": generateKlineData(113, 120, 0.02),    // 紫光国微
  "000768": generateKlineData(36, 120, 0.018),    // 中航西飞

  // 医药
  "603259": generateKlineData(54, 120, 0.02),     // 药明康德
  "600276": generateKlineData(47, 120, 0.015),    // 恒瑞医药
  "300760": generateKlineData(270, 120, 0.018),   // 迈瑞医疗
  "300015": generateKlineData(12.5, 120, 0.02),   // 爱尔眼科
  "000538": generateKlineData(57, 120, 0.012),    // 云南白药

  // 白酒
  "600519": generateKlineData(1650, 120, 0.015),  // 贵州茅台
  "000858": generateKlineData(148, 120, 0.018),   // 五粮液
  "000568": generateKlineData(165, 120, 0.018),   // 泸州老窖
  "002304": generateKlineData(93, 120, 0.015),    // 洋河股份
  "600809": generateKlineData(210, 120, 0.02),    // 山西汾酒
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
