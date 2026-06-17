"use client";

import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import type { AccountTransaction } from "@/types/account";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Receipt,
  Gift,
  Settings,
  List,
} from "lucide-react";
import { FlowHoverSurface } from "@/components/common/FlowHoverSurface";

const TYPE_CONFIG: Record<
  AccountTransaction["type"],
  { label: string; icon: typeof ArrowDownCircle; color: string }
> = {
  buy: { label: "买入", icon: ArrowDownCircle, color: "var(--up)" },
  sell: { label: "卖出", icon: ArrowUpCircle, color: "var(--down)" },
  fee: { label: "费用", icon: Receipt, color: "var(--text-muted)" },
  dividend: { label: "分红", icon: Gift, color: "var(--accent)" },
  adjustment: {
    label: "调整",
    icon: Settings,
    color: "var(--text-secondary)",
  },
};

interface TransactionListProps {
  transactions: AccountTransaction[];
  delay?: number;
}

export default function TransactionList({
  transactions,
  delay = 0,
}: TransactionListProps) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border-subtle)]">
        <List size={14} className="text-[var(--accent)]" />
        <span className="text-xs font-semibold text-[var(--text-primary)]">
          资金流水
        </span>
        <span className="text-[10px] text-[var(--text-muted)]">
          共 {transactions.length} 笔
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--border-subtle)]">
        {sorted.map((txn, i) => {
          const config = TYPE_CONFIG[txn.type];
          const Icon = config.icon;
          const isPositive = txn.amount > 0;

          return (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              className="flex items-center gap-3 px-5 py-2.5 hover:bg-[var(--surface-2)] transition-colors"
            >
            <FlowHoverSurface variant="subtle">
              {/* Type icon */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${config.color}15` }}
              >
                <Icon size={14} style={{ color: config.color }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    {config.label}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono-nums">
                    {txn.stockCode}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {new Date(txn.createdAt).toLocaleString("zh-CN", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono opacity-50">
                    {txn.relatedOrderId}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <span
                className={cn(
                  "text-sm font-semibold font-mono-nums flex-shrink-0",
                  isPositive ? "text-up" : "text-[var(--text-primary)]"
                )}
              >
                {isPositive ? "+" : ""}
                {formatCurrency(txn.amount)}
              </span>
            </FlowHoverSurface>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
