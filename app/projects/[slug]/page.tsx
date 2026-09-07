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

const pad = (n: number) => String(n).padStart(2, '0');

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
    <main className="min-h-screen px-6 pb-24 pt-24 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/projects"
          className="font-mono text-[11px] tracking-[0.25em] text-dim hover:bg-accent hover:text-ink"
        >
          ← BACK TO WORKS
        </Link>

        {/* 超大出血标题 */}
        <h1 className="mt-10 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          {project.title}
        </h1>

        {/* meta title block */}
        <div className="mt-10 inline-block border border-line font-mono text-[11px] tracking-wider">
          <div className="flex border-b border-line">
            <span className="w-20 border-r border-line px-3 py-2 text-dim">
              NO.
            </span>
            <span className="px-3 py-2 text-accent">P.{pad(project.order)}</span>
          </div>
          <div className="flex border-b border-line">
            <span className="w-20 border-r border-line px-3 py-2 text-dim">
              TAGS
            </span>
            <span className="px-3 py-2 text-paper">
              {project.tags.join(' / ')}
            </span>
          </div>
          {project.link && (
            <div className="flex border-b border-line">
              <span className="w-20 border-r border-line px-3 py-2 text-dim">
                LINK
              </span>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                className="px-3 py-2 text-paper underline-offset-4 hover:bg-accent hover:text-ink hover:no-underline"
              >
                {project.link.replace(/^https?:\/\//, '')} ↗
              </a>
            </div>
          )}
          <div className="flex">
            <span className="w-20 border-r border-line px-3 py-2 text-dim">
              REV
            </span>
            <span className="px-3 py-2 text-paper">2026.09</span>
          </div>
        </div>

        <article
          className="prose-dark mt-12"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </main>
  );
}
