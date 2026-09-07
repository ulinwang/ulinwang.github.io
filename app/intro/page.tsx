import type { Metadata } from 'next';
import { getIntro, markdownToHtml } from '@/lib/content';
import Intro from '@/components/Intro';

export const metadata: Metadata = {
  title: '简介 — 王友林 UlinWang',
  description: '南京大学信管本科，香港中文大学（深圳）硕士在读，Kimi/东方财富 AI 产品实习经历。',
};

export default async function IntroPage() {
  const intro = getIntro();
  const html = await markdownToHtml(intro.body);

  return (
    <main className="min-h-screen">
      <Intro html={html} />
    </main>
  );
}
