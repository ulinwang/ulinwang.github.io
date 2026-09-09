export type Lang = 'zh' | 'en';
export type Theme = 'dark' | 'light';

export interface UiDict {
  nav: { index: string; intro: string; works: string; about: string };
  hero: {
    origin: string;
    role: string;
    tagline: string;
    selectedWorks: string;
    block: {
      name: string;
      role: string;
      date: string;
      rev: string;
      status: string;
      statusValue: string;
      roleValue: string;
    };
  };
  frame: { scale: string; rev: string };
  sec: { prefix: string };
  featured: { label: string; viewAll: string; open: string };
  works: { hint: string; zoom: string; sheet: string; open: string; listMode: string; reset: string };
  detail: { back: string; no: string; tags: string; link: string; rev: string };
  intro: { abstract: string; experience: string; education: string; changelog: string };
  about: { note: string; endpoints: { note: string }[]; response: string };
  footer: { built: string };
}

/** 全站 UI 文案双语字典（zh 默认） */
export const ui: Record<Lang, UiDict> = {
  zh: {
    nav: { index: '首页', intro: '简介', works: '作品集', about: '关于我' },
    hero: {
      origin: '原点 / 0,0',
      role: 'AI 产品经理 × 全栈开发者',
      tagline: '在大模型与真实世界的交叉点上构建产品',
      selectedWorks: '精选项目 ↓',
      block: {
        name: '姓名',
        role: '职位',
        date: '日期',
        rev: '版次',
        status: '状态',
        statusValue: '可接洽',
        roleValue: 'AI 产品经理 × 开发',
      },
    },
    frame: { scale: '比例 1:1', rev: '版次 2026.09' },
    sec: { prefix: '节.' },
    featured: {
      label: '精选项目 / SELECTED',
      viewAll: '查看全部 →',
      open: '打开 ↗',
    },
    works: {
      hint: '拖拽平移 / 滚轮缩放 / 双击打开',
      zoom: '比例',
      sheet: '图纸 A-01 · 作品场',
      open: '双击打开 ↗',
      listMode: '作品集 / 索引（触屏列表模式）',
      reset: '复位视图',
    },
    detail: {
      back: '← 返回作品集',
      no: '编号',
      tags: '标签',
      link: '链接',
      rev: '版次',
    },
    intro: {
      abstract: '摘要 / ABSTRACT',
      experience: '工作经历',
      education: '教育经历',
      changelog: '更新日志',
    },
    about: {
      note: '联络端点',
      endpoints: [
        { note: '代码与项目 ↗' },
        { note: '直接写信 ↗' },
        { note: '日常与笔记 ↗' },
      ],
      response: '响应时间 < 48H / 时区 UTC+8',
    },
    footer: { built: '由 Next.js 构建' },
  },
  en: {
    nav: { index: 'INDEX', intro: 'INTRO', works: 'WORKS', about: 'ABOUT' },
    hero: {
      origin: 'ORIGIN / 0,0',
      role: 'AI PRODUCT MANAGER × FULL-STACK DEVELOPER',
      tagline: 'Building products where LLMs meet the real world',
      selectedWorks: 'SELECTED WORKS ↓',
      block: {
        name: 'NAME',
        role: 'ROLE',
        date: 'DATE',
        rev: 'REV',
        status: 'STATUS',
        statusValue: 'AVAILABLE',
        roleValue: 'AI PM × DEV',
      },
    },
    frame: { scale: 'SCALE 1:1', rev: 'REV.2026.09' },
    sec: { prefix: 'SEC.' },
    featured: {
      label: 'SELECTED WORKS',
      viewAll: 'VIEW ALL →',
      open: 'OPEN ↗',
    },
    works: {
      hint: 'DRAG TO PAN / SCROLL TO ZOOM / DOUBLE-CLICK TO OPEN',
      zoom: 'ZOOM',
      sheet: 'SHEET A-01 / WORKS FIELD',
      open: 'DOUBLE-CLICK TO OPEN ↗',
      listMode: 'WORKS / INDEX (touch list mode)',
      reset: 'RESET VIEW',
    },
    detail: {
      back: '← BACK TO WORKS',
      no: 'NO.',
      tags: 'TAGS',
      link: 'LINK',
      rev: 'REV',
    },
    intro: {
      abstract: 'ABSTRACT',
      experience: 'EXPERIENCE',
      education: 'EDUCATION',
      changelog: 'CHANGELOG',
    },
    about: {
      note: 'ENDPOINTS',
      endpoints: [
        { note: 'CODE & PROJECTS ↗' },
        { note: 'WRITE TO ME ↗' },
        { note: 'NOTES & DAILY ↗' },
      ],
      response: 'RESPONSE TIME < 48H / TIMEZONE UTC+8',
    },
    footer: { built: 'Built with Next.js' },
  },
};
