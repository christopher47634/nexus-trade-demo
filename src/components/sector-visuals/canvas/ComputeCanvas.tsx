"use client";

import { useRef, useEffect, useCallback } from "react";

interface ComputeCanvasProps {
  width: number;
  height: number;
  animationsEnabled?: boolean;
  hovered?: boolean;
}

/**
 * Canvas 2D visual for 算力 (Computing Power)
 * - Dark transparent base
 * - Grid lines: horizontal + vertical creating a grid pattern
 * - Center chip outline with pin lines on edges
 * - Pulse animation: chip outline opacity breathes (sine wave)
 * - Blue #3b82f6 + purple #8b5cf6
 */
export default function ComputeCanvas({
  width,
  height,
  animationsEnabled = true,
}: ComputeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const timeRef = useRef(0);
  const animEnabledRef = useRef(animationsEnabled);

  useEffect(() => {
    animEnabledRef.current = animationsEnabled;
  }, [animationsEnabled]);

  const draw = useCallback(
    (w: number, h: number, t: number, animOn: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      try {
        ctx.clearRect(0, 0, w, h);

        const blue = "#3b82f6";
        const purple = "#8b5cf6";
        const spacing = 30;

        // Subtle grid offset oscillation
        const offsetX = animOn ? Math.sin(t * 0.3) * 2 : 0;
        const offsetY = animOn ? Math.cos(t * 0.2) * 2 : 0;

        // Vertical grid lines
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = blue;
        ctx.lineWidth = 0.5;
        for (let x = offsetX % spacing; x < w; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }

        // Horizontal grid lines
        ctx.strokeStyle = purple;
        for (let y = offsetY % spacing; y < h; y += spacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Chip outline: centered rectangle
        const chipMarginX = w * 0.25;
        const chipMarginY = h * 0.18;
        const chipX = chipMarginX;
        const chipY = chipMarginY;
        const chipW = w - 2 * chipMarginX;
        const chipH = h - 2 * chipMarginY;

        // Pulse opacity via sine wave (~3s period)
        const pulseAlpha = animOn
          ? 0.15 + 0.1 * Math.sin(t * ((2 * Math.PI) / 3))
          : 0.18;

        // Outer chip border
        ctx.globalAlpha = pulseAlpha;
        ctx.strokeStyle = blue;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(chipX, chipY, chipW, chipH, 4);
        ctx.stroke();

        // Inner die
        const dieInsetX = chipW * 0.15;
        const dieInsetY = chipH * 0.15;
        ctx.globalAlpha = pulseAlpha * 0.8;
        ctx.strokeStyle = purple;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(
          chipX + dieInsetX,
          chipY + dieInsetY,
          chipW - 2 * dieInsetX,
          chipH - 2 * dieInsetY,
          2
        );
        ctx.stroke();

        // Core glow (radial gradient in center)
        if (animOn) {
          const coreX = w / 2;
          const coreY = h / 2;
          const coreR = Math.min(chipW, chipH) * 0.25;
          const coreAlpha =
            0.06 + 0.04 * Math.sin(t * ((2 * Math.PI) / 3));
          const grad = ctx.createRadialGradient(
            coreX,
            coreY,
            0,
            coreX,
            coreY,
            coreR
          );
          grad.addColorStop(0, blue);
          grad.addColorStop(1, "transparent");
          ctx.globalAlpha = coreAlpha;
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, coreR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pin lines — top edge
        const pinPositions = [0.2, 0.35, 0.5, 0.65, 0.8];
        const pinLength = 6;

        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 1;

        // Top pins
        ctx.strokeStyle = blue;
        pinPositions.forEach((pct) => {
          const px = chipX + chipW * pct;
          ctx.beginPath();
          ctx.moveTo(px, chipY - pinLength);
          ctx.lineTo(px, chipY);
          ctx.stroke();
        });

        // Bottom pins
        pinPositions.forEach((pct) => {
          const px = chipX + chipW * pct;
          ctx.beginPath();
          ctx.moveTo(px, chipY + chipH);
          ctx.lineTo(px, chipY + chipH + pinLength);
          ctx.stroke();
        });

        // Left pins
        ctx.strokeStyle = purple;
        const sidePins = [0.25, 0.5, 0.75];
        sidePins.forEach((pct) => {
          const py = chipY + chipH * pct;
          ctx.beginPath();
          ctx.moveTo(chipX - pinLength, py);
          ctx.lineTo(chipX, py);
          ctx.stroke();
        });

        // Right pins
        sidePins.forEach((pct) => {
          const py = chipY + chipH * pct;
          ctx.beginPath();
          ctx.moveTo(chipX + chipW, py);
          ctx.lineTo(chipX + chipW + pinLength, py);
          ctx.stroke();
        });

        // Circuit traces
        ctx.globalAlpha = 0.12;
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = blue;
        ctx.setLineDash([]);

        // Right trace 1
        ctx.beginPath();
        ctx.moveTo(chipX + chipW + 10, chipY + chipH * 0.36);
        ctx.lineTo(chipX + chipW + 30, chipY + chipH * 0.36);
        ctx.lineTo(chipX + chipW + 30, chipY + chipH * 0.5);
        ctx.stroke();

        // Right trace 2
        ctx.strokeStyle = purple;
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.moveTo(chipX + chipW + 10, chipY + chipH * 0.6);
        ctx.lineTo(chipX + chipW + 25, chipY + chipH * 0.6);
        ctx.lineTo(chipX + chipW + 25, chipY + chipH * 0.75);
        ctx.stroke();

        // Left trace
        ctx.strokeStyle = blue;
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.moveTo(chipX - 10, chipY + chipH * 0.36);
        ctx.lineTo(chipX - 25, chipY + chipH * 0.36);
        ctx.lineTo(chipX - 25, chipY + chipH * 0.22);
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
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
      draw(width, height, 0, false);
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
        draw(width, height, timeRef.current, animEnabledRef.current);
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
