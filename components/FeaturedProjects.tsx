import Link from 'next/link';
import type { ProjectMeta } from '@/lib/content';
import ProjectGrid from '@/components/ProjectGrid';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

export default function FeaturedProjects({
  projects,
}: {
  projects: ProjectMeta[];
}) {
  return (
    <section
      id="featured"
      className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-32 pt-8"
    >
      <Reveal>
        <SectionHeading index="01" title="精选项目" />
      </Reveal>
      <div className="mt-12">
        <ProjectGrid projects={projects} />
      </div>
      <Reveal delay={0.2} className="mt-10 text-center">
        <Link
          href="/projects"
          data-cursor
          className="inline-block rounded-full border border-white/15 px-6 py-2.5 text-sm text-zinc-300 transition-all hover:border-accent-cyan/50 hover:text-accent-cyan"
        >
          查看全部 →
        </Link>
      </Reveal>
    </section>
  );
}
