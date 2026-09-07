'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { scrollToSection } from '@/lib/scroll';

const PARTICLE_COUNT = 24;

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 2 + ((i * 7) % 4),
        delay: (i % 8) * 0.35,
      })),
    [],
  );

  useEffect(() => {
    // rAF 被节流（后台标签页等）恢复时直接跳到终态，而不是慢速补帧
    gsap.ticker.lagSmoothing(0);

    let safety: number | undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '.hero-line',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.18 },
      )
        .fromTo(
          '.hero-glow',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' },
          0,
        )
        .fromTo(
          '.hero-particle',
          { opacity: 0 },
          {
            opacity: 0.7,
            duration: 1.2,
            stagger: { each: 0.04, from: 'random' },
          },
          0.4,
        )
        .fromTo(
          '.hero-scroll-hint',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8 },
          1.2,
        );

      // 隐藏标签页没有渲染帧，直接呈现终态；可见时正常播放
      if (document.visibilityState === 'hidden') {
        tl.progress(1);
      }

      // 兜底：无论 rAF 是否被暂停，3s 内强制播到最终态（progress(1) 同步渲染）
      safety = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 3000);
      tl.eventCallback('onComplete', () => window.clearTimeout(safety));
    }, rootRef);

    return () => {
      window.clearTimeout(safety);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* 背景渐变光晕 */}
      <div
        className="hero-glow absolute left-1/2 top-1/3 h-[60vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(167,139,250,0.28), transparent)',
        }}
      />
      <div
        className="hero-glow absolute right-[10%] top-[15%] h-[40vmin] w-[40vmin] rounded-full opacity-0 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(34,211,238,0.18), transparent)',
        }}
      />

      {/* 粒子 */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="hero-particle animate-float-slow absolute rounded-full bg-accent/60 opacity-0"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className="relative z-10 text-center">
        <p className="hero-line font-display text-sm uppercase tracking-[0.4em] text-accent-cyan opacity-0">
          Portfolio · 2026
        </p>
        <h1 className="hero-line mt-6 font-display text-6xl font-bold leading-tight opacity-0 md:text-8xl">
          王友林
        </h1>
        <h2 className="hero-line text-gradient mt-2 font-display text-3xl font-bold opacity-0 md:text-5xl">
          UlinWang
        </h2>
        <p className="hero-line mx-auto mt-8 max-w-xl text-lg text-zinc-400 opacity-0 md:text-xl">
          AI 产品经理 × 全栈开发者
          <br />
          <span className="text-sm text-zinc-500 md:text-base">
            在大模型与真实世界的交叉点上构建产品
          </span>
        </p>
      </div>

      <a
        href="#featured"
        data-cursor
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('#featured');
        }}
        className="hero-scroll-hint absolute bottom-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500 opacity-0 transition-colors hover:text-accent-cyan"
      >
        向下滚动
        <span className="animate-bounce text-lg leading-none">↓</span>
      </a>
    </section>
  );
}
