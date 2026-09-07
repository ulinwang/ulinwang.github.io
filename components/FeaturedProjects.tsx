'use client';

import Link from 'next/link';
import type { ProjectMeta } from '@/lib/content';
import Reveal from '@/components/Reveal';
import { useUiPrefs } from '@/components/UiPrefs';

const pad = (n: number) => String(n).padStart(2, '0');

export default function FeaturedProjects({
  projects,
}: {
  projects: ProjectMeta[];
}) {
  const { t, lang } = useUiPrefs();
  return (
    <section
      id="featured"
      className="scroll-mt-20 border-t border-line px-6 pb-28 pt-16 sm:px-10"
    >
      <Reveal>
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[11px] tracking-[0.3em] text-dim">
            {t.featured.label}
          </p>
          <Link
            href="/projects"
            data-cursor
            className="font-mono text-[11px] tracking-[0.3em] text-paper underline-offset-4 hover:bg-accent hover:text-white hover:no-underline"
          >
            {t.featured.viewAll}
          </Link>
        </div>
      </Reveal>
      <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={0.1 + i * 0.1}>
            <Link
              href={`/projects/${p.slug}`}
              data-cursor
              className="group flex h-full flex-col bg-ink p-5 transition-colors hover:bg-paper"
            >
              <span className="font-mono text-[10px] tracking-[0.25em] text-dim group-hover:text-ink">
                P.{pad(p.order)} / {t.sec.prefix === '节.' ? '图' : 'FIG'}.{pad(i + 1)}
              </span>
              <span className="mt-3 font-display text-base font-bold leading-snug group-hover:text-ink">
                {lang === 'en' ? p.titleEn : p.title}
              </span>
              <span className="mt-auto pt-4 font-mono text-[10px] tracking-widest text-dim group-hover:text-ink">
                {t.featured.open}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
