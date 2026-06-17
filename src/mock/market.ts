export interface MarketIndex {
  code: string;
  name: string;
  price: number;
  changePercent: number;
  changeAmount: number;
  volume: string;
  turnover: string;
  high: number;
  low: number;
}

export interface MarketStats {
  upCount: number;
  downCount: number;
  flatCount: number;
  limitUp: number;
  limitDown: number;
  totalTurnover: string;
  northboundFlow: string;
}

export interface MarketSentiment {
  fearGreedIndex: number; // 0-100
  label: string;
  shortTrend: "bullish" | "bearish" | "neutral";
  midTrend: "bullish" | "bearish" | "neutral";
  signals: {
    name: string;
    value: string;
    signal: "buy" | "sell" | "neutral";
  }[];
}

export const marketIndices: MarketIndex[] = [
  {
    code: "000001",
    name: "上证指数",
    price: 3267.89,
    changePercent: 0.56,
    changeAmount: 18.23,
    volume: "3.2亿",
    turnover: "4567.8亿",
    high: 3275.12,
    low: 3245.67,
  },
  {
    code: "399001",
    name: "深证成指",
    price: 10234.56,
    changePercent: 0.78,
    changeAmount: 79.12,
    volume: "4.5亿",
    turnover: "5678.9亿",
    high: 10256.78,
    low: 10145.23,
  },
  {
    code: "399006",
    name: "创业板指",
    price: 2045.67,
    changePercent: 1.23,
    changeAmount: 24.89,
    volume: "2.1亿",
    turnover: "2345.6亿",
    high: 2052.34,
    low: 2018.45,
  },
  {
    code: "000688",
    name: "科创50",
    price: 987.34,
    changePercent: 1.56,
    changeAmount: 15.23,
    volume: "0.8亿",
    turnover: "876.5亿",
    high: 992.56,
    low: 970.12,
  },
  {
    code: "899050",
    name: "北证50",
    price: 1123.45,
    changePercent: -0.34,
    changeAmount: -3.84,
    volume: "0.3亿",
    turnover: "234.5亿",
    high: 1130.67,
    low: 1118.23,
  },
];

export const marketStats: MarketStats = {
  upCount: 3245,
  downCount: 1678,
  flatCount: 189,
  limitUp: 68,
  limitDown: 12,
  totalTurnover: "12834.5亿",
  northboundFlow: "+56.78亿",
};

export const marketSentiment: MarketSentiment = {
  fearGreedIndex: 62,
  label: "偏贪婪",
  shortTrend: "bullish",
  midTrend: "neutral",
  signals: [
    { name: "市场广度", value: "65.8%", signal: "buy" },
    { name: "量价关系", value: "温和放量", signal: "buy" },
    { name: "资金流向", value: "净流入", signal: "buy" },
    { name: "波动率", value: "偏低", signal: "neutral" },
    { name: "情绪指标", value: "偏贪婪", signal: "sell" },
  ],
};

export interface WatchlistStock {
  code: string;
  name: string;
  price: number;
  changePercent: number;
  sparkline: number[];
}

export const watchlist: WatchlistStock[] = [
  { code: "600519", name: "贵州茅台", price: 1688.0, changePercent: 0.98, sparkline: [1670, 1672, 1668, 1675, 1680, 1676, 1682, 1685, 1688] },
  { code: "300750", name: "宁德时代", price: 198.56, changePercent: 2.12, sparkline: [194, 195, 193, 196, 198, 197, 199, 198, 198.5] },
  { code: "688256", name: "寒武纪", price: 268.90, changePercent: 4.56, sparkline: [257, 260, 258, 262, 265, 263, 266, 268, 269] },
  { code: "000977", name: "浪潮信息", price: 35.67, changePercent: 3.45, sparkline: [34.5, 34.8, 34.2, 35.0, 35.3, 35.1, 35.5, 35.6, 35.7] },
  { code: "300124", name: "汇川技术", price: 62.34, changePercent: 3.56, sparkline: [60, 60.5, 60.2, 61.0, 61.5, 61.2, 61.8, 62.0, 62.3] },
];
