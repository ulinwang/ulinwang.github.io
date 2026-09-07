import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProject, getProjects, markdownToHtml } from '@/lib/content';

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — 王友林 UlinWang`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const html = await markdownToHtml(project.body);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-24">
      <Link
        href="/projects"
        className="text-sm text-accent-cyan transition-colors hover:text-accent"
      >
        ← 返回作品集
      </Link>
      <h1 className="mt-8 font-display text-3xl font-bold leading-snug md:text-5xl">
        {project.title}
      </h1>
      <p className="mt-4 text-lg text-zinc-400">{project.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-accent to-accent-cyan px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105"
        >
          访问项目 →
        </a>
      )}
      <article
        className="prose-dark mt-12 border-t border-white/10 pt-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
