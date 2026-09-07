'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

const TABS = [
  { href: '/', label: '首页', match: (p: string) => p === '/' },
  { href: '/intro', label: '简介', match: (p: string) => p === '/intro' },
  {
    href: '/projects',
    label: '作品集',
    match: (p: string) => p === '/projects' || p.startsWith('/projects/'),
  },
  { href: '/about', label: '关于我', match: (p: string) => p === '/about' },
];

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // 入场动画：隐藏标签页直接呈现终态（rAF 暂停，动画不可见）；
    // 可见页正常播放，2s 超时兜底强制到终态
    gsap.ticker.lagSmoothing(0);
    const header = headerRef.current;
    if (!header || document.visibilityState === 'hidden') return;

    const tween = gsap.fromTo(
      header,
      { y: -64, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.2 },
    );
    const safety = window.setTimeout(() => {
      if (tween.progress() < 1) tween.progress(1);
    }, 2000);
    tween.eventCallback('onComplete', () => window.clearTimeout(safety));

    return () => {
      window.clearTimeout(safety);
      tween.kill();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 路由切换时收起移动端菜单
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-ink/70 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          data-cursor
          className="font-display text-xl font-bold tracking-wide"
        >
          <span className="text-gradient">UW</span>
          <span className="ml-2 hidden text-sm font-medium text-zinc-400 sm:inline">
            王友林
          </span>
        </Link>

        {/* 桌面端 tabs */}
        <ul className="hidden items-center gap-8 md:flex">
          {TABS.map((tab) => {
            const isActive = tab.match(pathname);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  data-cursor
                  className={`group relative py-2 text-sm transition-colors ${
                    isActive
                      ? 'text-accent-cyan'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-accent to-accent-cyan transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 移动端汉堡按钮 */}
        <button
          type="button"
          data-cursor
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-zinc-200 transition-transform duration-300 ${
              menuOpen ? 'translate-y-[3.5px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-px w-6 bg-zinc-200 transition-transform duration-300 ${
              menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {/* 移动端菜单 */}
      <div
        className={`overflow-hidden border-b border-white/10 bg-ink/90 backdrop-blur-md transition-all duration-300 md:hidden ${
          menuOpen ? 'max-h-72' : 'max-h-0 border-b-0'
        }`}
      >
        <ul className="space-y-1 px-6 py-4">
          {TABS.map((tab) => {
            const isActive = tab.match(pathname);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-white/5 text-accent-cyan'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
