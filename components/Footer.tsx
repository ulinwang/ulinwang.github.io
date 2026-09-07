interface FooterProps {
  github: string;
  email: string;
  xhs: string;
}

export default function Footer({ github, email, xhs }: FooterProps) {
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} 王友林 UlinWang · Built with Next.js
        </p>
        <div className="flex items-center gap-5 text-sm text-zinc-400">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            className="transition-colors hover:text-accent-cyan"
          >
            GitHub
          </a>
          <a
            href={`mailto:${email}`}
            data-cursor
            className="transition-colors hover:text-accent-cyan"
          >
            邮箱
          </a>
          <a
            href={xhs}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor
            className="transition-colors hover:text-accent-cyan"
          >
            小红书
          </a>
        </div>
      </div>
    </footer>
  );
}
