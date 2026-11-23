/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f0f11',
        cardBg: '#1a1a1d',
        robloxYellow: '#f5b800',
      },
    },
  },
  plugins: [],
}
