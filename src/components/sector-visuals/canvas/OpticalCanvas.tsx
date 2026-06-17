"use client";

import { useRef, useEffect, useCallback } from "react";

interface OpticalCanvasProps {
  width: number;
  height: number;
  animationsEnabled?: boolean;
  hovered?: boolean;
}

/**
 * Canvas 2D visual for 光通信 (Optical Communication)
 * - Dark transparent base (card bg shows through)
 * - 3-5 diagonal lines from top-right to bottom-left
 * - Small dots moving along lines slowly
 * - Gold #c9a84c and cyan #22d3ee, low opacity
 */
export default function OpticalCanvas({
  width,
  height,
  animationsEnabled = true,
  hovered = false,
}: OpticalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const timeRef = useRef(0);
  const hoveredRef = useRef(false);

  // Keep hover ref in sync
  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  const draw = useCallback(
    (w: number, h: number, t: number, isHover: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      try {
        ctx.clearRect(0, 0, w, h);

        // Lines: diagonal from top-right to bottom-left
        const lines = [
          { x1: w, y1: 0, x2: 0, y2: h, color: "#c9a84c", opacity: 0.20, lw: 1.5 },
          { x1: w * 0.9, y1: 0, x2: -w * 0.1, y2: h, color: "#22d3ee", opacity: 0.14, lw: 1.2 },
          { x1: w * 1.1, y1: h * 0.1, x2: w * 0.1, y2: h * 1.1, color: "#c9a84c", opacity: 0.10, lw: 1 },
          { x1: w * 0.95, y1: -h * 0.05, x2: -w * 0.05, y2: h * 0.95, color: "#22d3ee", opacity: 0.08, lw: 0.8 },
          { x1: w * 1.05, y1: h * 0.05, x2: w * 0.05, y2: h * 1.05, color: "#c9a84c", opacity: 0.06, lw: 0.6 },
        ];

        // Draw lines with dashed style
        ctx.setLineDash([8, 16]);
        lines.forEach((line) => {
          const glowOpacity = isHover ? line.opacity * 1.15 : line.opacity;
          ctx.beginPath();
          ctx.moveTo(line.x1, line.y1);
          ctx.lineTo(line.x2, line.y2);
          ctx.strokeStyle = line.color;
          ctx.globalAlpha = Math.min(glowOpacity, 0.5);
          ctx.lineWidth = line.lw;
          ctx.stroke();
        });
        ctx.setLineDash([]);

        // Dots traveling along lines
        const dots = [
          { delay: 0, speed: 0.029, color: "#c9a84c", size: 3, lineIdx: 0 },
          { delay: 0.25, speed: 0.023, color: "#22d3ee", size: 2.5, lineIdx: 1 },
          { delay: 0.5, speed: 0.025, color: "#c9a84c", size: 2, lineIdx: 2 },
          { delay: 0.15, speed: 0.021, color: "#22d3ee", size: 2, lineIdx: 3 },
          { delay: 0.35, speed: 0.027, color: "#c9a84c", size: 1.8, lineIdx: 4 },
          { delay: 0.6, speed: 0.024, color: "#22d3ee", size: 2.2, lineIdx: 0 },
          { delay: 0.45, speed: 0.020, color: "#c9a84c", size: 2, lineIdx: 1 },
        ];

        const speedMul = isHover ? 1.15 : 1;

        dots.forEach((dot) => {
          const line = lines[dot.lineIdx];
          const rawProgress = ((t * dot.speed * speedMul + dot.delay) % 2);
          const progress = rawProgress <= 1 ? rawProgress : 2 - rawProgress;

          const px = line.x1 + (line.x2 - line.x1) * progress;
          const py = line.y1 + (line.y2 - line.y1) * progress;

          ctx.beginPath();
          ctx.arc(px, py, dot.size, 0, Math.PI * 2);
          ctx.fillStyle = dot.color;
          ctx.globalAlpha = isHover ? 0.32 : 0.22;
          ctx.fill();

          // Glow effect on hover
          if (isHover) {
            ctx.beginPath();
            ctx.arc(px, py, dot.size * 2.5, 0, Math.PI * 2);
            const grad = ctx.createRadialGradient(px, py, dot.size * 0.5, px, py, dot.size * 2.5);
            grad.addColorStop(0, dot.color);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.globalAlpha = 0.15;
            ctx.fill();
          }
        });

        ctx.globalAlpha = 1;
      } catch {
        // Graceful fallback: canvas draw failure → just don't draw
      }
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;

    // Check prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = mq.matches;

    // DPR capped at 2
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    // If reduced motion or animations disabled, draw single static frame
    if (reducedMotion || !animationsEnabled) {
      draw(width, height, 0, false);
      return;
    }

    // IntersectionObserver: pause when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    let lastTimestamp = 0;
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isVisibleRef.current) {
        timeRef.current += delta;
        draw(width, height, timeRef.current, hoveredRef.current);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
    };
  }, [width, height, animationsEnabled, draw]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
  );
}
