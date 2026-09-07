import Reveal from '@/components/Reveal';

export interface ChangelogEntry {
  version: string;
  period: string;
  title: string;
  subtitle: string;
  html: string;
}

/**
 * changelog / 版本历史排版：左侧版本号列（等宽荧光绿），右侧内容，
 * 硬边框分隔。
 */
export default function Changelog({
  index,
  title,
  entries,
}: {
  index: string;
  title: string;
  entries: ChangelogEntry[];
}) {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-20 sm:px-10">
      <Reveal>
        <div className="flex items-baseline gap-4 border-t border-line pt-4">
          <span className="bg-accent px-1.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.2em] text-ink">
            SEC.{index}
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
          <span className="font-mono text-[10px] tracking-[0.25em] text-dim">
            CHANGELOG
          </span>
        </div>
      </Reveal>
      <div className="mt-10">
        {entries.map((entry, i) => (
          <Reveal key={entry.version + entry.title} delay={0.08 * i}>
            <div className="grid gap-4 border-t border-line py-8 sm:grid-cols-[120px_1fr]">
              <div>
                <p className="font-mono text-sm font-medium text-accent">
                  {entry.version}
                </p>
                <p className="mt-1 font-mono text-[10px] tracking-wider text-dim">
                  {entry.period}
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">
                  {entry.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-dim">
                  {entry.subtitle}
                </p>
                <div
                  className="prose-dark mt-4 text-sm"
                  dangerouslySetInnerHTML={{ __html: entry.html }}
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
