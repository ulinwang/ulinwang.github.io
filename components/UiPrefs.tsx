'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ui, type Lang, type Theme, type UiDict } from '@/lib/i18n';

interface UiPrefs {
  lang: Lang;
  theme: Theme;
  t: UiDict;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
}

const UiPrefsContext = createContext<UiPrefs>({
  lang: 'zh',
  theme: 'dark',
  t: ui.zh,
  setLang: () => {},
  setTheme: () => {},
});

export function useUiPrefs() {
  return useContext(UiPrefsContext);
}

/**
 * 语言 + 显示模式全局状态。初始值读 html data 属性
 *（由 layout 内联脚本在水合前从 localStorage 写入），避免闪烁。
 */
export default function UiPrefsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>('zh');
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.lang === 'en') setLangState('en');
    if (root.dataset.theme === 'light') setThemeState('light');
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    document.documentElement.dataset.lang = next;
    try {
      localStorage.setItem('ui-lang', next);
    } catch {}
  };

  const setTheme = (next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('ui-theme', next);
    } catch {}
  };

  return (
    <UiPrefsContext.Provider
      value={{ lang, theme, t: ui[lang], setLang, setTheme }}
    >
      {children}
    </UiPrefsContext.Provider>
  );
}
