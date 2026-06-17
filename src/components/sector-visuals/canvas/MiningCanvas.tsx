"use client";

import { useRef, useEffect, useCallback } from "react";

interface MiningCanvasProps {
  width: number;
  height: number;
  animationsEnabled?: boolean;
  hovered?: boolean;
}

/**
 * Canvas 2D visual for 矿山 (Mining)
 * - Horizontal strata lines: 4-5 lines at different heights, slightly wavy
 * - Ore veins: 2-3 diagonal glowing lines crossing through strata
 * - Strata parallax: lines move at slightly different speeds (slow drift)
 * - Ore vein pulse: slow glow pulse (10-14s)
 * - Hover: ore veins brighten, strata lines sharpen
 * - Colors: copper #a0522d + iron grey #6b7280
 * - Feel: geological cross-section, raw material depth
 */
export default function MiningCanvas({
  width,
  height,
  animationsEnabled = true,
  hovered = false,
}: MiningCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const timeRef = useRef(0);
  const hoveredRef = useRef(false);
  const animEnabledRef = useRef(animationsEnabled);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    animEnabledRef.current = animationsEnabled;
  }, [animationsEnabled]);

  const draw = useCallback(
    (w: number, h: number, t: number, isHover: boolean, animOn: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      try {
        ctx.clearRect(0, 0, w, h);

        const copper = "#a0522d";
        const ironGrey = "#6b7280";
        const glowMul = isHover ? 1.15 : 1;
        const sharpMul = isHover ? 1.3 : 1;

        // --- Horizontal strata lines ---
        const strata = [
          { baseY: h * 0.18, opacity: 0.10, lw: 0.8, driftSpeed: 0.015, freq: 2.0, amp: h * 0.012 },
          { baseY: h * 0.32, opacity: 0.14, lw: 0.8, driftSpeed: 0.012, freq: 2.5, amp: h * 0.015 },
          { baseY: h * 0.48, opacity: 0.18, lw: 1.0, driftSpeed: 0.010, freq: 1.8, amp: h * 0.018 },
          { baseY: h * 0.62, opacity: 0.12, lw: 0.8, driftSpeed: 0.008, freq: 2.2, amp: h * 0.010 },
          { baseY: h * 0.78, opacity: 0.08, lw: 0.5, driftSpeed: 0.006, freq: 3.0, amp: h * 0.008 },
        ];

        strata.forEach((layer, i) => {
          const drift = animOn ? t * layer.driftSpeed * w * 0.02 : 0;
          ctx.globalAlpha = layer.opacity * glowMul * sharpMul;
          ctx.strokeStyle = ironGrey;
          ctx.lineWidth = layer.lw * (isHover ? 1.1 : 1);
          ctx.beginPath();

          for (let x = 0; x <= w; x += 2) {
            const wave = Math.sin(((x + drift) / w) * Math.PI * layer.freq + i * 0.7) * layer.amp;
            const y = layer.baseY + wave;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });

        // --- Ore veins: diagonal glowing lines ---
        const oreVeins = [
          { sx: w * 0.10, sy: h * 0.15, ex: w * 0.75, ey: h * 0.85, color: copper, opacity: 0.14, lw: 0.8 },
          { sx: w * 0.30, sy: h * 0.05, ex: w * 0.90, ey: h * 0.70, color: copper, opacity: 0.10, lw: 0.5 },
          { sx: w * 0.50, sy: h * 0.20, ex: w * 0.95, ey: h * 0.90, color: ironGrey, opacity: 0.08, lw: 0.5 },
        ];

        const veinPulse = animOn
          ? 1 + 0.2 * Math.sin(t * ((2 * Math.PI) / 12))
          : 1;

        oreVeins.forEach((vein) => {
          ctx.globalAlpha = Math.min(vein.opacity * glowMul * veinPulse, 0.25);
          ctx.strokeStyle = vein.color;
          ctx.lineWidth = vein.lw * (isHover ? 1.2 : 1);
          ctx.beginPath();
          ctx.moveTo(vein.sx, vein.sy);
          ctx.lineTo(vein.ex, vein.ey);
          ctx.stroke();
        });

        // Ore vein intersection highlights
        oreVeins.forEach((vein) => {
          strata.forEach((layer) => {
            // Check approximate intersection
            const veinMidX = (vein.sx + vein.ex) / 2;
            const veinMidY = (vein.sy + vein.ey) / 2;
            const layerMidY = layer.baseY;

            if (Math.abs(veinMidY - layerMidY) < h * 0.15) {
              ctx.globalAlpha = 0.06 * glowMul * veinPulse;
              ctx.fillStyle = copper;
              ctx.beginPath();
              ctx.arc(veinMidX, layerMidY, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        });

        // --- Strata texture dots (subtle grain) ---
        ctx.globalAlpha = 0.03;
        ctx.fillStyle = ironGrey;
        for (let i = 0; i < 20; i++) {
          const dx = (i * 37 + 11) % 100;
          const dy = (i * 53 + 7) % 100;
          const px = (dx / 100) * w;
          const py = (dy / 100) * h;
          ctx.beginPath();
          ctx.arc(px, py, 1, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      } catch {
        // Graceful fallback
      }
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = mq.matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    if (reducedMotion || !animationsEnabled) {
      draw(width, height, 0, false, false);
      return;
    }

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
        draw(
          width,
          height,
          timeRef.current,
          hoveredRef.current,
          animEnabledRef.current
        );
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
