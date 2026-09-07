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
 * 通用入场容器：机械式硬切出现（steps 缓动 + 短位移）。
 * 隐藏标签页直通终态；超时兜底强制播完。
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: RevealProps) {
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
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'steps(4)',
        delay,
      },
    );
    const safety = window.setTimeout(() => {
      if (tween.progress() < 1) tween.progress(1);
    }, 1500 + delay * 1000);
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
