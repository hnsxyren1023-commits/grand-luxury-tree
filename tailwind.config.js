/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Times New Roman"', 'serif'],
        sans: ['"Arial"', 'sans-serif'],
      },
      colors: {
        gold: '#FFD700',
        cyan: '#00f3ff',
        'dark-bg': '#050505',
        'panel-bg': 'rgba(10, 10, 10, 0.9)',
      },
      animation: {
        'shine': 'shine 3s linear infinite',
        'scan': 'scan 2s ease-in-out infinite',
      },
      keyframes: {
        shine: {
          'to': { backgroundPosition: '200% center' },
        },
        scan: {
          '0%': { top: '10%', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { top: '90%', opacity: 0 },
        }
      }
    },
  },
  plugins: [],
}
