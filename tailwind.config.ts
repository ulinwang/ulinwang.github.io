import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E0E0E',
        'ink-soft': '#141414',
        paper: '#E8E8E8',
        dim: '#6B6B6B',
        accent: {
          DEFAULT: '#B8FF2E',
          cyan: '#B8FF2E', // 兼容旧类名，统一荧光绿
        },
        line: 'rgba(255,255,255,0.08)',
        'line-soft': 'rgba(255,255,255,0.04)',
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
