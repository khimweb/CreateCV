/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#E0F2FE',
          100: '#BAE6FD',
          600: '#0284C7',
          700: '#0369A1',
        },
        obsidian: '#0F172A',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      transitionTimingFunction: {
        'ease-in-out': 'ease-in-out',
      },
      boxShadow: {
        glow: '0 0 24px rgba(2, 132, 199, 0.25)',
      },
      backdropBlur: {
        md: '12px',
      },
    },
  },
  plugins: [],
};
