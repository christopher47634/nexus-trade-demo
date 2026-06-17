"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemo } from "./DemoMode";

/* ─────────────────── Demo Highlight Badge ────────────────────── */

interface HighlightTarget {
  selector: string;
  label: string;
  step: number;
}

const highlights: HighlightTarget[] = [
  {
    selector: '[data-demo-highlight="optical-communication"]',
    label: "推荐点击",
    step: 0,
  },
];

function DemoBadge({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="absolute -top-2 -right-2 z-50 pointer-events-none"
    >
      <div
        className="px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
        style={{
          background: "linear-gradient(135deg, #D4A574 0%, #c4956a 100%)",
          color: "#0a0f1a",
          boxShadow: "0 2px 8px rgba(212,165,116,0.4)",
          animation: "demoPulse 2s ease-in-out infinite",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

/* ───────────────────── DemoGuide Component ───────────────────── */

export default function DemoGuide() {
  const { demoMode, currentStep, nextStep } = useDemo();
  const [activeHighlights, setActiveHighlights] = useState<string[]>([]);

  // Find which elements to highlight based on current step
  const checkHighlights = useCallback(() => {
    if (!demoMode) {
      setActiveHighlights([]);
      return;
    }

    const matching = highlights
      .filter((h) => h.step === currentStep)
      .map((h) => h.selector)
      .filter((selector) => document.querySelector(selector));

    setActiveHighlights(matching);
  }, [demoMode, currentStep]);

  // Observe DOM for highlighted elements
  useEffect(() => {
    checkHighlights();

    // Re-check when DOM changes (e.g., navigating to homepage)
    const observer = new MutationObserver(() => {
      checkHighlights();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [checkHighlights]);

  // Listen for clicks on highlighted elements
  useEffect(() => {
    if (!demoMode || activeHighlights.length === 0) return;

    const handleClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const highlightAttr = target.getAttribute("data-demo-highlight");
      if (highlightAttr) {
        // Remove highlight styling
        target.style.removeProperty("box-shadow");
        target.style.removeProperty("border");

        // Advance to next step
        nextStep();
      }
    };

    const cleanupFns: (() => void)[] = [];

    activeHighlights.forEach((selector) => {
      const el = document.querySelector(selector);
      if (!el) return;

      const highlightId =
        (el as HTMLElement).getAttribute("data-demo-highlight") || "unknown";

      // Apply highlight styling
      (el as HTMLElement).style.boxShadow =
        "0 0 0 2px rgba(212,165,116,0.6), 0 0 20px rgba(212,165,116,0.15)";
      (el as HTMLElement).style.border = "1px solid rgba(212,165,116,0.5)";
      (el as HTMLElement).style.transition =
        "box-shadow 0.3s ease, border-color 0.3s ease";
      (el as HTMLElement).style.position = "relative";

      // Inject badge
      const badgeContainer = document.createElement("div");
      badgeContainer.id = `demo-badge-${highlightId}`;
      badgeContainer.style.cssText =
        "position:absolute;top:-8px;right:-8px;z-index:50;pointer-events:none;";
      el.appendChild(badgeContainer);

      // Use React to render the badge into the container
      import("react-dom/client").then(({ createRoot }) => {
        const root = createRoot(badgeContainer);
        root.render(<DemoBadge label="推荐点击" />);
      });

      el.addEventListener("click", handleClick);
      cleanupFns.push(() => {
        el.removeEventListener("click", handleClick);
        (el as HTMLElement).style.removeProperty("box-shadow");
        (el as HTMLElement).style.removeProperty("border");
        const badge = document.getElementById(`demo-badge-${highlightId}`);
        if (badge) badge.remove();
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [demoMode, activeHighlights, nextStep]);

  // Show step indicator when demo is active
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
              {currentStep + 1}/8
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
