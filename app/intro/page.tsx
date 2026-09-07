import type { Metadata } from 'next';
import {
  getEducation,
  getExperience,
  getIntro,
  markdownToHtml,
} from '@/lib/content';
import Intro from '@/components/Intro';
import Changelog from '@/components/Timeline';

export const metadata: Metadata = {
  title: '简介 — 王友林 UlinWang',
  description:
    '南京大学信管本科，香港中文大学（深圳）硕士在读，Kimi/东方财富 AI 产品实习经历。',
};

// 时间段取结束日期作为版本号：2025.12—2026.06 → v2026.06
const versionOf = (period: string) => {
  const end = period.split(/[—–-]/).pop()?.trim() ?? period;
  return `v${end}`;
};

export default async function IntroPage() {
  const intro = getIntro();
  const introHtml = await markdownToHtml(intro.body);

  const experience = await Promise.all(
    getExperience().map(async (item) => ({
      version: versionOf(item.period),
      period: item.period,
      title: item.company,
      subtitle: item.role,
      html: await markdownToHtml(item.body),
    })),
  );

  const education = await Promise.all(
    getEducation().map(async (item) => ({
      version: versionOf(item.period),
      period: item.period,
      title: item.school,
      subtitle: item.degree,
      html: await markdownToHtml(item.body),
    })),
  );

  return (
    <main className="min-h-screen">
      <Intro html={introHtml} />
      <Changelog index="02" title="工作经历" entries={experience} />
      <Changelog index="03" title="教育经历" entries={education} />
    </main>
  );
}
