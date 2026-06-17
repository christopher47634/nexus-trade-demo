"use client";

import DesktopShell from "@/components/layout/DesktopShell";
import IndexTicker from "@/components/market/IndexTicker";
import HotSectorGrid from "@/components/market/HotSectorGrid";
import MarketOverview from "@/components/market/MarketOverview";
import RankingList from "@/components/market/RankingList";
import Watchlist from "@/components/market/Watchlist";
import MetricCard from "@/components/common/MetricCard";
import { getTopGainers, getTopByTurnover } from "@/mock/stocks";
import { Layers } from "lucide-react";

export default function DesktopHomePage() {
  const topGainers = getTopGainers(8);
  const topByTurnover = getTopByTurnover(8);

  return (
    <DesktopShell>
      {/* Top Index Ticker */}
      <IndexTicker />

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Account & Market Summary Row */}
        <div className="grid grid-cols-4 gap-3">
          <MetricCard
            label="模拟总资产"
            value={1256789.56}
            prefix="¥"
            change={2.34}
            delay={0}
          />
          <MetricCard
            label="今日盈亏"
            value={28956.78}
            prefix="¥"
            suffix=""
            change={2.34}
            delay={1}
          />
          <MetricCard
            label="持仓市值"
            value={1156789.12}
            prefix="¥"
            delay={2}
          />
          <MetricCard
            label="可用资金"
            value={99900.44}
            prefix="¥"
            delay={3}
          />
        </div>

        {/* Section Header: Hot Sectors */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[var(--accent)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              热门板块
            </h2>
            <span className="text-xs text-[var(--text-muted)]">
              实时更新
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <div className="w-1.5 h-1.5 rounded-full bg-up pulse-dot" />
            盘中 · 交易中
          </div>
        </div>

        {/* Hot Sector Grid */}
        <HotSectorGrid />

        {/* Bottom Section: Rankings + Sentiment + Watchlist */}
        <div className="grid grid-cols-12 gap-4">
          {/* Market Sentiment */}
          <div className="col-span-3">
            <MarketOverview />
          </div>

          {/* Top Gainers */}
          <div className="col-span-3">
            <RankingList
              title="涨幅榜"
              stocks={topGainers}
              valueKey="changePercent"
              delay={5}
            />
          </div>

          {/* Top by Turnover */}
          <div className="col-span-3">
            <RankingList
              title="成交额榜"
              stocks={topByTurnover}
              valueKey="turnover"
              delay={6}
            />
          </div>

          {/* Watchlist */}
          <div className="col-span-3">
            <Watchlist delay={7} />
          </div>
        </div>
      </div>
    </DesktopShell>
  );
}
