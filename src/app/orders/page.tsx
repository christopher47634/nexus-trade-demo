"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, BarChart3, PlayCircle } from "lucide-react";
import { getOrders, MockOrder } from "@/mock/orders";
import EmptyState from "@/components/common/EmptyState";

const STATUS_MAP: Record<MockOrder["status"], { label: string; color: string; bg: string }> = {
  submitted:       { label: "已提交", color: "#60A5FA", bg: "rgba(96,165,250,0.12)" },
  matching:        { label: "撮合中", color: "#FBBF24", bg: "rgba(251,191,36,0.12)" },
  partial_filled:  { label: "部分成交", color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
  filled:          { label: "已成交", color: "#34D399", bg: "rgba(52,211,153,0.12)" },
  cancelled:       { label: "已撤单", color: "#94A3B8", bg: "rgba(148,163,184,0.12)" },
  rejected:        { label: "已拒绝", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
};

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "刚刚";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}小时前`;
  return new Date(ts).toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<MockOrder[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleStartDemo = () => {
    try {
      localStorage.setItem("demoMode", "true");
      localStorage.setItem("demoModeStep", "0");
    } catch {
      // ignore
    }
    router.push("/");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-6"
      >
        <ClipboardList size={20} className="text-[var(--accent)]" />
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">委托订单</h1>
        <span className="text-sm text-[var(--text-muted)]">
          共 {orders.length} 笔
        </span>
      </motion.div>

      {orders.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            icon={<ClipboardList size={40} />}
            title="暂无委托订单"
            description="下单后将在此显示委托记录"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center justify-center gap-3"
          >
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)] transition-colors"
            >
              <BarChart3 size={15} />
              返回市场
            </button>
            <button
              onClick={handleStartDemo}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] transition-colors"
            >
              <PlayCircle size={15} />
              开始演示
            </button>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          data-demo-highlight="order-table"
          className="glass overflow-hidden rounded-xl"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[140px_1fr_80px_100px_80px_110px_90px_100px] gap-2 px-5 py-3 text-xs font-medium text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
            <span>订单编号</span>
            <span>股票</span>
            <span>方向</span>
            <span className="text-right">价格</span>
            <span className="text-right">数量</span>
            <span className="text-right">金额</span>
            <span className="text-center">状态</span>
            <span className="text-right">时间</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[var(--border-subtle)]">
            <AnimatePresence initial={false}>
              {orders.map((order, i) => {
                const st = STATUS_MAP[order.status];
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="grid grid-cols-[140px_1fr_80px_100px_80px_110px_90px_100px] gap-2 px-5 py-3 text-sm items-center hover:bg-[var(--surface-2)] transition-colors duration-150"
                  >
                    <span className="text-[var(--text-muted)] text-xs font-mono truncate">
                      {order.id.slice(0, 16)}…
                    </span>
                    <span className="text-[var(--text-primary)] font-medium truncate">
                      {order.stockName}
                      <span className="ml-1.5 text-[var(--text-muted)] text-xs">{order.stockCode}</span>
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: order.side === "buy" ? "var(--up)" : "var(--down)" }}
                    >
                      {order.side === "buy" ? "买入" : "卖出"}
                    </span>
                    <span className="text-right text-[var(--text-primary)] font-mono">
                      {order.price.toFixed(2)}
                    </span>
                    <span className="text-right text-[var(--text-secondary)] font-mono">
                      {order.quantity.toLocaleString()}
                    </span>
                    <span className="text-right text-[var(--text-secondary)] font-mono">
                      {order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="flex justify-center">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ color: st.color, backgroundColor: st.bg }}
                      >
                        {st.label}
                      </span>
                    </span>
                    <span className="text-right text-[var(--text-muted)] text-xs">
                      {relativeTime(order.createdAt)}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
