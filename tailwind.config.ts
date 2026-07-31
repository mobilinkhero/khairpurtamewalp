import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B5E20',
          light:   '#4C8C4A',
          dark:    '#003300',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#FFD700',
          light:   '#FFE566',
          dark:    '#C7A600',
          foreground: '#1A1A1A',
        },
        success:   '#2E7D32',
        warning:   '#F57C00',
        danger:    '#C62828',
        emergency: '#D32F2F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
