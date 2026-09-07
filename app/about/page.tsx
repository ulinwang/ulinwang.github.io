import type { Metadata } from 'next';
import { getAbout } from '@/lib/content';
import About from '@/components/About';

export const metadata: Metadata = {
  title: '关于我 — 王友林 UlinWang',
  description: '联系方式与社媒：GitHub、邮箱、小红书。',
};

export default function AboutPage() {
  const about = getAbout();

  return (
    <main className="min-h-screen">
      <About
        title={about.title}
        bodyZh={about.body}
        bodyEn={about.bodyEn}
        github={about.github}
        email={about.email}
        xhs={about.xhs}
      />
    </main>
  );
}
