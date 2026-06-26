import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F1E3',
        primary: '#8B5A2B',
        accent: '#B97739',
        dark: '#3B2416',
        border: '#D8C7B3',
        card: '#FFFFFF',
        success: '#2E7D32',
        warning: '#F9A825',
        danger: '#D32F2F',
        // Overwrite blue and indigo to remove all blue themes globally
        blue: {
          50: '#F7F1E3',
          100: '#D8C7B3',
          200: '#D8C7B3',
          300: '#B97739',
          400: '#B97739',
          500: '#B97739',
          600: '#8B5A2B',
          700: '#8B5A2B',
          800: '#3B2416',
          900: '#3B2416',
        },
        indigo: {
          50: '#F7F1E3',
          100: '#D8C7B3',
          200: '#D8C7B3',
          300: '#B97739',
          400: '#B97739',
          500: '#B97739',
          600: '#8B5A2B',
          700: '#8B5A2B',
          800: '#3B2416',
          900: '#3B2416',
        }
      }
    },
  },
  plugins: [],
};

export default config;
