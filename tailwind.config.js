/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffdf5',
          100: '#fef7db',
          200: '#fbe9a7',
          300: '#f6d56d',
          400: '#efbd3b',
          500: '#e5a91f',
          600: '#c68413',
          700: '#9d5f12',
          800: '#814b16',
          900: '#6d3e18',
        },
        night: {
          800: '#0d131f',
          900: '#070b12',
          950: '#04060a',
        },
      },
      fontFamily: {
        script: ['"Great Vibes"', '"Alex Brush"', '"Pinyon Script"', 'cursive'],
        scriptAlt: ['"Parisienne"', '"Alex Brush"', 'cursive'],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
        arabic: ['"Amiri"', '"Traditional Arabic"', 'serif'],
      },
    },
  },
  plugins: [],
};
