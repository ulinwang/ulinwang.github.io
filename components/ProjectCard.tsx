import Link from 'next/link';
import type { ProjectMeta } from '@/lib/content';

export default function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor
      className="project-card group relative flex flex-col rounded-2xl border border-white/10 bg-ink-soft p-6 opacity-0 transition-all duration-300 hover:-translate-y-2 hover:border-accent/40 hover:shadow-[0_20px_60px_-15px_rgba(167,139,250,0.35)]"
    >
      {project.featured && (
        <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-accent to-accent-cyan px-2.5 py-0.5 text-[10px] font-semibold text-ink">
          精选
        </span>
      )}
      <h3 className="pr-12 font-display text-lg font-bold leading-snug transition-colors group-hover:text-accent">
        {project.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
        {project.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
      <span className="mt-5 text-xs text-accent-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        查看详情 →
      </span>
    </Link>
  );
}
