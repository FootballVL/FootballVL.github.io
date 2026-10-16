import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#F3F4F0',
        surface: '#E8ECE6',
        accent: '#B6382E',
        ink: '#222925',
        muted: '#59635C',
        line: '#C7CDC5',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'Arial', 'sans-serif'],
        display: ['Barlow Condensed', 'Impact', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        panel: '0 24px 80px rgba(0,0,0,0.28)',
      },
    },
  },
  plugins: [],
} satisfies Config;
