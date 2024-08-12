import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: 'var(--font-sans)',
        display: 'var(--font-serif)',
      },
      colors: {
        foreground: 'var(--gold)',
      },
      keyframes: {
        glow: {
          '0%, 100%': {
            textShadow: 'none',
          },
          '50%': {
            textShadow:
              '0 0 10px rgba(252, 211, 77), 0 0 45px rgba(245, 158, 11), 0 0 10px rgba(252, 211, 77)',
          },
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
        glow: 'glow 1.5s linear infinite',
      },
      backgroundImage: {
        'table-gradient': 'var(--table-gradient)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
