"use client";

import { useRef, useEffect, useCallback } from "react";

interface RoboticsCanvasProps {
  width: number;
  height: number;
  animationsEnabled?: boolean;
  hovered?: boolean;
}

/**
 * Canvas 2D visual for 机器人 (Robotics) — NEW
 * - 3 circular joint nodes (radius 4-6px) connected by arc lines
 * - Joint positions: roughly forming an arm shape (shoulder, elbow, wrist)
 * - Coordinate lines: faint crosshairs at each joint
 * - Angle markings: tiny tick marks near joints
 * - Joint rotation: slow rotation (12s period)
 * - Trajectory arc: dashed line showing arm path, slowly drawing
 * - Hover: coordinate points appear at each joint, slightly brighter
 * - Colors: orange #f59e0b + amber #d97706
 * - Feel: engineering blueprint, industrial precision
 */
export default function RoboticsCanvas({
  width,
  height,
  animationsEnabled = true,
  hovered = false,
}: RoboticsCanvasProps) {
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

        const orange = "#f59e0b";
        const amber = "#d97706";
        const glowMul = isHover ? 1.15 : 1;

        // Joint positions forming an arm shape
        // Shoulder: upper-left area, Elbow: center, Wrist: lower-right area
        const joints = [
          { x: w * 0.25, y: h * 0.28, r: 5.5, label: "S" },  // Shoulder
          { x: w * 0.50, y: h * 0.48, r: 5, label: "E" },     // Elbow
          { x: w * 0.72, y: h * 0.62, r: 4.5, label: "W" },   // Wrist
        ];

        // Slow rotation angle for joint articulation
        const rotAngle = animOn
          ? Math.sin(t * ((2 * Math.PI) / 12)) * 0.08
          : 0;

        // --- Arm segments connecting joints (with slight arc) ---
        // Segment: Shoulder → Elbow
        const seg1MidX = (joints[0].x + joints[1].x) / 2;
        const seg1MidY = (joints[0].y + joints[1].y) / 2 - w * 0.04;

        ctx.globalAlpha = 0.16 * glowMul;
        ctx.strokeStyle = orange;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(joints[0].x, joints[0].y);
        ctx.quadraticCurveTo(seg1MidX, seg1MidY, joints[1].x, joints[1].y);
        ctx.stroke();

        // Segment: Elbow → Wrist
        const seg2MidX = (joints[1].x + joints[2].x) / 2;
        const seg2MidY = (joints[1].y + joints[2].y) / 2 + w * 0.03;

        ctx.globalAlpha = 0.14 * glowMul;
        ctx.strokeStyle = amber;
        ctx.beginPath();
        ctx.moveTo(joints[1].x, joints[1].y);
        ctx.quadraticCurveTo(seg2MidX, seg2MidY, joints[2].x, joints[2].y);
        ctx.stroke();

        // --- Coordinate crosshairs at each joint ---
        joints.forEach((joint, i) => {
          const crossSize = joint.r * 2.5;
          const crossAlpha = isHover ? 0.18 : 0.10;

          ctx.globalAlpha = crossAlpha;
          ctx.strokeStyle = i === 1 ? amber : orange;
          ctx.lineWidth = 0.4;

          // Horizontal crosshair
          ctx.beginPath();
          ctx.moveTo(joint.x - crossSize, joint.y);
          ctx.lineTo(joint.x + crossSize, joint.y);
          ctx.stroke();

          // Vertical crosshair
          ctx.beginPath();
          ctx.moveTo(joint.x, joint.y - crossSize);
          ctx.lineTo(joint.x, joint.y + crossSize);
          ctx.stroke();

          // Tick marks at crosshair ends
          const tickLen = 2;
          ctx.globalAlpha = crossAlpha * 0.7;
          // Top tick
          ctx.beginPath();
          ctx.moveTo(joint.x - tickLen, joint.y - crossSize);
          ctx.lineTo(joint.x + tickLen, joint.y - crossSize);
          ctx.stroke();
          // Bottom tick
          ctx.beginPath();
          ctx.moveTo(joint.x - tickLen, joint.y + crossSize);
          ctx.lineTo(joint.x + tickLen, joint.y + crossSize);
          ctx.stroke();
          // Left tick
          ctx.beginPath();
          ctx.moveTo(joint.x - crossSize, joint.y - tickLen);
          ctx.lineTo(joint.x - crossSize, joint.y + tickLen);
          ctx.stroke();
          // Right tick
          ctx.beginPath();
          ctx.moveTo(joint.x + crossSize, joint.y - tickLen);
          ctx.lineTo(joint.x + crossSize, joint.y + tickLen);
          ctx.stroke();
        });

        // --- Angle markings (tiny arc ticks near joints) ---
        // Shoulder angle
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = orange;
        ctx.lineWidth = 0.5;
        const angleR = joints[0].r * 2;
        for (let a = -0.5; a < 0.8; a += 0.3) {
          const angle = a + (animOn ? rotAngle * 2 : 0);
          const tx1 = joints[0].x + Math.cos(angle) * angleR;
          const ty1 = joints[0].y + Math.sin(angle) * angleR;
          const tx2 = joints[0].x + Math.cos(angle) * (angleR + 3);
          const ty2 = joints[0].y + Math.sin(angle) * (angleR + 3);
          ctx.beginPath();
          ctx.moveTo(tx1, ty1);
          ctx.lineTo(tx2, ty2);
          ctx.stroke();
        }

        // Elbow angle
        ctx.globalAlpha = 0.10;
        ctx.strokeStyle = amber;
        const angleR2 = joints[1].r * 2;
        for (let a = 1.8; a < 3.0; a += 0.3) {
          const angle = a + (animOn ? rotAngle * 1.5 : 0);
          const tx1 = joints[1].x + Math.cos(angle) * angleR2;
          const ty1 = joints[1].y + Math.sin(angle) * angleR2;
          const tx2 = joints[1].x + Math.cos(angle) * (angleR2 + 3);
          const ty2 = joints[1].y + Math.sin(angle) * (angleR2 + 3);
          ctx.beginPath();
          ctx.moveTo(tx1, ty1);
          ctx.lineTo(tx2, ty2);
          ctx.stroke();
        }

        // --- Joint rotation arcs ---
        // Slowly rotating small arc near shoulder
        const rotArcR = joints[0].r * 1.8;
        const rotStart = animOn ? t * 0.3 : 0;
        ctx.globalAlpha = 0.10 * glowMul;
        ctx.strokeStyle = orange;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(joints[0].x, joints[0].y, rotArcR, rotStart, rotStart + 1.2);
        ctx.stroke();

        // Rotating arc near elbow
        const rotArcR2 = joints[1].r * 1.6;
        ctx.globalAlpha = 0.08 * glowMul;
        ctx.strokeStyle = amber;
        ctx.beginPath();
        ctx.arc(joints[1].x, joints[1].y, rotArcR2, rotStart + 1.5, rotStart + 2.5);
        ctx.stroke();

        // --- Trajectory arc: dashed line showing arm path ---
        // Path from shoulder through elbow to wrist, with slight arc
        const trajProgress = animOn
          ? (t * 0.08) % 1
          : 0.5;

        ctx.setLineDash([6, 10]);
        ctx.globalAlpha = 0.10 * glowMul;
        ctx.strokeStyle = orange;
        ctx.lineWidth = 0.5;

        // Draw partial trajectory
        ctx.beginPath();
        const trajCx = w * 0.48;
        const trajCy = h * 0.35;
        const trajRx = w * 0.30;
        const trajRy = h * 0.22;
        ctx.ellipse(
          trajCx, trajCy,
          trajRx, trajRy,
          0.3,
          -Math.PI * 0.6,
          -Math.PI * 0.6 + trajProgress * Math.PI * 1.2,
          false
        );
        ctx.stroke();
        ctx.setLineDash([]);

        // --- Joint nodes (circles) ---
        joints.forEach((joint, i) => {
          const pulseAlpha = animOn
            ? 0.14 + 0.04 * Math.sin(t * ((2 * Math.PI) / 12) + i * 1.2)
            : 0.16;

          // Outer ring
          ctx.globalAlpha = pulseAlpha * glowMul;
          ctx.strokeStyle = i === 1 ? amber : orange;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(joint.x, joint.y, joint.r, 0, Math.PI * 2);
          ctx.stroke();

          // Inner dot
          ctx.globalAlpha = (pulseAlpha * 0.7) * glowMul;
          ctx.fillStyle = i === 1 ? amber : orange;
          ctx.beginPath();
          ctx.arc(joint.x, joint.y, joint.r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        });

        // --- Hover: coordinate定位点 at each joint ---
        if (isHover) {
          joints.forEach((joint, i) => {
            // Small diamond marker at joint
            const dSize = joint.r * 1.5;
            ctx.globalAlpha = 0.20;
            ctx.strokeStyle = i === 1 ? amber : orange;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(joint.x, joint.y - dSize);
            ctx.lineTo(joint.x + dSize, joint.y);
            ctx.lineTo(joint.x, joint.y + dSize);
            ctx.lineTo(joint.x - dSize, joint.y);
            ctx.closePath();
            ctx.stroke();

            // Coordinate label (tiny)
            ctx.globalAlpha = 0.16;
            ctx.fillStyle = orange;
            ctx.font = "6px monospace";
            ctx.fillText(
              `(${Math.round(joint.x)},${Math.round(joint.y)})`,
              joint.x + dSize + 2,
              joint.y - dSize
            );
          });

          // Wrist endpoint glow
          ctx.globalAlpha = 0.08;
          const wGrad = ctx.createRadialGradient(
            joints[2].x, joints[2].y, 0,
            joints[2].x, joints[2].y, joints[2].r * 4
          );
          wGrad.addColorStop(0, orange);
          wGrad.addColorStop(1, "transparent");
          ctx.fillStyle = wGrad;
          ctx.beginPath();
          ctx.arc(joints[2].x, joints[2].y, joints[2].r * 4, 0, Math.PI * 2);
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
