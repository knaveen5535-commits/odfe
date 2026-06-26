import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F4EA',
        surface: '#FFFFFF',
        primary: '#A56A2B',
        'primary-hover': '#8B5A2B',
        'primary-text': '#2C1810',
        'secondary-text': '#6B5B4F',
        border: '#E7DDCF',
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
      },
    },
  },
  plugins: [],
};

export default config;
