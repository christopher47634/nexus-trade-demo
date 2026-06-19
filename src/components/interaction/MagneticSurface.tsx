'use client';
import { useRef, useState, useCallback, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  intensity?: 'subtle' | 'medium';
  className?: string;
}

export function MagneticSurface({ children, intensity = 'subtle', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);

  const maxTilt = intensity === 'subtle' ? 1.5 : 2.5;
  const maxLift = intensity === 'subtle' ? -3 : -5;

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = ref.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const tiltX = (y - 0.5) * -maxTilt;
      const tiltY = (x - 0.5) * maxTilt;
      
      setTransform(`perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${maxLift}px)`);
      setGlowPos({ x: x * 100, y: y * 100 });
    });
  }, [maxTilt, maxLift]);

  const onLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setTransform('');
    setIsHovered(false);
  }, []);

  const prefersReduced = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      ref={ref}
      className={`magnetic-surface ${className}`}
      onMouseMove={prefersReduced ? undefined : onMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={onLeave}
      style={{
        transform: prefersReduced ? undefined : transform || undefined,
        transition: transform ? 'none' : 'transform 400ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isHovered && !prefersReduced && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(120px circle at ${glowPos.x}% ${glowPos.y}%, rgba(212,165,116,0.08), transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
      {children}
    </div>
  );
}
