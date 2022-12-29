/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        '13': 'repeat(13, minmax(0, 1fr))'
      },
    },
  },
  plugins: [],
}
