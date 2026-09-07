'use client';

import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

export default function Intro({ html }: { html: string }) {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-32 pt-32">
      <Reveal>
        <SectionHeading index="01" title="简介" />
      </Reveal>
      <Reveal delay={0.15}>
        <div
          className="prose-dark mt-10 text-lg"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Reveal>
    </section>
  );
}
