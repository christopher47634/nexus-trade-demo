"use client";

import GlassCard from "@/components/common/GlassCard";
import { marketSentiment, marketStats } from "@/mock/market";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MarketOverview() {
  const sentiment = marketSentiment;

  const getSentimentColor = (idx: number) => {
    if (idx >= 75) return "text-[var(--down)]";
    if (idx >= 50) return "text-[var(--accent)]";
    if (idx >= 25) return "text-[var(--text-secondary)]";
    return "text-[var(--up)]";
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case "buy":
        return <TrendingUp size={12} className="text-up" />;
      case "sell":
        return <TrendingDown size={12} className="text-down" />;
      default:
        return <Minus size={12} className="text-[var(--text-muted)]" />;
    }
  };

  return (
    <GlassCard delay={3} className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-[var(--accent)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          市场情绪
        </h3>
      </div>

      {/* Fear & Greed Gauge */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--surface-3)"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${sentiment.fearGreedIndex * 2.51} 251`}
              initial={{ strokeDasharray: "0 251" }}
              animate={{
                strokeDasharray: `${sentiment.fearGreedIndex * 2.51} 251`,
              }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={cn(
                "text-lg font-bold font-mono-nums",
                getSentimentColor(sentiment.fearGreedIndex)
              )}
            >
              {sentiment.fearGreedIndex}
            </span>
            <span className="text-[9px] text-[var(--text-muted)]">
              {sentiment.label}
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {sentiment.signals.slice(0, 4).map((sig) => (
            <div
              key={sig.name}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-[var(--text-muted)]">{sig.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[var(--text-secondary)] font-mono-nums">
                  {sig.value}
                </span>
                {getSignalIcon(sig.signal)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[var(--surface-1)]">
          <span className="text-[10px] text-[var(--text-muted)]">涨停</span>
          <span className="text-sm font-semibold text-up font-mono-nums">
            {marketStats.limitUp}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[var(--surface-1)]">
          <span className="text-[10px] text-[var(--text-muted)]">跌停</span>
          <span className="text-sm font-semibold text-down font-mono-nums">
            {marketStats.limitDown}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[var(--surface-1)]">
          <span className="text-[10px] text-[var(--text-muted)]">北向资金</span>
          <span className="text-sm font-semibold text-up font-mono-nums">
            {marketStats.northboundFlow}
          </span>
        </div>
        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[var(--surface-1)]">
          <span className="text-[10px] text-[var(--text-muted)]">趋势</span>
          <span className="text-sm font-semibold text-[var(--accent)] font-mono-nums">
            {sentiment.shortTrend === "bullish" ? "偏多" : sentiment.shortTrend === "bearish" ? "偏空" : "震荡"}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
