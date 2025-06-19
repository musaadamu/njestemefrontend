/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#7D324C',
          light: '#9D4D6A',
          dark: '#5D1F38'
        },
        warmGray: {
          DEFAULT: '#8B8178',
          light: '#ABA39B',
          dark: '#6B615A'
        }
      }
    },
  },
  plugins: [],
}
