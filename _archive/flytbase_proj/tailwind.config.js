/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        spider: {
          red: '#E23636',
          crimson: '#B81D24',
          blue: '#0B409C',
          cyan: '#00E5FF',
          dark: '#0B0F19',
          card: '#131B2E',
          border: '#1E293B',
          glow: '#E2363640'
        }
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spider-sense': 'spiderSense 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        spiderSense: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8', boxShadow: '0 0 15px rgba(226, 54, 54, 0.5)' },
          '50%': { transform: 'scale(1.05)', opacity: '1', boxShadow: '0 0 25px rgba(226, 54, 54, 0.9)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}
