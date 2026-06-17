"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Stock } from "@/mock/stocks";
import { createOrder, updateOrderStatus, type MockOrder } from "@/mock/orders";
import { X, Minus, Plus, Check, Loader2, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";

type TradeSide = "buy" | "sell";
type OrderStep = "input" | "submitted" | "matching" | "filled";

interface TradePanelProps {
  stock: Stock;
  side?: TradeSide;
  onClose: () => void;
}

const AVAILABLE_FUNDS = 1000000;

export default function TradePanel({ stock, side: initialSide = "buy", onClose }: TradePanelProps) {
  const router = useRouter();
  const [side, setSide] = useState<TradeSide>(initialSide);
  const [price, setPrice] = useState(stock.price.toFixed(2));
  const [quantity, setQuantity] = useState(100);
  const [step, setStep] = useState<OrderStep>("input");

  const priceNum = parseFloat(price) || 0;
  const totalAmount = priceNum * quantity;
  const maxBuy = Math.floor(AVAILABLE_FUNDS / priceNum / 100) * 100;

  const orderRef = useRef<MockOrder | null>(null);

  const handleSubmit = () => {
    const order = createOrder({
      stockCode: stock.code,
      stockName: stock.name,
      side,
      price: priceNum,
      quantity,
    });
    orderRef.current = order;
    setStep("submitted");
    setTimeout(() => {
      setStep("matching");
      updateOrderStatus(order.id, "matching");
    }, 1200);
    setTimeout(() => {
      setStep("filled");
      updateOrderStatus(order.id, "filled");
    }, 3000);
  };

  const handleReset = () => {
    setStep("input");
    orderRef.current = null;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Panel */}
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-10 w-[380px] max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025)), rgba(15, 22, 36, 0.92)",
            backdropFilter: "blur(24px) saturate(140%)",
            WebkitBackdropFilter: "blur(24px) saturate(140%)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header + Simulated badge */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
            <div>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {stock.name}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono-nums ml-2">
                {stock.code}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: "rgba(212,165,116,0.12)",
                  color: "var(--accent)",
                  border: "1px solid rgba(212,165,116,0.25)",
                }}
              >
                模拟交易
              </span>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content area with AnimatePresence for steps */}
          <AnimatePresence mode="wait">
            {step === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                data-demo-highlight="trade-inputs"
                className="p-4 space-y-4"
              >
                {/* Buy/Sell tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSide("buy")}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                      side === "buy"
                        ? "bg-[var(--up)] text-[var(--bg-primary)]"
                        : "bg-[var(--up-bg)] text-[var(--up)] border border-[var(--up)]"
                    )}
                  >
                    买入
                  </button>
                  <button
                    onClick={() => setSide("sell")}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                      side === "sell"
                        ? "bg-[var(--down)] text-white"
                        : "bg-[var(--down-bg)] text-[var(--down)] border border-[var(--down)]"
                    )}
                  >
                    卖出
                  </button>
                </div>

                {/* Price input */}
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1.5 block">
                    委托价格 (元)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setPrice((parseFloat(price) - 0.01).toFixed(2))
                      }
                      className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)] transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="flex-1 h-10 px-3 rounded-lg bg-[var(--surface-1)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-center font-mono-nums text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                    <button
                      onClick={() =>
                        setPrice((parseFloat(price) + 0.01).toFixed(2))
                      }
                      className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Quantity input */}
                <div>
                  <label className="text-xs text-[var(--text-muted)] mb-1.5 block">
                    委托数量 (股) · 100股倍数
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setQuantity(Math.max(100, quantity - 100))
                      }
                      className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)] transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const v = parseInt(e.target.value) || 0;
                        setQuantity(Math.floor(v / 100) * 100);
                      }}
                      className="flex-1 h-10 px-3 rounded-lg bg-[var(--surface-1)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-center font-mono-nums text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                      step={100}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 100)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Quick quantity buttons */}
                <div className="flex gap-2">
                  {["1/4", "1/2", "3/4", "全仓"].map((label, i) => {
                    const ratios = [0.25, 0.5, 0.75, 1];
                    const qty =
                      side === "buy"
                        ? Math.floor((maxBuy * ratios[i]) / 100) * 100
                        : Math.floor((5000 * ratios[i]) / 100) * 100;
                    return (
                      <button
                        key={label}
                        onClick={() => setQuantity(qty)}
                        className="flex-1 py-1.5 rounded-lg text-xs text-[var(--text-muted)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)] hover:text-[var(--text-secondary)] transition-colors"
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Amount calculation */}
                <div className="p-3 rounded-xl bg-[var(--surface-1)] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">交易金额</span>
                    <span className="text-[var(--text-primary)] font-mono-nums">
                      ¥{totalAmount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">可用资金</span>
                    <span className="text-[var(--text-secondary)] font-mono-nums">
                      ¥{AVAILABLE_FUNDS.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">
                      {side === "buy" ? "最大可买" : "最大可卖"}
                    </span>
                    <span className="text-[var(--accent)] font-mono-nums">
                      {side === "buy"
                        ? `${maxBuy.toLocaleString()}股`
                        : "5,000股"}
                    </span>
                  </div>
                </div>

                {/* Order preview summary */}
                <div
                  className="p-3 rounded-xl space-y-1.5"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">方向</span>
                    <span className={cn("font-medium", side === "buy" ? "text-up" : "text-down")}>
                      {side === "buy" ? "买入" : "卖出"} {stock.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">委托</span>
                    <span className="text-[var(--text-secondary)] font-mono-nums">
                      {priceNum.toFixed(2)}元 × {quantity}股
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">预计金额</span>
                    <span className="text-[var(--text-primary)] font-semibold font-mono-nums">
                      ¥{totalAmount.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={quantity <= 0 || priceNum <= 0}
                  data-demo-highlight="confirm-buy"
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                    side === "buy"
                      ? "bg-[var(--up)] text-[var(--bg-primary)] hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                      : "bg-[var(--down)] text-white hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {side === "buy" ? "确认买入" : "确认卖出"}
                </motion.button>

                {/* Risk disclaimer */}
                <p className="text-[10px] text-[var(--text-muted)] text-center leading-relaxed opacity-60">
                  当前为模拟成交，不构成真实交易建议。投资有风险，入市需谨慎。
                </p>
              </motion.div>
            )}

            {/* Order status steps */}
            {step !== "input" && (
              <motion.div
                key="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 space-y-6"
              >
                {/* Order summary */}
                <div className="text-center space-y-1">
                  <div className="text-sm text-[var(--text-muted)]">
                    {side === "buy" ? "买入" : "卖出"} {stock.name}
                  </div>
                  <div className="text-lg font-bold text-[var(--text-primary)] font-mono-nums">
                    {priceNum.toFixed(2)} × {quantity}股
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] font-mono-nums">
                    总金额 ¥{totalAmount.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}
                  </div>
                  {orderRef.current && (
                    <div className="text-[10px] text-[var(--text-muted)] font-mono-nums mt-1">
                      订单号: {orderRef.current.id}
                    </div>
                  )}
                </div>

                {/* Three-step progress timeline */}
                <div className="relative">
                  {/* Vertical connecting line */}
                  <div
                    className="absolute left-[15px] top-[20px] w-[2px] rounded-full"
                    style={{
                      height: "calc(100% - 40px)",
                      background: step === "filled"
                        ? "var(--accent)"
                        : step === "matching"
                        ? "linear-gradient(180deg, var(--up), var(--accent-soft))"
                        : "var(--surface-2)",
                    }}
                  />
                  <div className="space-y-4 relative z-10">
                  {/* Step 1: Submitted */}
                  <StatusStep
                    label="订单已提交"
                    status={
                      step === "submitted"
                        ? "active"
                        : step === "matching" || step === "filled"
                        ? "done"
                        : "pending"
                    }
                    icon={<Check size={16} />}
                    delay={0}
                  />

                  {/* Step 2: Matching */}
                  <StatusStep
                    label="撮合中"
                    status={
                      step === "matching"
                        ? "active"
                        : step === "filled"
                        ? "done"
                        : "pending"
                    }
                    icon={<Loader2 size={16} className={step === "matching" ? "animate-spin" : ""} />}
                    delay={0.15}
                  />

                  {/* Step 3: Filled */}
                  <StatusStep
                    label="模拟成交"
                    status={
                      step === "filled" ? "done" : "pending"
                    }
                    icon={<Check size={16} />}
                    delay={0.3}
                    highlight
                  />
                  </div>
                </div>

                {/* Done button */}
                {step === "filled" && (
                  <div className="space-y-3">
                  {/* Filled details */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="p-4 rounded-xl space-y-2"
                    style={{
                      background: "rgba(52,211,153,0.05)",
                      border: "1px solid rgba(52,211,153,0.12)",
                    }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">成交价格</span>
                      <span className="text-[var(--text-primary)] font-mono-nums font-semibold">{priceNum.toFixed(2)}元</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">成交数量</span>
                      <span className="text-[var(--text-primary)] font-mono-nums">{quantity}股</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">成交金额</span>
                      <span className="text-[var(--text-primary)] font-mono-nums font-semibold">
                        ¥{totalAmount.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {orderRef.current && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-muted)]">订单号</span>
                        <span className="text-[var(--text-secondary)] font-mono-nums text-[10px]">{orderRef.current.id}</span>
                      </div>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-2"
                  >
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)] transition-colors"
                    >
                      继续下单
                    </button>
                    <button
                      onClick={() => { onClose(); router.push("/orders"); }}
                      data-demo-highlight="view-orders"
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ClipboardList size={14} />
                      查看订单
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] transition-colors"
                    >
                      关闭
                    </button>
                  </motion.div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function StatusStep({
  label,
  status,
  icon,
  delay = 0,
  highlight = false,
}: {
  label: string;
  status: "pending" | "active" | "done";
  icon: React.ReactNode;
  delay?: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      className="flex items-center gap-3"
    >
      <motion.div
        animate={{
          scale: status === "active" ? [1, 1.1, 1] : 1,
        }}
        transition={{
          repeat: status === "active" ? Infinity : 0,
          duration: 1.5,
        }}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
          status === "done"
            ? highlight
              ? "bg-[var(--accent)] text-[var(--bg-primary)]"
              : "bg-[var(--up)] text-[var(--bg-primary)]"
            : status === "active"
            ? "bg-[var(--accent-soft)] text-[var(--accent)]"
            : "bg-[var(--surface-2)] text-[var(--text-muted)]"
        )}
      >
        {status === "active" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          icon
        )}
      </motion.div>
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-300",
          status === "done"
            ? highlight
              ? "text-[var(--accent)]"
              : "text-[var(--up)]"
            : status === "active"
            ? "text-[var(--accent)]"
            : "text-[var(--text-muted)]"
        )}
      >
        {label}
      </span>
      {status === "active" && (
        <motion.div
          className="w-2 h-2 rounded-full bg-[var(--accent)]"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
    </motion.div>
  );
}
