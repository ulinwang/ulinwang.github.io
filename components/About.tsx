'use client';

import Reveal from '@/components/Reveal';

interface AboutProps {
  title: string;
  body: string;
  github: string;
  email: string;
  xhs: string;
}

/**
 * /about = 接口文档：社媒链接做成 API ENDPOINTS 式列表，
 * 等宽大字，悬停整行反色。
 */
export default function About({ title, body, github, email, xhs }: AboutProps) {
  const endpoints = [
    {
      method: 'GET',
      path: 'github.com/ulinwang',
      note: '代码与项目',
      href: github,
      external: true,
    },
    {
      method: 'POST',
      path: `mailto:${email}`,
      note: '直接写信',
      href: `mailto:${email}`,
      external: false,
    },
    {
      method: 'GET',
      path: 'xiaohongshu.com',
      note: '日常与笔记',
      href: xhs,
      external: true,
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 pb-32 pt-32 sm:px-10">
      <Reveal>
        <div className="flex items-baseline gap-4 border-t border-line pt-4">
          <span className="bg-accent px-1.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.2em] text-ink">
            SEC.01
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
          <span className="font-mono text-[10px] tracking-[0.25em] text-dim">
            ENDPOINTS
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-8 max-w-xl leading-loose text-dim">{body.trim()}</p>
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
                {ep.note} ↗
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.4}>
        <p className="mt-8 font-mono text-[10px] tracking-[0.3em] text-dim">
          RESPONSE TIME: &lt; 48H / TIMEZONE: UTC+8
        </p>
      </Reveal>
    </section>
  );
}
