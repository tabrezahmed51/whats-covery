/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0f0f2a',
          surface: '#1a1a3e',
          accent: '#00ffea',
          purple: '#9d4edd',
          pink: '#ff006e'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace']
      }
    }
  },
  plugins: []
};