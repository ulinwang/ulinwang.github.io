'use client';

import Reveal from '@/components/Reveal';

export default function Intro({ html }: { html: string }) {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-20 pt-32 sm:px-10">
      <Reveal>
        <p className="font-mono text-[11px] tracking-[0.35em] text-accent">
          ABSTRACT / 摘要
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          className="prose-dark mt-6 text-lg"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Reveal>
    </section>
  );
}
