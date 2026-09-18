/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        army: {
          black: '#130102',
          dark: '#290102',
          maroon: '#410202',
          'red-dark': '#580202',
          red: '#730203',
          'red-light': '#900302',
          gold: '#D99C2B',
          'gold-soft': '#C99E30',
          'gold-light': '#F0C65A',
          ivory: '#E0DACD',
          white: '#F8F4EA',
          muted: '#B7AAA2',
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'Roboto', '"Segoe UI"', 'Arial', 'sans-serif'],
        serif: ['"Be Vietnam Pro"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        display: ['"Be Vietnam Pro"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(217, 156, 43, 0.35)',
        'gold-glow-lg': '0 0 25px rgba(217, 156, 43, 0.5)',
        'timeline-glow': '0 0 8px rgba(217, 156, 43, 0.6)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.7)',
      },
      borderRadius: {
        military: '8px',
      }
    },
  },
  plugins: [],
};
