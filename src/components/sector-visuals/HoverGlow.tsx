"use client";

import { useRef, useEffect, useCallback } from "react";

interface HoverGlowProps {
  enabled: boolean;
  color: string;
  className?: string;
  radius?: number;
  opacity?: number;
}

const LERP_COEFF = 0.065;
const FADE_IN_MS = 500;
const FADE_OUT_MS = 600;
const MAX_OPACITY = 0.14;
const DEFAULT_RADIUS_DESKTOP = 170;
const DEFAULT_RADIUS_MOBILE = 110;

export default function HoverGlow({
  enabled,
  color,
  className = "",
  radius,
  opacity,
}: HoverGlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });
  const glowPosRef = useRef({ x: -999, y: -999 });
  const isHoveringRef = useRef(false);
  const opacityRef = useRef(0);
  const hoverStartTimeRef = useRef(0);
  const hoverLeaveTimeRef = useRef(0);
  const isTouchDevice = useRef(false);
  const effectiveRadiusRef = useRef(radius ?? DEFAULT_RADIUS_DESKTOP);

  useEffect(() => {
    isTouchDevice.current = !window.matchMedia("(hover: hover)").matches;
    if (!radius) {
      effectiveRadiusRef.current = isTouchDevice.current
        ? DEFAULT_RADIUS_MOBILE
        : DEFAULT_RADIUS_DESKTOP;
    }
  }, [radius]);

  const maxOpacity = opacity ?? MAX_OPACITY;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Lerp glow position toward mouse
    const target = isHoveringRef.current ? mouseRef.current : glowPosRef.current;
    glowPosRef.current.x += (target.x - glowPosRef.current.x) * LERP_COEFF;
    glowPosRef.current.y += (target.y - glowPosRef.current.y) * LERP_COEFF;

    // Fade opacity
    const now = performance.now();
    if (isHoveringRef.current) {
      const elapsed = now - hoverStartTimeRef.current;
      opacityRef.current = Math.min(elapsed / FADE_IN_MS, 1) * maxOpacity;
    } else {
      const elapsed = now - hoverLeaveTimeRef.current;
      if (hoverLeaveTimeRef.current > 0) {
        opacityRef.current = Math.max(1 - elapsed / FADE_OUT_MS, 0) * maxOpacity;
      } else {
        opacityRef.current = 0;
      }
    }

    // Cancel if nothing to draw
    if (
      opacityRef.current < 0.001 ||
      isTouchDevice.current ||
      glowPosRef.current.x < -100
    ) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    const { x, y } = glowPosRef.current;
    const r = effectiveRadiusRef.current;
    const currentOpacity = opacityRef.current;

    // Multi-stop soft gradient — no bright center spot
    const gradient = ctx.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      r
    );
    const hexAlpha = (val: number) =>
      Math.round(val * 255)
        .toString(16)
        .padStart(2, "0");
    gradient.addColorStop(0, `${color}${hexAlpha(currentOpacity * 0.7)}`);
    gradient.addColorStop(0.3, `${color}${hexAlpha(currentOpacity * 0.5)}`);
    gradient.addColorStop(0.6, `${color}${hexAlpha(currentOpacity * 0.2)}`);
    gradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    rafRef.current = requestAnimationFrame(draw);
  }, [color, maxOpacity]);

  useEffect(() => {
    if (!enabled || isTouchDevice.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseEnter = (e: MouseEvent) => {
      isHoveringRef.current = true;
      hoverStartTimeRef.current = performance.now();
      hoverLeaveTimeRef.current = 0;
      // Initialize glow position to current mouse so it doesn't lerp from far away
      const rect = container.getBoundingClientRect();
      glowPosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      isHoveringRef.current = false;
      hoverLeaveTimeRef.current = performance.now();
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, draw]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-[5] pointer-events-none overflow-hidden rounded-2xl ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
}
