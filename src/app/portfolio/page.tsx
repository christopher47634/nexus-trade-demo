"use client";

import { useEffect, useState } from "react";
import DesktopShell from "@/components/layout/DesktopShell";
import AccountOverviewCard from "@/components/portfolio/AccountOverviewCard";
import PositionTable from "@/components/portfolio/PositionTable";
import AssetAllocation from "@/components/portfolio/AssetAllocation";
import PortfolioMiniChart from "@/components/portfolio/PortfolioMiniChart";
import TransactionList from "@/components/portfolio/TransactionList";
import {
  initializeAccount,
  getAccount,
  getPositions,
  getTransactions,
  getPortfolioHistory,
} from "@/lib/account-storage";
import type {
  AccountSummary,
  Position,
  AccountTransaction,
  PortfolioHistory,
} from "@/types/account";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function PortfolioPage() {
  const [account, setAccount] = useState<AccountSummary | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [history, setHistory] = useState<PortfolioHistory[]>([]);

  useEffect(() => {
    initializeAccount();
    setAccount(getAccount());
    setPositions(getPositions());
    setTransactions(getTransactions());
    setHistory(getPortfolioHistory());
  }, []);

  if (!account) {
    return (
      <DesktopShell>
        <div className="flex items-center justify-center h-screen">
          <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      </DesktopShell>
    );
  }

  return (
    <DesktopShell>
      <div className="p-6 space-y-5 max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <Briefcase size={20} className="text-[var(--accent)]" />
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            持仓中心
          </h1>
          <span className="text-sm text-[var(--text-muted)]">
            共 {positions.length} 只持仓
          </span>
        </motion.div>

        {/* Account Overview */}
        <AccountOverviewCard account={account} delay={0} />

        {/* Main: Position Table + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          {/* Position Table */}
          <PositionTable positions={positions} delay={1} />

          {/* Sidebar */}
          <div className="space-y-5">
            <PortfolioMiniChart history={history} delay={2} />
            <AssetAllocation
              account={account}
              positions={positions}
              delay={3}
            />
          </div>
        </div>

        {/* Transaction List */}
        <TransactionList transactions={transactions} delay={4} />

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[10px] text-[var(--text-muted)] leading-relaxed opacity-50 pb-4"
        >
          本系统为模拟交易平台，所有数据均为虚拟数据，不涉及真实资金和证券。投资有风险，入市需谨慎。
        </motion.p>
      </div>
    </DesktopShell>
  );
}
