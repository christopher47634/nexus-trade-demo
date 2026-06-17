"use client";

import { useRef, useState, useEffect } from "react";
import type { Sector } from "@/mock/sectors";
import OpticalCssVisual from "@/components/sector-visuals/css/OpticalCssVisual";
import ComputeCssVisual from "@/components/sector-visuals/css/ComputeCssVisual";
import SemiconductorCssVisual from "@/components/sector-visuals/css/SemiconductorCssVisual";
import OpticalCanvas from "@/components/sector-visuals/canvas/OpticalCanvas";
import ComputeCanvas from "@/components/sector-visuals/canvas/ComputeCanvas";
import SemiconductorCanvas from "@/components/sector-visuals/canvas/SemiconductorCanvas";

interface VisualCardComparisonProps {
  sector: Sector;
  mode: "css" | "canvas";
  animationsEnabled: boolean;
}

/**
 * Wrapper that measures its own size via ResizeObserver
 * and provides it to Canvas children.
 */
function CanvasVisualWrapper({
  children,
  onHoverChange,
}: {
  children: (width: number, height: number) => React.ReactNode;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setSize((prev) => {
          if (prev.width === Math.floor(width) && prev.height === Math.floor(height)) return prev;
          return { width: Math.floor(width), height: Math.floor(height) };
        });
      }
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      {size.width > 0 && size.height > 0 && children(size.width, size.height)}
    </div>
  );
}

export default function VisualCardComparison({
  sector,
  mode,
  animationsEnabled,
}: VisualCardComparisonProps) {
  const [hovered, setHovered] = useState(false);

  if (mode === "canvas") {
    return (
      <CanvasVisualWrapper onHoverChange={setHovered}>
        {(width, height) => {
          switch (sector.visualType) {
            case "optical":
              return (
                <OpticalCanvas
                  width={width}
                  height={height}
                  animationsEnabled={animationsEnabled}
                  hovered={hovered}
                />
              );
            case "compute":
              return (
                <ComputeCanvas
                  width={width}
                  height={height}
                  animationsEnabled={animationsEnabled}
                  hovered={hovered}
                />
              );
            case "semiconductor":
              return (
                <SemiconductorCanvas
                  width={width}
                  height={height}
                  animationsEnabled={animationsEnabled}
                  hovered={hovered}
                />
              );
            default:
              return (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs text-[var(--text-muted)] font-mono opacity-40">
                    Canvas — 无此视觉类型
                  </span>
                </div>
              );
          }
        }}
      </CanvasVisualWrapper>
    );
  }

  // CSS mode
  switch (sector.visualType) {
    case "optical":
      return (
        <OpticalCssVisual
          accentColor={sector.accentColor}
          animationsEnabled={animationsEnabled}
        />
      );
    case "compute":
      return (
        <ComputeCssVisual
          accentColor={sector.accentColor}
          animationsEnabled={animationsEnabled}
        />
      );
    case "semiconductor":
      return (
        <SemiconductorCssVisual
          accentColor={sector.accentColor}
          animationsEnabled={animationsEnabled}
        />
      );
    default:
      return null;
  }
}
