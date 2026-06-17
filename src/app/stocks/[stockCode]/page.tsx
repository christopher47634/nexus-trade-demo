"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DesktopShell from "@/components/layout/DesktopShell";
import KlineChart from "@/components/stock/KlineChart";
import OrderBook from "@/components/stock/OrderBook";
import TradePanel from "@/components/stock/TradePanel";
import { getStockByCode } from "@/mock/stocks";
import { getKlineData } from "@/mock/kline";
import { cn, formatPercent } from "@/lib/utils";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Repeat,
  Building2,
} from "lucide-react";

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stockCode = params.stockCode as string;
  const stock = getStockByCode(stockCode);
  const klineData = useMemo(() => getKlineData(stockCode), [stockCode]);
  const [showTrade, setShowTrade] = useState(false);
  const [tradeSide, setTradeSide] = useState<"buy" | "sell">("buy");

  if (!stock) {
    return (
      <DesktopShell>
        <div className="flex items-center justify-center h-screen">
          <span className="text-[var(--text-muted)]">股票未找到</span>
        </div>
      </DesktopShell>
    );
  }

  const isUp = stock.changePercent >= 0;

  const handleBuy = () => {
    setTradeSide("buy");
    setShowTrade(true);
  };

  const handleSell = () => {
    setTradeSide("sell");
    setShowTrade(true);
  };

  return (
    <DesktopShell>
      <div className="p-6 space-y-5">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft size={16} />
          返回
        </motion.button>

        {/* Stock Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass p-5 rounded-2xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">
                  {stock.name}
                </h1>
                <span className="text-sm text-[var(--text-muted)] font-mono-nums">
                  {stock.code}
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: "rgba(52,211,153,0.1)",
                    color: "#34D399",
                    border: "1px solid rgba(52,211,153,0.2)",
                  }}
                >
                  已收盘
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono-nums">
                  15:00:00
                </span>
                <button
                  onClick={() =>
                    router.push(`/sectors/${stock.sectorId}`)
                  }
                  className="px-2 py-0.5 rounded-md text-[10px] text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] transition-colors"
                >
                  {stock.sectorId}
                </button>
              </div>
              <div className="flex items-baseline gap-3">
                <span
                  className={cn(
                    "text-3xl font-bold font-mono-nums",
                    isUp ? "text-up" : "text-down"
                  )}
                >
                  {stock.price.toFixed(2)}
                </span>
                <div className={cn("flex items-center gap-1", isUp ? "text-up" : "text-down")}>
                  {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="text-sm font-semibold font-mono-nums">
                    {formatPercent(stock.changePercent)}
                  </span>
                  <span className="text-xs font-mono-nums">
                    ({stock.changeAmount > 0 ? "+" : ""}
                    {stock.changeAmount.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>

            {/* Buy/Sell buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleBuy}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[var(--up)] text-[var(--bg-primary)] hover:shadow-[0_0_24px_rgba(52,211,153,0.3)] transition-shadow"
              >
                买入
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSell}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[var(--down)] text-white hover:shadow-[0_0_24px_rgba(248,113,113,0.3)] transition-shadow"
              >
                卖出
              </motion.button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-[var(--border-subtle)]">
            <StatItem label="成交额" value={stock.turnover} icon={<BarChart3 size={12} />} />
            <StatItem label="换手率" value={`${stock.turnoverRate}%`} icon={<Repeat size={12} />} />
            <StatItem label="市值" value={stock.marketCap} icon={<Building2 size={12} />} />
            <StatItem label="PE" value={stock.pe.toFixed(1)} icon={<Activity size={12} />} />
            <StatItem label="最高" value={stock.high.toFixed(2)} className="text-up" />
            <StatItem label="最低" value={stock.low.toFixed(2)} className="text-down" />
            <StatItem label="开盘" value={stock.open.toFixed(2)} />
            <StatItem label="昨收" value={stock.prevClose.toFixed(2)} />
          </div>
        </motion.div>

        {/* Main content: Chart + OrderBook */}
        <div className="grid grid-cols-12 gap-4">
          {/* K-line chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="col-span-9 glass p-4 rounded-2xl"
          >
            <KlineChart data={klineData} />
          </motion.div>

          {/* Order book */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="col-span-3 glass p-4 rounded-2xl"
          >
            <OrderBook currentPrice={stock.price} prevClose={stock.prevClose} />
          </motion.div>
        </div>
      </div>

      {/* Trade Panel Overlay */}
      {showTrade && (
        <TradePanel
          stock={stock}
          side={tradeSide}
          onClose={() => setShowTrade(false)}
        />
      )}
    </DesktopShell>
  );
}

function StatItem({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span
        className={cn(
          "text-xs font-semibold text-[var(--text-primary)] font-mono-nums",
          className
        )}
      >
        {value}
      </span>
    </div>
  );
}
