/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        custom: 'repeat(16, 1fr)',
      }
    },
  },
  plugins: [],
}

