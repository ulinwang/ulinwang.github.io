import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';

export interface TimelineEntry {
  title: string;
  subtitle: string;
  period: string;
  html: string;
}

/**
 * 时间线列表（工作/教育经历）：左侧竖线 + 节点圆点 + 卡片式内容。
 * 纯展示组件，入场动画由 Reveal 提供（含隐藏页直通与超时兜底）。
 */
export default function Timeline({
  index,
  title,
  entries,
}: {
  index: string;
  title: string;
  entries: TimelineEntry[];
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-24">
      <Reveal>
        <SectionHeading index={index} title={title} />
      </Reveal>
      <div className="relative mt-12 border-l border-white/15 pl-8">
        {entries.map((entry, i) => (
          <Reveal key={entry.title} delay={0.1 + i * 0.1} className="relative pb-10 last:pb-0">
            {/* 节点圆点 */}
            <span className="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-accent to-accent-cyan shadow-[0_0_10px_rgba(167,139,250,0.7)]" />
            <div className="rounded-2xl border border-white/10 bg-ink-soft p-6 transition-colors hover:border-accent/30">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-bold">
                  {entry.title}
                </h3>
                <span className="font-display text-xs tracking-wider text-accent-cyan">
                  {entry.period}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500">{entry.subtitle}</p>
              <div
                className="prose-dark mt-4 text-sm"
                dangerouslySetInnerHTML={{ __html: entry.html }}
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
