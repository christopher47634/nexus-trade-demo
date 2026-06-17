"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { KlineBar } from "@/mock/kline";
import ChartTypeSwitcher, { ChartType } from "./ChartTypeSwitcher";

type TimeFrame = "分时" | "日K" | "周K" | "月K";

// Helper to generate SVG path from kline data
function generateSVGPath(data: KlineBar[]): string {
  if (data.length === 0) return "";
  const width = 800;
  const height = 320;
  const padding = 20;

  const closes = data.map(d => d.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((d.close - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return `M${points.join(" L")}`;
}

interface KlineChartProps {
  data: KlineBar[];
}

export default function KlineChart({ data }: KlineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const priceSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const modulesRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<TimeFrame>("日K");
  const [chartType, setChartType] = useState<ChartType>("candlestick");
  const [showVolume, setShowVolume] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const tabs: TimeFrame[] = ["分时", "日K", "周K", "月K"];

  // Determine which chart types are disabled for intraday
  const isIntraday = activeTab === "分时";
  const disabledChartTypes: ChartType[] = isIntraday ? ["candlestick", "bar"] : [];

  // Create price series based on chartType
  const createPriceSeries = useCallback(
    (chart: any, lc: any, klineData: KlineBar[]) => {
      let series: any;
      switch (chartType) {
        case "candlestick":
          series = chart.addSeries(lc.CandlestickSeries, {
            upColor: "#34D399",
            downColor: "#F87171",
            borderDownColor: "#F87171",
            borderUpColor: "#34D399",
            wickDownColor: "#F87171",
            wickUpColor: "#34D399",
          });
          series.setData(
            klineData.map((d) => ({
              time: d.time as any,
              open: d.open,
              high: d.high,
              low: d.low,
              close: d.close,
            }))
          );
          break;
        case "area":
          series = chart.addSeries(lc.AreaSeries, {
            lineColor: "#D4A574",
            topColor: "rgba(212,165,116,0.28)",
            bottomColor: "rgba(212,165,116,0.0)",
            lineWidth: 2,
          });
          series.setData(
            klineData.map((d) => ({ time: d.time as any, value: d.close }))
          );
          break;
        case "line":
          series = chart.addSeries(lc.LineSeries, {
            color: "#D4A574",
            lineWidth: 2,
          });
          series.setData(
            klineData.map((d) => ({ time: d.time as any, value: d.close }))
          );
          break;
        case "bar":
          series = chart.addSeries(lc.BarSeries, {
            upColor: "#34D399",
            downColor: "#F87171",
          });
          series.setData(
            klineData.map((d) => ({
              time: d.time as any,
              open: d.open,
              high: d.high,
              low: d.low,
              close: d.close,
            }))
          );
          break;
      }
      return series;
    },
    [chartType]
  );

  // Create volume series
  const createVolumeSeries = useCallback(
    (chart: any, lc: any, klineData: KlineBar[]) => {
      const series = chart.addSeries(lc.HistogramSeries, {
        color: "#26a69a",
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
      });
      chart.priceScale("volume").applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      series.setData(
        klineData.map((d) => ({
          time: d.time as any,
          value: d.volume,
          color: d.close >= d.open ? "rgba(52,211,153,0.35)" : "rgba(248,113,113,0.35)",
        }))
      );
      return series;
    },
    []
  );

  // Initialize chart (once per data/tab change)
  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    let chart: any = null;
    let resizeObserver: ResizeObserver | null = null;

    const initChart = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!containerRef.current || containerRef.current.clientWidth === 0) {
          console.warn("Chart container has no width, retrying...");
          setTimeout(() => initChart(), 200);
          return;
        }

        const lc = await import("lightweight-charts");
        if (!containerRef.current) return;

        // Clear previous chart
        containerRef.current.innerHTML = "";

        chart = lc.createChart(containerRef.current, {
          width: containerRef.current.clientWidth,
          height: 320,
          layout: {
            background: { type: lc.ColorType.Solid, color: "transparent" },
            textColor: "#94A3B8",
            fontSize: 11,
          },
          grid: {
            vertLines: { color: "rgba(255, 255, 255, 0.04)" },
            horzLines: { color: "rgba(255, 255, 255, 0.04)" },
          },
          crosshair: {
            mode: lc.CrosshairMode.Normal,
            vertLine: {
              color: "rgba(212, 165, 116, 0.4)",
              labelBackgroundColor: "#D4A574",
            },
            horzLine: {
              color: "rgba(212, 165, 116, 0.4)",
              labelBackgroundColor: "#D4A574",
            },
          },
          rightPriceScale: {
            borderColor: "rgba(255, 255, 255, 0.06)",
          },
          timeScale: {
            borderColor: "rgba(255, 255, 255, 0.06)",
            timeVisible: false,
          },
        });

        chartRef.current = chart;
        modulesRef.current = lc;

        // Create price series
        priceSeriesRef.current = createPriceSeries(chart, lc, data);

        // Create volume series
        if (showVolume) {
          volumeSeriesRef.current = createVolumeSeries(chart, lc, data);
        }

        chart.timeScale().fitContent();

        setTimeout(() => setLoaded(true), 100);

        // Resize observer
        resizeObserver = new ResizeObserver((entries) => {
          if (entries[0] && chart) {
            chart.applyOptions({ width: entries[0].contentRect.width });
          }
        });
        resizeObserver.observe(containerRef.current);
      } catch (err) {
        console.error("Lightweight Charts init failed:", err);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <svg width="100%" height="320" viewBox="0 0 800 320" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(52,211,153,0.3)"/>
                  <stop offset="100%" stop-color="rgba(52,211,153,0)"/>
                </linearGradient>
              </defs>
              <path d="${generateSVGPath(data)}" fill="none" stroke="#34D399" stroke-width="2"/>
              <path d="${generateSVGPath(data)} L800,320 L0,320 Z" fill="url(#chartGrad)"/>
            </svg>
          `;
        }
        setLoaded(true);
      }
    };

    initChart();

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      if (chart) {
        chart.remove();
        chart = null;
      }
    };
  }, [data, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update price series when chartType changes (without recreating chart)
  useEffect(() => {
    const chart = chartRef.current;
    const lc = modulesRef.current;
    if (!chart || !lc || !loaded) return;

    // Remove old price series
    if (priceSeriesRef.current) {
      try {
        chart.removeSeries(priceSeriesRef.current);
      } catch {
        /* series may already be gone */
      }
      priceSeriesRef.current = null;
    }

    // Create new price series
    priceSeriesRef.current = createPriceSeries(chart, lc, data);
    chart.timeScale().fitContent();
  }, [chartType, loaded, data, createPriceSeries]);

  // Toggle volume series
  useEffect(() => {
    const chart = chartRef.current;
    const lc = modulesRef.current;
    if (!chart || !lc || !loaded) return;

    if (showVolume) {
      if (!volumeSeriesRef.current) {
        volumeSeriesRef.current = createVolumeSeries(chart, lc, data);
      }
    } else {
      if (volumeSeriesRef.current) {
        try {
          chart.removeSeries(volumeSeriesRef.current);
        } catch {
          /* already removed */
        }
        volumeSeriesRef.current = null;
      }
    }
  }, [showVolume, loaded, data, createVolumeSeries]);

  // Handle timeframe switch
  const handleTabSwitch = (tab: TimeFrame) => {
    if (tab === activeTab) return;
    // Switch to intraday: default chartType to area
    if (tab === "分时" && (chartType === "candlestick" || chartType === "bar")) {
      setChartType("area");
    }
    // Switch from intraday to daily+: default back to candlestick
    if (activeTab === "分时" && tab !== "分时") {
      setChartType("candlestick");
    }
    setActiveTab(tab);
  };

  return (
    <div className="w-full">
      {/* Timeframe tabs + chart type switcher + volume toggle */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Timeframe tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabSwitch(tab)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                activeTab === tab
                  ? "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-1)]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-[rgba(255,255,255,0.08)]" />

        {/* Chart type switcher */}
        <ChartTypeSwitcher
          value={chartType}
          onChange={setChartType}
          disabled={disabledChartTypes}
        />

        {/* Divider */}
        <div className="w-px h-4 bg-[rgba(255,255,255,0.08)]" />

        {/* Volume toggle */}
        <button
          onClick={() => setShowVolume(v => !v)}
          className={cn(
            "px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-200 border",
            showVolume
              ? "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]"
              : "text-[var(--text-muted)] border-[rgba(255,255,255,0.06)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-1)]"
          )}
          title={showVolume ? "隐藏成交量" : "显示成交量"}
        >
          {showVolume ? "成交量 ●" : "成交量"}
        </button>
      </div>

      {/* Chart container with loading animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0.3 }}
        transition={{ duration: 0.5 }}
        className="relative w-full rounded-xl overflow-hidden"
        style={{
          background: "rgba(2, 6, 18, 0.5)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Loading shimmer overlay */}
        {!loaded && (
          <motion.div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(212,165,116,0.05), transparent)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s ease-in-out infinite",
            }}
          />
        )}

        <div ref={containerRef} className="w-full" style={{ height: 320 }} />
      </motion.div>
    </div>
  );
}
