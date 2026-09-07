'use client';

import { useUiPrefs } from '@/components/UiPrefs';

export default function SectionHeading({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  const { t } = useUiPrefs();
  return (
    <div className="flex items-baseline gap-4 border-t border-line pt-4">
      <span className="bg-accent px-1.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.2em] text-white">
        {t.sec.prefix}{index}
      </span>
      <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h2>
      <span className="h-px flex-1 self-center bg-line" />
    </div>
  );
}
