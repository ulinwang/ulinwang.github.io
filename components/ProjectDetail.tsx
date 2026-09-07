'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { useUiPrefs } from '@/components/UiPrefs';

interface ProjectDetailProps {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  tags: string[];
  link?: string;
  order: number;
  html: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function ProjectDetail(props: ProjectDetailProps) {
  const { t, lang } = useUiPrefs();
  const title = lang === 'en' ? props.titleEn : props.title;
  const description = lang === 'en' ? props.descriptionEn : props.description;

  return (
    <main className="min-h-screen px-6 pb-24 pt-24 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Reveal y={12}>
          <Link
            href="/projects"
            data-cursor
            className="font-mono text-[11px] tracking-[0.25em] text-dim hover:bg-accent hover:text-white"
          >
            {t.detail.back}
          </Link>
        </Reveal>

        {/* 超大出血标题 */}
        <Reveal delay={0.08}>
          <h1 className="mt-10 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            {title}
          </h1>
        </Reveal>

        {/* meta title block */}
        <Reveal delay={0.16}>
          <div className="mt-10 inline-block border border-line font-mono text-[11px] tracking-wider">
            <div className="flex border-b border-line">
              <span className="w-20 border-r border-line px-3 py-2 text-dim">
                {t.detail.no}
              </span>
              <span className="px-3 py-2 text-accent">
                P.{pad(props.order)}
              </span>
            </div>
            <div className="flex border-b border-line">
              <span className="w-20 border-r border-line px-3 py-2 text-dim">
                {t.detail.tags}
              </span>
              <span className="px-3 py-2 text-paper">
                {props.tags.join(' / ')}
              </span>
            </div>
            {props.link && (
              <div className="flex border-b border-line">
                <span className="w-20 border-r border-line px-3 py-2 text-dim">
                  {t.detail.link}
                </span>
                <a
                  href={props.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                  className="px-3 py-2 text-paper underline-offset-4 hover:bg-accent hover:text-white hover:no-underline"
                >
                  {props.link.replace(/^https?:\/\//, '')} ↗
                </a>
              </div>
            )}
            <div className="flex">
              <span className="w-20 border-r border-line px-3 py-2 text-dim">
                {t.detail.rev}
              </span>
              <span className="px-3 py-2 text-paper">2026.09</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <p className="mt-8 max-w-2xl leading-loose text-dim">{description}</p>
        </Reveal>

        <article
          className="prose-dark mt-12"
          dangerouslySetInnerHTML={{ __html: props.html }}
        />
      </div>
    </main>
  );
}
