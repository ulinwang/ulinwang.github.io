import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProject, getProjects, markdownToHtml } from '@/lib/content';
import ProjectDetail from '@/components/ProjectDetail';

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
    <ProjectDetail
      title={project.title}
      titleEn={project.titleEn}
      description={project.description}
      descriptionEn={project.descriptionEn}
      tags={project.tags}
      link={project.link}
      order={project.order}
      html={html}
    />
  );
}
