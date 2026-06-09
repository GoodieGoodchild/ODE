/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0faf4',
          100: '#dcf2e6',
          200: '#bce5ce',
          300: '#8dd0ae',
          400: '#58b388',
          500: '#2D6A4F',
          600: '#245a42',
          700: '#1a4530',
          800: '#12301f',
          900: '#0b1f14',
        },
        amber: '#F4A261',
        coral: '#E76F51',
        sage: '#95D5B2',
        cream: '#FAFAF5',
        charcoal: '#1C1C1E',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
}
