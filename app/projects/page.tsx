import type { Metadata } from 'next';
import { getProjects } from '@/lib/content';
import CanvasBoard from '@/components/CanvasBoard';

export const metadata: Metadata = {
  title: '作品集 — 王友林 UlinWang',
  description: 'LLM 多智能体仿真、知识图谱、浏览器扩展与 AI 工具链等项目合集。',
};

export default function ProjectsPage() {
  const projects = getProjects().map(({ body: _body, ...meta }) => meta);

  return <CanvasBoard projects={projects} />;
}
