'use client';

import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

interface AboutProps {
  title: string;
  body: string;
  github: string;
  email: string;
  xhs: string;
}

const CARDS = [
  {
    label: 'GitHub',
    key: 'github',
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.66.41.36.78 1.06.78 2.14 0 1.55-.02 2.79-.02 3.17 0 .31.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    ),
  },
  {
    label: '邮箱',
    key: 'email',
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    label: '小红书',
    key: 'xhs',
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
  },
] as const;

export default function About({ title, body, github, email, xhs }: AboutProps) {
  const values: Record<(typeof CARDS)[number]['key'], { href: string; handle: string }> = {
    github: { href: github, handle: '@ulinwang' },
    email: { href: `mailto:${email}`, handle: email },
    xhs: { href: xhs, handle: '关注我的日常' },
  };

  return (
    <section className="mx-auto max-w-4xl px-6 pb-32 pt-32">
      <Reveal>
        <SectionHeading index="01" title={title} />
      </Reveal>
      <Reveal delay={0.15}>
        <p className="mt-10 text-lg leading-loose text-zinc-400">
          {body.trim()}
        </p>
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {CARDS.map((card, i) => (
          <Reveal key={card.key} delay={0.2 + i * 0.12}>
            <a
              href={values[card.key].href}
              target={card.external ? '_blank' : undefined}
              rel={card.external ? 'noopener noreferrer' : undefined}
              data-cursor
              className="group flex h-full flex-col items-start gap-4 rounded-2xl border border-white/10 bg-ink-soft p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-cyan/40 hover:shadow-[0_16px_50px_-12px_rgba(34,211,238,0.3)]"
            >
              <span className="text-zinc-400 transition-colors group-hover:text-accent-cyan">
                {card.icon}
              </span>
              <span>
                <span className="block font-display font-bold">{card.label}</span>
                <span className="mt-1 block text-sm text-zinc-500">
                  {values[card.key].handle}
                </span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
