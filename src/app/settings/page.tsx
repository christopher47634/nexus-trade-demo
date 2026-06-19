"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Monitor,
  Volume2,
  Eye,
  ChevronRight,
  Moon,
  Zap,
  Lock,
  Smartphone,
  BarChart3,
  Clock,
  Globe,
  Info,
} from "lucide-react";
import DesktopShell from "@/components/layout/DesktopShell";
import { cn } from "@/lib/utils";

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-11 h-6 rounded-full transition-all duration-300 shrink-0",
        enabled
          ? "bg-[var(--accent)] shadow-[0_0_12px_rgba(212,165,116,0.3)]"
          : "bg-[var(--surface-2)]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300",
          enabled ? "left-[22px]" : "left-0.5"
        )}
      />
    </button>
  );
}

function SettingRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 px-1">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "rgba(212,165,116,0.08)",
            border: "1px solid rgba(212,165,116,0.12)",
          }}
        >
          <Icon size={15} className="text-[var(--accent)]" />
        </div>
        <div className="min-w-0">
          <span className="text-sm text-[var(--text-primary)] block">{label}</span>
          {description && (
            <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">{description}</span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function SectionCard({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-2xl p-4 md:p-5"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-1">
        {title}
      </h3>
      <div className="divide-y divide-[rgba(255,255,255,0.04)]">
        {children}
      </div>
    </motion.div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    haptic: true,
    darkMode: true,
    compactMode: false,
    autoRefresh: true,
    refreshInterval: 5,
    showVolume: true,
    showMA: true,
    riskAlert: true,
    confirmOrder: true,
    biometric: false,
    priceAlert: true,
    klineAnimation: true,
    reducedMotion: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DesktopShell>
      <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto page-enter space-y-4 md:space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(212,165,116,0.2) 0%, rgba(212,165,116,0.05) 100%)",
              border: "1px solid rgba(212,165,116,0.2)",
            }}
          >
            <Settings size={20} className="text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">设置</h1>
            <p className="text-xs text-[var(--text-muted)]">个性化你的交易体验</p>
          </div>
        </motion.div>

        {/* Account Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="glass rounded-2xl p-4 md:p-5"
          style={{
            background: "linear-gradient(135deg, rgba(212,165,116,0.06) 0%, rgba(212,165,116,0.02) 100%)",
            border: "1px solid rgba(212,165,116,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-[var(--accent)]"
              style={{
                background: "linear-gradient(135deg, rgba(212,165,116,0.2) 0%, rgba(212,165,116,0.08) 100%)",
                border: "1px solid rgba(212,165,116,0.25)",
                boxShadow: "0 4px 16px rgba(212,165,116,0.15)",
              }}
            >
              N
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Nexus Trade</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">模拟交易账户 · 专业版</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-medium"
                  style={{ color: "#D4A574", background: "rgba(212,165,116,0.12)", border: "1px solid rgba(212,165,116,0.15)" }}
                >
                  演示模式
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">ID: NX-2026-0001</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[var(--text-muted)] shrink-0" />
          </div>
        </motion.div>

        {/* Trading Preferences */}
        <SectionCard title="交易偏好" delay={0.1}>
          <SettingRow icon={Bell} label="交易通知" description="委托成交、价格预警推送">
            <Toggle enabled={settings.notifications} onToggle={() => toggle("notifications")} />
          </SettingRow>
          <SettingRow icon={Volume2} label="提示音效" description="下单、成交音效反馈">
            <Toggle enabled={settings.sound} onToggle={() => toggle("sound")} />
          </SettingRow>
          <SettingRow icon={Smartphone} label="触感反馈" description="操作时震动反馈">
            <Toggle enabled={settings.haptic} onToggle={() => toggle("haptic")} />
          </SettingRow>
          <SettingRow icon={Shield} label="下单确认" description="提交委托前二次确认">
            <Toggle enabled={settings.confirmOrder} onToggle={() => toggle("confirmOrder")} />
          </SettingRow>
          <SettingRow icon={Zap} label="风险预警" description="持仓异动实时提醒">
            <Toggle enabled={settings.riskAlert} onToggle={() => toggle("riskAlert")} />
          </SettingRow>
        </SectionCard>

        {/* Display Settings */}
        <SectionCard title="显示设置" delay={0.15}>
          <SettingRow icon={Moon} label="深色模式" description="护眼暗色主题">
            <Toggle enabled={settings.darkMode} onToggle={() => toggle("darkMode")} />
          </SettingRow>
          <SettingRow icon={Monitor} label="紧凑模式" description="缩小间距，显示更多内容">
            <Toggle enabled={settings.compactMode} onToggle={() => toggle("compactMode")} />
          </SettingRow>
          <SettingRow icon={Eye} label="K线动画" description="图表加载过渡动画">
            <Toggle enabled={settings.klineAnimation} onToggle={() => toggle("klineAnimation")} />
          </SettingRow>
          <SettingRow icon={Palette} label="减弱动效" description="减少动画和过渡效果">
            <Toggle enabled={settings.reducedMotion} onToggle={() => toggle("reducedMotion")} />
          </SettingRow>
        </SectionCard>

        {/* Chart Settings */}
        <SectionCard title="行情设置" delay={0.2}>
          <SettingRow icon={BarChart3} label="显示成交量" description="K线图下方成交量柱">
            <Toggle enabled={settings.showVolume} onToggle={() => toggle("showVolume")} />
          </SettingRow>
          <SettingRow icon={BarChart3} label="均线指标" description="MA5 / MA10 / MA20">
            <Toggle enabled={settings.showMA} onToggle={() => toggle("showMA")} />
          </SettingRow>
          <SettingRow icon={Clock} label="自动刷新" description="行情数据定时更新">
            <Toggle enabled={settings.autoRefresh} onToggle={() => toggle("autoRefresh")} />
          </SettingRow>
          {settings.autoRefresh && (
            <SettingRow icon={Globe} label="刷新频率" description="数据更新间隔">
              <span className="text-sm text-[var(--accent)] font-mono">{settings.refreshInterval}s</span>
            </SettingRow>
          )}
          <SettingRow icon={Bell} label="价格预警" description="关注股票价格变动提醒">
            <Toggle enabled={settings.priceAlert} onToggle={() => toggle("priceAlert")} />
          </SettingRow>
        </SectionCard>

        {/* Security */}
        <SectionCard title="安全设置" delay={0.25}>
          <SettingRow icon={Lock} label="生物识别" description="指纹 / 面容解锁">
            <Toggle enabled={settings.biometric} onToggle={() => toggle("biometric")} />
          </SettingRow>
          <SettingRow icon={Shield} label="交易密码" description="修改交易密码">
            <ChevronRight size={16} className="text-[var(--text-muted)]" />
          </SettingRow>
          <SettingRow icon={Shield} label="登录设备" description="管理已登录设备">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">1 台设备</span>
              <ChevronRight size={16} className="text-[var(--text-muted)]" />
            </div>
          </SettingRow>
        </SectionCard>

        {/* About */}
        <SectionCard title="关于" delay={0.3}>
          <SettingRow icon={Info} label="版本信息">
            <span className="text-xs text-[var(--text-muted)] font-mono">v7.0.0</span>
          </SettingRow>
          <SettingRow icon={Globe} label="服务条款">
            <ChevronRight size={16} className="text-[var(--text-muted)]" />
          </SettingRow>
          <SettingRow icon={Shield} label="隐私政策">
            <ChevronRight size={16} className="text-[var(--text-muted)]" />
          </SettingRow>
        </SectionCard>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center pt-2 pb-4"
        >
          <p className="text-[10px] text-[var(--text-muted)] opacity-50">
            Nexus Trade · 模拟交易平台 · 所有数据均为虚拟数据
          </p>
        </motion.div>
      </div>
    </DesktopShell>
  );
}
