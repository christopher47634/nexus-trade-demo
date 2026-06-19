'use client';
import { useEffect, useState } from 'react';

export function CursorOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouchDevice || prefersReduced) return;

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    
    // Show on first mouse move
    const onMove = () => {
      setVisible(true);
      document.removeEventListener('mousemove', onMove);
    };
    document.addEventListener('mousemove', onMove);

    return () => {
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div
      className="cursor-glow-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
        opacity: visible ? 1 : 0,
        transition: 'opacity 300ms ease',
        background: `radial-gradient(
          220px circle at var(--cursor-x, -200px) var(--cursor-y, -200px),
          rgba(212, 165, 116, 0.12),
          transparent 70%
        )`,
        mixBlendMode: 'soft-light',
      }}
    />
  );
}
