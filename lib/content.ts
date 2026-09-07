import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDir = path.join(process.cwd(), 'content');

export interface SiteIntro {
  title: string;
  body: string;
}

export interface SiteAbout {
  title: string;
  github: string;
  email: string;
  xhs: string;
  body: string;
}

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  featured: boolean;
  order: number;
}

export interface Project extends ProjectMeta {
  body: string;
}

function readMarkdownFile(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return matter(raw);
}

export function getIntro(): SiteIntro {
  const { data, content } = readMarkdownFile(
    path.join(contentDir, 'site', 'intro.md'),
  );
  return { title: data.title ?? '简介', body: content };
}

export function getAbout(): SiteAbout {
  const { data, content } = readMarkdownFile(
    path.join(contentDir, 'site', 'about.md'),
  );
  return {
    title: data.title ?? '关于我',
    github: data.github ?? 'https://github.com/ulinwang',
    email: data.email ?? 'ulinwang@163.com',
    xhs: data.xhs ?? 'https://www.xiaohongshu.com',
    body: content,
  };
}

export function getProjects(): Project[] {
  const dir = path.join(contentDir, 'projects');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const projects = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const { data, content } = readMarkdownFile(path.join(dir, file));
    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      link: data.link || undefined,
      featured: Boolean(data.featured),
      order: typeof data.order === 'number' ? data.order : 99,
      body: content,
    };
  });
  return projects.sort((a, b) => a.order - b.order);
}

export interface ExperienceItem {
  slug: string;
  company: string;
  role: string;
  period: string;
  order: number;
  body: string;
}

export interface EducationItem {
  slug: string;
  school: string;
  degree: string;
  period: string;
  order: number;
  body: string;
}

function readFolderCollection<T extends { slug: string; order: number }>(
  folder: string,
  map: (data: Record<string, unknown>, body: string, slug: string) => T,
): T[] {
  const dir = path.join(contentDir, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const { data, content } = readMarkdownFile(path.join(dir, file));
      return map(data, content, slug);
    })
    .sort((a, b) => a.order - b.order);
}

export function getExperience(): ExperienceItem[] {
  return readFolderCollection('experience', (data, body, slug) => ({
    slug,
    company: String(data.company ?? slug),
    role: String(data.role ?? ''),
    period: String(data.period ?? ''),
    order: typeof data.order === 'number' ? data.order : 99,
    body,
  }));
}

export function getEducation(): EducationItem[] {
  return readFolderCollection('education', (data, body, slug) => ({
    slug,
    school: String(data.school ?? slug),
    degree: String(data.degree ?? ''),
    period: String(data.period ?? ''),
    order: typeof data.order === 'number' ? data.order : 99,
    body,
  }));
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
