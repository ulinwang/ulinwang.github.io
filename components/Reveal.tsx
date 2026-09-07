'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** 初始下移距离 */
  y?: number;
}

/**
 * 通用入场动画容器：GSAP 上浮淡入。
 * 隐藏标签页直通终态；2s 超时兜底强制播完（与 Hero/Portfolio 同模式）。
 */
export default function Reveal({ children, className, delay = 0, y = 40 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    const el = ref.current;
    if (!el) return;
    if (document.visibilityState === 'hidden') {
      gsap.set(el, { y: 0, opacity: 1 });
      return;
    }
    const tween = gsap.fromTo(
      el,
      { y, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay },
    );
    const safety = window.setTimeout(() => {
      if (tween.progress() < 1) tween.progress(1);
    }, 2000 + delay * 1000);
    tween.eventCallback('onComplete', () => window.clearTimeout(safety));

    return () => {
      window.clearTimeout(safety);
      tween.kill();
    };
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
