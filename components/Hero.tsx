'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { scrollToSection } from '@/lib/scroll';

const NAME_CN = ['王', '友', '林'];
const NAME_EN = 'ULINWANG';

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    let safety: number | undefined;

    const ctx = gsap.context(() => {
      // 机械式逐字砸入 + 元件帧切换
      const tl = gsap.timeline();
      tl.fromTo(
        '.hero-char',
        { y: '0.55em', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: 'steps(2)', stagger: 0.09 },
      )
        .fromTo(
          '.hero-en',
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: 'steps(2)' },
          0.5,
        )
        .fromTo(
          '.hero-el',
          { opacity: 0 },
          { opacity: 1, duration: 0.15, ease: 'steps(1)', stagger: 0.12 },
          0.6,
        );

      // 隐藏标签页没有渲染帧，直接呈现终态；可见时正常播放
      if (document.visibilityState === 'hidden') {
        tl.progress(1);
      }

      // 兜底：无论 rAF 是否被暂停，2.5s 内强制播到最终态
      safety = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 2500);
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
      className="bg-dotgrid-soft relative min-h-screen overflow-hidden"
    >
      {/* 左上十字准星 */}
      <div className="hero-el absolute left-[8vw] top-[20vh] opacity-0">
        <span className="font-mono text-2xl text-dim">+</span>
        <span className="ml-3 font-mono text-[10px] tracking-[0.3em] text-dim">
          ORIGIN / 0,0
        </span>
      </div>

      {/* 超大姓名（出血 + 描边叠印） */}
      <div className="absolute left-[4vw] top-[24vh] select-none">
        <h1 className="whitespace-nowrap font-display text-[15vw] font-bold leading-[0.95] tracking-tighter md:text-[13vw]">
          {NAME_CN.map((ch) => (
            <span key={ch} className="hero-char inline-block opacity-0">
              {ch}
            </span>
          ))}
        </h1>
        <p className="hero-en text-outline whitespace-nowrap font-display text-[9vw] font-bold leading-none tracking-tight opacity-0 md:text-[7.5vw]">
          {NAME_EN}
        </p>
        <p className="hero-el mt-6 font-mono text-xs tracking-[0.35em] text-accent opacity-0">
          AI PRODUCT MANAGER × FULL-STACK DEVELOPER
        </p>
        <p className="hero-el mt-2 text-sm text-dim opacity-0">
          在大模型与真实世界的交叉点上构建产品
        </p>
      </div>

      {/* 右下标题栏（title block） */}
      <div className="hero-el absolute bottom-[10vh] right-[5vw] border border-line bg-ink opacity-0">
        {[
          ['NAME', '王友林 / ULINWANG'],
          ['ROLE', 'AI PM × DEV'],
          ['DATE', '2026-09-07'],
          ['REV', '2026.09'],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex border-b border-line font-mono text-[10px] tracking-wider last:border-b-0"
          >
            <span className="w-16 border-r border-line px-2 py-1.5 text-dim">
              {k}
            </span>
            <span className="px-2 py-1.5 text-paper">{v}</span>
          </div>
        ))}
        <div className="flex font-mono text-[10px] tracking-wider">
          <span className="w-16 border-r border-line px-2 py-1.5 text-dim">
            STATUS
          </span>
          <span className="bg-accent px-2 py-1.5 font-medium text-ink">
            AVAILABLE
          </span>
        </div>
      </div>

      {/* 左下精选入口 */}
      <div className="hero-el absolute bottom-[10vh] left-[5vw] opacity-0">
        <button
          type="button"
          data-cursor
          onClick={() => scrollToSection('#featured')}
          className="group border border-line px-4 py-2 font-mono text-[11px] tracking-[0.25em] text-dim transition-colors hover:border-accent hover:text-accent"
        >
          SELECTED WORKS ↓
        </button>
      </div>
    </section>
  );
}
