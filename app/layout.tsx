import type { Metadata } from 'next';
import Script from 'next/script';
import { Noto_Sans_SC, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Frame from '@/components/Frame';
import UiPrefsProvider from '@/components/UiPrefs';
import GaPageView from '@/components/GaPageView';
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

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: '王友林 UlinWang — AI 产品经理 × 全栈开发者',
  description:
    '王友林（UlinWang）的个人作品集：LLM 多智能体仿真、知识图谱、浏览器扩展与 AI 工具链。',
};

// 水合前从 localStorage 恢复语言/主题，避免闪烁
const prefsScript = `(function(){try{var l=localStorage.getItem('ui-lang');var t=localStorage.getItem('ui-theme');var d=document.documentElement;if(l)d.dataset.lang=l;if(t)d.dataset.theme=t;}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const about = getAbout();
  return (
    <html
      lang="zh-CN"
      data-theme="dark"
      data-lang="zh"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body className="font-sans antialiased">
        {/* GA4：G-9QE68891YP，匿名化 IP；路由切换由 GaPageView 上报 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9QE68891YP"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-9QE68891YP', { anonymize_ip: true });`}
        </Script>
        <UiPrefsProvider>
          <GaPageView />
          <CustomCursor />
          <Frame />
          <Navbar />
          <SmoothScroll>{children}</SmoothScroll>
          <Footer github={about.github} email={about.email} xhs={about.xhs} />
        </UiPrefsProvider>
      </body>
    </html>
  );
}
