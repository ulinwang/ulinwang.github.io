'use client';

import { useEffect, useRef } from 'react';

/**
 * 工程十字线光标：横纵两条 1px 参考线贯穿视口 + 交叉处小方块
 * + 右下角实时坐标读数（等宽字体）。悬停可点击元素时方块变荧光绿。
 * 仅 pointer:fine 启用；prefers-reduced-motion 与移动端不出现。
 */
export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLDivElement>(null);
  const hRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!finePointer || reducedMotion) return;

    document.documentElement.classList.add('custom-cursor');

    let mouseX = -100;
    let mouseY = -100;
    let curX = -100;
    let curY = -100;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      hovering = Boolean(
        (e.target as HTMLElement).closest('a, button, [data-cursor]'),
      );
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

    const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0');

    const loop = () => {
      curX += (mouseX - curX) * 0.35;
      curY += (mouseY - curY) * 0.35;
      if (vRef.current) vRef.current.style.transform = `translateX(${curX}px)`;
      if (hRef.current) hRef.current.style.transform = `translateY(${curY}px)`;
      if (boxRef.current) {
        boxRef.current.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
        boxRef.current.classList.toggle('cursor-hover', hovering);
      }
      if (readoutRef.current) {
        readoutRef.current.style.transform = `translate(${curX + 14}px, ${curY + 14}px)`;
        readoutRef.current.textContent = `X:${pad(curX)} Y:${pad(curY)}`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    if (!document.hidden) raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove('custom-cursor');
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden [@media(pointer:fine)]:block motion-reduce:hidden"
    >
      <div ref={vRef} className="absolute left-0 top-0 h-full w-px bg-line-soft" />
      <div ref={hRef} className="absolute left-0 top-0 h-px w-full bg-line-soft" />
      <div
        ref={boxRef}
        className="absolute left-0 top-0 h-[7px] w-[7px] border border-paper"
      />
      <div
        ref={readoutRef}
        className="absolute left-0 top-0 font-mono text-[10px] tracking-wider text-dim"
      />
    </div>
  );
}
