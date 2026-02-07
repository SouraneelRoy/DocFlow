/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      fontWeight: {
        extralight: '200',
        light: '300',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        wide: '0.08em',
      },
      backdropBlur: {
        xs: '2px',
        sm: '8px',
        md: '12px',
      },
    },
  },
  plugins: [],
}
