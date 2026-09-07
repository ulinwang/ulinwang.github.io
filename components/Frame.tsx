'use client';

import { useUiPrefs } from '@/components/UiPrefs';

/**
 * 全局图框：页面四周 1px 边框 + 四角坐标十字 + 底部标注。
 * 纯装饰，pointer-events-none，位于内容之上、导航之下。
 */
export default function Frame() {
  const { t } = useUiPrefs();
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 hidden sm:block"
    >
      <div className="absolute inset-3 border border-line" />
      {/* 四角十字 */}
      {[
        'left-3 top-3',
        'right-3 top-3',
        'left-3 bottom-3',
        'right-3 bottom-3',
      ].map((pos) => (
        <span
          key={pos}
          className={`absolute ${pos} font-mono text-[10px] leading-none text-dim`}
        >
          +
        </span>
      ))}
      {/* 图框标注（仅底边，远离顶部导航与画布 UI） */}
      <span className="absolute bottom-5 left-6 font-mono text-[9px] tracking-[0.25em] text-dim">
        {t.frame.scale}
      </span>
      <span className="absolute bottom-5 left-32 font-mono text-[9px] tracking-[0.25em] text-dim">
        {t.frame.rev}
      </span>
    </div>
  );
}
