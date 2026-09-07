import type { Metadata } from 'next';
import { Noto_Sans_SC, Space_Grotesk } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAbout } from '@/lib/content';

const sans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: '王友林 UlinWang — AI 产品经理 × 全栈开发者',
  description:
    '王友林（UlinWang）的个人作品集：LLM 多智能体仿真、知识图谱、浏览器扩展与 AI 工具链。',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const about = getAbout();
  return (
    <html lang="zh-CN" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <CustomCursor />
        <Navbar />
        <SmoothScroll>{children}</SmoothScroll>
        <Footer github={about.github} email={about.email} xhs={about.xhs} />
      </body>
    </html>
  );
}
