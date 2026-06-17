"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Beaker, Eye, EyeOff } from "lucide-react";
import { sectors } from "@/mock/sectors";
import AdvancedSectorCard from "@/components/sector-visuals/AdvancedSectorCard";
import FpsMeter from "@/components/visual-lab/FpsMeter";

// Only show the 3 sectors that have CSS visuals implemented
const LAB_SECTOR_IDS = ["optical-communication", "computing-power", "semiconductor"];
const labSectors = sectors.filter((s) => LAB_SECTOR_IDS.includes(s.id));

export default function VisualLabPage() {
  const [currentMode, setCurrentMode] = useState<"css" | "canvas">("css");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #020612 0%, #0a1628 100%)",
      }}
    >
      <FpsMeter />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Beaker size={22} className="text-[var(--accent)]" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Visual Lab
            </h1>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            高级板块卡片视觉实验 · 不影响线上主页面
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-4 mb-8"
        >
          {/* CSS / Canvas toggle */}
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{
              border: "1px solid var(--border-subtle)",
              background: "var(--surface-1)",
            }}
          >
            <button
              onClick={() => setCurrentMode("css")}
              className="px-4 py-2 text-xs font-medium transition-all duration-200"
              style={{
                background: currentMode === "css" ? "var(--surface-3)" : "transparent",
                color: currentMode === "css" ? "var(--text-primary)" : "var(--text-muted)",
                borderRight: "1px solid var(--border-subtle)",
              }}
            >
              CSS
            </button>
            <button
              onClick={() => setCurrentMode("canvas")}
              className="px-4 py-2 text-xs font-medium transition-all duration-200"
              style={{
                background: currentMode === "canvas" ? "var(--surface-3)" : "transparent",
                color: currentMode === "canvas" ? "var(--text-primary)" : "var(--text-muted)",
              }}
            >
              Canvas
            </button>
          </div>

          {/* Animation toggle */}
          <button
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              border: "1px solid var(--border-subtle)",
              background: animationsEnabled ? "var(--surface-2)" : "var(--surface-1)",
              color: animationsEnabled ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            {animationsEnabled ? (
              <Eye size={14} className="text-[var(--accent)]" />
            ) : (
              <EyeOff size={14} />
            )}
            动画 {animationsEnabled ? "开" : "关"}
          </button>

          {/* Mode label */}
          <span className="text-[10px] text-[var(--text-muted)] font-mono ml-auto">
            mode: {currentMode} · animation: {animationsEnabled ? "on" : "off"}
          </span>
        </motion.div>

        {/* Card Grid — 3 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {labSectors.map((sector, i) => (
            <AdvancedSectorCard
              key={sector.id}
              sector={sector}
              mode={currentMode}
              animationsEnabled={animationsEnabled}
              index={i}
            />
          ))}
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-[11px] text-[var(--text-muted)]">
            展示光通信 · 算力 · 半导体 三个板块的 CSS/Framer Motion 视觉效果对比
          </p>
          <a
            href="/"
            className="inline-block mt-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            ← 返回首页
          </a>
        </motion.div>
      </div>
    </div>
  );
}
