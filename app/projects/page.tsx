import type { Metadata } from 'next';
import { getProjects } from '@/lib/content';
import ProjectGrid from '@/components/ProjectGrid';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: '作品集 — 王友林 UlinWang',
  description: 'LLM 多智能体仿真、知识图谱、浏览器扩展与 AI 工具链等项目合集。',
};

export default function ProjectsPage() {
  const projects = getProjects().map(({ body: _body, ...meta }) => meta);

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-6 pb-32 pt-32">
        <Reveal>
          <SectionHeading index="01" title="作品集" />
          <p className="mt-4 text-zinc-500">
            共 {projects.length} 个项目，点击卡片查看详情。
          </p>
        </Reveal>
        <div className="mt-12">
          <ProjectGrid projects={projects} />
        </div>
      </section>
    </main>
  );
}
