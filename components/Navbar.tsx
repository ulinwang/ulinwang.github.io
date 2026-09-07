'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useUiPrefs } from '@/components/UiPrefs';

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { lang, theme, t, setLang, setTheme } = useUiPrefs();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const TABS = [
    { href: '/', label: t.nav.index, match: (p: string) => p === '/' },
    { href: '/intro', label: t.nav.intro, match: (p: string) => p === '/intro' },
    {
      href: '/projects',
      label: t.nav.works,
      match: (p: string) => p === '/projects' || p.startsWith('/projects/'),
    },
    { href: '/about', label: t.nav.about, match: (p: string) => p === '/about' },
  ];

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    const header = headerRef.current;
    if (!header || document.visibilityState === 'hidden') return;

    const tween = gsap.fromTo(
      header,
      { y: -56, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: 'steps(3)', delay: 0.1 },
    );
    const safety = window.setTimeout(() => {
      if (tween.progress() < 1) tween.progress(1);
    }, 1500);
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const linkCls = (isActive: boolean) =>
    `inline-block px-2 py-1 font-mono text-[11px] tracking-[0.25em] transition-colors ${
      isActive
        ? 'bg-accent text-white'
        : 'text-dim hover:bg-paper hover:text-ink'
    }`;

  const toggleBtn = (isActive: boolean) =>
    `px-1.5 py-0.5 font-mono text-[10px] tracking-widest transition-colors ${
      isActive ? 'bg-accent text-white' : 'text-dim hover:text-paper'
    }`;

  const controls = (
    <>
      {/* 语言切换 */}
      <span className="flex border border-line" data-cursor>
        <button
          type="button"
          onClick={() => setLang('zh')}
          className={toggleBtn(lang === 'zh')}
        >
          中
        </button>
        <button
          type="button"
          onClick={() => setLang('en')}
          className={toggleBtn(lang === 'en')}
        >
          EN
        </button>
      </span>
      {/* 显示模式切换 */}
      <span className="flex border border-line" data-cursor>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={toggleBtn(theme === 'dark')}
        >
          DARK
        </button>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={toggleBtn(theme === 'light')}
        >
          LIGHT
        </button>
      </span>
    </>
  );

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled ? 'border-b border-line bg-ink' : 'border-b border-transparent'
      }`}
    >
      <nav className="flex h-14 items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          data-cursor
          className="font-mono text-xs font-bold tracking-[0.2em]"
        >
          <span className="bg-accent px-1 text-white">UW</span>
          <span className="ml-2 hidden text-dim sm:inline">王友林</span>
        </Link>

        {/* 桌面端 tabs + 控件 */}
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-6">
            {TABS.map((tab) => (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  data-cursor
                  className={linkCls(tab.match(pathname))}
                >
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">{controls}</div>
        </div>

        {/* 移动端：控件 + 汉堡 */}
        <div className="flex items-center gap-2 md:hidden">
          {controls}
          <button
            type="button"
            data-cursor
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`h-px w-6 bg-paper transition-transform duration-200 ${
                menuOpen ? 'translate-y-[3.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-px w-6 bg-paper transition-transform duration-200 ${
                menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <div
        className={`overflow-hidden border-b border-line bg-ink transition-all duration-200 md:hidden ${
          menuOpen ? 'max-h-72' : 'max-h-0 border-b-0'
        }`}
      >
        <ul className="space-y-1 px-6 py-4">
          {TABS.map((tab) => (
            <li key={tab.href}>
              <Link
                href={tab.href}
                onClick={() => setMenuOpen(false)}
                className={linkCls(tab.match(pathname))}
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
