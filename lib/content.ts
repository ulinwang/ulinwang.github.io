import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDir = path.join(process.cwd(), 'content');

export interface SiteIntro {
  title: string;
  body: string;
  bodyEn: string;
}

export interface SiteAbout {
  title: string;
  github: string;
  email: string;
  xhs: string;
  body: string;
  bodyEn: string;
}

export interface ProjectMeta {
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  tags: string[];
  link?: string;
  featured: boolean;
  order: number;
  x: number;
  y: number;
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
  return {
    title: data.title ?? '简介',
    body: content,
    bodyEn: typeof data.body_en === 'string' ? data.body_en : content,
  };
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
    bodyEn: typeof data.body_en === 'string' ? data.body_en : content,
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
      titleEn: typeof data.title_en === 'string' ? data.title_en : (data.title ?? slug),
      description: data.description ?? '',
      descriptionEn: typeof data.description_en === 'string' ? data.description_en : (data.description ?? ''),
      tags: Array.isArray(data.tags) ? data.tags : [],
      link: data.link || undefined,
      featured: Boolean(data.featured),
      order: typeof data.order === 'number' ? data.order : 99,
      x: typeof data.x === 'number' ? data.x : 0,
      y: typeof data.y === 'number' ? data.y : 0,
      body: content,
    };
  });
  return projects.sort((a, b) => a.order - b.order);
}

export interface ExperienceItem {
  slug: string;
  company: string;
  companyEn: string;
  role: string;
  roleEn: string;
  period: string;
  order: number;
  body: string;
}

export interface EducationItem {
  slug: string;
  school: string;
  schoolEn: string;
  degree: string;
  degreeEn: string;
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
    companyEn: String(data.company_en ?? data.company ?? slug),
    role: String(data.role ?? ''),
    roleEn: String(data.role_en ?? data.role ?? ''),
    period: String(data.period ?? ''),
    order: typeof data.order === 'number' ? data.order : 99,
    body,
  }));
}

export function getEducation(): EducationItem[] {
  return readFolderCollection('education', (data, body, slug) => ({
    slug,
    school: String(data.school ?? slug),
    schoolEn: String(data.school_en ?? data.school ?? slug),
    degree: String(data.degree ?? ''),
    degreeEn: String(data.degree_en ?? data.degree ?? ''),
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
