"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { KlineBar } from "@/mock/kline";

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
  const [activeTab, setActiveTab] = useState<TimeFrame>("日K");
  const [loaded, setLoaded] = useState(false);

  const tabs: TimeFrame[] = ["分时", "日K", "周K", "月K"];

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    let chart: any = null;
    let candleSeries: any = null;
    let volumeSeries: any = null;

    const initChart = async () => {
      try {
        // Wait for container to have dimensions
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!containerRef.current || containerRef.current.clientWidth === 0) {
          console.warn("Chart container has no width, retrying...");
          setTimeout(() => initChart(), 200);
          return;
        }

        const { createChart, ColorType, CrosshairMode } = await import(
          "lightweight-charts"
        );

        if (!containerRef.current) return;

        // Clear previous chart
        containerRef.current.innerHTML = "";

        chart = createChart(containerRef.current, {
          width: containerRef.current.clientWidth,
          height: 320,
          layout: {
            background: { type: ColorType.Solid, color: "transparent" },
            textColor: "#94A3B8",
            fontSize: 11,
          },
          grid: {
            vertLines: { color: "rgba(255, 255, 255, 0.04)" },
            horzLines: { color: "rgba(255, 255, 255, 0.04)" },
          },
          crosshair: {
            mode: CrosshairMode.Normal,
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

        // Candlestick series
        candleSeries = chart.addCandlestickSeries({
          upColor: "#34D399",
          downColor: "#F87171",
          borderDownColor: "#F87171",
          borderUpColor: "#34D399",
          wickDownColor: "#F87171",
          wickUpColor: "#34D399",
        });

        candleSeries.setData(
          data.map((d) => ({
            time: d.time as any,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }))
        );

        // Volume series
        volumeSeries = chart.addHistogramSeries({
          color: "#26a69a",
          priceFormat: { type: "volume" },
          priceScaleId: "volume",
        });

        chart.priceScale("volume").applyOptions({
          scaleMargins: { top: 0.8, bottom: 0 },
        });

        volumeSeries.setData(
          data.map((d) => ({
            time: d.time as any,
            value: d.volume,
            color: d.close >= d.open ? "rgba(52,211,153,0.35)" : "rgba(248,113,113,0.35)",
          }))
        );

        chart.timeScale().fitContent();

        // Trigger loaded animation
        setTimeout(() => setLoaded(true), 100);

        // Resize observer
        const resizeObserver = new ResizeObserver((entries) => {
          if (entries[0] && chart) {
            chart.applyOptions({
              width: entries[0].contentRect.width,
            });
          }
        });
        resizeObserver.observe(containerRef.current);

        return () => {
          resizeObserver.disconnect();
        };
      } catch (err) {
        console.error("Lightweight Charts init failed:", err);
        // Fallback: render a simple SVG chart
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
      if (chart) {
        chart.remove();
        chart = null;
      }
    };
  }, [data, activeTab]);

  return (
    <div className="w-full">
      {/* Timeframe tabs */}
      <div className="flex items-center gap-1 mb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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
