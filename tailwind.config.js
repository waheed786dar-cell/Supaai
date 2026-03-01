/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Editorial serif for headings
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        // Clean mono for chat/code feel
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        // Body
        sans: ['DM Sans', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f6f4',
          100: '#edeae5',
          200: '#d6cfc5',
          300: '#bdb2a3',
          400: '#a09181',
          500: '#8a7a6a',
          600: '#756655',
          700: '#5e5143',
          800: '#3d3428',
          900: '#1e1a12',
          950: '#0d0b08',
        },
        ember: {
          400: '#f59e4a',
          500: '#e8851a',
          600: '#c96e0e',
        },
        sage: {
          400: '#7fb99a',
          500: '#5a9e7f',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
