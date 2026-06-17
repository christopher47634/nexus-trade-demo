"use client";

import { useRef, useEffect, useCallback } from "react";

interface SemiconductorCanvasProps {
  width: number;
  height: number;
  animationsEnabled?: boolean;
  hovered?: boolean;
}

/**
 * Canvas 2D visual for 半导体 (Semiconductor)
 * - Dark transparent base
 * - Concentric circles (3-5) centered on card
 * - Radial etch lines from center outward
 * - Slow rotation (~30s per revolution)
 * - Hover: scan line sweeps across
 * - Indigo #6366f1 + purple #a855f7 + occasional gold #c9a84c
 */
export default function SemiconductorCanvas({
  width,
  height,
  animationsEnabled = true,
  hovered = false,
}: SemiconductorCanvasProps) {
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

        const indigo = "#6366f1";
        const purple = "#a855f7";
        const gold = "#c9a84c";

        const cx = w * 0.59;
        const cy = h * 0.5;
        const maxRadius = Math.min(w, h) * 0.42;

        const rotation = animOn ? (t / 30) * Math.PI * 2 : 0;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);

        // Concentric circles
        const ringCount = 5;
        for (let i = 0; i < ringCount; i++) {
          const r = maxRadius * ((i + 1) / ringCount);
          const ringOpacity = 0.1 + (0.08 * (ringCount - i)) / ringCount;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.strokeStyle = i % 2 === 0 ? indigo : purple;
          ctx.globalAlpha = ringOpacity;
          ctx.lineWidth = 1.5 - i * 0.15;
          ctx.stroke();
        }

        // Wafer surface fill — very faint
        ctx.beginPath();
        ctx.arc(0, 0, maxRadius * 0.97, 0, Math.PI * 2);
        ctx.fillStyle = indigo;
        ctx.globalAlpha = 0.02;
        ctx.fill();

        // Radial etch lines (10 lines)
        const etchCount = 10;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < etchCount; i++) {
          const angle = (i / etchCount) * Math.PI * 2;
          const innerR = maxRadius * 0.25;
          const outerR = maxRadius;
          const x1 = Math.cos(angle) * innerR;
          const y1 = Math.sin(angle) * innerR;
          const x2 = Math.cos(angle) * outerR;
          const y2 = Math.sin(angle) * outerR;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = i % 2 === 0 ? indigo : purple;
          ctx.globalAlpha = 0.1;
          ctx.stroke();
        }

        // Cross lines (horizontal + vertical through center)
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = indigo;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -maxRadius);
        ctx.lineTo(0, maxRadius);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-maxRadius, 0);
        ctx.lineTo(maxRadius, 0);
        ctx.stroke();

        // Die grid cells in center area
        const cellW = 14;
        const cellH = 18;
        const cols = 5;
        const rows = 3;
        ctx.globalAlpha = 0.07;
        ctx.strokeStyle = purple;
        ctx.lineWidth = 0.4;
        for (let c = -Math.floor(cols / 2); c <= Math.floor(cols / 2); c++) {
          for (let r = -Math.floor(rows / 2); r <= Math.floor(rows / 2); r++) {
            const rx = c * 18 - cellW / 2;
            const ry = r * 22 - cellH / 2;
            ctx.beginPath();
            ctx.roundRect(rx, ry, cellW, cellH, 1);
            ctx.stroke();
          }
        }

        // Center glow
        const glowRadius = maxRadius * 0.15;
        const glowAlpha = animOn ? 0.04 + 0.03 * Math.sin(t * 2) : 0.05;
        const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
        centerGrad.addColorStop(0, indigo);
        centerGrad.addColorStop(1, "transparent");
        ctx.globalAlpha = glowAlpha;
        ctx.fillStyle = centerGrad;
        ctx.beginPath();
        ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Notch indicator at bottom
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = indigo;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const notchY = maxRadius * 0.97;
        ctx.moveTo(-4, notchY - 5);
        ctx.lineTo(0, notchY);
        ctx.lineTo(4, notchY - 5);
        ctx.stroke();

        // Occasional gold highlight on one ring
        const goldRingIdx = 2;
        const goldR = maxRadius * ((goldRingIdx + 1) / ringCount);
        ctx.beginPath();
        ctx.arc(0, 0, goldR, 0, Math.PI * 0.15);
        ctx.strokeStyle = gold;
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
        ctx.globalAlpha = 1;

        // Hover: scan line sweeps across
        if (isHover && animOn) {
          const scanProgress = (t * 0.5) % 1;
          const scanY = h * scanProgress;

          const scanGrad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
          scanGrad.addColorStop(0, "transparent");
          scanGrad.addColorStop(0.5, indigo);
          scanGrad.addColorStop(1, "transparent");

          ctx.globalAlpha = 0.25;
          ctx.fillStyle = scanGrad;
          ctx.fillRect(0, scanY - 2, w, 4);

          ctx.globalAlpha = 1;
        }
      } catch {
        // Graceful fallback: canvas draw failure → just don't draw
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
