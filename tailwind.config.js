/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tag-yellow': '#FFBE00',
      },
      fontFamily: {
        'druk': ['Druk', 'Arial Black', 'sans-serif'],
        'garamond': ['ITC Garamond Std', 'Georgia', 'serif'],
        'mdio': ['MDIO', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
