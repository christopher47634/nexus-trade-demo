"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  BarChart3,
  ArrowLeftRight,
  Briefcase,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { icon: LayoutGrid, label: "市场" },
  { icon: BarChart3, label: "板块" },
  { icon: ArrowLeftRight, label: "交易" },
  { icon: Briefcase, label: "持仓" },
  { icon: User, label: "我的" },
];

export default function MobileShell({
  children,
  activeTab: controlledTab,
  hideTabs = false,
}: {
  children: React.ReactNode;
  activeTab?: number;
  hideTabs?: boolean;
}) {
  const [internalTab, setInternalTab] = useState(0);
  const activeTab = controlledTab ?? internalTab;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <div className="global-bg" />

      {/* Main Content - with safe area bottom padding */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          paddingBottom: hideTabs
            ? "env(safe-area-inset-bottom, 0px)"
            : "calc(80px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {children}
      </main>

      {/* Bottom Tab Bar - Floating Glass */}
      {!hideTabs && (<motion.nav
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "rgba(2, 6, 18, 0.6)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
          boxShadow: "0 -24px 80px rgba(0,0,0,0.45)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = i === activeTab;
            return (
              <button
                key={tab.label}
                onClick={() => setInternalTab(i)}
                className="relative flex flex-col items-center gap-0.5 flex-1 py-1 mobile-press"
              >
                <div className="relative">
                  <Icon
                    size={20}
                    className={cn(
                      "transition-colors duration-200",
                      isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-muted)]"
                    )}
                    style={isActive ? { filter: "drop-shadow(0 0 6px rgba(212,165,116,0.4))" } : undefined}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-tab-glow"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(212,165,116,0.35), transparent 70%)",
                        filter: "blur(10px)",
                      }}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] transition-colors duration-200",
                    isActive
                      ? "text-[var(--accent)] font-medium"
                      : "text-[var(--text-muted)]"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.nav>)}
    </div>
  );
}
