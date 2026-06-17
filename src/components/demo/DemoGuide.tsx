"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useDemo, demoSteps } from "./DemoMode";

/* ─────────────────── Step Configuration ─────────────────────── */

interface StepConfig {
  /** CSS selector for the element to highlight */
  selector: string;
  /** Badge label text */
  badge: string;
  /** Route pattern this step applies to (startsWith match) */
  route: string;
  /** Optional: after which step to auto-advance (for click-driven steps) */
  advanceOn?: "click" | "delay";
  /** For delay-based advance, milliseconds to wait */
  delayMs?: number;
  /** Navigation target when advancing from this step */
  navigateTo?: string;
}

const stepConfigs: StepConfig[] = [
  // Step 0: Homepage — highlight 光通信 card
  {
    selector: '[data-demo-highlight="optical-communication"]',
    badge: "推荐点击",
    route: "/",
    advanceOn: "click",
    navigateTo: "/sectors/optical-communication",
  },
  // Step 1: Sector page — highlight first stock row
  {
    selector: '[data-demo-highlight="first-stock"]',
    badge: "下一步",
    route: "/sectors/",
    advanceOn: "click",
    navigateTo: "/stocks/300308",
  },
  // Step 2: Stock page — highlight chart type switcher
  {
    selector: '[data-demo-highlight="chart-type-switcher"]',
    badge: "切换图表类型",
    route: "/stocks/",
    advanceOn: "click",
  },
  // Step 3: Stock page — highlight buy button
  {
    selector: '[data-demo-highlight="buy-button"]',
    badge: "模拟交易入口",
    route: "/stocks/",
    advanceOn: "click",
  },
  // Step 4: TradePanel — highlight price/quantity inputs
  {
    selector: '[data-demo-highlight="trade-inputs"]',
    badge: "调整参数",
    route: "/stocks/",
    advanceOn: "delay",
    delayMs: 2500,
  },
  // Step 5: TradePanel — highlight confirm buy button
  {
    selector: '[data-demo-highlight="confirm-buy"]',
    badge: "提交交易",
    route: "/stocks/",
    advanceOn: "click",
  },
  // Step 6: TradePanel — highlight view orders button
  {
    selector: '[data-demo-highlight="view-orders"]',
    badge: "查看成交记录",
    route: "/stocks/",
    advanceOn: "click",
    navigateTo: "/orders",
  },
  // Step 7: Orders page — highlight order table
  {
    selector: '[data-demo-highlight="order-table"]',
    badge: "演示完成 ✓",
    route: "/orders",
    advanceOn: "delay",
    delayMs: 3000,
  },
];

/* ─────────────────── CSS injection (once) ───────────────────── */

