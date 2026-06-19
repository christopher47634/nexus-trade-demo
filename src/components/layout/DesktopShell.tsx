"use client";

import { useMouseGlow } from "@/hooks/use-mouse-position";
import { useCursorGlow } from "@/hooks/useCursorGlow";
import { CursorOverlay } from "@/components/interaction/CursorOverlay";
import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  ClipboardList,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import { DemoButton } from "@/components/demo/DemoMode";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "市场", href: "/" },
  { icon: TrendingUp, label: "板块", href: "/#sectors" },
  { icon: Briefcase, label: "持仓", href: "/portfolio" },
  { icon: ClipboardList, label: "订单", href: "/orders" },
  { icon: Settings, label: "设置", href: "/settings" },
];

export default function DesktopShell({
  children,
}: {
  children: React.ReactNode;
}) {
  useMouseGlow();
  useCursorGlow();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Global Background */}
      <div className="global-bg" />

      {/* Desktop Left Sidebar — hidden on mobile */}
      <motion.aside
        initial={{ x: -64, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed left-0 top-0 bottom-0 z-30 hidden md:flex flex-col items-center w-16 py-4 bg-[var(--surface-1)] border-r border-[var(--border-subtle)]"
      >
        {/* Logo */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent)] opacity-80 flex items-center justify-center mb-6">
          <span className="text-[var(--bg-primary)] font-bold text-sm">N</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-[var(--accent)] bg-[var(--accent-soft)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--glass-bg)]"
                )}
              >
                <Icon size={18} />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[1px] w-[3px] h-5 rounded-r-full bg-[var(--accent)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="flex flex-col items-center gap-2">
          <DemoButton />
          <ThemeSwitcher />
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-16 min-h-screen min-w-0 overflow-hidden">
        <CursorOverlay />
        {children}
      </main>

      {/* Mobile Bottom Nav — visible only on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-around py-2.5 bg-[#0d0d14]/95 backdrop-blur-xl border-t border-[rgba(212,165,116,0.12)]" style={{boxShadow: '0 -4px 20px rgba(0,0,0,0.4)'}}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors",
                isActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)]"
              )}
            >
              <Icon size={18} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
