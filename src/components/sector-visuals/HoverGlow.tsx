"use client";

import { useRef, useEffect, useCallback } from "react";

interface HoverGlowProps {
  enabled: boolean;
  color: string;
  className?: string;
  radius?: number;
  opacity?: number;
}

export default function HoverGlow({
  enabled,
  color,
  className = "",
  radius = 100,
  opacity = 0.2,
}: HoverGlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });
  const isHoveringRef = useRef(false);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = !window.matchMedia("(hover: hover)").matches;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    if (!isHoveringRef.current || isTouchDevice.current) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    const { x, y } = mouseRef.current;
    if (x < 0 || y < 0) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`);
    gradient.addColorStop(0.5, `${color}${Math.round(opacity * 0.4 * 255).toString(16).padStart(2, "0")}`);
    gradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    rafRef.current = requestAnimationFrame(draw);
  }, [color, radius, opacity]);

  useEffect(() => {
    if (!enabled || isTouchDevice.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
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

    const handleMouseEnter = () => {
      isHoveringRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveringRef.current = false;
      mouseRef.current = { x: -999, y: -999 };
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
