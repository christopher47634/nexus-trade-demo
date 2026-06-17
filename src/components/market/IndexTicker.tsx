"use client";

import { motion } from "framer-motion";
import { marketIndices } from "@/mock/market";
import { cn, formatPercent } from "@/lib/utils";

export default function IndexTicker() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-6 px-6 py-2.5 border-b border-[var(--border-subtle)] overflow-x-auto no-scrollbar"
      style={{ background: "var(--surface-1)" }}
    >
      {marketIndices.map((idx, i) => (
        <motion.div
          key={idx.code}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 whitespace-nowrap"
        >
          <span className="text-xs text-[var(--text-muted)] font-medium">
            {idx.name}
          </span>
          <span
            className={cn(
              "text-sm font-semibold font-mono-nums",
              idx.changePercent >= 0 ? "text-up" : "text-down"
            )}
          >
            {idx.price.toFixed(2)}
          </span>
          <span
            className={cn(
              "text-xs font-mono-nums px-1.5 py-0.5 rounded",
              idx.changePercent >= 0 ? "text-up bg-up" : "text-down bg-down"
            )}
          >
            {formatPercent(idx.changePercent)}
          </span>
          {i < marketIndices.length - 1 && (
            <div className="w-px h-4 bg-[var(--border-subtle)] ml-6" />
          )}
        </motion.div>
      ))}
      <div className="flex-1" />
      <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
        <span>
          总成交{" "}
          <span className="text-[var(--accent)] font-medium font-mono-nums">
            12834.5亿
          </span>
        </span>
        <span>
          涨{" "}
          <span className="text-up font-mono-nums">3245</span>{" "}
          / 跌{" "}
          <span className="text-down font-mono-nums">1678</span>
        </span>
      </div>
    </motion.div>
  );
}