let styleInjected = false;
function injectDemoStyles() {
  if (styleInjected || typeof document === "undefined") return;
  styleInjected = true;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes demoPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    @keyframes demoBadgeBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }
    [data-demo-active="true"] {
      position: relative;
      z-index: 85;
    }
  `;
  document.head.appendChild(style);
}

/* ─────────────────── DemoGuide Component ────────────────────── */

export default function DemoGuide() {
  const { demoMode, currentStep, nextStep } = useDemo();
  const pathname = usePathname();
  const router = useRouter();
  const cleanupRef = useRef<(() => void) | null>(null);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Inject CSS once
  useEffect(() => {
    injectDemoStyles();
  }, []);

  /** Determine if current route matches the step's expected route */
  const routeMatches = useCallback(
    (stepRoute: string) => {
      if (stepRoute === "/") return pathname === "/";
      return pathname.startsWith(stepRoute);
    },
    [pathname]
  );

  /** Core highlight + interaction logic */
  const applyHighlight = useCallback(() => {
    // Clean up previous highlight
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }

    if (!demoMode) return;

    const config = stepConfigs[currentStep];
    if (!config) return;

    // If not on the right route, don't highlight (DemoGuide just shows the step indicator)
    if (!routeMatches(config.route)) return;

    const el = document.querySelector(config.selector) as HTMLElement | null;
    if (!el) return;

    // Save original styles
    const origBoxShadow = el.style.boxShadow;
    const origBorder = el.style.border;
    const origPosition = el.style.position;
    const origZIndex = el.style.zIndex;

    // Apply gold highlight
    el.style.boxShadow =
      "0 0 0 2px rgba(212,165,116,0.7), 0 0 24px rgba(212,165,116,0.2)";
    el.style.border = "2px solid rgba(212,165,116,0.7)";
    el.style.transition = "box-shadow 0.3s ease, border-color 0.3s ease";
    el.style.position = origPosition || "relative";
    el.style.zIndex = "85";
    el.setAttribute("data-demo-active", "true");

    // Create badge
    const badge = document.createElement("div");
    badge.id = "demo-guide-badge";
    badge.style.cssText =
      "position:absolute;top:-10px;right:-10px;z-index:90;pointer-events:none;";
    badge.innerHTML = `<div style="
      background: linear-gradient(135deg, #D4A574 0%, #c4956a 100%);
      color: #0a0f1a;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 2px 10px rgba(212,165,116,0.5);
      animation: demoBadgeBounce 1.5s ease-in-out infinite;
    ">${config.badge}</div>`;
    el.appendChild(badge);

    // Scroll element into view
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Cleanup function
    const cleanup = () => {
      el.style.boxShadow = origBoxShadow;
      el.style.border = origBorder;
      el.style.position = origPosition;
      el.style.zIndex = origZIndex;
      el.removeAttribute("data-demo-active");
      const b = document.getElementById("demo-guide-badge");
      if (b) b.remove();
      el.removeEventListener("click", handleClick);
    };

    // Click handler
    const handleClick = () => {
      cleanup();
      cleanupRef.current = null;

      // Navigate if needed
      if (config.navigateTo) {
        router.push(config.navigateTo);
        // Advance step after a brief delay to let navigation start
        setTimeout(() => nextStep(), 100);
      } else {
        nextStep();
      }
    };

    if (config.advanceOn === "click") {
      el.addEventListener("click", handleClick);
    } else if (config.advanceOn === "delay") {
      delayTimerRef.current = setTimeout(() => {
        cleanup();
        cleanupRef.current = null;
        if (config.navigateTo) {
          router.push(config.navigateTo);
          setTimeout(() => nextStep(), 100);
        } else {
          nextStep();
        }
      }, config.delayMs || 2000);
    }

    cleanupRef.current = cleanup;
  }, [demoMode, currentStep, routeMatches, nextStep, router]); // eslint-disable-line react-hooks/exhaustive-deps

  // Run highlight on step change and route change
  useEffect(() => {
    // Small delay to let the page render
    const timer = setTimeout(applyHighlight, 300);
    return () => clearTimeout(timer);
  }, [applyHighlight, pathname]);

  // MutationObserver to re-apply highlight when DOM changes (e.g., element appears after mount)
  useEffect(() => {
    if (!demoMode) return;

    const config = stepConfigs[currentStep];
    if (!config || !routeMatches(config.route)) return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    let retryCount = 0;
    const maxRetries = 50; // ~5 seconds at 100ms intervals

    const tryHighlight = () => {
      const el = document.querySelector(config.selector);
      if (el) {
        applyHighlight();
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(tryHighlight, 100);
      }
    };

    // Initial attempt
    tryHighlight();

    // Watch for DOM mutations
    const observer = new MutationObserver(() => {
      const el = document.querySelector(config.selector);
      if (el && !cleanupRef.current) {
        applyHighlight();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [demoMode, currentStep, pathname, routeMatches, applyHighlight]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  // Clean up highlight when demo is turned off
  useEffect(() => {
    if (!demoMode) {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    }
  }, [demoMode]);

  // Step indicator bar
  return (
    <AnimatePresence>
      {demoMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] pointer-events-none"
        >
          <div
            className="px-4 py-2 rounded-xl flex items-center gap-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(21,29,45,0.95) 0%, rgba(13,20,33,0.96) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(212,165,116,0.25)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: "#D4A574",
                boxShadow: "0 0 8px rgba(212,165,116,0.6)",
                animation: "demoPulse 2s ease-in-out infinite",
              }}
            />
            <span className="text-[12px] text-[var(--text-secondary)]">
              演示模式
            </span>
            <span
              className="text-[11px] font-mono-nums px-1.5 py-0.5 rounded-md"
              style={{
                background: "rgba(212,165,116,0.12)",
                color: "#D4A574",
              }}
            >
              {currentStep + 1}/{demoSteps.length}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              {demoSteps[currentStep]}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
