/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        pr:"#4BD4DE",
        br:"#08171F",
        sr:"#0B1F29",
        dr:"#283237",
        hr:"#94E3E7"
      }
    },
  },
  plugins: [],
}
