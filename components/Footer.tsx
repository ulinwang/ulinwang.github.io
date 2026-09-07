'use client';

import { useUiPrefs } from '@/components/UiPrefs';

interface FooterProps {
  github: string;
  email: string;
  xhs: string;
}

export default function Footer({ github, email, xhs }: FooterProps) {
  const { t } = useUiPrefs();
  return (
    <footer className="border-t border-line px-6 py-10 sm:px-10">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <p className="font-mono text-[10px] tracking-[0.2em] text-dim">
          © 2026 王友林 ULINWANG · {t.footer.built}
        </p>
        <div className="flex items-center gap-5 font-mono text-[11px] tracking-[0.2em] text-dim">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            className="hover:bg-accent hover:text-white"
          >
            GITHUB
          </a>
          <a
            href={`mailto:${email}`}
            data-cursor
            className="hover:bg-accent hover:text-white"
          >
            MAIL
          </a>
          <a
            href={xhs}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            className="hover:bg-accent hover:text-white"
          >
            XHS
          </a>
        </div>
      </div>
    </footer>
  );
}
