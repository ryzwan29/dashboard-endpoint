/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        bg: {
          base: '#05080f',
          side: '#060914',
          card: 'rgba(255,255,255,0.02)',
        },
        border: {
          soft: 'rgba(255,255,255,0.07)',
          muted: 'rgba(255,255,255,0.05)',
        },
      },
    },
  },
  plugins: [],
}
