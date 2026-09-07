'use client';

import Reveal from '@/components/Reveal';
import { useUiPrefs } from '@/components/UiPrefs';

export default function Intro({ htmlZh, htmlEn }: { htmlZh: string; htmlEn: string }) {
  const { t, lang } = useUiPrefs();
  return (
    <section className="mx-auto max-w-4xl px-6 pb-20 pt-32 sm:px-10">
      <Reveal>
        <p className="font-mono text-[11px] tracking-[0.35em] text-accent">
          {t.intro.abstract}
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          className="prose-dark mt-6 text-lg"
          dangerouslySetInnerHTML={{ __html: lang === 'en' ? htmlEn : htmlZh }}
        />
      </Reveal>
    </section>
  );
}
