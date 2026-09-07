import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--bg)',
        'ink-soft': 'var(--bg-soft)',
        paper: 'var(--paper)',
        dim: 'var(--dim)',
        accent: {
          DEFAULT: 'var(--accent)',
          cyan: 'var(--accent)', // 兼容旧类名
        },
        line: 'var(--line)',
        'line-soft': 'var(--line-soft)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
