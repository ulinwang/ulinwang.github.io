'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!finePointer || reducedMotion) return;

    document.documentElement.classList.add('custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hovering = Boolean(target.closest('a, button, [data-cursor]'));
      ring.style.width = hovering ? '56px' : '32px';
      ring.style.height = hovering ? '56px' : '32px';
      ring.style.borderColor = hovering
        ? 'rgba(34, 211, 238, 0.9)'
        : 'rgba(167, 139, 250, 0.7)';
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove('custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  const visibilityClass =
    'pointer-events-none fixed left-0 top-0 z-[9999] hidden [@media(pointer:fine)]:block motion-reduce:hidden';

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className={`${visibilityClass} h-1.5 w-1.5 rounded-full bg-accent-cyan`}
      />
      <div
        ref={ringRef}
        aria-hidden
        className={`${visibilityClass} h-8 w-8 rounded-full border transition-[width,height,border-color] duration-200`}
        style={{ borderColor: 'rgba(167, 139, 250, 0.7)' }}
      />
    </>
  );
}
