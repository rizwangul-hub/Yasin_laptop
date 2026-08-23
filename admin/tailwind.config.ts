import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FEFDF8',
          100: '#FEF9E7',
          200: '#FDF1C5',
          300: '#FCE598',
          400: '#FAD461',
          500: '#F5C542', // Golden Yellow
          600: '#EAB308', // Primary Amber
          700: '#CA8A04',
          800: '#A16207',
          900: '#713F12',
          950: '#422006',
        },
        charcoal: {
          50: '#FAFAF7',
          100: '#F4F4EE',
          200: '#E5E5DF',
          300: '#D4D4CD',
          400: '#A1A19A',
          500: '#71716C',
          600: '#52524D',
          700: '#3F3F3A',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },
        warm: {
          bg: '#FAFAF7',
          surface: '#F4F4EE',
          card: '#FFFFFF',
          border: '#E5E5DF',
          text: '#18181B',
          muted: '#71717A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(24, 24, 27, 0.04), 0 4px 16px -4px rgba(24, 24, 27, 0.06)',
        'soft-md': '0 4px 12px -2px rgba(24, 24, 27, 0.06), 0 8px 24px -4px rgba(24, 24, 27, 0.08)',
        'soft-lg': '0 8px 24px -4px rgba(24, 24, 27, 0.08), 0 16px 40px -8px rgba(24, 24, 27, 0.12)',
        'yellow-glow': '0 4px 20px -2px rgba(245, 197, 66, 0.35)',
      },
    },
  },
  plugins: [],
};
export default config;
