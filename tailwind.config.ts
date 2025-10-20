import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tdi: {
          yellow: '#FFD60A',
          black: '#0A0A0A',
          gray: {
            50: '#F5F5F5',
            200: '#E5E7EB'
          }
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      }
    }
  },
  plugins: []
} satisfies Config