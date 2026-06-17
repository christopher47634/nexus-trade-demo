"use client";

import { useRef, useEffect, useCallback } from "react";

interface ComputeCanvasProps {
  width: number;
  height: number;
  animationsEnabled?: boolean;
  hovered?: boolean;
}

/**
 * Canvas 2D visual for 算力 (Computing Power) — REFINED
 * - Center chip outline: rectangle with pins, blue #3b82f6, opacity 0.12-0.20
 * - Background grid: very faint, purple #8b5cf6, opacity 0.06-0.12
 * - Chip breathing: 6.5s period, opacity 0.08-0.18
 * - Circuit nodes: 4-6 points with low-freq pulse
 * - Hover: local glow only, don't brighten whole card
 */
export default function ComputeCanvas({
  width,
  height,
  animationsEnabled = true,
  hovered = false,
}: ComputeCanvasProps) {
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
    (w: number, h: number, t: number, animOn: boolean, isHover: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      try {
        ctx.clearRect(0, 0, w, h);

        const blue = "#3b82f6";
        const purple = "#8b5cf6";
        const spacing = 36;

        // Background grid: very faint
        const gridAlpha = animOn
          ? 0.06 + 0.02 * Math.sin(t * 0.08)
          : 0.08;

        ctx.globalAlpha = gridAlpha;
        ctx.strokeStyle = purple;
        ctx.lineWidth = 0.5;

        // Subtle grid drift
        const driftX = animOn ? (t * 1.5) % spacing : 0;
        const driftY = animOn ? (t * 1.0) % spacing : 0;

        for (let x = driftX; x < w; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = driftY; y < h; y += spacing) {
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

        // Chip breathing: 6.5s period, opacity 0.08-0.18
        const breathAlpha = animOn
          ? 0.13 + 0.05 * Math.sin(t * ((2 * Math.PI) / 6.5))
          : 0.16;

        // Outer chip border
        ctx.globalAlpha = breathAlpha;
        ctx.strokeStyle = blue;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(chipX, chipY, chipW, chipH, 3);
        ctx.stroke();

        // Inner die
        const dieInsetX = chipW * 0.15;
        const dieInsetY = chipH * 0.15;
        ctx.globalAlpha = breathAlpha * 0.7;
        ctx.strokeStyle = purple;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.roundRect(
          chipX + dieInsetX,
          chipY + dieInsetY,
          chipW - 2 * dieInsetX,
          chipH - 2 * dieInsetY,
          2
        );
        ctx.stroke();

        // Core glow (subtle radial in center)
        const coreX = w / 2;
        const coreY = h / 2;
        const coreR = Math.min(chipW, chipH) * 0.22;
        const coreAlpha = animOn
          ? 0.04 + 0.03 * Math.sin(t * ((2 * Math.PI) / 6.5))
          : 0.05;
        const grad = ctx.createRadialGradient(
          coreX, coreY, 0,
          coreX, coreY, coreR
        );
        grad.addColorStop(0, blue);
        grad.addColorStop(1, "transparent");
        ctx.globalAlpha = coreAlpha;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, coreR, 0, Math.PI * 2);
        ctx.fill();

        // Pin lines — top/bottom edge
        const pinPositions = [0.2, 0.35, 0.5, 0.65, 0.8];
        const pinLength = 5;

        ctx.globalAlpha = 0.14;
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = blue;

        pinPositions.forEach((pct) => {
          const px = chipX + chipW * pct;
          // Top pin
          ctx.beginPath();
          ctx.moveTo(px, chipY - pinLength);
          ctx.lineTo(px, chipY);
          ctx.stroke();
          // Bottom pin
          ctx.beginPath();
          ctx.moveTo(px, chipY + chipH);
          ctx.lineTo(px, chipY + chipH + pinLength);
          ctx.stroke();
        });

        // Side pins
        ctx.strokeStyle = purple;
        const sidePins = [0.25, 0.5, 0.75];
        sidePins.forEach((pct) => {
          const py = chipY + chipH * pct;
          // Left pin
          ctx.beginPath();
          ctx.moveTo(chipX - pinLength, py);
          ctx.lineTo(chipX, py);
          ctx.stroke();
          // Right pin
          ctx.beginPath();
          ctx.moveTo(chipX + chipW, py);
          ctx.lineTo(chipX + chipW + pinLength, py);
          ctx.stroke();
        });

        // Circuit nodes: 5 points with low-freq pulse
        const nodes = [
          { x: chipX + chipW + 22, y: chipY + chipH * 0.30 },
          { x: chipX + chipW + 28, y: chipY + chipH * 0.55 },
          { x: chipX - 22, y: chipY + chipH * 0.35 },
          { x: chipX - 28, y: chipY + chipH * 0.65 },
          { x: chipX + chipW * 0.5, y: chipY - 18 },
          { x: chipX + chipW * 0.5, y: chipY + chipH + 18 },
        ];

        const nodePulsePeriod = 10; // slow pulse
        nodes.forEach((node, i) => {
          const phase = (i / nodes.length) * Math.PI * 2;
          const pulse = animOn
            ? 0.08 + 0.05 * Math.sin(t * ((2 * Math.PI) / nodePulsePeriod) + phase)
            : 0.10;

          ctx.beginPath();
          ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? blue : purple;
          ctx.globalAlpha = pulse;
          ctx.fill();
        });

        // Circuit traces connecting nodes to chip pins
        ctx.lineWidth = 0.6;
        ctx.globalAlpha = 0.10;
        ctx.strokeStyle = blue;

        // Right trace 1
        ctx.beginPath();
        ctx.moveTo(chipX + chipW + pinLength, chipY + chipH * 0.30);
        ctx.lineTo(nodes[0].x, nodes[0].y);
        ctx.stroke();

        // Right trace 2
        ctx.strokeStyle = purple;
        ctx.beginPath();
        ctx.moveTo(chipX + chipW + pinLength, chipY + chipH * 0.55);
        ctx.lineTo(nodes[1].x, nodes[1].y);
        ctx.stroke();

        // Left trace 1
        ctx.strokeStyle = blue;
        ctx.beginPath();
        ctx.moveTo(chipX - pinLength, chipY + chipH * 0.35);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.stroke();

        // Left trace 2
        ctx.strokeStyle = purple;
        ctx.beginPath();
        ctx.moveTo(chipX - pinLength, chipY + chipH * 0.65);
        ctx.lineTo(nodes[3].x, nodes[3].y);
        ctx.stroke();

        // Top trace
        ctx.strokeStyle = blue;
        ctx.globalAlpha = 0.08;
        ctx.beginPath();
        ctx.moveTo(chipX + chipW * 0.5, chipY - pinLength);
        ctx.lineTo(nodes[4].x, nodes[4].y);
        ctx.stroke();

        // Bottom trace
        ctx.strokeStyle = purple;
        ctx.beginPath();
        ctx.moveTo(chipX + chipW * 0.5, chipY + chipH + pinLength);
        ctx.lineTo(nodes[5].x, nodes[5].y);
        ctx.stroke();

        // Hover: local glow around chip only
        if (isHover && animOn) {
          const glowR = Math.max(chipW, chipH) * 0.6;
          const hoverGrad = ctx.createRadialGradient(
            coreX, coreY, 0,
            coreX, coreY, glowR
          );
          hoverGrad.addColorStop(0, blue);
          hoverGrad.addColorStop(1, "transparent");
          ctx.globalAlpha = 0.06;
          ctx.fillStyle = hoverGrad;
          ctx.beginPath();
          ctx.arc(coreX, coreY, glowR, 0, Math.PI * 2);
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
          animEnabledRef.current,
          hoveredRef.current
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
