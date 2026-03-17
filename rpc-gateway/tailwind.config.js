/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#080c14',
          2: '#0d1422',
          3: '#111827',
        },
        surface: {
          DEFAULT: '#131d2e',
          2: '#1a2540',
        },
        border: {
          DEFAULT: '#1e2d47',
          2: '#243550',
        },
        accent: {
          DEFAULT: '#3b7de8',
          2: '#5a95f5',
        },
      },
    },
  },
  plugins: [],
}
