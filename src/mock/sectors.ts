export interface Sector {
  id: string;
  name: string;
  changePercent: number;
  turnover: string;
  capitalInflow: string;
  hotRank: number;
  imageUrl: string;
  accentColor: string;
  themeType: "gold" | "cyber" | "institutional" | "ice";
  description: string;
  topStocks: string[];
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  visualType:
    | "optical"
    | "compute"
    | "semiconductor"
    | "mining"
    | "new-energy"
    | "robotics"
    | "low-altitude"
    | "defense"
    | "medicine"
    | "baijiu";
  heroImageUrl?: string;
  cardImageUrl?: string;
}

export const sectors: Sector[] = [
  {
    id: "optical-communication",
    name: "光通信",
    changePercent: 3.85,
    turnover: "287.6亿",
    capitalInflow: "+18.3亿",
    hotRank: 1,
    imageUrl: "",
    accentColor: "#D4A574",
    themeType: "gold",
    description: "光模块、光纤光缆、光器件",
    topStocks: ["中际旭创", "新易盛", "天孚通信"],
    gradientFrom: "#D4A574",
    gradientTo: "#8B6914",
    icon: "Zap",
    visualType: "optical",
  },
  {
    id: "computing-power",
    name: "算力",
    changePercent: 2.73,
    turnover: "412.8亿",
    capitalInflow: "+24.7亿",
    hotRank: 2,
    imageUrl: "",
    accentColor: "#6366F1",
    themeType: "cyber",
    description: "GPU服务器、AI芯片、数据中心",
    topStocks: ["浪潮信息", "中科曙光", "紫光股份"],
    gradientFrom: "#6366F1",
    gradientTo: "#4338CA",
    icon: "Cpu",
    visualType: "compute",
  },
  {
    id: "semiconductor",
    name: "半导体",
    changePercent: 1.92,
    turnover: "356.4亿",
    capitalInflow: "+12.1亿",
    hotRank: 3,
    imageUrl: "",
    accentColor: "#3B82F6",
    themeType: "cyber",
    description: "芯片设计、晶圆制造、封测",
    topStocks: ["中芯国际", "北方华创", "韦尔股份"],
    gradientFrom: "#3B82F6",
    gradientTo: "#1D4ED8",
    icon: "MemoryStick",
    visualType: "semiconductor",
  },
  {
    id: "mining",
    name: "矿山",
    changePercent: -0.86,
    turnover: "198.3亿",
    capitalInflow: "-5.2亿",
    hotRank: 8,
    imageUrl: "",
    accentColor: "#A78BFA",
    themeType: "institutional",
    description: "锂矿、铜矿、稀土、煤炭",
    topStocks: ["天齐锂业", "紫金矿业", "中国神华"],
    gradientFrom: "#A78BFA",
    gradientTo: "#7C3AED",
    icon: "Mountain",
    visualType: "mining",
  },
  {
    id: "new-energy",
    name: "新能源",
    changePercent: 1.45,
    turnover: "267.9亿",
    capitalInflow: "+8.6亿",
    hotRank: 4,
    imageUrl: "",
    accentColor: "#34D399",
    themeType: "ice",
    description: "光伏、风电、储能、氢能",
    topStocks: ["隆基绿能", "宁德时代", "阳光电源"],
    gradientFrom: "#34D399",
    gradientTo: "#059669",
    icon: "Sun",
    visualType: "new-energy",
  },
  {
    id: "robotics",
    name: "机器人",
    changePercent: 2.31,
    turnover: "234.5亿",
    capitalInflow: "+15.8亿",
    hotRank: 5,
    imageUrl: "",
    accentColor: "#F59E0B",
    themeType: "gold",
    description: "人形机器人、工业机器人、减速器",
    topStocks: ["汇川技术", "绿的谐波", "拓斯达"],
    gradientFrom: "#F59E0B",
    gradientTo: "#D97706",
    icon: "Bot",
    visualType: "robotics",
  },
  {
    id: "low-altitude",
    name: "低空经济",
    changePercent: 4.12,
    turnover: "156.8亿",
    capitalInflow: "+22.4亿",
    hotRank: 6,
    imageUrl: "",
    accentColor: "#14B8A6",
    themeType: "ice",
    description: "eVTOL、无人机、低空基建",
    topStocks: ["亿航智能", "中信海直", "万丰奥威"],
    gradientFrom: "#14B8A6",
    gradientTo: "#0D9488",
    icon: "Plane",
    visualType: "low-altitude",
  },
  {
    id: "military",
    name: "军工",
    changePercent: -1.23,
    turnover: "189.7亿",
    capitalInflow: "-8.9亿",
    hotRank: 9,
    imageUrl: "",
    accentColor: "#EF4444",
    themeType: "institutional",
    description: "航空发动机、导弹、卫星",
    topStocks: ["航发动力", "中航沈飞", "中国卫星"],
    gradientFrom: "#EF4444",
    gradientTo: "#B91C1C",
    icon: "Shield",
    visualType: "defense",
  },
  {
    id: "pharma",
    name: "医药",
    changePercent: -0.54,
    turnover: "312.6亿",
    capitalInflow: "-3.1亿",
    hotRank: 10,
    imageUrl: "",
    accentColor: "#EC4899",
    themeType: "institutional",
    description: "创新药、CXO、医疗器械",
    topStocks: ["药明康德", "恒瑞医药", "迈瑞医疗"],
    gradientFrom: "#EC4899",
    gradientTo: "#BE185D",
    icon: "HeartPulse",
    visualType: "medicine",
  },
  {
    id: "baijiu",
    name: "白酒",
    changePercent: 0.78,
    turnover: "245.3亿",
    capitalInflow: "+2.3亿",
    hotRank: 7,
    imageUrl: "",
    accentColor: "#D4A574",
    themeType: "gold",
    description: "高端白酒、次高端、区域酒",
    topStocks: ["贵州茅台", "五粮液", "泸州老窖"],
    gradientFrom: "#D4A574",
    gradientTo: "#92400E",
    icon: "Wine",
    visualType: "baijiu",
  },
];

export function getSectorById(id: string): Sector | undefined {
  return sectors.find((s) => s.id === id);
}

export function getTopSectors(n: number = 10): Sector[] {
  return [...sectors].sort((a, b) => a.hotRank - b.hotRank).slice(0, n);
}
