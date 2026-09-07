'use client';

import Reveal from '@/components/Reveal';
import { useUiPrefs } from '@/components/UiPrefs';

interface AboutProps {
  title: string;
  bodyZh: string;
  bodyEn: string;
  github: string;
  email: string;
  xhs: string;
}

/**
 * /about = 接口文档：社媒链接做成 ENDPOINTS 式列表，
 * 等宽大字，悬停整行反色。
 */
export default function About({ title, bodyZh, bodyEn, github, email, xhs }: AboutProps) {
  const { t, lang } = useUiPrefs();
  const endpoints = [
    {
      method: 'GET',
      path: 'github.com/ulinwang',
      href: github,
      external: true,
    },
    {
      method: 'POST',
      path: `mailto:${email}`,
      href: `mailto:${email}`,
      external: false,
    },
    {
      method: 'GET',
      path: 'xiaohongshu.com',
      href: xhs,
      external: true,
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 pb-32 pt-32 sm:px-10">
      <Reveal>
        <div className="flex items-baseline gap-4 border-t border-line pt-4">
          <span className="bg-accent px-1.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.2em] text-white">
            {t.sec.prefix}01
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            {lang === 'en' ? 'ABOUT' : title}
          </h2>
          <span className="font-mono text-[10px] tracking-[0.25em] text-dim">
            {t.about.note}
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-8 max-w-xl leading-loose text-dim">
          {(lang === 'en' ? bodyEn : bodyZh).trim()}
        </p>
      </Reveal>

      <div className="mt-12 border-b border-line">
        {endpoints.map((ep, i) => (
          <Reveal key={ep.path} delay={0.15 + i * 0.08}>
            <a
              href={ep.href}
              target={ep.external ? '_blank' : undefined}
              rel={ep.external ? 'noopener noreferrer' : undefined}
              data-cursor
              className="group flex items-baseline gap-4 border-t border-line py-5 transition-colors hover:bg-paper sm:gap-8"
            >
              <span className="w-14 shrink-0 font-mono text-xs font-bold tracking-[0.2em] text-accent group-hover:text-ink">
                {ep.method}
              </span>
              <span className="font-mono text-base text-paper group-hover:text-ink sm:text-xl">
                {ep.path}
              </span>
              <span className="ml-auto font-mono text-[10px] tracking-[0.2em] text-dim group-hover:text-ink">
                {t.about.endpoints[i].note}
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.4}>
        <p className="mt-8 font-mono text-[10px] tracking-[0.3em] text-dim">
          {t.about.response}
        </p>
      </Reveal>
    </section>
  );
}
