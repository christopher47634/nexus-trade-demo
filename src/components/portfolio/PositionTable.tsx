"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn, formatCurrency } from "@/lib/utils";
import type { Position } from "@/types/account";
import { getSectorById } from "@/mock/sectors";
import {
  Package,
  AlertTriangle,
} from "lucide-react";

const RISK_CONFIG: Record<
  Position["riskLevel"],
  { label: string; color: string; bg: string }
> = {
  low: { label: "低", color: "#34D399", bg: "rgba(52,211,153,0.12)" },
  medium: { label: "中", color: "#FBBF24", bg: "rgba(251,191,36,0.12)" },
  high: { label: "高", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
};

interface PositionTableProps {
  positions: Position[];
  delay?: number;
}

export default function PositionTable({
  positions,
  delay = 0,
}: PositionTableProps) {
  const router = useRouter();

  if (positions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay * 0.08 }}
        className="glass p-8 flex flex-col items-center justify-center gap-3"
      >
        <Package size={40} className="text-[var(--text-muted)] opacity-50" />
        <span className="text-sm text-[var(--text-muted)]">暂无持仓</span>
        <span className="text-xs text-[var(--text-muted)] opacity-60">
          下单交易后将在此显示持仓信息
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="glass overflow-hidden rounded-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-[var(--accent)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            持仓明细
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            共 {positions.length} 只
          </span>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[160px_80px_90px_90px_90px_90px_100px_100px_80px_70px_60px] gap-1 px-5 py-2.5 text-[10px] font-medium text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
        <span>股票</span>
        <span>板块</span>
        <span className="text-right">持仓/可用</span>
        <span className="text-right">成本价</span>
        <span className="text-right">现价</span>
        <span className="text-right">市值</span>
        <span className="text-right">浮动盈亏</span>
        <span className="text-right">今日盈亏</span>
        <span className="text-right">仓位</span>
        <span className="text-center">盈亏%</span>
        <span className="text-center">风险</span>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[var(--border-subtle)]">
        {positions.map((pos, i) => {
          const sector = getSectorById(pos.sectorId);
          const risk = RISK_CONFIG[pos.riskLevel];
          const pnlColor =
            pos.unrealizedPnL > 0
              ? "text-up"
              : pos.unrealizedPnL < 0
              ? "text-down"
              : "text-[var(--text-secondary)]";
          const todayColor =
            pos.todayPnL > 0
              ? "text-up"
              : pos.todayPnL < 0
              ? "text-down"
              : "text-[var(--text-secondary)]";

          return (
            <motion.div
              key={pos.stockCode}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              onClick={() => router.push(`/stocks/${pos.stockCode}`)}
              className="grid grid-cols-2 md:grid-cols-[160px_80px_90px_90px_90px_90px_100px_100px_80px_70px_60px] gap-1 px-5 py-3 text-sm items-center hover:bg-[var(--surface-2)] transition-colors duration-150 cursor-pointer"
            >
              {/* Stock */}
              <div className="flex flex-col">
                <span className="text-[var(--text-primary)] font-medium">
                  {pos.stockName}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono-nums">
                  {pos.stockCode}
                </span>
              </div>

              {/* Sector */}
              <span className="hidden md:block text-[10px] text-[var(--text-muted)] truncate">
                {sector?.name || pos.sectorId}
              </span>

              {/* Quantity */}
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-[var(--text-primary)] font-mono-nums">
                  {pos.quantity.toLocaleString()}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono-nums">
                  /{pos.availableQuantity.toLocaleString()}
                </span>
              </div>

              {/* Avg Cost */}
              <span className="hidden md:block text-right text-xs text-[var(--text-secondary)] font-mono-nums">
                ¥{pos.avgCost.toFixed(2)}
              </span>

              {/* Current Price */}
              <div className="text-right">
                <span className="text-xs font-semibold text-[var(--text-primary)] font-mono-nums">
                  ¥{pos.currentPrice.toFixed(2)}
                </span>
              </div>

              {/* Market Value */}
              <span className="hidden md:block text-right text-xs text-[var(--text-primary)] font-mono-nums">
                ¥{formatCurrency(pos.marketValue)}
              </span>

              {/* Unrealized P&L */}
              <div className="hidden md:flex flex-col items-end">
                <span
                  className={cn("text-xs font-semibold font-mono-nums", pnlColor)}
                >
                  {pos.unrealizedPnL >= 0 ? "+" : ""}
                  {formatCurrency(pos.unrealizedPnL)}
                </span>
              </div>

              {/* Today P&L */}
              <div className="hidden md:flex flex-col items-end">
                <span
                  className={cn("text-xs font-mono-nums", todayColor)}
                >
                  {pos.todayPnL >= 0 ? "+" : ""}
                  {formatCurrency(pos.todayPnL)}
                </span>
              </div>

              {/* Position Ratio */}
              <span className="hidden md:block text-right text-xs text-[var(--text-secondary)] font-mono-nums">
                {(pos.positionRatio * 100).toFixed(1)}%
              </span>

              {/* P&L Percent */}
              <div className="flex flex-col items-end md:items-center">
                <span
                  className={cn(
                    "text-xs font-semibold font-mono-nums",
                    pos.unrealizedPnLPercent > 0
                      ? "text-up"
                      : pos.unrealizedPnLPercent < 0
                      ? "text-down"
                      : "text-[var(--text-secondary)]"
                  )}
                >
                  {pos.unrealizedPnLPercent > 0 ? "+" : ""}
                  {pos.unrealizedPnLPercent.toFixed(2)}%
                </span>
                {/* Mobile: show market value */}
                <span className="md:hidden text-[10px] text-[var(--text-muted)] font-mono-nums">
                  市值 ¥{formatCurrency(pos.marketValue)}
                </span>
              </div>

              {/* Risk Level */}
              <span className="hidden md:flex justify-center">
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-0.5"
                  style={{ color: risk.color, backgroundColor: risk.bg }}
                >
                  {pos.riskLevel === "high" && (
                    <AlertTriangle size={8} />
                  )}
                  {risk.label}
                </span>
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
